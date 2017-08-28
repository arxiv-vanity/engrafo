let utils = require("./utils");

var css = `
  dt-article figure {
    overflow-x: auto;
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
  Array.from(figures).forEach(span => {
    // Pandoc gives us <p><span></span></p> so get rid of surrounding paragraph
    let paragraph = span.parentNode;
    paragraph.parentNode.insertBefore(span, paragraph);
    if (paragraph.children.length === 0) {
      paragraph.parentNode.removeChild(paragraph);
    }

    let figure = dom.createElement("figure");
    figure.id = span.id;
    utils.replaceAndKeepChildren(span, figure);

    let caption = figure.querySelector(".engrafo-figcaption");
    utils.replaceAndKeepChildren(caption, dom.createElement("figcaption"));
  });
};
