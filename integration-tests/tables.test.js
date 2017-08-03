var utils = require("./utils");

test("basic tables render correctly", done => {
  utils.expectBodyToMatchSnapshot("tables/basic.tex", done);
});
