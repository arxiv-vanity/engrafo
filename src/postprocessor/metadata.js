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

  // Insert metadata after title
  let metadata = utils.nodeFromString(dom, '<div class="engrafo-metadata"></div>');
  let title = dom.querySelector('h1');
  title.parentNode.insertBefore(metadata, title.nextSibling);

  let authors = utils.nodeFromString(dom, '<div class="authors"></div>');

  Array.from(dom.querySelectorAll("p.author")).forEach(el => {
    let div = utils.nodeFromString(dom, '<div class="author"></div>');
    utils.replaceAndKeepChildren(el, div);

    // Replace each line inside each span (bit of a hack. hopefully it won't break.)
    div.innerHTML = div.innerHTML.replace('<br>', '</span><span>');

    authors.appendChild(div);
  });

  metadata.appendChild(authors);
  metadata.appendChild(utils.nodeFromString(dom, '<div class="engrafo-metadata-custom"></div>'));

  // HACK: If there is a footnote directly after the authors, put it after the authors.
  // This is normally when a footnote without a mark is used for affiliation.
  let p = metadata.nextElementSibling;
  if (p && p.tagName == 'P' && p.children.length == 1 && p.children[0].className == 'engrafo-footnote') {
    // Remove footnote
    utils.removeAndFlattenChildren(p.childNodes[0]);
    // Put after authors
    authors.appendChild(p);
  }
};
