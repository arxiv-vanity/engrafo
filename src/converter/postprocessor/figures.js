module.exports = function(dom) {
  Array.from(dom.querySelectorAll("figure")).forEach(figure => {
    // If caption is at start, put it at end
    if (
      figure.children.length > 0 &&
      figure.children[0].tagName == "FIGCAPTION"
    ) {
      figure.appendChild(figure.children[0]);
    }
  });
};
