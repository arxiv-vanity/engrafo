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

function createChildProcess({
  cssPath,
  javaScriptPath,
  htmlPath,
  texPath,
  outputDir,
}) {
  // prettier-ignore
  const latexmlArgs = [
    "--format", "html5",
    "--nodefaultresources",
    "--mathtex",
    "--svg",
    "--verbose",
    "--timestamp", "0",
    "--path", "/app/latexml/packages/",
    "--preload", "/app/latexml/engrafo.ltxml",
    "--preload", "/usr/src/latexml/lib/LaTeXML/Package/hyperref.sty.ltxml",
    "--xsltparameter", "SIMPLIFY_HTML:true"
  ];

  if (cssPath) {
    latexmlArgs.push("--css", cssPath);
  }

  if (javaScriptPath) {
    latexmlArgs.push("--javascript", javaScriptPath);
  }

  latexmlArgs.push(path.basename(texPath));

  if (process.env.LATEXML_DOCKER) {
    // prettier-ignore
    const dockerArgs = [
      "run",
      "--init",
      "-v", `${path.dirname(texPath)}:/input`,
      "-v", `${outputDir}:/output`,
      "-v", `${path.join(__dirname, "../../")}:/app`,
      "-w", "/input",
      "--rm",
      "engrafo-dev",
    ];

    latexmlArgs.push("--dest", "/output/index.html");

    const args = dockerArgs.concat(["latexmlc"], latexmlArgs);
    return childProcess.spawn("docker", args);
  }

  latexmlArgs.push("--dest", htmlPath);

  return childProcess.spawn("latexmlc", latexmlArgs, {
    cwd: path.dirname(texPath),
  });
}

/**
 * Render a document with latexml
 *
 * @param {Object} options
 * @param {string} options.texPath
 * @param {string} options.outputDir
 * @param {string} [options.cssPath]
 * @param {string} [options.javaScriptPath]
 */
function render({ texPath, outputDir, cssPath, javaScriptPath }) {
  const htmlPath = path.join(outputDir, "index.html");

  const latexmlc = createChildProcess({
    texPath,
    outputDir,
    htmlPath,
    cssPath,
    javaScriptPath,
  });

  const stdoutReadline = readline.createInterface({ input: latexmlc.stdout });
  stdoutReadline.on("line", console.log);
  const stderrReadline = readline.createInterface({ input: latexmlc.stderr });
  stderrReadline.on("line", console.error);

  return new Promise((resolve, reject) => {
    latexmlc.on("error", reject);
    latexmlc.on("close", (code) => {
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
  render: render,
};
