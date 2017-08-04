let utils = require('./utils');

module.exports = function(dom) {
  elements = dom.body.getElementsByClassName('engrafo-footnote');

  // If there are footnotes, put the container element in the appendix.
  // Distill will automatically fill it with footnotes.
  if (elements.length > 0) {
    var dtAppendix = dom.getElementsByTagName('dt-appendix')[0];
    var h3 = dom.createElement('h3');
    h3.textContent = 'Footnotes';
    dtAppendix.appendChild(h3);
    dtAppendix.appendChild(dom.createElement('dt-fn-list'));
  }

  // Replace footnotes with Distill footnotes
  Array.from(elements).forEach((span) => {
    let dtFn = dom.createElement('dt-fn');
    utils.replaceAndKeepChildren(span, dtFn);
  });

};
