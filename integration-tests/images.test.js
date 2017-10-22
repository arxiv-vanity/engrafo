var utils = require("./utils");

test("images in figures render correctly", done => {
  utils.expectBodyToMatchSnapshot("images/figure.tex", done);
});

test("multiple images in figures render correctly", done => {
  utils.expectBodyToMatchSnapshot("images/multiple-image.tex", done);
});

test("plain images render correctly", done => {
  utils.expectBodyToMatchSnapshot("images/plain-image.tex", done);
});
