exports.replaceAndKeepChildren = function(oldEl, newEl) {
  while (oldEl.firstChild) {
    newEl.appendChild(oldEl.firstChild);
  }
  oldEl.parentNode.replaceChild(newEl, oldEl);
};

exports.addStylesheet = function(dom, css) {
  let style = dom.createElement('style');
  style.appendChild(dom.createTextNode(css));
  dom.head.appendChild(style);
};
