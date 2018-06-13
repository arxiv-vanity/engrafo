var utils = require("./utils");

module.exports = function(dom) {
  // Remove container which we will replace with our own
  utils.removeAndFlattenChildren(dom.querySelector(".ltx_page_main"));

  // Remove dates
  utils.removeAll(dom.querySelectorAll(".ltx_date"))

  utils.replaceAndKeepChildren(
    dom.querySelector(".ltx_document"),
    dom.createElement('dt-article')
  );

  // HACK: Add an empty <h1> if it doesn't exist, because adding metadata
  // expects there to be one
  if (!dom.querySelector('h1')) {
    let dtArticle = dom.querySelector('dt-article');
    dtArticle.insertBefore(dom.createElement('h1'), dtArticle.firstChild);
  }

  // Make abstract title same size as everything else
  var abstractTitle = dom.querySelector(".ltx_title_abstract");
  if (abstractTitle) {
    utils.replaceAndKeepChildren(abstractTitle, dom.createElement('h2'));
  }

  utils.removeAll(dom.querySelectorAll(".ltx_page_footer"));
};
