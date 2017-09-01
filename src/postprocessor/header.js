let utils = require("./utils");
let yaml = require("js-yaml");

module.exports = function(dom, data) {
  // Get rid of <header>
  Array.from(dom.querySelectorAll("header")).forEach(header => {
    utils.removeAndFlattenChildren(header);
  });

  let title = dom.querySelector("h1");

  // Create title if one doesn't exist
  if (!title) {
    let dtArticle = dom.querySelector("dt-article");
    title = utils.nodeFromString(dom, "<h1>Untitled</h1>");
    dtArticle.insertBefore(title, dtArticle.firstChild);
  }

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

  let titleHTML = title.innerHTML;

  // Clean up weird characters
  titleHTML = titleHTML.replace('\u3000', '')

  title.innerHTML = titleHTML;
  data.title = titleHTML;

  // Remove date
  let date = dom.querySelector("dt-article > .date");
  if (date) {
    date.parentNode.removeChild(date);
  }
};
