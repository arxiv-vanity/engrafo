exports.replaceAndKeepChildren = function(oldEl, newEl) {
  while (oldEl.firstChild) {
    newEl.appendChild(oldEl.firstChild);
  }
  oldEl.parentNode.replaceChild(newEl, oldEl);
};
