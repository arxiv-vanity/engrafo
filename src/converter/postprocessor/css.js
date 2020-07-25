const utils = require("./utils");

module.exports = function (document, { externalCSS, externalJavaScript }) {
  const head = document.querySelector("head");
  const body = document.querySelector("body");
  const meta = utils.nodeFromString(
    document,
    '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">'
  );
  head.appendChild(meta);

  if (externalCSS) {
    const link = utils.nodeFromString(
      document,
      '<link type="text/css" rel="stylesheet">'
    );
    link.setAttribute("href", externalCSS);
    head.appendChild(link);
  }

  if (externalJavaScript) {
    const script = utils.nodeFromString(
      document,
      '<script type="text/javascript">'
    );
    script.setAttribute("src", externalJavaScript);
    body.appendChild(script);
  } else {
    // Move where latexml puts it
    for (let script of head.querySelectorAll("script")) {
      body.appendChild(script);
    }
  }
};
