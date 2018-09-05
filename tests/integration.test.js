const { spawn } = require("child_process");
const path = require("path");
const tmp = require("tmp-promise");
const { integrationDocuments, renderToDom } = require("./utils");

let percySnapshots = [],
  outputDir;

beforeAll(async () => {
  outputDir = path.join(__dirname, "integration-output");
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
});

afterAll(async () => {
  if (process.env.PERCY_TOKEN) {
    const percy = spawn("percy", ["snapshot", outputDir]);
    percy.stdout.on("data", d => console.log(d.toString()));
    percy.stderr.on("data", d => console.error(d.toString()));
    await new Promise((resolve, reject) => {
      percy.on("error", reject);
      percy.on("close", code => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`percy exited with code ${code}`));
        }
      });
    });
  } else {
    console.log("No, PERCY_TOKEN envvar, skipping percy test");
  }
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
}, 20000); // long timeout to wait for Percy

test.each(integrationDocuments())("%s", async (documentName, documentPath) => {
  const outputPath = path.join(outputDir, path.parse(documentName).name);
  // await fs.mkdirs(outputPath);
  const { htmlString, document } = await renderToDom(documentPath, outputPath);

  expect(document.querySelector(".ltx_page_main").outerHTML).toMatchSnapshot();

  percySnapshots.push({ documentName, htmlString });
});
