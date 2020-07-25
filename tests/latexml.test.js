const latexml = require("../src/converter/latexml");
const path = require("path");
const tmp = require("tmp-promise");

let outputDir;

beforeAll(async () => {
  outputDir = await tmp.dir({ unsafeCleanup: true, dir: "/tmp" });
});

afterAll(async () => {
  outputDir.cleanup();
});

test("latexml raises an exception on fatal error", async () => {
  await expect(
    latexml.render({
      texPath: path.join(__dirname, "other-documents/broken.tex"),
      outputDir: outputDir.path,
    })
  ).rejects.toThrowError("latexmlc exited with status 1");
});
