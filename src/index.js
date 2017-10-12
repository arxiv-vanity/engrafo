var async = require("async");
var childProcess = require("child_process");
var distill = require("distill-template");
var fs = require("fs-extra");
var jsdom = require("jsdom");
var path = require("path");

var input = require("./input");
var math = require("./math");
var postprocessors = require("./postprocessor");

// Render a LaTeX document with Pandoc. Callback is called with error or
// path to directory with index.html in it.
exports.renderPandoc = (texPath, pandocOnly, callback) => {
  var outputDir = path.dirname(texPath);
  var texFilename = path.basename(texPath);
  var htmlPath = path.join(outputDir, "index.html");
  var args = [
    "--from",
    "latex+raw_tex+latex_macros",
    "--to",
    "html5",
    "--standalone",
    "--mathjax",
    "--data-dir",
    "/app/pandoc-data",
    "--template",
    "engrafo.html",
  ];

  if (!pandocOnly) {
    args.push(
      "--filter",
      "/app/pandocfilter/engrafo_pandocfilter.py"
    );
  }

  args.push(
    "--output",
    "index.html",
    texFilename
  );

  var pandoc = childProcess.spawn("/usr/local/bin/pandoc", args, {
    cwd: outputDir
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

  // Check there is actually a document to process
  var body = dom.querySelector('.engrafo-body');
  if (!body || body.children.length == 0) {
    throw new Error("Document is blank");
  }

  // Document state
  var data = {};

  // Run all processing on document.
  //
  // Order is important -- typically the Engrafo processor comes before the
  // Distill one so that we can massage the Pandoc output into the format
  // that Distill expects.
  postprocessors.layout(dom, data);
  distill.components.html(dom, data);
  postprocessors.styles(dom, data);
  postprocessors.header(dom, data);
  postprocessors.metadata(dom, data);
  postprocessors.code(dom, data);
  distill.components.code(dom, data);
  postprocessors.figures(dom, data);
  postprocessors.math(dom, data);
  postprocessors.headings(dom, data);
  postprocessors.footnotes(dom, data);
  distill.components.footnote(dom, data);
  postprocessors.bibliography(dom, data);
  distill.components.appendix(dom, data);
  distill.components.typeset(dom, data);
  postprocessors.typeset(dom, data);
  distill.components.hoverBox(dom, data);
  postprocessors.container(dom, data);

  return jsdom.serializeDocument(dom);
};

// Do all processing on the file that Pandoc produces
exports.processHTML = (htmlPath, pandocOnly, callback) => {
  async.waterfall([
    (callback) => {
      fs.readFile(htmlPath, "utf8", callback);
    },
    (htmlString, callback) => {
      if (pandocOnly) { return callback(null, htmlString); }
      try {
        htmlString = exports.postprocess(htmlString);
      } catch(err) {
        return callback(err);
      }
      callback(null, htmlString);
    },
    (htmlString, callback) => {
      if (pandocOnly) { return callback(null, htmlString); }
      math.renderMath(htmlString, callback);
    },
    (htmlString, callback) => {
      fs.writeFile(htmlPath, htmlString, callback);
    }
  ], callback);
};

// Render and postprocess a LaTeX file into outputDir (created if does not
// exist). Calls callback with an error on failure or a path to an HTML file
// on success.
exports.render = ({inputPath, outputDir, pandocOnly}, callback) => {
  var texPath, htmlPath;
  async.waterfall([
    (callback) => {
      input.prepareRenderingDir(inputPath, outputDir, callback);
    },
    (_texPath, callback) => {
      texPath = _texPath;
      console.log("Rendering tex file", texPath);
      exports.renderPandoc(texPath, pandocOnly, callback);
    },
    (_htmlPath, callback) => {
      htmlPath = _htmlPath;
      exports.processHTML(htmlPath, pandocOnly, callback);
    },
    (callback) => {
      input.uploadOutput(texPath, outputDir, callback);
    }
  ], (err) => {
    callback(err, htmlPath);
  });
};
