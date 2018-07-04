var utils = require("./utils");

module.exports = function(dom) {
  let dtAppendix = dom.createElement("dt-appendix");
  dom.querySelector(".ltx_page_content").appendChild(dtAppendix);
};
