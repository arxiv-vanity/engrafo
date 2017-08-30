let utils = require("./utils");

var css = `
dt-article figure .math.display {
  display: block;
  font-family: Georgia, serif;
}

@media (min-width: 768px) {
  dt-article figure .math.display {
    margin-left: 24px;
  }
}

.engrafo-container .mjx-chtml[tabindex]:focus {
  outline: none;
  display: inline-block;
}
`;

module.exports = function(dom) {
  utils.addStylesheet(dom, css);

  // Make math figures
  let mathBlocks = dom.querySelectorAll(".engrafo-equation");
  Array.from(mathBlocks).forEach(div => {
    // Sometimes there is a <p> in there for some reason
    if (div.children[0].tagName == 'P') {
      utils.removeAndFlattenChildren(div.children[0]);
    }

    let figure = dom.createElement("figure");
    figure.id = div.id;
    utils.replaceAndKeepChildren(div, figure);
  });

  // Remove the Mathjax script because we're going server-side baby
  let scriptToRemove = dom.querySelector('script[src^="https://cdnjs.cloudflare.com/ajax/libs/mathjax/"]');
  if (scriptToRemove) {
    scriptToRemove.parentNode.removeChild(scriptToRemove);
  }
};
