var utils = require("./utils");

test("authors render correctly", done => {
  utils.expectBodyToMatchSnapshot("layout/authors.tex", done);
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

test("dates are not rendered", done => {
  utils.expectBodyToMatchSnapshot("layout/date.tex", done);
})

test("abstracts work", done => {
  utils.expectBodyToMatchSnapshot("layout/abstract.tex", done);
});
