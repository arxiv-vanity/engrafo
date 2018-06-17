const childProcess = require("child_process");
const fs = require("fs-extra");
const path = require("path");
const readline = require("readline");

function unlinkIfExists(path) {
  try {
    fs.unlinkSync(path);
  } catch (err) {
    if (err.code !== "ENOENT") {
      throw err;
    }
  }
}

// render a document with latexml
function render({ texPath, outputDir }) {
  var htmlPath = path.join(outputDir, "index.html");

  var latexmlc = childProcess.spawn(
    "latexmlc",
    [
      "--dest",
      htmlPath,
      "--format",
      "html5",
      "--nodefaultresources",
      "--mathtex",
      "--svg",
      "--verbose",
      "--preload",
      "/app/latexml/engrafo.ltxml",
      "--preload",
      "/usr/src/latexml/lib/LaTeXML/Package/hyperref.sty.ltxml",
      texPath
    ],
    {
      cwd: path.dirname(texPath)
    }
  );

  var stdoutReadline = readline.createInterface({ input: latexmlc.stdout });
  stdoutReadline.on("line", console.log);
  var stderrReadline = readline.createInterface({ input: latexmlc.stderr });
  stderrReadline.on("line", console.error);

  return new Promise((resolve, reject) => {
    latexmlc.on("error", reject);
    latexmlc.on("close", code => {
      if (code !== 0) {
        return reject(new Error(`latexmlc exited with status ${code}`));
      }

      // HACK: Clean up stuff we don't want
      unlinkIfExists(path.join(outputDir, "LaTeXML.cache"));

      return resolve(htmlPath);
    });
  });
}

module.exports = {
  render: render
};
