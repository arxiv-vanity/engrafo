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

  var items = Array.from(dom.querySelectorAll(".ltx_bibitem"));
  if (items.length === 0) return;

  // Container for hover boxes
  dom
    .querySelector("body")
    .appendChild(
      utils.nodeFromString(dom, `<div id="cite-hover-boxes-container"></div>`)
    );

  var ol = dom.createElement("ol");
  items.forEach(item => {
    // TODO maybe format this correctly so we don't have to rely on <ol>
    // numbering
    item.removeChild(item.querySelector(".ltx_bibtag"));
    // TODO style bibliography items
    ol.appendChild(item);
  });

  var bibliographyEl = dom.querySelector(".ltx_bibliography");
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
