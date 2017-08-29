let utils = require("./utils");

var css = `
dt-article figure .math.display {
  display: block;
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

  // Remove the Mathjax script that Pandoc puts in because it is not async and
  // an old version
  let scriptToRemove = dom.querySelector('script[src^="https://cdnjs.cloudflare.com/ajax/libs/mathjax/"]');
  if (scriptToRemove) {
    scriptToRemove.parentNode.removeChild(scriptToRemove);
  }

  let mathjaxConfig = {
    showProcessingMessages: false,
    messageStyle: "none",
    showMathMenu: false,
    menuSettings: {
      inTabOrder: false,
    },
    displayAlign: "left",
    displayIndent: "24px",
    tex2jax: {
      processRefs: false,
      ignoreClass: "engrafo-container", // Ignore everything
      processClass: "math" // Then just process math
    },
    CommonHTML: {
      mtextFontInherit: true, // Use body font for text
    }
  };

  let configScript = utils.nodeFromString(dom, '<script type="text/javascript"></script>');
  configScript.appendChild(dom.createTextNode(`window.MathJax = ${JSON.stringify(mathjaxConfig)};`));
  dom.head.appendChild(configScript);

  dom.head.appendChild(utils.nodeFromString(dom, '<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS_CHTML-full" async type="text/javascript"></script>'));

};
