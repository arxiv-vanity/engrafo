const Bundler = require("parcel-bundler");
const app = require("express")();
const render = require("./index").render;
const path = require("path");
const tmp = require("tmp-promise");

module.exports.start = async input => {
  const tmpDir = await tmp.dir({ dir: "/tmp" });
  const htmlPath = await render({
    input: input,
    output: tmpDir.path,
    // This absolute filesystem path will be passed unmodified through
    // to the parcel bundler, which will compile the SCSS
    externalCSS: path.join(__dirname, "../assets/css/index.scss"),
    externalJavaScript: path.join(__dirname, "../assets/javascript/index.js")
  });

  console.log("💅  Starting server at http://localhost:8000");
  const bundler = new Bundler(htmlPath, { hmrPort: 8001 });
  app.use(bundler.middleware());
  app.listen(8000);
};
