let utils = require("./utils");
var css = `
/* listings */
.ltx_listing {
  font-size: 0.8em;
  border-left: 3px solid rgba(0, 0, 0, 0.05);
  padding: 0 0 0 24px;
  color: rgba(0, 0, 0, 0.6);
  font-family: monospace;
}
.ltx_listingline { white-space:nowrap; min-height:1em; }
.ltx_lst_numbers_left .ltx_listingline .ltx_tag {
  background-color:transparent;
  margin-left:-3em; width:2.5em;
  position:absolute;
  text-align:right; }
.ltx_lst_numbers_right .ltx_listingline .ltx_tag {
    background-color:transparent;
    width:2.5em;
    position:absolute; right:3em;
    text-align:right; }
`;
module.exports = function(dom) {
  utils.addStylesheet(dom, css);

  // Remove download link
  utils.removeAll(dom.querySelectorAll(".ltx_listing_data"));
};
