var utils = require("./utils");

test("it fails when document is just \\includepdf", done => {
  utils.renderToDom("failures/includepdf.tex", (err) => {
    expect(err).toBeTruthy();
    expect(err.toString()).toContain("Document is blank");
    done();
  });
});
