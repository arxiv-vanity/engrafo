exports.removeAll = function (els) {
  Array.from(els).forEach((el) => {
    el.parentNode.removeChild(el);
  });
};

exports.nodeFromString = function (document, str) {
  var div = document.createElement("div");
  div.innerHTML = str;
  if (!div.firstChild) {
    throw new Error("Invalid HTML passed to nodeFromString");
  }
  return div.firstChild;
};
