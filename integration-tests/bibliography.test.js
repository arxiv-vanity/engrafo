var utils = require("./utils");

test("a basic bibliography renders correctly", done => {
  utils.expectBodyToMatchSnapshot("bibliography/basic.tex", done);
});

test("a 3-line inline bibliography renders correctly", done => {
  utils.expectBodyToMatchSnapshot("bibliography/inline_3line.tex", done);
});
