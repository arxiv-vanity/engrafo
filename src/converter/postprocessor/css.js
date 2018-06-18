const utils = require("./utils");

module.exports = function(dom, { externalCSS }) {
  const head = dom.querySelector("head");
  const meta = utils.nodeFromString(
    dom,
    '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">'
  );
  head.appendChild(meta);

  if (externalCSS) {
    const link = utils.nodeFromString(
      dom,
      '<link type="text/css" rel="stylesheet">'
    );
    link.setAttribute("href", externalCSS);
    head.appendChild(link);
  }
};
