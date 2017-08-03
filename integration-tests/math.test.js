var utils = require("./utils");

test("block math renders correctly", done => {
  utils.expectBodyToMatchSnapshot("math/block.tex", done);
});

test("inline math renders correctly", done => {
  utils.expectBodyToMatchSnapshot("math/inline.tex", done);
});
