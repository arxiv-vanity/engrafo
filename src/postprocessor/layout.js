var utils = require("./utils");

module.exports = function(dom) {
  // Remove all of latexml's style
  utils.removeAll(dom.querySelectorAll("link[rel='stylesheet']"));

  // Remove container which we will replace with our own
  utils.removeAndFlattenChildren(dom.querySelector(".ltx_page_main"));

  // Remove dates
  utils.removeAll(dom.querySelectorAll(".ltx_date"))

  utils.replaceAndKeepChildren(
    dom.querySelector(".ltx_document"),
    dom.createElement('dt-article')
  );

  // Make abstract title same size as everything else
  utils.replaceAndKeepChildren(
    dom.querySelector(".ltx_title_abstract"),
    dom.createElement('h2')
  );

  utils.removeAll(dom.querySelector("footer"));
};
