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

.engrafo-metadata code {
  background: none;
  border: 0;
  padding: 0;
  font-size: inherit;
  color: inherit;
  word-break: break-word;
  white-space: normal;
}

.engrafo-metadata > .authors {
}

.engrafo-metadata .author {
  margin-bottom: 12px;
}

/* HACK(bfirsh): this seems to make things render a bit better. but really this is just making up for our dodgy authors output */
.engrafo-metadata .author > span,
.engrafo-metadata .author .thanks {
  display: block;
}

.engrafo-metadata .author > span:first-child {
  font-weight: bold;
}

.engrafo-metadata .author > span:first-child .thanks {
  font-weight: normal;
}

.engrafo-metadata .engrafo-metadata-custom {
  color: rgba(0, 0, 0, 0.5);
}

/* DISABLED: put the authors on the RHS
@media(min-width: 768px) {
  .engrafo-metadata {
    display: flex;
  }
  .engrafo-metadata > .authors {
    flex: 2;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    padding-right: 30px;
    margin-right: 15px;
  }
  .engrafo-metadata .engrafo-metadata-custom {
    flex: 1;
  }
}
*/

`;

module.exports = function(dom) {
  utils.addStylesheet(dom, css);

  let metadata = dom.querySelector('.engrafo-metadata');
  let authors = metadata.querySelector('.authors');

  Array.from(authors.children).forEach(el => {
    // Replace each line inside each span (bit of a hack. hopefully it won't break.)
    el.innerHTML = el.innerHTML.replace('<br>', '</span><span>');
  });

  // HACK: If there is a footnote directly after the authors, put it after the authors.
  // This is normally when a footnote without a mark is used for affiliation.
  let p = dom.querySelector('.engrafo-body').children[0];
  if (p && p.tagName == 'P' && p.children.length == 1 && p.children[0].className == 'engrafo-footnote') {
    // Remove footnote
    utils.removeAndFlattenChildren(p.childNodes[0]);
    // Put after authors
    authors.appendChild(p);
  }
};
