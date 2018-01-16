var childProcess = require("child_process");
var fs = require("fs");
var path = require("path");
var tmp = require("tmp");
var io = require("../src/io");

describe("prepareInputDirectory", () => {
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

  it("extracts tarballs", done => {
    fs.writeFileSync(path.join(this.dir, "main.tex"), "");
    var tarball = path.join(this.dir, 'tarball.gz');
    childProcess.execSync(`tar -czf "${tarball}" main.tex`, {cwd: this.dir});
    fs.unlinkSync(path.join(this.dir, "main.tex"));
    io.prepareInputDirectory(tarball, (err, inputPath) => {
      if (err) throw err;
      var texFile = path.join(inputPath, "main.tex");
      expect(fs.lstatSync(texFile).isFile()).toBe(true);
      done();
    });
  });

  it("extracts gzipped tex files", done => {
    // Create .gz file with tex file in it
    var inputFile = path.join(this.dir, "1607.06499");
    fs.writeFileSync(inputFile, "\\documentclass{article}");
    childProcess.execSync(`gzip "${inputFile}"`);
    inputFile = `${inputFile}.gz`;
    expect(fs.lstatSync(inputFile).isFile()).toBe(true);

    io.prepareInputDirectory(inputFile, (err, inputPath) => {
      if (err) throw err;
      var texFile = path.join(inputPath, "main.tex");
      expect(fs.lstatSync(texFile).isFile()).toBe(true);
      done();
    });
  });
});

describe("prepareOutputDirectory", () => {
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

  it("creates the output directory if it does not exist", done => {
    var outputDir = path.join(this.dir, "doesnotexist");
    io.prepareOutputDirectory(outputDir, (err, _) => {
      if (err) throw err;
      expect(fs.lstatSync(outputDir).isDirectory()).toBe(true);
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
    io.pickLatexFile(this.dir, (err, filename) => {
      if (err) throw err;
      expect(path.basename(filename)).toBe("ms.tex");
      done();
    });
  });
  it("chooses main.tex if it exists", done => {
    fs.writeFileSync(path.join(this.dir, "main.tex"), "");
    fs.writeFileSync(path.join(this.dir, "nope.tex"), "");
    fs.writeFileSync(path.join(this.dir, "cool.gif"), "");
    io.pickLatexFile(this.dir, (err, filename) => {
      if (err) throw err;
      expect(path.basename(filename)).toBe("main.tex");
      done();
    });
  });
  it("chooses the only tex file if there's one", done => {
    fs.writeFileSync(path.join(this.dir, "wibble.tex"), "");
    fs.writeFileSync(path.join(this.dir, "cool.gif"), "");
    fs.writeFileSync(path.join(this.dir, "rad.jpg"), "");
    io.pickLatexFile(this.dir, (err, filename) => {
      if (err) throw err;
      expect(path.basename(filename)).toBe("wibble.tex");
      done();
    });
  });
  it("chooses the only tex file with \\documentclass if there are several", done => {
    fs.writeFileSync(path.join(this.dir, "wibble.tex"), "not the tex you are looking for");
    fs.writeFileSync(path.join(this.dir, "correct.tex"), "\\documentclass[12pt, letterpaper]{article}");
    fs.writeFileSync(path.join(this.dir, "cool.gif"), "");
    fs.writeFileSync(path.join(this.dir, "rad.jpg"), "");
    io.pickLatexFile(this.dir, (err, filename) => {
      if (err) throw err;
      expect(path.basename(filename)).toBe("correct.tex");
      done();
    });
  });
  it("chooses the only tex file with \\documentclass and a .bbl file if there are several", done => {
    fs.writeFileSync(path.join(this.dir, "wibble.tex"), "\\documentclass[12pt, letterpaper]{article}");
    fs.writeFileSync(path.join(this.dir, "correct.tex"), "\\documentclass[12pt, letterpaper]{article}");
    fs.writeFileSync(path.join(this.dir, "correct.bbl"), "");
    fs.writeFileSync(path.join(this.dir, "cool.gif"), "");
    fs.writeFileSync(path.join(this.dir, "rad.jpg"), "");
    io.pickLatexFile(this.dir, (err, filename) => {
      if (err) throw err;
      expect(path.basename(filename)).toBe("correct.tex");
      done();
    });
  });
  it("fails if there aren't any tex files", done => {
    fs.writeFileSync(path.join(this.dir, "cool.gif"), "");
    fs.writeFileSync(path.join(this.dir, "rad.jpg"), "");
    io.pickLatexFile(this.dir, (err, filename) => {
      expect(err.toString()).toContain("No .tex files found");
      done();
    });
  });
  it("fails if there aren't any tex files with \\documentclass", done => {
    fs.writeFileSync(path.join(this.dir, "wibble.tex"), "");
    fs.writeFileSync(path.join(this.dir, "nope.tex"), "");
    fs.writeFileSync(path.join(this.dir, "cool.gif"), "");
    fs.writeFileSync(path.join(this.dir, "rad.jpg"), "");
    io.pickLatexFile(this.dir, (err, filename) => {
      expect(err.toString()).toContain("No .tex files with \\documentclass found");
      done();
    });
  });
  it("fails if there are several candidates with .bbl files", done => {
    fs.writeFileSync(path.join(this.dir, "wibble.tex"), "\\documentclass[12pt, letterpaper]{article}");
    fs.writeFileSync(path.join(this.dir, "wibble.bbl"), "");
    fs.writeFileSync(path.join(this.dir, "correct.tex"), "\\documentclass[12pt, letterpaper]{article}");
    fs.writeFileSync(path.join(this.dir, "correct.bbl"), "");
    fs.writeFileSync(path.join(this.dir, "cool.gif"), "");
    fs.writeFileSync(path.join(this.dir, "rad.jpg"), "");
    io.pickLatexFile(this.dir, (err, filename) => {
      expect(err.toString()).toContain("Ambiguous LaTeX path");
      done();
    });
  });
});
