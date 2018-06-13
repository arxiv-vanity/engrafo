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

  it("extracts tarballs", async () => {
    fs.writeFileSync(path.join(this.dir, "main.tex"), "");
    var tarball = path.join(this.dir, 'tarball.gz');
    childProcess.execSync(`tar -czf "${tarball}" main.tex`, {cwd: this.dir});
    fs.unlinkSync(path.join(this.dir, "main.tex"));
    const inputPath = await io.prepareInputDirectory(tarball);
    var texFile = path.join(inputPath, "main.tex");
    expect(fs.lstatSync(texFile).isFile()).toBe(true);
  });

  it("extracts gzipped tex files", async () => {
    // Create .gz file with tex file in it
    var inputFile = path.join(this.dir, "1607.06499");
    fs.writeFileSync(inputFile, "\\documentclass{article}");
    childProcess.execSync(`gzip "${inputFile}"`);
    inputFile = `${inputFile}.gz`;
    expect(fs.lstatSync(inputFile).isFile()).toBe(true);

    const inputPath = await io.prepareInputDirectory(inputFile);
    var texFile = path.join(inputPath, "main.tex");
    expect(fs.lstatSync(texFile).isFile()).toBe(true);
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

  it("creates the output directory if it does not exist", async () => {
    var outputDir = path.join(this.dir, "doesnotexist");
    await io.prepareOutputDirectory(outputDir);
    expect(fs.lstatSync(outputDir).isDirectory()).toBe(true);
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
  it("chooses ms.tex if it exists", async () => {
    fs.writeFileSync(path.join(this.dir, "ms.tex"), "");
    fs.writeFileSync(path.join(this.dir, "nope.tex"), "");
    fs.writeFileSync(path.join(this.dir, "cool.gif"), "");
    const filename = await io.pickLatexFile(this.dir);
    expect(path.basename(filename)).toBe("ms.tex");
  });
  it("chooses main.tex if it exists", async () => {
    fs.writeFileSync(path.join(this.dir, "main.tex"), "");
    fs.writeFileSync(path.join(this.dir, "nope.tex"), "");
    fs.writeFileSync(path.join(this.dir, "cool.gif"), "");
    const filename = await io.pickLatexFile(this.dir);
    expect(path.basename(filename)).toBe("main.tex");
  });
  it("chooses the only tex file if there's one", async () => {
    fs.writeFileSync(path.join(this.dir, "wibble.tex"), "");
    fs.writeFileSync(path.join(this.dir, "cool.gif"), "");
    fs.writeFileSync(path.join(this.dir, "rad.jpg"), "");
    const filename = await io.pickLatexFile(this.dir);
    expect(path.basename(filename)).toBe("wibble.tex");
  });
  it("chooses the only tex file with \\documentclass if there are several", async () => {
    fs.writeFileSync(path.join(this.dir, "wibble.tex"), "not the tex you are looking for");
    fs.writeFileSync(path.join(this.dir, "correct.tex"), "\\documentclass[12pt, letterpaper]{article}");
    fs.writeFileSync(path.join(this.dir, "cool.gif"), "");
    fs.writeFileSync(path.join(this.dir, "rad.jpg"), "");
    const filename = await io.pickLatexFile(this.dir);
    expect(path.basename(filename)).toBe("correct.tex");
  });
  it("chooses the only tex file with \\documentclass and a .bbl file if there are several", async () => {
    fs.writeFileSync(path.join(this.dir, "wibble.tex"), "\\documentclass[12pt, letterpaper]{article}");
    fs.writeFileSync(path.join(this.dir, "correct.tex"), "\\documentclass[12pt, letterpaper]{article}");
    fs.writeFileSync(path.join(this.dir, "correct.bbl"), "");
    fs.writeFileSync(path.join(this.dir, "cool.gif"), "");
    fs.writeFileSync(path.join(this.dir, "rad.jpg"), "");
    const filename = await io.pickLatexFile(this.dir);
    expect(path.basename(filename)).toBe("correct.tex");
  });
  it("fails if there aren't any tex files", async () => {
    fs.writeFileSync(path.join(this.dir, "cool.gif"), "");
    fs.writeFileSync(path.join(this.dir, "rad.jpg"), "");
    await expect(io.pickLatexFile(this.dir)).rejects.toThrowError("No .tex files found");
  });
  it("fails if there aren't any tex files with \\documentclass", async () => {
    fs.writeFileSync(path.join(this.dir, "wibble.tex"), "");
    fs.writeFileSync(path.join(this.dir, "nope.tex"), "");
    fs.writeFileSync(path.join(this.dir, "cool.gif"), "");
    fs.writeFileSync(path.join(this.dir, "rad.jpg"), "");
    await expect(io.pickLatexFile(this.dir)).rejects.toThrowError("No .tex files with \\documentclass found");
  });
  it("fails if there are several candidates with .bbl files", async () => {
    fs.writeFileSync(path.join(this.dir, "wibble.tex"), "\\documentclass[12pt, letterpaper]{article}");
    fs.writeFileSync(path.join(this.dir, "wibble.bbl"), "");
    fs.writeFileSync(path.join(this.dir, "correct.tex"), "\\documentclass[12pt, letterpaper]{article}");
    fs.writeFileSync(path.join(this.dir, "correct.bbl"), "");
    fs.writeFileSync(path.join(this.dir, "cool.gif"), "");
    fs.writeFileSync(path.join(this.dir, "rad.jpg"), "");
    await expect(io.pickLatexFile(this.dir)).rejects.toThrowError("Ambiguous LaTeX path");
  });
});
