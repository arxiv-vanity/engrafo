
module.exports = function(dom) {
  // Replace footnotes with Distill footnotes
  elements = dom.body.getElementsByClassName('engrafo-footnote');
  Array.from(elements).forEach((span) => {
    let dtFn = dom.createElement('dt-fn');
    while (span.firstChild) {
      dtFn.appendChild(span.firstChild);
    }
    span.parentNode.replaceChild(dtFn, span);
  });
};
