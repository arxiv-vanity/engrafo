/* eslint-disable no-console, react/button-has-type */

import { storiesOf } from "@storybook/html";
import groupBy from "lodash/groupBy";

// Webpack doesn't import the CSS and JS referenced in the HTML, so we have
// to import that manually.
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

const integrationImport = require.context(
  "../tests/integration-output",
  true,
  /\.html/
);

const groups = groupBy(integrationImport.keys(), key => key.split("/")[1]);
Object.keys(groups).forEach(group => {
  const stories = storiesOf(group);
  groups[group].forEach(key => {
    // Slice off ./group/ at start and /index.html at end
    const name = key
      .split("/")
      .slice(2, -1)
      .join("/");
    stories.add(name, createStory(integrationImport(key)));
  });
});
