const mjpage = require("mathjax-node-page").mjpage;

function renderMath(dom) {
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
      ignoreClass: "ltx_page_main", // Ignore everything
      processClass: "ltx_Math|ltx_DisplayMath", // Then just process math
    },
    CommonHTML: {
      mtextFontInherit: true, // Use body font for text
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
        "noUndefined.js",
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
        enskip: [" ", 0],
        // https://stackoverflow.com/questions/18189175/how-to-use-textup-with-mathjax
        textup: ["\\mathrm{#1}", 1],

        // https://github.com/mathjax/MathJax-third-party-extensions/issues/26
        shortleftarrow: ["\\mathrel{\u2190}"],
        shortrightarrow: ["\\mathrel{\u2192}"],
        shortuparrow: ["\\mathrel{\u2191}"],
        shortdownarrow: ["\\mathrel{\u2193}"],
        Yup: ["\\mathbin{\u2144}"],
        Ydown: ["\\mathbin{}"],
        Yleft: ["\\mathbin{}"],
        Yright: ["\\mathbin{}"],
        varcurlyvee: ["\\mathbin{\u22CE}"],
        varcurlywedge: ["\\mathbin{\u22CF}"],
        minuso: ["\\mathbin{}"],
        baro: ["\\mathbin{}"],
        sslash: ["\\mathbin{\u2AFD}"],
        bbslash: ["\\mathbin{}"],
        moo: ["\\mathbin{}"],
        varotimes: ["\\mathbin{\u2297}"],
        varoast: ["\\mathbin{\u229B}"],
        varobar: ["\\mathbin{\u233D}"],
        varodot: ["\\mathbin{\u2299}"],
        varoslash: ["\\mathbin{\u2298}"],
        varobslash: ["\\mathbin{\u29B8}"],
        varocircle: ["\\mathbin{\u229A}"],
        varoplus: ["\\mathbin{\u2295}"],
        varominus: ["\\mathbin{\u2296}"],
        boxast: ["\\mathbin{\u29C6}"],
        boxbar: ["\\mathbin{\u25EB}"],
        boxdot: ["\\mathbin{\u22A1}"],
        boxslash: ["\\mathbin{\u29C4}"],
        boxbslash: ["\\mathbin{\u29C5}"],
        boxcircle: ["\\mathbin{\u29C7}"],
        boxbox: ["\\mathbin{\u29C8}"],
        boxempty: ["\\mathbin{}"],
        lightning: ["\\mathbin{}"],
        merge: ["\\mathbin{}"],
        vartimes: ["\\mathbin{\u00D7}"],
        fatsemi: ["\\mathbin{}"],
        sswarrow: ["\\mathrel{}"],
        ssearrow: ["\\mathrel{}"],
        curlywedgeuparrow: ["\\mathrel{}"],
        curlywedgedownarrow: ["\\mathrel{}"],
        fatslash: ["\\mathbin{}"],
        fatbslash: ["\\mathbin{}"],
        lbag: ["\\mathbin{\u27C5}"],
        rbag: ["\\mathbin{\u27C6}"],
        varbigcirc: ["\\mathbin{\u25CB}"],
        leftrightarroweq: ["\\mathrel{}"],
        curlyveedownarrow: ["\\mathrel{}"],
        curlyveeuparrow: ["\\mathrel{}"],
        nnwarrow: ["\\mathrel{}"],
        nnearrow: ["\\mathrel{}"],
        leftslice: ["\\mathbin{}"],
        rightslice: ["\\mathbin{}"],
        varolessthan: ["\\mathbin{\u29C0}"],
        varogreaterthan: ["\\mathbin{\u29C1}"],
        varovee: ["\\mathbin{}"],
        varowedge: ["\\mathbin{}"],
        talloblong: ["\\mathbin{\u2AFE}"],
        interleave: ["\\mathbin{\u2AF4}"],
        circledast: ['"229B}'],
        ocircle: ['"229A}'],
        circledcirc: ['"229A}'],
        obar: ["\\mathbin{\u233D}"],
        obslash: ["\\mathbin{\u29B8}"],
        olessthan: ["\\mathbin{\u29C0}"],
        ogreaterthan: ["\\mathbin{\u29C1}"],
        ovee: ["\\mathbin{}"],
        owedge: ["\\mathbin{}"],
        oblong: ["\\mathbin{}"],
        inplus: ["\\mathrel{}"],
        niplus: ["\\mathrel{}"],
        nplus: ["\\mathbin{}"],
        subsetplus: ["\\mathrel{\u2ABF}"],
        supsetplus: ["\\mathrel{\u2AC0}"],
        subsetpluseq: ["\\mathrel{}"],
        supsetpluseq: ["\\mathrel{}"],
        Lbag: ["\\mathopen{}"],
        Rbag: ["\\mathclose{}"],
        llparenthesis: ["\\mathopen{\u2987}"],
        rrparenthesis: ["\\mathclose{\u2988}"],
        binampersand: ["\\mathopen{}"],
        bindnasrepma: ["\\mathclose{}"],
        trianglelefteqslant: ["\\mathrel{}"],
        trianglerighteqslant: ["\\mathrel{}"],
        ntrianglelefteqslant: ["\\mathrel{}"],
        ntrianglerighteqslant: ["\\mathrel{}"],
        llfloor: ["\\mathopen{}"],
        rrfloor: ["\\mathclose{}"],
        llceil: ["\\mathopen{}"],
        rrceil: ["\\mathclose{}"],
        Mapstochar: ["\\mathrel{}"],
        mapsfromchar: ["\\mathrel{}"],
        Mapsfromchar: ["\\mathrel{}"],
        leftrightarrowtriangle: ["\\mathrel{\u21FF}"],
        leftarrowtriangle: ["\\mathrel{\u21FD}"],
        rightarrowtriangle: ["\\mathrel{\u21FE}"],
        bigtriangledown: ["\\mathop {\u25BD}"],
        bigtriangleup: ["\\mathop {\u25B3}"],
        bigcurlyvee: ["\\mathop{}"],
        bigcurlywedge: ["\\mathop{}"],
        bigsqcap: ["\\mathop {\u2A05}"],
        bigbox: ["\\mathop{}"],
        bigparallel: ["\\mathop{}"],
        biginterleave: ["\\mathop {\u2AFC}"],
        bignplus: ["\\mathop{}"],
        llbracket: ["\\mathopen{\u27E6}"],
        rrbracket: ["\\mathclose{\u27E7}"],

        // I think this is a copyright sign with a circular rather than slightly elliptical perimeter.

        varcopyright: ["{\u00A9}"],

        // The following four macros are like \not, but adjusted for use with arrows.

        arrownot: ["\\mathrel{}"],
        Arrownot: ["\\mathrel{}"],
        longarrownot: ["\\mathrel{}"],
        Longarrownot: ["\\mathrel{}"],

        Mapsto: ["\\mathrel{\u21A6}"],
        mapsfrom: ["\\mathrel{\u21A4}"],
        Mapsfrom: ["\\mathrel{\u2906}"],
        Longmapsto: ["\\mathrel{\u27FE}"],
        longmapsfrom: ["\\mathrel{\u27FB}"],
        Longmapsfrom: ["\\mathrel{\u27FD}"],

        // These are defined in LaTeXML's siunitx bindings, but for some reason don't work inside math
        // From https://github.com/brucemiller/LaTeXML/blob/master/lib/LaTeXML/Package/siunitx.sty.ltxml
        SIUnitSymbolCelsius: ["\u00B0C"],
        SIUnitSymbolOhm: ["\u03C9"],
        SIUnitSymbolDegree: ["\u00B0"],
        SIUnitSymbolArcminute: ["{}^{\\prime}"],
        SIUnitSymbolArcsecond: ["{}^{\\prime\\prime}"],
        SIUnitSymbolAngstrom: ["\u00C5"],
        SIUnitSymbolMicro: ["\u00B5"],
        // FIXME: these don't work
        "lx@arcdegree": ["\u00B0"],
        "lx@arcminute": ["{}^{\\prime}"],
        "lx@arcsecond": ["{}^{\\prime\\prime}"],
      },
      Augment: {
        Definitions: {
          macros: {
            bm: "myBoldSwitch",
            // https://github.com/mathjax/MathJax-docs/wiki/Macro:-arc-symbol-under,-over
            overparen: ["UnderOver", "23DC"], // UnderOver represents the MathML element, 23DC the unicode character
            underparen: ["UnderOver", "23DD"], // UnderOver represents the MathML element, 23DC the unicode character
          },
        },
        Parse: {
          prototype: {
            // https://github.com/mathjax/MathJax/issues/1219
            myBoldSwitch: function () {
              this.stack.env.boldsymbol = true;
            },
          },
        },
      },
    },
  };

  let pageConfig = {
    format: ["TeX"],
    MathJax: mathjaxConfig,
  };

  let mjnodeConfig = {
    html: true,
    css: true,
  };

  console.log("Rendering math...");

  return new Promise((resolve) => {
    mjpage(dom, pageConfig, mjnodeConfig, resolve);
  });
}

module.exports = {
  renderMath: renderMath,
};
