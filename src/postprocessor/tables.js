let utils = require("./utils");

module.exports = function(dom) {
  Array.from(dom.querySelectorAll("figure.ltx_table")).forEach(figure => {
    // If caption is at start, put it at end
    if (figure.children[0].tagName == "FIGCAPTION") {
      figure.appendChild(figure.children[0]);
    }
  });
};
