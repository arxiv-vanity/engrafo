var utils = require("./utils");

var css = `
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
  utils.addStylesheet(dom, css);
};
