const { spawn } = require("child_process");
const path = require("path");
const tmp = require("tmp-promise");
const { testDocuments, renderToDom } = require("./utils");

let percySnapshots = [],
  outputDir;

beforeAll(async () => {
  outputDir = await tmp.dir({ unsafeCleanup: true, dir: "/tmp" });
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
});

afterAll(async () => {
  if (process.env.PERCY_TOKEN) {
    const percy = spawn("percy", ["snapshot", outputDir.path]);
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
  outputDir.cleanup();
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
}, 20000); // long timeout to wait for Percy

test.each(testDocuments())("%s", async (documentName, documentPath) => {
  const outputPath = path.join(outputDir.path, path.parse(documentName).name);
  // await fs.mkdirs(outputPath);
  const { htmlString, document } = await renderToDom(documentPath, outputPath);

  expect(document.querySelector(".ltx_page_main").outerHTML).toMatchSnapshot();

  percySnapshots.push({ documentName, htmlString });
});
