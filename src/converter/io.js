const childProcess = require("child_process");
const fs = require("fs-extra");
const path = require("path");
const uploader = require("s3-recursive-uploader");
const axios = require("axios");
const AWS = require("aws-sdk");
const tmp = require("tmp-promise");
const url = require("url");
const util = require("util");

const exec = util.promisify(childProcess.exec);

// Turn a given input path or URL into an actual input path on disk
async function prepareInputDirectory(givenPath) {
  let inputPath = givenPath;

  // Fetch input from S3 if required
  if (givenPath.startsWith("s3://")) {
    inputPath = await fetchInputFromS3(inputPath);
  }

  // Fetch URL if required
  if (givenPath.startsWith("https://")) {
    inputPath = await fetchInputFromURL(inputPath);
  }

  // Untar tarball, if required
  if (inputPath.endsWith(".gz")) {
    inputPath = await extractGzipToTmpdir(inputPath);
  }

  return normalizeDirectory(inputPath);
}

async function prepareOutputDirectory(outputDir) {
  // Create temp output dir if uploading to S3
  if (outputDir.startsWith("s3://")) {
    const tmpdir = await tmp.dir({ dir: "/tmp" });
    return tmpdir.path;
  } else {
    // Create output directory if it doesn't exist
    await fs.ensureDir(outputDir);
    return normalizeDirectory(outputDir);
  }
}

// Fetch a tarball from S3 to use as input
async function fetchInputFromS3(s3URL) {
  const tmpDir = await tmp.dir({ dir: "/tmp" });
  const parsedS3URL = url.parse(s3URL);
  const localFile = path.join(tmpDir.path, path.basename(parsedS3URL.path));
  console.log(`Downloading ${s3URL} to ${localFile}...`);

  const params = {
    Bucket: parsedS3URL.host,
    Key: parsedS3URL.path.slice(1),
  };
  const s3 = new AWS.S3();
  const readStream = s3.getObject(params).createReadStream();
  await new Promise((resolve, reject) => {
    readStream.on("error", reject);
    readStream.on("end", resolve);
    const file = fs.createWriteStream(localFile);
    readStream.pipe(file);
  });
  return localFile;
}

// Fetch tarball from URL to use as input
async function fetchInputFromURL(inputURL) {
  const tmpDir = await tmp.dir({ dir: "/tmp" });
  const parsedURL = url.parse(inputURL);
  let localFile = path.join(tmpDir.path, path.basename(parsedURL.path));
  const response = await axios.get(inputURL, {
    headers: {
      "User-Agent": "engrafo",
    },
    responseType: "stream",
  });
  await new Promise((resolve, reject) => {
    response.data
      .on("error", reject)
      .pipe(fs.createWriteStream(localFile))
      .on("error", reject)
      .on("finish", resolve);
  });
  // arXiv URLs don't have extensions, but we rely on the extensions to know whether to unzip
  const contentEncoding = response.headers["content-encoding"];
  if (contentEncoding === "x-gzip" && !localFile.endsWith(".gz")) {
    await fs.rename(localFile, localFile + ".gz");
    localFile = localFile + ".gz";
  }
  return localFile;
}

async function extractGzipToTmpdir(gzipPath) {
  const gunzippedDir = await tmp.dir({ dir: "/tmp" });
  const extractedDir = await tmp.dir({ dir: "/tmp" });

  const gunzippedFilename = path.basename(gzipPath).replace(/\.gz$/, "");
  const gunzippedPath = path.join(gunzippedDir.path, gunzippedFilename);

  await exec(`gunzip < "${gzipPath}" > "${gunzippedPath}"`);
  try {
    await exec(`tar -xf "${gunzippedPath}"`, {
      cwd: extractedDir.path,
    });
  } catch (err) {
    if (err.stderr) {
      const errorMessage = err.stderr.toString();
      if (
        // Linux
        errorMessage.includes("This does not look like a tar archive") ||
        // OS X
        errorMessage.includes("Unrecognized archive format")
      ) {
        console.log(
          "Input file is gzipped but not a tarball, assuming it is a .tex file"
        );
        await fs.move(gunzippedPath, path.join(extractedDir.path, "main.tex"));
      }
    } else {
      throw err;
    }
  }
  return extractedDir.path;
}

// Upload rendered directory to S3 if need be
async function uploadOutputToS3(renderedPath, outputDir) {
  // Format outputDir into what s3-recursive-uploader expects
  outputDir = outputDir.replace("s3://", "");
  if (outputDir.slice("-1") != "/") {
    outputDir += "/";
  }
  const stats = await uploader({
    source: renderedPath,
    destination: outputDir,
    ignoreHidden: false,
  });
  console.log(`Uploaded ${stats.count} files to s3://${outputDir}`);
}

function normalizeDirectory(dir) {
  if (dir.slice(-1) == "/") {
    dir = dir.slice(0, -1);
  }
  return path.resolve(path.normalize(dir));
}

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
  const texPaths = files.filter((f) => f.endsWith(".tex"));
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
  prepareInputDirectory: prepareInputDirectory,
  prepareOutputDirectory: prepareOutputDirectory,
  uploadOutputToS3: uploadOutputToS3,
  pickLatexFile: pickLatexFile,
};
