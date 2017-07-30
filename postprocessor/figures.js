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
  let style = dom.createElement('style');
  style.appendChild(dom.createTextNode(css));
  dom.head.appendChild(style);

  let tables = dom.body.getElementsByClassName('engrafo-table');
  Array.from(tables).forEach((div) => {
    let figure = dom.createElement('figure');
    figure.id = div.id;
    utils.replaceAndKeepChildren(div, figure);
  })
};
