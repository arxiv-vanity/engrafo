var childProcess = require("child_process");
var distill = require("distill-template");
var fs = require("fs-extra");
var jsdom = require("jsdom");
var path = require("path");
var postprocessors = require("./postprocessor");

var normalizeDirectory = (dir) => {
  if (dir.slice(-1) == "/") {
    dir = dir.slice(0, -1);
  }
  return path.normalize(dir);
}

var prepareOutputDir = (inputDir, outputDir, callback) => {
  // Nothing to prepare
  if (inputDir === outputDir) {
    return callback();
  }
  fs.copy(inputDir, outputDir, callback);
};

// Render a LaTeX document with Pandoc. Callback is called with error or
// path to directory with index.html in it.
exports.renderPandoc = (texPath, callback) => {
  var outputDir = path.dirname(texPath);
  var texFilename = path.basename(texPath);
  var htmlPath = path.join(outputDir, "index.html");
  var args = [
    "--from",
    "latex+raw_tex",
    "--to",
    "html",
    "--standalone",
    "--mathjax",
    "--filter",
    "/app/pandocfilter/engrafo_pandocfilter.py",
    "--output",
    "index.html",
    texFilename
  ];
  var pandoc = childProcess.spawn("/usr/local/bin/pandoc", args, {
    cwd: outputDir,
  });
  var stdout = "";
  var stderr = "";
  pandoc.stdout.on("data", data => {
    stdout += data.toString();
  });
  pandoc.stderr.on("data", data => {
    stderr += data.toString();
  });
  pandoc.on("error", callback);
  pandoc.on("close", code => {
    if (code !== 0) {
      callback(
        new Error(
          `pandoc exited with status ${code}\nstdout: ${stdout}\nstderr: ${stderr}`
        )
      );
      return;
    }
    return callback(null, htmlPath);
  });
};

// Run postprocessing against a string of HTML
exports.postprocess = htmlString => {
  var dom = jsdom.jsdom(htmlString, {
    features: { ProcessExternalResources: false, FetchExternalResources: false }
  });
  postprocessors.layout(dom);
  postprocessors.header(dom);
  postprocessors.code(dom);
  postprocessors.figures(dom);
  postprocessors.math(dom);
  postprocessors.headings(dom);
  postprocessors.footnotes(dom);
  postprocessors.bibliography(dom);
  distill.render(dom, {});
  return jsdom.serializeDocument(dom);
};

// Render and postprocess a LaTeX file into outputDir (created if does not
// exist). Calls callback with an error on failure or a path to an HTML file
// on success.
exports.render = (texPath, outputDir, callback) => {
  var inputDir = normalizeDirectory(path.dirname(texPath));
  outputDir = normalizeDirectory(outputDir);
  var texFilename = path.basename(texPath);
  var outputTexPath = path.join(outputDir, texFilename);

  prepareOutputDir(inputDir, outputDir, (err) => {
    if (err) return callback(err);
    exports.renderPandoc(outputTexPath, (err, htmlPath) => {
      if (err) return callback(err, htmlPath);
      fs.readFile(htmlPath, "utf8", (err, htmlString) => {
        if (err) return callback(err, htmlPath);
        var transformedHtml = exports.postprocess(htmlString);
        fs.writeFile(htmlPath, transformedHtml, err => {
          return callback(err, htmlPath);
        });
      });
    });
  });
};
