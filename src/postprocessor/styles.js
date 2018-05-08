var fs = require("fs");
var path = require("path");
var utils = require("./utils");

module.exports = function(dom) {
  const stylesPath = path.join(__dirname, "../styles");
  const layout = fs.readFileSync(path.join(stylesPath, "styles-layout.css"));
  const article = fs.readFileSync(path.join(stylesPath, "styles-article.css"));
  const code = fs.readFileSync(path.join(stylesPath, "styles-code.css"));
  const print = fs.readFileSync(path.join(stylesPath, "styles-print.css"));

  utils.addStylesheet(dom, layout + article + code + print);

  // Remove weird styling from places we don't want it
  Array.from(dom.querySelectorAll("figcaption, .ltx_bibblock .ltx_text, .ltx_caption .ltx_text")).forEach(el => {
    el.removeAttribute("style");
  });
};
