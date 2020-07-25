module.exports = function (document) {
  Array.from(document.querySelectorAll("figure")).forEach((figure) => {
    // If caption is at start, put it at end
    if (
      figure.children.length > 0 &&
      figure.children[0].tagName == "FIGCAPTION"
    ) {
      figure.appendChild(figure.children[0]);
    }
  });
};
