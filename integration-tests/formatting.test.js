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
