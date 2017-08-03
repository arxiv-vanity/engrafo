var utils = require("./utils");

test("titles and headings render correctly", done => {
  utils.expectBodyToMatchSnapshot("layout/headings.tex", done);
});

test("paragraphs and line breaks render correctly", done => {
  utils.expectBodyToMatchSnapshot("layout/paragraphs.tex", done);
});

test("footnotes render correctly", done => {
  utils.expectBodyToMatchSnapshot("layout/footnotes.tex", done);
});
