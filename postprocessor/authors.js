let utils = require("./utils");
module.exports = function(dom) {
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
