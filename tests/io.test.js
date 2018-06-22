const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");
const tmp = require("tmp-promise");
const io = require("../src/io");

describe("prepareInputDirectory", () => {
  let dir;
  beforeEach(async () => {
    dir = await tmp.dir({ unsafeCleanup: true });
  });
  afterEach(() => {
    dir.cleanup();
  });

  it("extracts tarballs", async () => {
    fs.writeFileSync(path.join(dir.path, "main.tex"), "");
    var tarball = path.join(dir.path, "tarball.gz");
    childProcess.execSync(`tar -czf "${tarball}" main.tex`, { cwd: dir.path });
    fs.unlinkSync(path.join(dir.path, "main.tex"));
    const inputPath = await io.prepareInputDirectory(tarball);
    var texFile = path.join(inputPath, "main.tex");
    expect(fs.lstatSync(texFile).isFile()).toBe(true);
  });

  it("extracts gzipped tex files", async () => {
    // Create .gz file with tex file in it
    var inputFile = path.join(dir.path, "1607.06499");
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
  let dir;
  beforeEach(async () => {
    dir = await tmp.dir({ unsafeCleanup: true });
  });
  afterEach(() => {
    dir.cleanup();
  });

  it("creates the output directory if it does not exist", async () => {
    var outputDir = path.join(dir.path, "doesnotexist");
    await io.prepareOutputDirectory(outputDir);
    expect(fs.lstatSync(outputDir).isDirectory()).toBe(true);
  });
});

describe("pickLatexFile", () => {
  let dir;
  beforeEach(async () => {
    dir = await tmp.dir({ unsafeCleanup: true });
  });
  afterEach(() => {
    dir.cleanup();
  });
  it("chooses ms.tex if it exists", async () => {
    fs.writeFileSync(path.join(dir.path, "ms.tex"), "");
    fs.writeFileSync(path.join(dir.path, "nope.tex"), "");
    fs.writeFileSync(path.join(dir.path, "cool.gif"), "");
    const filename = await io.pickLatexFile(dir.path);
    expect(path.basename(filename)).toBe("ms.tex");
  });
  it("chooses main.tex if it exists", async () => {
    fs.writeFileSync(path.join(dir.path, "main.tex"), "");
    fs.writeFileSync(path.join(dir.path, "nope.tex"), "");
    fs.writeFileSync(path.join(dir.path, "cool.gif"), "");
    const filename = await io.pickLatexFile(dir.path);
    expect(path.basename(filename)).toBe("main.tex");
  });
  it("chooses the only tex file if there's one", async () => {
    fs.writeFileSync(path.join(dir.path, "wibble.tex"), "");
    fs.writeFileSync(path.join(dir.path, "cool.gif"), "");
    fs.writeFileSync(path.join(dir.path, "rad.jpg"), "");
    const filename = await io.pickLatexFile(dir.path);
    expect(path.basename(filename)).toBe("wibble.tex");
  });
  it("chooses the only tex file with \\documentclass if there are several", async () => {
    fs.writeFileSync(
      path.join(dir.path, "wibble.tex"),
      "not the tex you are looking for"
    );
    fs.writeFileSync(
      path.join(dir.path, "correct.tex"),
      "\\documentclass[12pt, letterpaper]{article}"
    );
    fs.writeFileSync(path.join(dir.path, "cool.gif"), "");
    fs.writeFileSync(path.join(dir.path, "rad.jpg"), "");
    const filename = await io.pickLatexFile(dir.path);
    expect(path.basename(filename)).toBe("correct.tex");
  });
  it("chooses the only tex file with \\documentclass and a .bbl file if there are several", async () => {
    fs.writeFileSync(
      path.join(dir.path, "wibble.tex"),
      "\\documentclass[12pt, letterpaper]{article}"
    );
    fs.writeFileSync(
      path.join(dir.path, "correct.tex"),
      "\\documentclass[12pt, letterpaper]{article}"
    );
    fs.writeFileSync(path.join(dir.path, "correct.bbl"), "");
    fs.writeFileSync(path.join(dir.path, "cool.gif"), "");
    fs.writeFileSync(path.join(dir.path, "rad.jpg"), "");
    const filename = await io.pickLatexFile(dir.path);
    expect(path.basename(filename)).toBe("correct.tex");
  });
  it("fails if there aren't any tex files", async () => {
    fs.writeFileSync(path.join(dir.path, "cool.gif"), "");
    fs.writeFileSync(path.join(dir.path, "rad.jpg"), "");
    await expect(io.pickLatexFile(dir.path)).rejects.toThrowError(
      "No .tex files found"
    );
  });
  it("fails if there aren't any tex files with \\documentclass", async () => {
    fs.writeFileSync(path.join(dir.path, "wibble.tex"), "");
    fs.writeFileSync(path.join(dir.path, "nope.tex"), "");
    fs.writeFileSync(path.join(dir.path, "cool.gif"), "");
    fs.writeFileSync(path.join(dir.path, "rad.jpg"), "");
    await expect(io.pickLatexFile(dir.path)).rejects.toThrowError(
      "No .tex files with \\documentclass found"
    );
  });
  it("fails if there are several candidates with .bbl files", async () => {
    fs.writeFileSync(
      path.join(dir.path, "wibble.tex"),
      "\\documentclass[12pt, letterpaper]{article}"
    );
    fs.writeFileSync(path.join(dir.path, "wibble.bbl"), "");
    fs.writeFileSync(
      path.join(dir.path, "correct.tex"),
      "\\documentclass[12pt, letterpaper]{article}"
    );
    fs.writeFileSync(path.join(dir.path, "correct.bbl"), "");
    fs.writeFileSync(path.join(dir.path, "cool.gif"), "");
    fs.writeFileSync(path.join(dir.path, "rad.jpg"), "");
    await expect(io.pickLatexFile(dir.path)).rejects.toThrowError(
      "Ambiguous LaTeX path"
    );
  });
});
