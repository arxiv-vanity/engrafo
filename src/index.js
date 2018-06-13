const async = require("async");
const distill = require("distill-template");
const fs = require("fs-extra");
const jsdom = require("jsdom");
const util = require("util");

const io = require("./io");
const latexml = require("./latexml");
const math = require("./math");
const postprocessors = require("./postprocessor");

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
  // Distill one so that we can massage the LaTeXML output into the format
  // that Distill expects.
  postprocessors.layout(dom, data);
  distill.components.html(dom, data);
  postprocessors.styles(dom, data);
  postprocessors.metadata(dom, data);
  postprocessors.code(dom, data);
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
  postprocessors.lists(dom, data);
  postprocessors.links(dom, data);
  postprocessors.container(dom, data);

  return jsdom.serializeDocument(dom);
};

// Do all processing on the file that LaTeXML produces
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
exports.render = ({input, output, postProcessing}, callback) => {
  if (postProcessing === undefined) {
    postProcessing = true;
  }

  var texPath, outputDir, htmlPath;
  async.waterfall([
    (callback) => {
      io.prepareInputDirectory(input, callback);
    },
    (inputDir, callback) => {
      io.pickLatexFile(inputDir, callback);
    },
    (_texPath, callback) => {
      texPath = _texPath;

      io.prepareOutputDirectory(output, callback);
    },
    (_outputDir, callback) => {
      outputDir = _outputDir;
      console.log(`Rendering tex file ${texPath} to ${outputDir}`);
      latexml.render(texPath, outputDir, callback);
    },
    (_htmlPath, callback) => {
      htmlPath = _htmlPath;
      if (postProcessing) {
        exports.processHTML(htmlPath, callback);
      } else {
        callback();
      }
    },
    (callback) => {
      if (output.startsWith('s3://')) {
        io.uploadOutputToS3(outputDir, output, callback);
      } else {
        callback();
      }
    }
  ], (err) => {
    callback(err, htmlPath);
  });
};

// TODO: actually convert this to async/await
exports.render = util.promisify(exports.render);
