var utils = require("./utils");

test("lists render correctly", done => {
  utils.expectBodyToMatchSnapshot("formatting/lists.tex", done);
});

test("text formatting renders correctly", done => {
  utils.expectBodyToMatchSnapshot("formatting/text.tex", done);
});
