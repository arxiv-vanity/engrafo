var utils = require("./utils");

module.exports = function(dom) {
  // Put horizontal rule before appendices
  let appendixDivider = dom.querySelector("#engrafo-appendix-below");
  if (appendixDivider) {
    let hr = dom.createElement("hr");
    appendixDivider.parentNode.replaceChild(hr, appendixDivider);
  }
};
