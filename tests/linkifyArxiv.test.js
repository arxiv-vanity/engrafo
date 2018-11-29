const linkifyArxiv = require("../src/converter/linkifyArxiv");

describe("linkifyArxiv", () => {
  it("converts arXiv:1234.5678 into a link", () => {
    expect(linkifyArxiv("This is arXiv:1234.5678 a sentence")).toEqual(
      'This is <a href="https://arxiv.org/abs/1234.5678">arXiv:1234.5678</a> a sentence'
    );
  });
});
