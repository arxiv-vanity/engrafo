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

  dt-article figure img {
    margin-bottom: 15px;
  }

  @media (min-width: 1080px) {
    dt-article figure {
      overflow: visible;
    }
  }
`;

module.exports = function(dom) {
  utils.addStylesheet(dom, css);

  // Make tables figures
  let tableDivs = dom.querySelectorAll(".engrafo-table");
  Array.from(tableDivs).forEach(div => {
    let figure = dom.createElement("figure");
    figure.id = div.id;
    utils.replaceAndKeepChildren(div, figure);
  });

  let tables = dom.querySelectorAll("dt-article > table");
  Array.from(tables).forEach(table => {
    let figure = dom.createElement("figure");
    utils.wrapElement(table, figure);
  });

  // Make figures figures
  let figures = dom.querySelectorAll(".engrafo-figure");
  Array.from(figures).forEach(div => {
    // Pandoc gives us <div class="engrafo-figure"><p>...</p></div>
    // so get rid of paragraph
    utils.removeAndFlattenChildren(div.children[0]);

    let figure = dom.createElement("figure");
    figure.id = div.id;
    figure.className = "l-page";
    utils.replaceAndKeepChildren(div, figure);

    let caption = figure.querySelector(".engrafo-figcaption");
    if (caption) {
      utils.replaceAndKeepChildren(caption, dom.createElement("figcaption"));
    }
  });
};
