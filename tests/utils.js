const converter = require("../src/converter");
const fs = require("fs-extra");
const jsdom = require("jsdom");
const path = require("path");

function integrationDocuments() {
  const documentsPath = path.join(__dirname, "integration");
  const documents = fs.readdirSync(documentsPath);
  return documents
    .filter(name => name.match(/\.tex$/))
    .map(name => [name, path.join(documentsPath, name)]);
}

async function renderToDom(input, output) {
  const htmlPath = await converter.render({
    input: input,
    output: output
  });
  const htmlString = await fs.readFile(htmlPath, "utf-8");
  const document = jsdom.jsdom(htmlString, {
    features: {
      ProcessExternalResources: false,
      FetchExternalResources: false
    }
  });
  return { htmlPath, htmlString, document };
}

module.exports = {
  renderToDom: renderToDom,
  integrationDocuments: integrationDocuments
};
