const childProcess = require("child_process");
const fs = require("fs-extra");
const path = require("path");
const readline = require("readline");

function unlinkIfExists(path) {
  try {
    fs.unlinkSync(path);
  } catch(err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }
}

// render a document with latexml
exports.render = (texPath, outputDir, callback) => {
  var htmlPath = path.join(outputDir, "index.html");

  var latexmlc = childProcess.spawn("latexmlc", [
      "--dest", htmlPath,
      "--format", "html5",
      "--mathtex",
      "--svg",
      "--verbose",
      "--preload", "/app/latexml/engrafo.ltxml",
      "--preload", "/usr/src/latexml/lib/LaTeXML/Package/hyperref.sty.ltxml",
      texPath
    ], {
      cwd: path.dirname(texPath)
  });
  latexmlc.on("error", callback);

  var stdoutReadline = readline.createInterface({input: latexmlc.stdout});
  stdoutReadline.on("line", console.log);
  var stderrReadline = readline.createInterface({input: latexmlc.stderr});
  stderrReadline.on("line", console.error);

  latexmlc.on("close", code => {
    if (code !== 0) {
      callback(new Error(`latexmlc exited with status ${code}`));
      return;
    }

    // HACK: Clean up stuff we don't want
    unlinkIfExists(path.join(outputDir, "LaTeXML.cache"));
    unlinkIfExists(path.join(outputDir, "LaTeXML.css"));
    unlinkIfExists(path.join(outputDir, "ltx-article.css"));
    unlinkIfExists(path.join(outputDir, "ltx-listings.css"));

    return callback(null, htmlPath);
  });

};
