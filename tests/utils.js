const util = require("util");
const engrafo = require("../src");
const readFile = util.promisify(require("fs").readFile);
const { configureToMatchImageSnapshot } = require("jest-image-snapshot");
const jsdom = require("jsdom");
const path = require("path");
const puppeteer = require("puppeteer");
const tmp = require("tmp-promise");

const toMatchImageSnapshot = configureToMatchImageSnapshot({
  customDiffConfig: {
    threshold: 0.05
  },
  noColors: true
});
expect.extend({ toMatchImageSnapshot });

exports.renderToDom = async (input, callback) => {
  input = path.join(__dirname, input);

  const tmpDir = await tmp.dir({ unsafeCleanup: true });
  const output = tmpDir.path;

  const htmlPath = await engrafo.render({ input: input, output: tmpDir.path });
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

  await page.goto(`file://${htmlPath}`);
  const screenshot = await page.screenshot({
    fullPage: true
  });
  expect(screenshot).toMatchImageSnapshot();
};

function removeDescendantsWithTagName(element, tagName) {
  Array.from(element.getElementsByTagName(tagName)).forEach(el => {
    el.parentNode.removeChild(el);
  });
}
