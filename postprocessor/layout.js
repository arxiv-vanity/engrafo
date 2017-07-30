
module.exports = function(dom) {
  // Wrap whole thing in <dt-article>
  let dtArticle = dom.createElement('dt-article');
  dtArticle.className = 'centered';
  while (dom.body.firstChild) {
    dtArticle.appendChild(dom.body.firstChild);
  }
  dom.body.appendChild(dtArticle);

  // Get rid of <header>
  Array.from(dom.body.getElementsByTagName('header')).forEach((header) => {
    while(header.firstChild) {
      header.parentNode.insertBefore(header.firstChild, header);
    }
    header.parentNode.removeChild(header);
  });

  // Put appendix at the end
  let dtAppendix = dom.createElement('dt-appendix');
  dom.body.appendChild(dtAppendix);
};
