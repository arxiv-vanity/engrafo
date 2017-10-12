var utils = require("./utils");

test("bold is stripped from title", done => {
  utils.expectBodyToMatchSnapshot("headings/bold-title.tex", done);
});

test("TITLES IN ALL CAPS are fixed", done => {
  utils.expectBodyToMatchSnapshot("headings/all-caps-titles.tex", done);
});
