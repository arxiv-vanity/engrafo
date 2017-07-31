
module.exports = function(dom) {
  // Wrap whole thing in <dt-article>
  let dtArticle = dom.createElement('dt-article');
  dtArticle.className = 'centered';
  while (dom.body.firstChild) {
    dtArticle.appendChild(dom.body.firstChild);
  }
  dom.body.appendChild(dtArticle);

  // Put appendix at the end
  let dtAppendix = dom.createElement('dt-appendix');
  dom.body.appendChild(dtAppendix);

  // Put horizontal rule before appendices
  let appendixDivider = dom.getElementById('engrafo-appendix-below');
  if (appendixDivider) {
    let hr = dom.createElement('hr');
    appendixDivider.parentNode.replaceChild(hr, appendixDivider);
  }
};
