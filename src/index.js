var async = require("async");
var childProcess = require("child_process");
var distill = require("distill-template");
var fs = require("fs-extra");
var jsdom = require("jsdom");
var path = require("path");

var input = require("./input");
var math = require("./math");
var postprocessors = require("./postprocessor");

// render a document with latexml
exports.renderLatexml = (texPath, callback) => {
  var outputDir = path.dirname(texPath);
  var texFilename = path.basename(texPath);
  var htmlPath = path.join(outputDir, "index.html");

  var latexmlc = childProcess.spawn("latexmlc", [
      "--dest", htmlPath,
      "--format", "html5",
      "--mathtex",
      "--verbose",
      "--preload", "latexml/engrafo.ltxml",
      texPath
    ], {
    // TODO: in tests, just dump output to console.log so jest can hide it
    stdio: ['pipe', process.stdout, process.stderr]
  });
  latexmlc.on("error", callback);

  latexmlc.on("close", code => {
    if (code !== 0) {
      callback(new Error(`latexmlc exited with status ${code}`));
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
  var ltxDocument = dom.querySelector('.ltx_document');
  if (!ltxDocument) {
    throw new Error("Could not find .ltx_document");
  }
  // Title and metadata is always present
  if (ltxDocument.children.length == 0) {
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
  postprocessors.metadata(dom, data);
  // postprocessors.code(dom, data);
  // distill.components.code(dom, data);
  postprocessors.figures(dom, data);
  postprocessors.math(dom, data);
  postprocessors.headings(dom, data);
  postprocessors.appendix(dom, data);
  postprocessors.footnotes(dom, data);
  distill.components.footnote(dom, data);
  postprocessors.bibliography(dom, data);
  distill.components.appendix(dom, data);
  distill.components.typeset(dom, data);
  postprocessors.typeset(dom, data);
  distill.components.hoverBox(dom, data);
  postprocessors.tables(dom, data);
  postprocessors.container(dom, data);

  return jsdom.serializeDocument(dom);
};

// Do all processing on the file that Pandoc produces
exports.processHTML = (htmlPath, callback) => {
  async.waterfall([
    (callback) => {
      fs.readFile(htmlPath, "utf8", callback);
    },
    (htmlString, callback) => {
      try {
        htmlString = exports.postprocess(htmlString);
      } catch(err) {
        return callback(err);
      }
      callback(null, htmlString);
    },
    (htmlString, callback) => {
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
exports.render = ({inputPath, outputDir, postProcessing}, callback) => {
  if (postProcessing === undefined) {
    postProcessing = true;
  }

  var texPath, htmlPath;
  async.waterfall([
    (callback) => {
      input.prepareRenderingDir(inputPath, outputDir, callback);
    },
    (_texPath, callback) => {
      texPath = _texPath;
      console.log("Rendering tex file", texPath);
      exports.renderLatexml(texPath, callback);
    },
    (_htmlPath, callback) => {
      htmlPath = _htmlPath;
      if (postProcessing) {
        exports.processHTML(htmlPath, callback);
      }
    },
    (callback) => {
      input.uploadOutput(texPath, outputDir, callback);
    }
  ], (err) => {
    callback(err, htmlPath);
  });
};
