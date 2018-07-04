const utils = require("./utils");

module.exports = function(dom, { externalCSS, externalJavaScript }) {
  const head = dom.querySelector("head");
  const body = dom.querySelector("body");
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

  if (externalJavaScript) {
    const script = utils.nodeFromString(dom, '<script type="text/javascript">');
    script.setAttribute("src", externalJavaScript);
    body.appendChild(script);
  } else {
    // Move where latexml puts it
    for (let script of head.querySelectorAll("script")) {
      body.appendChild(script);
    }
  }
};
