exports.removeAll = function(els) {
  Array.from(els).forEach(el => {
    el.parentNode.removeChild(el);
  });
};

exports.nodeFromString = function(dom, str) {
  var div = dom.createElement("div");
  div.innerHTML = str;
  if (!div.firstChild) {
    throw new Error("Invalid HTML passed to nodeFromString");
  }
  return div.firstChild;
};
