const path = require("path");
const { integrationDocuments, renderToDom } = require("./utils");

beforeAll(async () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
});

afterAll(async () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
});

test.each(integrationDocuments())("%s", async (documentName, documentPath) => {
  const outputPath = path.join(__dirname, "integration-output", documentName);
  const { document } = await renderToDom(documentPath, outputPath);

  expect(document.querySelector(".ltx_page_main")).toMatchSnapshot();
});
