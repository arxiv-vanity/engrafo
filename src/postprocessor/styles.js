var fs = require("fs");
var path = require("path");
var utils = require("./utils");

var css = `
dt-article,
dt-appendix,
.dt-hover-box {
  font: 400 16px/1.55em -apple-system, BlinkMacSystemFont, "Roboto", Helvetica, sans-serif;
}

@media (min-width: 1024px) {
  dt-article {
      font-size: 20px;
  }
}

dt-article h1,
dt-article h2,
dt-article h3 {
  font-family: Baskerville, Georgia, serif;
}

dt-article h1 {
  font-size: 32px;
}

dt-article h2 {
  font-size: 28px;
}

dt-article h3 {
  font-size: 22px;
}

@media (min-width: 768px) {
  dt-article h1 {
    font-size: 46px;
  }
}

@media (min-width: 1024px) {
  dt-article h2 {
    font-size: 32px;
  }
  dt-article h3 {
    font-size: 28px;
  }
}

dt-article p {
  hyphens: auto;
  -webkit-hyphens: auto;
}

@media(min-width: 768px) {
  dt-article p {
    hyphens: none;
    -webkit-hyphens: none;
  }
}
`;

module.exports = function(dom) {
  var distillPath = path.join(__dirname, "../../node_modules/distill-template/");
  var layout = fs.readFileSync(path.join(distillPath, "components/styles-layout.css"));
  var article = fs.readFileSync(path.join(distillPath, "components/styles-article.css"));
  var code = fs.readFileSync(path.join(distillPath, "components/styles-code.css"));
  var print = fs.readFileSync(path.join(distillPath, "components/styles-print.css"));

  utils.addStylesheet(dom, layout + article + code + print);
  utils.addStylesheet(dom, css);
};
