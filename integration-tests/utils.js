const engrafo = require("../src");
const fs = require("fs");
const { configureToMatchImageSnapshot } = require('jest-image-snapshot');
const jsdom = require("jsdom");
const path = require("path");
const puppeteer = require('puppeteer');
const tmp = require("tmp");

const toMatchImageSnapshot = configureToMatchImageSnapshot({
  customDiffConfig: {
    threshold: 0.05,
  },
  noColors: true,
});
expect.extend({ toMatchImageSnapshot });

exports.renderToDom = (input, callback) => {
  input = path.join(__dirname, input);

  tmp.dir({unsafeCleanup: true}, (err, output, cleanupCallback) => {
    if (err) return callback(err);
    engrafo.render({input: input, output: output}, (err, htmlPath) => {
      if (err) {
        cleanupCallback();
        return callback(err);
      }
      fs.readFile(htmlPath, "utf-8", (err, htmlString) => {
        if (err) {
          cleanupCallback();
          return callback(err);
        }
        var document = jsdom.jsdom(htmlString, {
          features: {
            ProcessExternalResources: false,
            FetchExternalResources: false
          }
        });
        callback(null, cleanupCallback, htmlPath, document);
      });
    });
  });
};

exports.expectBodyToMatchSnapshot = async (inputPath, done) => {
  exports.renderToDom(inputPath, async (err, cleanupCallback, htmlPath, document) => {
    if (err) throw err;
    removeDescendantsWithTagName(document.body, "script");
    removeDescendantsWithTagName(document.body, "style");
    expect(document.body).toMatchSnapshot();

    await page.goto(`file://${htmlPath}`);
    const screenshot = await page.screenshot({
      fullPage: true
    });
    expect(screenshot).toMatchImageSnapshot();

    cleanupCallback();
    done();
  });
};

var removeDescendantsWithTagName = (element, tagName) => {
  Array.from(element.getElementsByTagName(tagName)).forEach(el => {
    el.parentNode.removeChild(el);
  });
};
