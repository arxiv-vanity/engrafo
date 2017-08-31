const mjpage = require("mathjax-node-page").mjpage;

exports.renderMath = (htmlString, callback) => {
  let mathjaxConfig = {
    showProcessingMessages: false,
    messageStyle: "none",
    showMathMenu: false,
    menuSettings: {
      inTabOrder: false
    },
    displayAlign: "left",
    tex2jax: {
      processRefs: false,
      ignoreClass: "engrafo-container", // Ignore everything
      processClass: "math" // Then just process math
    },
    CommonHTML: {
      mtextFontInherit: true // Use body font for text
    },
    TeX: {
      Macros: {
        // https://github.com/mathjax/MathJax/issues/1219
        bm: ["{\\boldsymbol #1}",1],
      }
    }
  };

  let pageConfig = {
    format: ["TeX"],
    fontURL: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/fonts/HTML-CSS',
    MathJax: mathjaxConfig
  };

  let mjnodeConfig = {
    html: true,
    css: true
  };

  mjpage(htmlString, pageConfig, mjnodeConfig, output => {
    callback(null, output);
  });
};
