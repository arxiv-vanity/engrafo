let utils = require("./utils");

// From https://github.com/distillpub/template/blob/master/components/citation.js
let css = `
.engrafo-cite {
  cursor: default;
  white-space: nowrap;
  font-family: -apple-system, BlinkMacSystemFont, "Roboto", Helvetica, sans-serif;
  font-size: 75%;
  color: hsla(206, 90%, 20%, 0.7);
  display: inline-block;
  line-height: 1.1em;
  text-align: center;
  position: relative;
  top: -2px;
  margin: 0 2px;
}

a.engrafo-cite,
a.engrafo-cite:hover {
  border-bottom: 0;
}

figcaption .engrafo-cite {
  font-size: 11px;
  font-weight: normal;
  top: -2px;
  line-height: 1em;
}
`;

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
    id: el.id
  };
}

// From https://github.com/distillpub/template/blob/master/components/citation.js
var appendCiteHoverDiv = (function() {
  var hover_n = 0;
  return function appendHoverDiv(dom, content) {
    var container = dom.querySelector("#cite-hover-boxes-container");
    var id = `dt-cite-hover-box-${hover_n}`;
    hover_n += 1;
    var str = `<div style="display:none;" class="dt-hover-box" id="${id}" >${content}</div>`;
    var div = utils.nodeFromString(dom, str);
    container.appendChild(div);
    return id;
  };
})();

module.exports = function(dom) {
  utils.addStylesheet(dom, css);

  var items = dom.querySelectorAll(".bibitem");
  if (items.length === 0) return;

  // Container for hover boxes
  dom
    .querySelector("body")
    .appendChild(
      utils.nodeFromString(dom, `<div id="cite-hover-boxes-container"></div>`)
    );

  var bibliography = Array.from(items).map(parseBibitem);

  var ol = dom.createElement("ol");
  bibliography.forEach(item => {
    var li = dom.createElement("li");
    li.id = item.id;
    if (item.title) {
      var strong = dom.createElement("strong");
      utils.moveChildren(item.title, strong);
      li.appendChild(strong);
      li.appendChild(dom.createElement("br"));
    }
    if (item.authors) {
      utils.moveChildren(item.authors, li);
    }
    if (item.source) {
      li.appendChild(dom.createTextNode(" "));
      utils.moveChildren(item.source, li);
    }
    ol.appendChild(li);
  });

  var bibliographyEl = dom.querySelector(".bibliography");
  bibliographyEl.parentNode.removeChild(bibliographyEl);

  var dtBibliography = dom.createElement("dt-bibliography");
  dtBibliography.appendChild(ol);

  var dtAppendix = dom.querySelector("dt-appendix");
  dtAppendix.appendChild(utils.nodeFromString(dom, "<h3>References</h3>"));
  dtAppendix.appendChild(dtBibliography);

  // Add hover boxes to citations
  Array.from(dom.querySelectorAll(".engrafo-cite")).forEach(a => {
    var bibItem = dom.querySelector(a.getAttribute("href"));
    if (!bibItem) return;
    var refId = appendCiteHoverDiv(dom, bibItem.innerHTML);
    var hoverSpan = utils.nodeFromString(dom, `<span data-hover-ref="${refId}"></span>`);
    utils.moveChildren(a, hoverSpan);
    a.appendChild(hoverSpan);
    a.setAttribute("onclick", "event.preventDefault()");
  });
};
