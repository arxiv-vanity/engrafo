let utils = require('./utils');

var css = `
.engrafo-equation-number {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
}
@media (min-width: 1080px) {
  .engrafo-equation-number {
    right: 5%;
  }
}
`;

module.exports = function(dom) {
  utils.addStylesheet(dom, css);

  // Make math figures
  let mathBlocks = dom.getElementsByClassName('engrafo-equation');
  Array.from(mathBlocks).forEach((div) => {
    let figure = dom.createElement('figure');
    figure.id = div.id;
    utils.replaceAndKeepChildren(div, figure);
  });
};
