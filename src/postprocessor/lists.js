let utils = require("./utils");

module.exports = function(dom) {
  // Replace shitty latexml lists with normal stuff
  Array.from(dom.querySelectorAll(".ltx_itemize .ltx_item, .ltx_enumerate .ltx_item")).forEach(li => {
    // Remove list-style-type:none;
    li.removeAttribute("style");
    // ... and the fake bullet
    utils.removeAll(li.querySelectorAll(".ltx_tag_enumerate"));
    utils.removeAll(li.querySelectorAll(".ltx_tag_itemize"));
  });
};
