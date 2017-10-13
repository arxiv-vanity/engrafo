var utils = require("./utils");

test("images in figures render correctly", done => {
  utils.expectBodyToMatchSnapshot("images/figure.tex", done);
});

test("plain images render correctly", done => {
  utils.expectBodyToMatchSnapshot("images/plain-image.tex", done);
});
