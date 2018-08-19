/* eslint-disable no-console, react/button-has-type */

import { document } from "global";
import { storiesOf } from "@storybook/html";

import * as snapshots from "../tests/__snapshots__/integration.test.js.snap";
import "../src/assets/css/index.scss";
import main from "../src/assets/javascript/main";

function createStory(html) {
  return () => {
    const container = document.createElement("div");
    container.innerHTML = html;
    main(container);
    return container;
  };
}

storiesOf("Basic functionality")
  .add("Citations", createStory(snapshots[`citations.tex 1`]))
  .add("Figures", createStory(snapshots[`figures.tex 1`]))
  .add("Footnotes", createStory(snapshots[`footnotes.tex 1`]))
  .add("Headings", createStory(snapshots[`headings.tex 1`]))
  .add("Lists", createStory(snapshots[`lists.tex 1`]))
  .add("Math", createStory(snapshots[`math.tex 1`]))
  .add("Paragraph styles", createStory(snapshots[`paragraph.tex 1`]))
  .add("Tables", createStory(snapshots[`tables.tex 1`]))
  .add("Text styles", createStory(snapshots[`text.tex 1`]))
  .add("URLs", createStory(snapshots[`urls.tex 1`]));

storiesOf("Packages", module)
  .add("aa", createStory(snapshots[`aa.tex 1`]))
  .add("algorithm2e", createStory(snapshots[`algorithm.tex 1`]))
  .add("listings", createStory(snapshots[`listings.tex 1`]));

storiesOf("Complete documents")
  .add("sample2e", createStory(snapshots[`sample2e.tex 1`]))
  .add("small2e", createStory(snapshots[`small2e.tex 1`]));
