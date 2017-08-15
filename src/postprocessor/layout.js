var utils = require("./utils");

module.exports = function(dom) {
  // Wrap whole thing in <dt-article>
  let dtArticle = utils.nodeFromString(
    dom,
    '<dt-article class="centered"></dt-article>'
  );
  while (dom.body.firstChild) {
    dtArticle.appendChild(dom.body.firstChild);
  }
  dom.body.appendChild(dtArticle);

  // Put appendix at the end
  let dtAppendix = dom.createElement("dt-appendix");
  dom.body.appendChild(dtAppendix);

  // Put horizontal rule before appendices
  let appendixDivider = dom.querySelector("#engrafo-appendix-below");
  if (appendixDivider) {
    let hr = dom.createElement("hr");
    appendixDivider.parentNode.replaceChild(hr, appendixDivider);
  }
};
