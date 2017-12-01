let utils = require("./utils");

var css = `
dt-article .ltx_equationgroup,
dt-article .ltx_equation {
  width: 100%;
}

dt-article table td.ltx_eqn_cell {
  font-family: Georgia, serif;
  font-size: inherit;
  border: none;
  padding: 0;
}

.engrafo-container .mjx-chtml[tabindex]:focus {
  outline: none;
  display: inline-block;
}
`;

module.exports = function(dom) {
  utils.addStylesheet(dom, css);

  Array.from(dom.querySelectorAll(".ltx_equation .ltx_Math")).forEach(math => {
    // Disambiguate display maths
    math.className = "ltx_DisplayMath";
    // Add markup so mathjax picks it up
    math.innerHTML = `\\[ ${math.innerHTML} \\]`;
  });

  Array.from(dom.querySelectorAll(".ltx_Math")).forEach(math => {
    math.innerHTML = `\\(${math.innerHTML}\\)`;
  })
};
