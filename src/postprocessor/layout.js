var utils = require("./utils");

module.exports = function(dom) {
  // Even in html5 mode, Pandoc adds XHTML namespaces
  var html = dom.querySelector("html");
  html.removeAttribute("xmlns");
  html.removeAttribute("xml:lang");

  // Wrap whole thing in <dt-article>
  let dtArticle = utils.nodeFromString(
    dom,
    '<dt-article></dt-article>'
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
