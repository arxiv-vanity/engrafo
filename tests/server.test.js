const fs = require("fs-extra");
const path = require("path");
const supertest = require("supertest");
const tmp = require("tmp-promise");

const { app } = require("../src/server");

test("convert renders papers", async () => {
  const inputDir = await tmp.dir({ dir: "/tmp" });
  await fs.writeFile(
    path.join(inputDir.path, "main.tex"),
    "\\begin{document}hello world\\end{document}"
  );
  const outputDir = await tmp.dir({ dir: "/tmp" });

  await supertest(app)
    .post("/convert")
    .send({
      input: inputDir.path,
      output: outputDir.path,
    })
    .expect(function (res) {
      if (res.status != 200) {
        console.log(res.body);
      }
    })
    .expect(200);

  const output = await (
    await fs.readFile(path.join(outputDir.path, "index.html"))
  ).toString();
  expect(output).toContain(`<p class="ltx_p">hello world</p>`);
}, 10000);
