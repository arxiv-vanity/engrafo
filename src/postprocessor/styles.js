var fs = require("fs");
var path = require("path");
var utils = require("./utils");

var css = `
/* HACK: We just need this for the dev server, but it shouldn't make
its way out to rendered output. Figure out some way of doing this so it is
just shown in dev server. */
body {
  margin: 0;
}

dt-appendix,
.dt-hover-box {
  font: 400 14px/1.55em -apple-system, BlinkMacSystemFont, "Roboto", Helvetica, sans-serif;
}

@media (min-width: 1024px) {
  dt-appendix,
  .dt-hover-box {
    font-size: 17px;
  }
}

/* Slice off long URLs because they mess up the mobile design */
dt-article a,
dt-appendix a,
.dt-hover-box a {
  word-break: break-word;
}

dt-article h1,
dt-article h2,
dt-article h3 {
  font-family: Baskerville, Georgia, serif;
}

dt-article h1 {
  font-size: 32px;
  margin-bottom: 24px;
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

.engrafo-container code {
  word-break: break-word;
  white-space: normal;
}

dt-article > blockquote {
  padding-left: 24px;
}

/* Some block-level styling stuff we get from Pandoc.
TODO(bfirsh): make these inline elements instead. */
.engrafo-container .emph {
  font-style: italic;
}
.engrafo-container .textbf {
  font-weight: bold;
}

.engrafo-container dt {
  font-family: Georgia, serif;
  font-weight: bold;
}

dt-article > h5,
dt-article > h6 {
  font-family: Georgia, serif;
  font-weight: bold;
  font-size: inherit;
}

/* latexml makes heavy use of <section> so remove the margin that distill adds */
dt-article section {
  margin-top: 0;
  margin-bottom: 0;
}

/* Standard article bit alignment. Add more to this definition to add support
in articles. */
dt-article > blockquote,
dt-article > dl,
dt-article > h5,
dt-article > h6,
dt-article > .engrafo-metadata {
  width: auto;
  margin-left: 24px;
  margin-right: 24px;
  box-sizing: border-box;
}

@media(min-width: 768px) {
  dt-article > blockquote,
  dt-article > dl,
  dt-article > h5,
  dt-article > h6,
  dt-article > .engrafo-metadata {
    margin-left: 72px;
    margin-right: 72px;
  }
}

@media(min-width: 1080px) {
  dt-article > blockquote,
  dt-article > dl,
  dt-article > h5,
  dt-article > h6,
  dt-article > .engrafo-metadata {
    margin-left: calc(50% - 984px / 2);
    width: 648px;
  }
}

/* latexml stuff */
.ltx_ERROR        { color:red; }
.ltx_rdf          { display:none; }
.ltx_missing      { color:red;}
.ltx_nounicode    { color:red; }

/* TODO: just use the correct HTML elements if possible */
.ltx_font_bold { font-weight: bolder; }
.ltx_font_italic { font-style: italic; }
.ltx_font_typewriter {
  font-family: monospace;
  font-size: 0.9em;
}
.ltx_align_center { text-align: center; }
.ltx_align_right    { text-align:right; }
.ltx_align_top      { vertical-align:top; }
.ltx_align_bottom   { vertical-align:bottom; }
.ltx_align_middle   { vertical-align:middle; }
.ltx_align_baseline { vertical-align:baseline; }

/*======================================================================
 Borders and such */
.ltx_tabular { display:inline-table; border-collapse:collapse; }
.ltx_tabular.ltx_centering { display:table; }
.ltx_thead,
.ltx_tfoot,
.ltx_tbody   { display:table-row-group; }
.ltx_tr      { display:table-row; }
.ltx_td,
.ltx_th      { display:table-cell; }

.ltx_td { font-size: 15px; }

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
