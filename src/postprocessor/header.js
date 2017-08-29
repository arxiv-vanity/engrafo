let utils = require("./utils");
let yaml = require("js-yaml");

module.exports = function(dom, data) {
  // Get rid of <header>
  Array.from(dom.querySelectorAll("header")).forEach(header => {
    utils.removeAndFlattenChildren(header);
  });

  let title = dom.querySelector("h1");

  // No title, bail out because there isn't much we can do here.
  if (!title) {
    return;
  }

  data.title = title.innerHTML;

  // Remove <strong> from title
  if (title.children.length && title.children[0].tagName === "STRONG") {
    utils.removeAndFlattenChildren(title.children[0]);
  }

  // Remove new lines from title
  Array.from(title.children).forEach(child => {
    if (child.tagName === "BR") {
      title.removeChild(child);
    }
  });

  // Insert byline after title
  let dtByline = dom.createElement("dt-byline");
  title.parentNode.insertBefore(dtByline, title.nextSibling);

  // Remove date
  let date = dom.querySelector("dt-article > .date");
  if (date) {
    date.parentNode.removeChild(date);
  }
};
