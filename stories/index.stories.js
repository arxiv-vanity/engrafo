/* eslint-disable no-console, react/button-has-type */

import { storiesOf } from "@storybook/html";

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

const stories = storiesOf("Integration");
integrationImport.keys().forEach(key => {
  const name = key.replace(/^\.\//, "").replace(/\/index\.html$/, "");
  stories.add(name, createStory(integrationImport(key)));
});
