let utils = require("./utils");

var css = `
dt-article figure .math {
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
    tex2jax: {
      processRefs: false,
      ignoreClass: "engrafo-container", // Ignore everything
      processClass: "math" // Then just process math
    }
  };

  let configScript = utils.nodeFromString(dom, '<script type="text/javascript"></script>');
  configScript.appendChild(dom.createTextNode(`window.MathJax = ${JSON.stringify(mathjaxConfig)};`));
  dom.head.appendChild(configScript);

  dom.head.appendChild(utils.nodeFromString(dom, '<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS_CHTML-full" async type="text/javascript"></script>'));

};
