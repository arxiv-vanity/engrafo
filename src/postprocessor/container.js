var utils = require("./utils");

module.exports = function(dom) {
  // Put everything inside a container
  let container = utils.nodeFromString(
    dom,
    '<div class="engrafo-container"></div>'
  );
  while (dom.body.firstChild) {
    container.appendChild(dom.body.firstChild);
  }
  dom.body.appendChild(container);
};
