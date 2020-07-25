const converter = require("../src/converter");
const fs = require("fs-extra");
const { JSDOM } = require("jsdom");
const klawSync = require("klaw-sync");
const path = require("path");

function integrationDocuments() {
  const documentsPath = path.join(__dirname, "integration/");
  const documents = klawSync(documentsPath, { nodir: true });
  return documents
    .filter((item) => item.path.match(/\.tex$/))
    .map((item) => [item.path.replace(documentsPath, ""), item.path]);
}

async function renderToDom(input, output) {
  const absoluteAssetsPath = path.join(__dirname, "../dist");
  const relativeAssetsPath = path.relative(output, absoluteAssetsPath);

  const htmlPath = await converter.render({
    input: input,
    output: output,
    externalCSS: path.join(relativeAssetsPath, "css/index.css"),
    externalJavaScript: path.join(relativeAssetsPath, "javascript/index.js"),
  });
  const htmlString = await fs.readFile(htmlPath, "utf-8");
  const dom = new JSDOM(htmlString);
  const document = dom.window.document;
  return { htmlPath, htmlString, document };
}

module.exports = {
  renderToDom: renderToDom,
  integrationDocuments: integrationDocuments,
};
