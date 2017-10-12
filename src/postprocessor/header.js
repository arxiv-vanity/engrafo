let utils = require("./utils");
let yaml = require("js-yaml");
let toTitleCase = require("titlecase");

module.exports = function(dom, data) {
  let title = dom.querySelector("h1");

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

  // We've removed a bunch of elements so text nodes might be fragmented
  title.normalize();

  var textNodes = dom.createTreeWalker(title, dom.defaultView.NodeFilter.SHOW_TEXT);
  while (textNodes.nextNode()) {
    let node = textNodes.currentNode;
    // UPPER CASE TITLE ARGH
    // FIXME: this will be a false positive if it's just an acronym in a tag
    if (node.nodeValue == node.nodeValue.toUpperCase()) {
      node.nodeValue = toTitleCase(node.nodeValue.toLowerCase());
    }

    // Clean up weird characters
    node.nodeValue = node.nodeValue.replace('\u3000', '');
  }

  data.title = title.innerHTML;
};
