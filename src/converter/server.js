const Bundler = require("parcel-bundler");
const app = require("express")();
const render = require("./index").render;
const path = require("path");
const tmp = require("tmp-promise");

module.exports.start = async input => {
  const tmpDir = await tmp.dir();
  const htmlPath = await render({
    input: input,
    output: tmpDir.path
  });

  console.log("💅  Starting server at http://localhost:8000");
  const bundler = new Bundler(htmlPath, { hmrPort: 8001 });
  app.use(bundler.middleware());
  app.listen(8000);
};
