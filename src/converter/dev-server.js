const Bundler = require("parcel-bundler");
const fs = require("fs-extra");
const app = require("express")();
const render = require("./index").render;
const path = require("path");
const tmp = require("tmp-promise");

module.exports.start = async (options) => {
  // tmp dir needs to be within the project directory so Parcel can resolve
  // assets.
  // TODO: cleanup tmpdir
  const tmpDirDir = path.join(__dirname, "../../.tmp");
  await fs.ensureDir(tmpDirDir);
  const tmpDir = await tmp.dir({ dir: tmpDirDir });

  Object.assign(options, {
    output: tmpDir.path,
    // This path will be passed unmodified through .to the parcel bundler,
    // which will compile the SCSS. "~" is Parcel shorthand for the project
    // root.
    externalCSS: "../../src/assets/css/index.scss",
    externalJavaScript: "../../src/assets/javascript/index.js",
  });
  const htmlPath = await render(options);

  console.log("💅  Starting server at http://localhost:8000");
  const bundler = new Bundler(htmlPath, { hmrPort: 8001 });
  app.use(bundler.middleware());
  app.listen(8000);
};
