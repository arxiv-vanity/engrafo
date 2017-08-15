var engrafo = require("../src");
var fs = require("fs");
var jsdom = require("jsdom");
var path = require("path");
var tmp = require("tmp");

exports.expectBodyToMatchSnapshot = (texPath, done) => {
  texPath = path.join(__dirname, texPath);

  tmp.dir({unsafeCleanup: true}, (err, outputDir, cleanupCallback) => {
    if (err) throw err;
    engrafo.render(texPath, outputDir, (err, htmlPath) => {
      if (err) throw err;
      fs.readFile(htmlPath, "utf-8", (err, htmlString) => {
        if (err) throw err;
        var document = jsdom.jsdom(htmlString, {
          features: {
            ProcessExternalResources: false,
            FetchExternalResources: false
          }
        });

        var body = document.body;
        removeDescendantsWithTagName(body, "script");
        removeDescendantsWithTagName(body, "style");

        expect(document.body).toMatchSnapshot();
        cleanupCallback();
        done();
      });
    });
  });
};

var removeDescendantsWithTagName = (element, tagName) => {
  Array.from(element.getElementsByTagName(tagName)).forEach(el => {
    el.parentNode.removeChild(el);
  });
}
