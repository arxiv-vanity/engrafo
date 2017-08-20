var utils = require("./utils");

test("lists render correctly", done => {
  utils.expectBodyToMatchSnapshot("formatting/lists.tex", done);
});

test("text formatting renders correctly", done => {
  utils.expectBodyToMatchSnapshot("formatting/text.tex", done);
});

test("links get wrapped in anchors", done => {
  utils.expectBodyToMatchSnapshot("formatting/links.tex", done);
});

test("vskip is ignored", done => {
  utils.expectBodyToMatchSnapshot("formatting/vskip.tex", done);
});

test("\pdfoutput=1 is ignored", done => {
  utils.expectBodyToMatchSnapshot("formatting/pdfoutput.tex", done);
});

test("pinforms3 TITLE, AUTHOR, AFF are supported", done => {
  utils.expectBodyToMatchSnapshot("formatting/pinforms3.tex", done);
});

test("ICML commands are supported", done => {
  utils.expectBodyToMatchSnapshot("formatting/icml.tex", done);
});

test("\institute command is supported", done => {
  utils.expectBodyToMatchSnapshot("formatting/institute.tex", done);
});
