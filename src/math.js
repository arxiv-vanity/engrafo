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
        // This is used to make macros work in both normal and math mode, so
        // just ignore
        ensuremath: ['#1', 1],
        // https://tex.stackexchange.com/questions/159289/more-basic-versions-of-prescript
        prescript: ['{}^{#1}_{#2} #3', 3],
      },
      Augment: {
        Definitions: {macros: {
          bm: 'myBoldSwitch'
        }},
        Parse: {prototype: {
          // https://github.com/mathjax/MathJax/issues/1219
          myBoldSwitch: function (name) {
            this.stack.env.boldsymbol = true;
          }
        }}
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
