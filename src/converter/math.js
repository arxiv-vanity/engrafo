const mjpage = require("mathjax-node-page").mjpage;

function renderMath(htmlString) {
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
      ignoreClass: "ltx_page_main", // Ignore everything
      processClass: "ltx_Math|ltx_DisplayMath" // Then just process math
    },
    CommonHTML: {
      mtextFontInherit: true // Use body font for text
    },
    TeX: {
      extensions: [
        "autoload-all.js",
        // Even though we've defined autoload-all, for some reason we need to
        // define everything explicitly otherwise noUndefined doesn't work.
        "AMSmath.js",
        "AMSsymbols.js",
        "AMScd.js",
        "cancel.js",
        "color.js",
        "extpfeil.js",
        "mhchem.js",
        // Don't fail completely if a macro is missing
        "noUndefined.js"
      ],
      Macros: {
        // This is used to make macros work in both normal and math mode, so
        // just ignore
        ensuremath: ["#1", 1],
        // https://tex.stackexchange.com/questions/159289/more-basic-versions-of-prescript
        prescript: ["{}^{#1}_{#2} #3", 3],
        // https://groups.google.com/forum/#!topic/mathjax-users/Z0YJVtiQHCY
        lefteqn: ["\\rlap{\\displaystyle{#1}}", 1],
        // https://groups.google.com/forum/#!msg/mathjax-users/JC7L3lX54s4/poMq9iniAQAJ
        textnormal: ["\\textrm{#1}", 1],
        // https://gist.github.com/uchida/4001035
        bra: ["\\langle{#1}|", 1],
        ket: ["|{#1}\\rangle", 1],
        braket: ["\\langle{#1}\\rangle}", 1],
        ketbra: ["\\ket{#1}\\bra{#2}", 2],
        hdots: ["\\dots", 0],
        dag: ["\\dagger", 0],
        ddag: ["\\ddagger", 0],
        leavevmode: ["", 0],
        nobreak: ["", 0],
        // \mathbb, but with numerals
        mathds: ["{\\mathbb #1}", 1],
        mathbbm: ["{\\mathbb #1}", 1],
        // https://github.com/mathjax/MathJax/issues/1275
        bigtimes: ["\\mathop{\\vcenter{\\huge\\times}}", 0],
        vspace: ["", 1],
        // https://stackoverflow.com/questions/18189175/how-to-use-textup-with-mathjax
        textup: ["\\mathrm{#1}", 1]
      },
      Augment: {
        Definitions: {
          macros: {
            bm: "myBoldSwitch"
          }
        },
        Parse: {
          prototype: {
            // https://github.com/mathjax/MathJax/issues/1219
            myBoldSwitch: function() {
              this.stack.env.boldsymbol = true;
            }
          }
        }
      }
    }
  };

  let pageConfig = {
    format: ["TeX"],
    fontURL:
      "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/fonts/HTML-CSS",
    MathJax: mathjaxConfig
  };

  let mjnodeConfig = {
    html: true,
    css: true
  };

  return new Promise(resolve => {
    mjpage(htmlString, pageConfig, mjnodeConfig, resolve);
  });
}

module.exports = {
  renderMath: renderMath
};
