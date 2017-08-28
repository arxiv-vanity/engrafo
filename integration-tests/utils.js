var engrafo = require("../src");
var fs = require("fs");
var jsdom = require("jsdom");
var path = require("path");
var tmp = require("tmp");

exports.renderToDom = (inputPath, callback) => {
  inputPath = path.join(__dirname, inputPath);

  tmp.dir({unsafeCleanup: true}, (err, outputDir, cleanupCallback) => {
    if (err) return callback(err);
    engrafo.render({inputPath: inputPath, outputDir: outputDir}, (err, htmlPath) => {
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
        callback(null, cleanupCallback, document);
      });
    });
  });
};

exports.expectBodyToMatchSnapshot = (inputPath, done) => {
  exports.renderToDom(inputPath, (err, cleanupCallback, document) => {
    if (err) throw err;
    removeDescendantsWithTagName(document.body, "script");
    removeDescendantsWithTagName(document.body, "style");
    expect(document.body).toMatchSnapshot();
    cleanupCallback();
    done();
  });
};

var removeDescendantsWithTagName = (element, tagName) => {
  Array.from(element.getElementsByTagName(tagName)).forEach(el => {
    el.parentNode.removeChild(el);
  });
};
