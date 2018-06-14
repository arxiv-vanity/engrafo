const utils = require("./utils");

// TODO: scope this to just integration tests
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

test("titles and sections render correctly", async () => {
  await utils.expectToMatchSnapshot("documents/sections.tex");
});

test("text renders correctly", async () => {
  await utils.expectToMatchSnapshot("documents/text.tex");
});

test("paragraph formatting renders correctly", async () => {
  await utils.expectToMatchSnapshot("documents/paragraph.tex");
});

test("URLS render correctly", async () => {
  await utils.expectToMatchSnapshot("documents/urls.tex");
});

test("listings render correctly", async () => {
  await utils.expectToMatchSnapshot("documents/listings.tex");
});

test("tables render correctly", async () => {
  await utils.expectToMatchSnapshot("documents/tables.tex");
});

test("figures render correctly", async () => {
  await utils.expectToMatchSnapshot("documents/figures.tex");
});

test("math renders correctly", async () => {
  await utils.expectToMatchSnapshot("documents/math.tex");
});

test("footnotes render correctly", async () => {
  await utils.expectToMatchSnapshot("documents/footnotes.tex");
});

test("citations render correctly", async () => {
  await utils.expectToMatchSnapshot("documents/citations.tex");
});

test("sample2e.tex sample document renders correctly", async () => {
  await utils.expectToMatchSnapshot("documents/sample2e.tex");
});

test("small2e.tex sample document renders correctly", async () => {
  await utils.expectToMatchSnapshot("documents/small2e.tex");
});
