var utils = require("./utils");

test("bold is stripped from title", done => {
  utils.expectBodyToMatchSnapshot("header/bold-title.tex", done);
});

test("TITLES IN ALL CAPS are fixed", done => {
  utils.expectBodyToMatchSnapshot("header/all-caps-titles.tex", done);
});
