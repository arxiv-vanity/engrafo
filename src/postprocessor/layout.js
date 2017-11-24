var utils = require("./utils");

module.exports = function(dom) {
  // Remove all of latexml's style
  Array.from(dom.querySelectorAll("link[rel='stylesheet']")).forEach(link => {
    link.parentNode.removeChild(link);
  });

  // Remove container which we will replace with our own
  utils.removeAndFlattenChildren(dom.querySelector(".ltx_page_main"));

  utils.replaceAndKeepChildren(
    dom.querySelector(".ltx_document"),
    dom.createElement('dt-article')
  );

  // Make abstract title same size as everything else
  utils.replaceAndKeepChildren(
    dom.querySelector(".ltx_title_abstract"),
    dom.createElement('h2')
  );

  var footer = dom.querySelector("footer");
  if (footer) {
    footer.parentNode.removeChild(footer);
  }
};
