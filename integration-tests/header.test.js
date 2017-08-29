var utils = require("./utils");

test("bold is stripped from header", done => {
  utils.expectBodyToMatchSnapshot("header/bold-title.tex", done);
});
