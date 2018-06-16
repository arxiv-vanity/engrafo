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

function createChildProcess({ htmlPath, texPath, outputDir }) {
  // prettier-ignore
  const latexmlArgs = [
    "--format", "html5",
    "--nodefaultresources",
    "--css", "/app/dist/index.css",
    "--mathtex",
    "--svg",
    "--verbose",
    "--timestamp", "0",
    "--preload", "/app/latexml/engrafo.ltxml",
    "--preload", "/usr/src/latexml/lib/LaTeXML/Package/hyperref.sty.ltxml",
  ];

  latexmlArgs.push(path.basename(texPath));

  if (process.env.LATEXML_DOCKER) {
    // prettier-ignore
    const dockerArgs = [
      "run",
      "--init",
      "-v", `${path.dirname(texPath)}:/input`,
      "-v", `${outputDir}:/output`,
      "-w", "/input",
      "--rm",
      "engrafo",
    ];

    latexmlArgs.push("--dest", "/output/index.html");

    const args = dockerArgs.concat(["latexmlc"], latexmlArgs);
    return childProcess.spawn("docker", args);
  }

  latexmlArgs.push("--dest", htmlPath);

  return childProcess.spawn("latexmlc", latexmlArgs, {
    cwd: path.dirname(texPath)
  });
}

// render a document with latexml
function render({ texPath, outputDir }) {
  const htmlPath = path.join(outputDir, "index.html");

  const latexmlc = createChildProcess({ texPath, outputDir, htmlPath });

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
