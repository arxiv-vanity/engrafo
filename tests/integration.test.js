const { spawn } = require("child_process");
const path = require("path");
const tmp = require("tmp-promise");
const { testDocuments, renderToDom } = require("./utils");

let percySnapshots = [],
  outputDir;

beforeAll(async () => {
  outputDir = await tmp.dir({ unsafeCleanup: true, dir: "/tmp" });
});

afterAll(async () => {
  if (process.env.PERCY_TOKEN) {
    const percy = spawn("percy", ["snapshot", outputDir.path]);
    percy.stdout.on("data", d => console.log(d.toString()));
    percy.stderr.on("data", d => console.error(d.toString()));
    await new Promise((resolve, reject) => {
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
}, 20000); // long timeout to wait for Percy

function removeDescendants(element, selector) {
  Array.from(element.querySelectorAll(selector)).forEach(el => {
    el.parentNode.removeChild(el);
  });
}

for (let { documentName, documentPath } of testDocuments()) {
  test(`${documentName} renders correctly`, async () => {
    const outputPath = path.join(outputDir.path, path.parse(documentName).name);
    // await fs.mkdirs(outputPath);
    const { htmlString, document } = await renderToDom(
      documentPath,
      outputPath
    );

    removeDescendants(document.body, "script");
    removeDescendants(document.body, "style");
    expect(document.body).toMatchSnapshot();

    percySnapshots.push({ documentName, htmlString });
  });
}
