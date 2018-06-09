const fs = require("fs-extra");
const jsdom = require("jsdom");

const io = require("./io");
const latexml = require("./latexml");
const math = require("./math");
const postprocessors = require("./postprocessor");

// Run postprocessing against a string of HTML
function postprocess(htmlString) {
  var dom = jsdom.jsdom(htmlString, {
    features: { ProcessExternalResources: false, FetchExternalResources: false }
  });

  // Run all processing on document.
  postprocessors.figures(dom);
  postprocessors.headings(dom);
  postprocessors.links(dom);
  postprocessors.math(dom);

  return jsdom.serializeDocument(dom);
}

// Do all processing on the file that LaTeXML produces
async function processHTML(htmlPath) {
  let htmlString = await fs.readFile(htmlPath, "utf8");
  htmlString = postprocess(htmlString);
  htmlString = await math.renderMath(htmlString);
  await fs.writeFile(htmlPath, htmlString);
}

// Render and postprocess a LaTeX file into outputDir (created if does not
// exist). Calls callback with an error on failure or a path to an HTML file
// on success.
async function render({ input, output, postProcessing }) {
  if (postProcessing === undefined) {
    postProcessing = true;
  }

  const inputDir = await io.prepareInputDirectory(input);
  const texPath = await io.pickLatexFile(inputDir);
  const outputDir = await io.prepareOutputDirectory(output);

  console.log(`Rendering tex file ${texPath} to ${outputDir}`);
  const htmlPath = await latexml.render({ texPath, outputDir });

  await processHTML(htmlPath);

  if (output.startsWith("s3://")) {
    await io.uploadOutputToS3(outputDir, output);
  }

  return htmlPath;
}

module.exports = {
  render: render
};
