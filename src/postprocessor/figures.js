let utils = require("./utils");

var css = `
  dt-article table th,
  dt-article table td {
    padding-right: 1rem;
  }

  dt-article table th:last-child,
  dt-article table td:last-child {
    padding-right: 0;
  }

  dt-article figure {
    overflow-x: auto;
  }

  dt-article figure img,
  dt-article figure table,
  dt-article figure .ltx_listing,
  dt-article figure .ltx_tabular {
    width: 100%;
    height: auto;
    margin-bottom: 15px;
  }

  dt-article table td.ltx_subfigure {
    border: 0;
    padding: 0 1rem 0 0;
  }

  dt-article .ltx_subfigure figure {
    margin: 0;
  }

  @media (min-width: 1080px) {
    dt-article figure {
      overflow: visible;
    }

    dt-article figure .images {
      display: flex;
    }
    dt-article figure .images > div {
      margin-right: 15px;
    }
  }

`;

module.exports = function(dom) {
  utils.addStylesheet(dom, css);

  Array.from(dom.querySelectorAll("figure")).forEach(figure => {
    // If caption is at start, put it at end
    if (
      figure.children.length > 0 &&
      figure.children[0].tagName == "FIGCAPTION"
    ) {
      figure.appendChild(figure.children[0]);
    }

    if (figure.querySelector(".ltx_subfigure")) {
      figure.className += " l-page";
    }
  });
};
