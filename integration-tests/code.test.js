var utils = require("./utils");

test("basic listings render correctly", done => {
  utils.expectBodyToMatchSnapshot("code/basic.tex", done);
});
