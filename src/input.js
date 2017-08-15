var async = require("async");
var fs = require("fs-extra");
var path = require("path");

// Do everything to prepare an output directory that is going to be rendered
exports.prepareOutput = (texPath, outputDir, callback) => {
  normalizeInputDirAndTexFilename(texPath, (err, inputDir, texFilename) => {
    if (err) return callback(err);
    outputDir = normalizeDirectory(outputDir);
    var outputTexPath = path.join(outputDir, texFilename);
    if (inputDir === outputDir) {
      return callback(null, outputTexPath);
    }
    fs.copy(inputDir, outputDir, err => {
      callback(err, outputTexPath);
    });
  });
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
        var bibFilename = filename.replace(".tex", ".bib");
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
