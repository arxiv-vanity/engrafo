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

// FIXME: needs latexml bindings. which papers is this in?
test.skip("pinforms3 TITLE, AUTHOR, AFF are supported", done => {
  utils.expectBodyToMatchSnapshot("formatting/pinforms3.tex", done);
});

// FIXME: needs latexml bindings
test.skip("ICML commands are supported", done => {
  utils.expectBodyToMatchSnapshot("formatting/icml.tex", done);
});

// FIXME: needs latexml bindings for \inst - where is this from?
test.skip("\institute command is supported", done => {
  utils.expectBodyToMatchSnapshot("formatting/institute.tex", done);
});
