var distill = require("distill-template");
var jsdom = require("jsdom");
var postprocessors = require("./postprocessor");

function render(htmlString) {
  var dom = jsdom.jsdom(htmlString, {
    features: { ProcessExternalResources: false, FetchExternalResources: false }
  });
  postprocessors.header(dom);
  distill.render(dom, {});
  return jsdom.serializeDocument(dom);
}

exports.render = render;
