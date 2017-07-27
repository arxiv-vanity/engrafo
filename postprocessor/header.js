
module.exports = function(dom) {
  // Wrap whole thing in <dt-article>
  let dtArticle = dom.createElement('dt-article');
  Array.from(dom.body.children).forEach(function(child) {
    dom.body.removeChild(child);
    dtArticle.appendChild(child);
  });
  dom.body.appendChild(dtArticle);

};
