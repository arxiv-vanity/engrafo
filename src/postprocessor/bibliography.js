let utils = require("./utils");

// From https://github.com/distillpub/template/blob/master/components/citation.js
let css = `
.ltx_cite {
  cursor: default;
  /* TODO: maybe put this back when citations are shorter?
  white-space: nowrap; */
  font-family: -apple-system, BlinkMacSystemFont, "Roboto", Helvetica, sans-serif;
  font-style: normal;
  font-size: 75%;
  display: inline-block;
  line-height: 1.1em;
  text-align: center;
  position: relative;
  top: -2px;
  margin: 0 2px;
}

.ltx_cite a,
.ltx_cite a:hover {
  color: hsla(206, 90%, 20%, 0.7);
  border-bottom: 0;
}

figcaption .ltx_cite {
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
    item.removeChild(item.querySelector(".ltx_tag_bibitem"));
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

  var bibItems = Array.from(ol.childNodes);

  // Add hover boxes to citations
  Array.from(dom.querySelectorAll(".ltx_cite a")).forEach(a => {
    // This could just be dom.querySelector(a.getAttribute("href")) but
    // querySelector doesn't work if there are periods in the ID. Sigh.
    var bibItem = dom.querySelector(
      `li[id='${a.getAttribute("href").slice(1)}']`
    );
    if (!bibItem) return;

    var refId = appendCiteHoverDiv(dom, bibItem.innerHTML);
    var bibItemNumber = bibItems.indexOf(bibItem) + 1;
    var hoverSpan = utils.nodeFromString(
      dom,
      `<span data-hover-ref="${refId}"></span>`
    );
    utils.wrapElement(a, hoverSpan);
    a.setAttribute("onclick", "event.preventDefault()");
  });

  // Replace missing citations with [?]. Much neater.
  Array.from(dom.querySelectorAll(".ltx_missing_citation")).forEach(el => {
    el.innerHTML = "?";
  });
};
