var utils = require("./utils");

test("authors render correctly", done => {
  utils.expectBodyToMatchSnapshot("layout/authors.tex", done);
});

test("titles and headings render correctly", done => {
  utils.expectBodyToMatchSnapshot("layout/headings.tex", done);
});

test("paragraphs and line breaks render correctly", done => {
  utils.expectBodyToMatchSnapshot("layout/paragraphs.tex", done);
});

test("footnotes render correctly", done => {
  utils.expectBodyToMatchSnapshot("layout/footnotes.tex", done);
});

test("footnotes in author render correctly", done => {
  utils.expectBodyToMatchSnapshot("layout/footnotes-author.tex", done);
})
