const util = require("util");
const converter = require("../src/converter");
const readFile = util.promisify(require("fs").readFile);
const jsdom = require("jsdom");
const fs = require("fs-extra");
const path = require("path");

function testDocuments() {
  const documentsPath = path.join(__dirname, "documents");
  const documents = fs.readdirSync(documentsPath);
  return documents.filter(name => name.match(/\.tex$/)).map(name => ({
    documentName: name,
    documentPath: path.join(documentsPath, name)
  }));
}

async function renderToDom(input, output) {
  const htmlPath = await converter.render({
    input: input,
    output: output
  });
  const htmlString = await readFile(htmlPath, "utf-8");
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
  testDocuments: testDocuments
};
