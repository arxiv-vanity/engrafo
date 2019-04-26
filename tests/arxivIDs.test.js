const { matchArxivID } = require("../src/converter/arxivIDs");

describe("matchArxivID", () => {
  it("matches arxiv:1234.5678", () => {
    expect(matchArxivID("blah arXiv:1234.5678 blah")).toEqual("1234.5678");
  });
  it("matches abs/1234.5678", () => {
    expect(matchArxivID("blah abs/1234.5678 blah")).toEqual("1234.5678");
  });
  it("matches abs/1234.5678 with a comma", () => {
    expect(matchArxivID("blah abs/1234.5678, blah")).toEqual("1234.5678");
  });
  it("matches plain IDs", () => {
    expect(matchArxivID("blah blah 1234.5678 blah blah")).toEqual("1234.5678");
  });
  it("matches old IDs", () => {
    expect(matchArxivID("blah blah hep-th/9806026 blah blah")).toEqual(
      "hep-th/9806026"
    );
  });
  it("matches old IDs with period", () => {
    expect(matchArxivID("blah blah hep-th/9806026. blah blah")).toEqual(
      "hep-th/9806026"
    );
  });
});
