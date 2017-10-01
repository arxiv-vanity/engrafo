var utils = require("./utils");

test("footnotes after metadata are inlined inside metadata", done => {
  utils.expectBodyToMatchSnapshot("metadata/footnotes-after-metadata.tex", done);
});
