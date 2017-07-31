var distill = require("distill-template");
var jsdom = require("jsdom");
var postprocessors = require("./postprocessor");

function render(htmlString) {
  var dom = jsdom.jsdom(htmlString, {
    features: { ProcessExternalResources: false, FetchExternalResources: false }
  });
  postprocessors.layout(dom);
  postprocessors.header(dom);
  postprocessors.figures(dom);
  postprocessors.math(dom);
  postprocessors.headings(dom);
  postprocessors.footnotes(dom);
  distill.render(dom, {});
  return jsdom.serializeDocument(dom);
}

exports.render = render;
