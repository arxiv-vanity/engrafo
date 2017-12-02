let linkifyUrls = require("linkify-urls");
let utils = require("./utils");

module.exports = function(dom) {
  var window = dom.defaultView;

  // Linkify plain text URLs
  var walker = dom.createTreeWalker(
    dom.querySelector("dt-article"),
    window.NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        // Skip links and all their children
        if (node.parentNode.nodeName === "A") {
          return window.NodeFilter.FILTER_REJECT;
        }
        return window.NodeFilter.FILTER_ACCEPT;
      }
    },
    null
  );

  var nodesToReplace = [];

  while (walker.nextNode()) {
    var node = walker.currentNode;
    var newText = linkifyUrls(node.textContent);
    // Linkify didn't do anything
    if (node.textContent === newText) {
      continue;
    }
    // Treewalker stops if we replace the node it is currently on, so collect
    // up changes and perform after treewalker has finished
    nodesToReplace.push({
      node: node,
      replacement: newText
    });
  }

  nodesToReplace.forEach(obj => {
    var replacementNode = dom.createElement('span');
    replacementNode.innerHTML = obj.replacement;
    obj.node.parentNode.replaceChild(replacementNode, obj.node);
  });

  // Add http:// to URLs which don't have it
  Array.from(dom.querySelectorAll('a')).forEach(a => {
    var href = a.getAttribute('href');
    if (!href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('#')) {
      a.setAttribute('href', 'http://' + href);
    }
  });
};
