let utils = require("./utils");

module.exports = function(dom) {
  elements = dom.querySelectorAll(".engrafo-footnote");

  // If there are footnotes, put the container element in the appendix.
  // Distill will automatically fill it with footnotes.
  if (elements.length > 0) {
    var dtAppendix = dom.querySelector("dt-appendix");
    dtAppendix.appendChild(utils.nodeFromString(dom, "<h3>Footnotes</h3>"));
    dtAppendix.appendChild(dom.createElement("dt-fn-list"));
  }

  // Replace footnotes with Distill footnotes
  Array.from(elements).forEach(span => {
    let dtFn = dom.createElement("dt-fn");
    utils.replaceAndKeepChildren(span, dtFn);
  });
};
