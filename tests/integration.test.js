const utils = require("./utils");

test(
  "basic latex features render correctly",
  async () => {
    await utils.expectToMatchSnapshot("documents/basic.tex");
  },
  25000
);

test(
  "sample2e.tex sample document renders correctly",
  async () => {
    await utils.expectToMatchSnapshot("documents/sample2e.tex");
  },
  10000
);

test(
  "small2e.tex sample document renders correctly",
  async () => {
    await utils.expectToMatchSnapshot("documents/small2e.tex");
  },
  10000
);
