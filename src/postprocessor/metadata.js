let utils = require("./utils");

let css = `
.engrafo-metadata {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 12px;
  padding-bottom: 12px;
  margin-bottom: 24px;
  font: 400 12px/1.55em -apple-system, BlinkMacSystemFont, "Roboto", Helvetica, sans-serif;
}

.engrafo-metadata p {
  font: 400 12px/1.55em -apple-system, BlinkMacSystemFont, "Roboto", Helvetica, sans-serif;
  margin-bottom: 12px;
}

.engrafo-metadata:first-line {
  font-weight: bold;
}

.engrafo-metadata .engrafo-metadata-custom {
  color: rgba(0, 0, 0, 0.5);
}
`;

module.exports = function(dom) {
  utils.addStylesheet(dom, css);

  // Put metadata in right place
  let metadata = utils.nodeFromString(dom, '<div class="engrafo-metadata"></div>');
  let h1 = dom.querySelector("h1");
  if (h1) {
    h1.parentNode.insertBefore(metadata, h1.nextSibling);
  }

  let authors = dom.querySelector('.ltx_authors');
  if (authors) {
    metadata.appendChild(authors);
  }

  metadata.appendChild(utils.nodeFromString(dom, '<div class="engrafo-metadata-custom"></div>'));

  // Array.from(authors.children).forEach(el => {
  //   // Replace each line inside each span (bit of a hack. hopefully it won't break.)
  //   el.innerHTML = el.innerHTML.replace('<br>', '</span><span>');
  // });
};
