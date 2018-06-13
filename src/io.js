const async = require("async");
const childProcess = require("child_process");
const fs = require("fs-extra");
const path = require("path");
const uploader = require("s3-recursive-uploader");
const AWS = require("aws-sdk");
const tmp = require("tmp");
const url = require("url");
const util = require("util");

// Turn a given input path or URL into an actual input path on disk
// TODO: make async
function prepareInputDirectory(givenPath, callback) {
  async.waterfall(
    [
      callback => {
        // Fetch input from S3 if required
        if (givenPath.startsWith("s3://")) {
          fetchInputFromS3(givenPath, callback);
        } else {
          callback(null, givenPath);
        }
      },
      (inputPath, callback) => {
        // Untar tarball, if required
        if (inputPath.endsWith(".gz")) {
          extractGzipToTmpdir(inputPath, callback);
        } else {
          callback(null, inputPath);
        }
      },
      (inputPath, callback) => {
        callback(null, normalizeDirectory(inputPath));
      }
    ],
    callback
  );
}

// TODO: make async
function prepareOutputDirectory(outputDir, callback) {
  // Create temp output dir if uploading to S3
  if (outputDir.startsWith("s3://")) {
    tmp.dir((err, tmpdir, cleanup) => {
      // Passing the cleanup callback often means it gets called accidentally
      callback(err, tmpdir);
    });
  } else {
    // Create output directory if it doesn't exist
    fs.ensureDir(outputDir, err => {
      if (err) return callback(err);
      callback(null, normalizeDirectory(outputDir));
    });
  }
}

// Fetch a tarball from S3 to use as input
// TODO: make async
var fetchInputFromS3 = (s3Url, callback) => {
  tmp.dir((err, tmpDir) => {
    if (err) return callback(err);
    var s3url = url.parse(s3Url);
    var localFile = path.join(tmpDir, path.basename(s3url.path));
    console.log(`Downloading ${s3Url} to ${localFile}...`);
    var params = {
      Bucket: s3url.host,
      Key: s3url.path.slice(1)
    };
    var s3 = new AWS.S3();
    var readStream = s3.getObject(params).createReadStream();
    readStream.on("error", callback);
    readStream.on("end", () => {
      callback(null, localFile);
    });
    var file = fs.createWriteStream(localFile);
    readStream.pipe(file);
  });
};

var extractGzipToTmpdir = (gzipPath, callback) => {
  var tmpDir;
  async.waterfall(
    [
      callback => {
        tmp.dir(callback);
      },
      (_tmpDir, _, callback) => {
        tmpDir = _tmpDir;
        childProcess.exec(`gunzip ${gzipPath}`, err => callback(err));
      },
      callback => {
        var gunzippedPath = gzipPath.replace(/\.gz$/, "");
        childProcess.exec(
          `tar -xf "${gunzippedPath}"`,
          { cwd: tmpDir },
          (err, stdout, stderr) => {
            if (
              err &&
              stderr
                .toString()
                .indexOf("tar: This does not look like a tar archive") !== -1
            ) {
              console.log(
                "Input file is gzipped but not a tarball, assuming it is a .tex file"
              );
              fs.rename(gunzippedPath, path.join(tmpDir, "main.tex"), callback);
            } else {
              callback(err);
            }
          }
        );
      }
    ],
    err => {
      callback(err, tmpDir);
    }
  );
};

// Upload rendered directory to S3 if need be
function uploadOutputToS3(renderedPath, outputDir, callback) {
  // Format outputDir into what s3-recursive-uploader expects
  outputDir = outputDir.replace("s3://", "");
  if (outputDir.slice("-1") != "/") {
    outputDir += "/";
  }
  uploader({
    source: renderedPath,
    destination: outputDir,
    ignoreHidden: false
  })
    .then(stats => {
      console.log(`Uploaded ${stats.count} files to s3://${outputDir}`);
      callback();
    })
    .catch(callback);
}

var normalizeDirectory = dir => {
  if (dir.slice(-1) == "/") {
    dir = dir.slice(0, -1);
  }
  return path.resolve(path.normalize(dir));
};

// Pick a main .tex file from a directory
async function pickLatexFile(dir) {
  if (dir.endsWith(".tex")) {
    return dir;
  }
  const files = await fs.readdir(dir);
  if (files.includes("ms.tex")) {
    return path.join(dir, "ms.tex");
  }
  if (files.includes("main.tex")) {
    return path.join(dir, "main.tex");
  }
  const texPaths = files.filter(f => f.endsWith(".tex"));
  if (texPaths.length === 0) {
    throw new Error("No .tex files found");
  }
  if (texPaths.length === 1) {
    return path.join(dir, texPaths[0]);
  }
  let docCandidates = [];
  for (let p of texPaths) {
    let data = await fs.readFile(path.join(dir, p));
    if (data && data.includes("\\documentclass")) {
      docCandidates.push(p);
    }
  }
  if (docCandidates.length === 0) {
    throw new Error("No .tex files with \\documentclass found");
  }

  if (docCandidates.length === 1) {
    return path.join(dir, docCandidates[0]);
  }

  let bblCandidates = [];
  for (let p of docCandidates) {
    let bbl = p.replace(".tex", ".bbl");
    if (await fs.pathExists(path.join(dir, bbl))) {
      bblCandidates.push(p);
    }
  }

  if (bblCandidates.length > 1) {
    throw new Error(
      `Ambiguous LaTeX path (${bblCandidates.length} candidates)`
    );
  }
  return bblCandidates[0];
}

module.exports = {
  prepareInputDirectory: util.promisify(prepareInputDirectory),
  prepareOutputDirectory: util.promisify(prepareOutputDirectory),
  uploadOutputToS3: util.promisify(uploadOutputToS3),
  pickLatexFile: pickLatexFile
};
