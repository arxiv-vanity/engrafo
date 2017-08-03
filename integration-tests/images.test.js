var utils = require("./utils");

test("images in figures render correctly", done => {
  utils.expectBodyToMatchSnapshot("images/figure.tex", done);
});
