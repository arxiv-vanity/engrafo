var fs = require("fs");
var path = require("path");
var tmp = require("tmp");
var input = require("../src/input");

describe("prepareRenderingDir", () => {
  beforeEach(done => {
    tmp.dir({ unsafeCleanup: true }, (err, dir, cleanup) => {
      this.inputDir = dir;
      this.inputCleanup = cleanup;
      tmp.dir({ unsafeCleanup: true }, (err, dir, cleanup) => {
        this.outputDir = dir;
        this.outputCleanup = cleanup;
        done();
      });
    });
  });
  afterEach(() => {
    this.inputCleanup();
    this.outputCleanup();
  });

  it("copies input when specifying a file", done => {
    fs.writeFileSync(path.join(this.inputDir, "main.tex"), "");
    fs.writeFileSync(path.join(this.inputDir, "cool.gif"), "");
    var texPath = path.join(this.inputDir, "main.tex");
    input.prepareRenderingDir(texPath, this.outputDir, (err, outputTexPath) => {
      if (err) throw err;
      expect(outputTexPath).toBe(path.join(this.outputDir, "main.tex"));
      expect(fs.lstatSync(outputTexPath).isFile()).toBe(true);
      expect(fs.lstatSync(path.join(this.outputDir, "cool.gif")).isFile()).toBe(true);
      done();
    });
  });

  it("copies input and chooses a .tex file when specifying a directory", done => {
    fs.writeFileSync(path.join(this.inputDir, "main.tex"), "");
    fs.writeFileSync(path.join(this.inputDir, "nope.tex"), "");
    fs.writeFileSync(path.join(this.inputDir, "cool.gif"), "");
    input.prepareRenderingDir(this.inputDir, this.outputDir, (err, outputTexPath) => {
      if (err) throw err;
      expect(outputTexPath).toBe(path.join(this.outputDir, "main.tex"));
      expect(fs.lstatSync(outputTexPath).isFile()).toBe(true);
      expect(fs.lstatSync(path.join(this.outputDir, "cool.gif")).isFile()).toBe(true);
      done();
    });
  });
});

describe("pickLatexFile", () => {
  beforeEach(done => {
    tmp.dir({ unsafeCleanup: true }, (err, dir, cleanup) => {
      this.dir = dir;
      this.cleanup = cleanup;
      done();
    });
  });
  afterEach(() => {
    this.cleanup();
  });
  it("chooses ms.tex if it exists", done => {
    fs.writeFileSync(path.join(this.dir, "ms.tex"), "");
    fs.writeFileSync(path.join(this.dir, "nope.tex"), "");
    fs.writeFileSync(path.join(this.dir, "cool.gif"), "");
    input.pickLatexFile(this.dir, (err, filename) => {
      if (err) throw err;
      expect(filename).toBe("ms.tex");
      done();
    });
  });
  it("chooses main.tex if it exists", done => {
    fs.writeFileSync(path.join(this.dir, "main.tex"), "");
    fs.writeFileSync(path.join(this.dir, "nope.tex"), "");
    fs.writeFileSync(path.join(this.dir, "cool.gif"), "");
    input.pickLatexFile(this.dir, (err, filename) => {
      if (err) throw err;
      expect(filename).toBe("main.tex");
      done();
    });
  });
  it("chooses the only tex file if there's one", done => {
    fs.writeFileSync(path.join(this.dir, "wibble.tex"), "");
    fs.writeFileSync(path.join(this.dir, "cool.gif"), "");
    fs.writeFileSync(path.join(this.dir, "rad.jpg"), "");
    input.pickLatexFile(this.dir, (err, filename) => {
      if (err) throw err;
      expect(filename).toBe("wibble.tex");
      done();
    });
  });
  it("chooses the only tex file with \\documentclass if there are several", done => {
    fs.writeFileSync(path.join(this.dir, "wibble.tex"), "not the tex you are looking for");
    fs.writeFileSync(path.join(this.dir, "correct.tex"), "\\documentclass[12pt, letterpaper]{article}");
    fs.writeFileSync(path.join(this.dir, "cool.gif"), "");
    fs.writeFileSync(path.join(this.dir, "rad.jpg"), "");
    input.pickLatexFile(this.dir, (err, filename) => {
      if (err) throw err;
      expect(filename).toBe("correct.tex");
      done();
    });
  });
  it("chooses the only tex file with \\documentclass and a .bib file if there are several", done => {
    fs.writeFileSync(path.join(this.dir, "wibble.tex"), "\\documentclass[12pt, letterpaper]{article}");
    fs.writeFileSync(path.join(this.dir, "correct.tex"), "\\documentclass[12pt, letterpaper]{article}");
    fs.writeFileSync(path.join(this.dir, "correct.bib"), "");
    fs.writeFileSync(path.join(this.dir, "cool.gif"), "");
    fs.writeFileSync(path.join(this.dir, "rad.jpg"), "");
    input.pickLatexFile(this.dir, (err, filename) => {
      if (err) throw err;
      expect(filename).toBe("correct.tex");
      done();
    });
  });
  it("fails if there aren't any tex files", done => {
    fs.writeFileSync(path.join(this.dir, "cool.gif"), "");
    fs.writeFileSync(path.join(this.dir, "rad.jpg"), "");
    input.pickLatexFile(this.dir, (err, filename) => {
      expect(err.toString()).toContain("No .tex files found");
      done();
    });
  });
  it("fails if there aren't any tex files with \\documentclass", done => {
    fs.writeFileSync(path.join(this.dir, "wibble.tex"), "");
    fs.writeFileSync(path.join(this.dir, "nope.tex"), "");
    fs.writeFileSync(path.join(this.dir, "cool.gif"), "");
    fs.writeFileSync(path.join(this.dir, "rad.jpg"), "");
    input.pickLatexFile(this.dir, (err, filename) => {
      expect(err.toString()).toContain("No .tex files with \\documentclass found");
      done();
    });
  });
  it("fails if there are several candidates with .bib files", done => {
    fs.writeFileSync(path.join(this.dir, "wibble.tex"), "\\documentclass[12pt, letterpaper]{article}");
    fs.writeFileSync(path.join(this.dir, "wibble.bib"), "");
    fs.writeFileSync(path.join(this.dir, "correct.tex"), "\\documentclass[12pt, letterpaper]{article}");
    fs.writeFileSync(path.join(this.dir, "correct.bib"), "");
    fs.writeFileSync(path.join(this.dir, "cool.gif"), "");
    fs.writeFileSync(path.join(this.dir, "rad.jpg"), "");
    input.pickLatexFile(this.dir, (err, filename) => {
      expect(err.toString()).toContain("Ambiguous LaTeX path");
      done();
    });
  });
});
