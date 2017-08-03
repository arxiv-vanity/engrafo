var utils = require("./utils");

test("a basic bibliography renders correctly", done => {
  utils.expectBodyToMatchSnapshot("bibliography/basic.tex", done);
});
