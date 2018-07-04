const util = require("util");
const converter = require("../src/converter");
const readFile = util.promisify(require("fs").readFile);
const { configureToMatchImageSnapshot } = require("jest-image-snapshot");
const jsdom = require("jsdom");
const path = require("path");
const tmp = require("tmp-promise");

const toMatchImageSnapshot = configureToMatchImageSnapshot({
  customDiffConfig: {
    threshold: 0.05
  },
  noColors: true
});
expect.extend({ toMatchImageSnapshot });

exports.renderToDom = async input => {
  input = path.join(__dirname, input);

  const tmpDir = await tmp.dir({ unsafeCleanup: true });

  const htmlPath = await converter.render({
    input: input,
    output: tmpDir.path
  });
  const htmlString = await readFile(htmlPath, "utf-8");
  const document = jsdom.jsdom(htmlString, {
    features: {
      ProcessExternalResources: false,
      FetchExternalResources: false
    }
  });
  return { htmlPath, document };
};

exports.expectToMatchSnapshot = async inputPath => {
  const { htmlPath, document } = await exports.renderToDom(inputPath);

  removeDescendantsWithTagName(document.body, "script");
  removeDescendantsWithTagName(document.body, "style");
  expect(document.body).toMatchSnapshot();

  const localPage = await browser.newPage();
  try {
    await localPage.goto(`file://${htmlPath}`, { waitUntil: "networkidle0" });
    const screenshot = await localPage.screenshot({
      fullPage: true
    });
    expect(screenshot).toMatchImageSnapshot();
  } finally {
    localPage.close();
  }
};

function removeDescendantsWithTagName(element, tagName) {
  Array.from(element.getElementsByTagName(tagName)).forEach(el => {
    el.parentNode.removeChild(el);
  });
}
