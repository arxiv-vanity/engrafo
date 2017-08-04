let utils = require('./utils');

function parseBibitem(el) {
  // TODO(andreas): this isn't always the structure (e.g. 1707.08084v1)
  // reformat to this consistent format in the filter.

  var sourceEl = el.children[2];
  if (sourceEl) {
    // Flatten them paragraphs
    Array.from(sourceEl.children).forEach(el => {
      if (el.tagName == "P") {
        utils.removeAndFlattenChildren(el);
      }
    });
  }

  return {
    authors: el.children[0],
    title: el.children[1],
    source: sourceEl,
    id: el.getAttribute('id'),
  };
}

module.exports = function(dom) {
  var items = dom.getElementsByClassName('bibitem');
  if (items.length === 0) return;

  var bibliography = Array.from(items).map(parseBibitem);

  var ol = dom.createElement('ol');
  bibliography.forEach(item => {
    var li = dom.createElement('li');
    li.setAttribute('id', item.id);
    if (item.title) {
      var strong = dom.createElement('strong');
      utils.moveChildren(item.title, strong);
      li.appendChild(strong);
      li.appendChild(dom.createElement('br'));
    }
    if (item.authors) {
      utils.moveChildren(item.authors, li);
    }
    if (item.source) {
      li.appendChild(dom.createTextNode(' '));
      utils.moveChildren(item.source, li);
    }
    ol.appendChild(li);
  });

  var bibliographyEl = dom.getElementsByClassName('bibliography')[0];
  bibliographyEl.parentNode.removeChild(bibliographyEl);

  var dtBibliography = dom.createElement('dt-bibliography');
  dtBibliography.appendChild(ol);

  var dtAppendix = dom.getElementsByTagName('dt-appendix')[0];
  var h3 = dom.createElement('h3');
  h3.textContent = "References";
  dtAppendix.appendChild(h3);
  dtAppendix.appendChild(dtBibliography);
};
