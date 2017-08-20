var childProcess = require("child_process");
var distill = require("distill-template");
var fs = require("fs-extra");
var jsdom = require("jsdom");
var path = require("path");

var input = require("./input");
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
  ]

  if (!pandocOnly) {
    args.push(
      "--filter",
      "/app/pandocfilter/engrafo_pandocfilter.py",
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

  // Document state
  var data = {};

  // Run all processing on document.
  //
  // Order is important -- typically the Engrafo processor comes before the
  // Distill one so that we can massage the Pandoc output into the format
  // that Distill expects.
  postprocessors.layout(dom, data);
  distill.components.html(dom, data);
  distill.components.styles(dom, data);
  postprocessors.styles(dom, data);
  postprocessors.header(dom, data);
  distill.components.byline(dom, data);
  postprocessors.authors(dom, data);
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

  return jsdom.serializeDocument(dom);
};

// Render and postprocess a LaTeX file into outputDir (created if does not
// exist). Calls callback with an error on failure or a path to an HTML file
// on success.
exports.render = (inputPath, outputDir, pandocOnly, callback) => {
  input.prepareRenderingDir(inputPath, outputDir, (err, texPath) => {
    if (err) return callback(err);
    console.log("Rendering tex file", texPath);
    exports.renderPandoc(texPath, pandocOnly, (err, htmlPath) => {
      if (err) return callback(err, htmlPath);
      fs.readFile(htmlPath, "utf8", (err, htmlString) => {
        if (err) return callback(err, htmlPath);
        var transformedHtml = pandocOnly
            ? htmlString
            : exports.postprocess(htmlString);
        fs.writeFile(htmlPath, transformedHtml, err => {
          if (err) return callback(err);
          input.uploadOutput(texPath, outputDir, (err) => {
            return callback(err, htmlPath);
          });
        });
      });
    });
  });
};
