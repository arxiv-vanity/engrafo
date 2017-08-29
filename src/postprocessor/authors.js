let utils = require("./utils");

let css = `
dt-byline code {
  background: none;
  border: 0;
  padding: 0;
  font-size: inherit;
  color: inherit;
  word-break: break-word;
  white-space: normal;
}

dt-byline .author > span {
  margin-right: 5px;
}

@media (min-width: 1080px) {
  dt-byline .affiliation {
    display: inline !important;
  }
}
`;

module.exports = function(dom) {
  utils.addStylesheet(dom, css);

  var bylineAuthors = dom.querySelector("dt-byline .authors");
  Array.from(dom.querySelectorAll("p.author")).forEach(el => {
    if (el.tagName == "P") {
      var newEl = utils.nodeFromString(dom, '<div class="author"></div>');
      utils.replaceAndKeepChildren(el, newEl);
      bylineAuthors.appendChild(newEl);
    } else {
      bylineAuthors.appendChild(el);
    }
  });
};
