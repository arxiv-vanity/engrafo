/* eslint-disable no-console, react/button-has-type */

import { document } from "global";
import { storiesOf } from "@storybook/html";

import * as snapshots from "../tests/__snapshots__/integration.test.js.snap";
import "../src/assets/css/index.scss";
import main from "../src/assets/javascript/main";

function createStory(snapshotName) {
  return () => {
    const container = document.createElement("div");
    let html = snapshots[snapshotName];
    // Jest puts strings inside a quote inside the snapshot. Good grief.
    // First, remove starting and end quote
    html = html
      .trim()
      .replace(/^"/, "")
      .replace(/"$/, "");
    // Then remove all the backslashed quotes
    html = html.replace(/\\"/g, '"');
    container.innerHTML = html;
    main(container);
    return container;
  };
}

storiesOf("Basic functionality")
  .add("Citations", createStory("citations.tex 1"))
  .add("Figures", createStory("figures.tex 1"))
  .add("Footnotes", createStory("footnotes.tex 1"))
  .add("Headings", createStory("headings.tex 1"))
  .add("Lists", createStory("lists.tex 1"))
  .add("Math", createStory("math.tex 1"))
  .add("Paragraph styles", createStory("paragraph.tex 1"))
  .add("Tables", createStory("tables.tex 1"))
  .add("Text styles", createStory("text.tex 1"))
  .add("URLs", createStory("urls.tex 1"));

storiesOf("Packages", module)
  .add("aa.cls", createStory("aa.cls.tex 1"))
  .add("acronym.sty", createStory("acronym.sty.tex 1"))
  .add("algorithm.sty", createStory("algorithm.sty.tex 1"))
  .add("algorithm2e.sty", createStory("algorithm2e.sty.tex 1"))
  .add("alltt.sty", createStory("alltt.sty.tex 1"))
  .add("amsart.cls", createStory("amsart.cls.tex 1"))
  .add("array.sty", createStory("array.sty.tex 1"))
  .add("cleveref.sty", createStory("cleveref.sty.tex 1"))
  .add("color.sty", createStory("color.sty.tex 1"))
  .add("graphicx.sty", createStory("graphicx.sty.tex 1"))
  .add("hyperref.sty", createStory("hyperref.sty.tex 1"))
  .add("IEEEtran.cls", createStory("IEEEtran.cls.tex 1"))
  .add("listings.sty", createStory("listings.sty.tex 1"))
  .add("pifont.sty", createStory("pifont.sty.tex 1"))
  .add("report.cls", createStory("report.cls.tex 1"));

storiesOf("Complete documents")
  .add("sample2e", createStory("sample2e.tex 1"))
  .add("small2e", createStory("small2e.tex 1"));
