let utils = require("./utils");

var css = `
dt-article figure .math {
  display: block;
  overflow-x: auto;
  margin-right: 30px;
}

.engrafo-container .mjx-chtml[tabindex]:focus {
  outline: none;
  display: inline-block;
}

.engrafo-equation-number {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
}
@media(min-width: 768px) {
  .engrafo-equation-number {
    right: 5%;
  }
}
@media (min-width: 1080px) {
  .engrafo-equation-number {
    right: 5%;
  }
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
