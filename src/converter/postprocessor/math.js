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

/* On mobile, make inline math word wrap. This isn't ideal, but it's a lot better than the page being too wide */
dt-article .ltx_Math .mjx-chtml {
  white-space: normal;
}
@media (min-width: 768px) {
  dt-article .ltx_Math .mjx-chtml {
    white-space: nowrap;
  }
}

/* make tables fixed width so they don't cause mobile to scroll right.
Ideally this would be done with flexbox or whatever, but let's deal with
the tables that latexml gives us for now */
@media (max-width: 767px) {
  table.ltx_equation,
  table.ltx_equation tr {
    table-layout: fixed;
  }

  .ltx_eqn_cell {
    overflow-x: scroll;
  }

  .ltx_eqn_eqno {
    width: 50px;
  }

  /* Don't do the weird padding to center equations because this breaks mobile */
  .ltx_eqn_center_padleft,
  .ltx_eqn_center_padright {
    display: none;
  }

  /* Another hack to attempt to stop equations scrolling. This desperately
  needs a proper fix. */
  .ltx_equationgroup_container {
    overflow-x: scroll;
  }
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

  Array.from(dom.querySelectorAll(".ltx_equationgroup")).forEach(math => {
    // These are sometimes not figures so add class to parent so we can make
    // it scroll on overflow
    math.parentNode.className += " ltx_equationgroup_container";
  });

  Array.from(dom.querySelectorAll(".ltx_Math")).forEach(math => {
    math.innerHTML = `\\(${math.innerHTML}\\)`;
  });
};
