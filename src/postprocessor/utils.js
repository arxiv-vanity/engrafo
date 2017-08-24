exports.replaceAndKeepChildren = function(oldEl, newEl) {
  while (oldEl.firstChild) {
    newEl.appendChild(oldEl.firstChild);
  }
  oldEl.parentNode.replaceChild(newEl, oldEl);
};

exports.removeAndFlattenChildren = function(el) {
  while (el.firstChild) {
    el.parentNode.insertBefore(el.firstChild, el);
  }
  el.parentNode.removeChild(el);
};

exports.addStylesheet = function(dom, css) {
  let style = dom.createElement("style");
  style.appendChild(dom.createTextNode(css));
  dom.head.appendChild(style);
};

exports.addExternalScript = function(dom, src) {
  let script = dom.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", src);
  dom.body.appendChild(script);
};

exports.addExternalStylesheet = function(dom, href) {
  let style = dom.createElement("link");
  style.setAttribute("rel", "stylesheet");
  style.setAttribute("href", href);
  dom.head.appendChild(style);
};

exports.moveChildren = function(from, to) {
  while (from.firstChild) {
    to.appendChild(from.firstChild);
  }
};

exports.nodeFromString = function(dom, str) {
  var div = dom.createElement("div");
  div.innerHTML = str;
  return div.firstChild;
};

exports.wrapElement = function(innerEl, outerEl) {
  innerEl.parentNode.insertBefore(outerEl, innerEl);
  outerEl.appendChild(innerEl);
}
