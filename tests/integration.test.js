var utils = require("./utils");

test("basic latex features render correctly", done => {
  utils.expectToMatchSnapshot("documents/basic.tex", done);
}, 25000);

test("sample2e.tex sample document renders correctly", done => {
  utils.expectToMatchSnapshot("documents/sample2e.tex", done);
}, 10000);

test("small2e.tex sample document renders correctly", done => {
  utils.expectToMatchSnapshot("documents/small2e.tex", done);
}, 10000);
