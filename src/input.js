var async = require("async");
var fs = require("fs-extra");
var path = require("path");
var s3 = require("s3");
var tar = require("tar");
var tmp = require("tmp");
var url = require("url");

// Do everything to prepare a directory that is going to be rendered
exports.prepareRenderingDir = (inputPath, outputDir, callback) => {
  setUpOutputDir(outputDir, (err, outputDir) => {
    if (err) return callback(err);
    // If we've been passed a tarball, extract directly to output dir
    if (inputPath.endsWith(".tar.gz")) {
      fetchInput(inputPath, (err, inputPath) => {
        if (err) return callback(err);
        tar.extract({file: inputPath, cwd: outputDir, strict: true}, (err) => {
          if (err) callback(err);
          exports.pickLatexFile(outputDir, (err, filename) => {
            if (err) return callback(err);
            callback(null, path.join(outputDir, filename));
          });
        });
      });
    } else {
      // Otherwise, figure out what our input is and copy over to output dir
      normalizeInputDirAndTexFilename(inputPath, (err, inputDir, texFilename) => {
        if (err) return callback(err);
        var outputTexPath = path.join(outputDir, texFilename);
        if (inputDir === outputDir) {
          return callback(null, outputTexPath);
        }
        fs.copy(inputDir, outputDir, err => {
          callback(err, outputTexPath);
        });
      });
    }
  });
};

var createS3Client = function() {
  return s3.createClient({
    s3Options: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_S3_REGION_NAME,
    }
  });
};

// If input dir is on S3, fetch it first
var fetchInput = (texPath, callback) => {
  if (!texPath.startsWith("s3://")) {
    return callback(null, texPath);
  }
  var client = createS3Client();
  tmp.dir((err, tmpDir) => {
    if (err) return callback(err);
    var s3url = url.parse(texPath);
    var localFile = path.join(tmpDir, path.basename(s3url.path));
    var params = {
      localFile: localFile,
      s3Params: {
        Bucket: s3url.host,
        Key: s3url.path.slice(1),
      }
    };
    var downloader = client.downloadFile(params);
    downloader.on("error", callback);
    downloader.on("end", () => {
      callback(null, localFile);
    });
  });
};

// Upload rendered directory to S3 if need be
exports.uploadOutput = (renderedTexPath, outputDir, callback) => {
  if (!outputDir.startsWith('s3://')) {
    return callback();
  }
  var renderedPath = path.dirname(renderedTexPath);
  var client = createS3Client();
  var s3url = url.parse(outputDir);
  var params = {
    localDir: renderedPath,
    s3Params: {
      Bucket: s3url.host,
      Prefix: s3url.path.slice(1),
    },
  };
  var uploader = client.uploadDir(params);
  uploader.on("error", callback);
  uploader.on("end", () => {
    callback();
  });
};

// Set up a temporary directory if the output directory is on S3
var setUpOutputDir = (outputDir, callback) => {
  if (outputDir.startsWith("s3://")) {
    tmp.dir(callback);
  }
  else {
    // Create output directory if it doesn't exist
    fs.ensureDir(outputDir, (err) => {
      if (err) return callback(err);
      callback(null, normalizeDirectory(outputDir));
    });
  }
};

var normalizeDirectory = dir => {
  if (dir.slice(-1) == "/") {
    dir = dir.slice(0, -1);
  }
  return path.normalize(dir);
};

// Convert either a path to a tex file or a path to a directory containing
// tex files into a path to a directory and a chosen tex file
var normalizeInputDirAndTexFilename = (texPath, callback) => {
  fs.stat(texPath, (err, stats) => {
    if (err) return callback(err);
    if (stats.isFile()) {
      let dir = normalizeDirectory(path.dirname(texPath));
      let filename = path.basename(texPath);
      return callback(null, dir, filename);
    }
    let dir = normalizeDirectory(texPath);
    exports.pickLatexFile(dir, (err, filename) => {
      callback(err, dir, filename);
    });
  });
};

// Pick a main .tex file from a directory
exports.pickLatexFile = (dir, callback) => {
  fs.readdir(dir, (err, files) => {
    if (err) return callback(err);
    if (files.includes("ms.tex")) {
      return callback(null, "ms.tex");
    }
    if (files.includes("main.tex")) {
      return callback(null, "main.tex");
    }
    var texPaths = files.filter(f => f.endsWith(".tex"));
    if (texPaths.length === 0) {
      return callback(new Error("No .tex files found"));
    }
    if (texPaths.length === 1) {
      return callback(null, texPaths[0]);
    }
    async.filter(texPaths, (filename, filtercb) => {
      fs.readFile(path.join(dir, filename), (err, data) => {
        return filtercb(err, data && data.indexOf("\\documentclass") !== -1);
      });
    }, (err, candidates) => {
      if (err) return callback(err);
      if (candidates.length === 0) {
        return callback(new Error("No .tex files with \\documentclass found"));
      }
      if (candidates.length === 1) {
        return (callback(null, candidates[0]));
      }
      // Find .tex files with a corresponding .bib file
      async.filter(candidates, (filename, filtercb) => {
        var bibFilename = filename.replace(".tex", ".bbl");
        fs.stat(path.join(dir, bibFilename), (err) => {
          filtercb(null, err === null);
        });
      }, (err, candidates) => {
        if (err) return callback(err);
        if (candidates.length === 1) {
          return (callback(null, candidates[0]));
        }
        callback(new Error(`Ambiguous LaTeX path (${candidates.length} candidates)`));
      });
    });
  });
};
