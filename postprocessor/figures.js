let utils = require('./utils');

var css = `
  table {
    margin-top: 48px;
    margin-bottom: 48px;
  }
  table caption {
    color: rgba(0, 0, 0, 0.6);
    font-size: 12px;
    line-height: 1.5em;
    caption-side: bottom;
    margin-top: 24px;
    text-align: left;
  }
  @media(min-width: 1024px) {
    table caption {
      font-size: 13px;
    }
  }

  dt-article figure table {
    width: 100%;
  }
`;

module.exports = function(dom) {
  utils.addStylesheet(dom, css);
  

  // Make tables figures
  let tables = dom.body.getElementsByClassName('engrafo-table');
  Array.from(tables).forEach((div) => {
    let figure = dom.createElement('figure');
    figure.id = div.id;
    utils.replaceAndKeepChildren(div, figure);
  })

  // Make figures figures
  let figures = dom.body.getElementsByClassName('engrafo-figure');
  Array.from(figures).forEach((span) => {
    // Pandoc gives us <p><span></span></p> so get rid of surrounding paragraph
    let paragraph = span.parentNode;
    paragraph.parentNode.insertBefore(span, paragraph);
    if (paragraph.children.length === 0) {
      paragraph.parentNode.removeChild(paragraph);
    }

    let figure = dom.createElement('figure');
    figure.id = span.id;
    utils.replaceAndKeepChildren(span, figure);

    let caption = figure.getElementsByClassName('engrafo-figcaption')[0];
    utils.replaceAndKeepChildren(caption, dom.createElement('figcaption'));
  });
};
