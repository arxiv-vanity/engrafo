const utils = require("./utils");

module.exports = function(dom, { externalCSS }) {
  if (externalCSS) {
    const head = dom.querySelector("head");
    const link = utils.nodeFromString(
      dom,
      '<link type="text/css" rel="stylesheet">'
    );
    link.setAttribute("href", externalCSS);
    head.appendChild(link);
  }
};
