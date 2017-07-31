let utils = require('./utils');
module.exports = function(dom) {
  // Use Distill syntax highlighting and code blocks
  Array.from(dom.getElementsByTagName('pre')).forEach((pre) => {
    let dtCode = dom.createElement('dt-code');
    dtCode.setAttribute('block', '');
    dtCode.setAttribute('language', pre.getAttribute('data-language'));
    if (pre.firstChild.tagName == "CODE") {
      utils.removeAndFlattenChildren(pre.firstChild);
    }
    utils.replaceAndKeepChildren(pre, dtCode);
  });

  // Remove <strong> from inline code (whhhyy)
  Array.from(dom.getElementsByTagName('code')).forEach((code) => {
    if (code.parentNode.tagName == "STRONG") {
      utils.removeAndFlattenChildren(code.parentNode);
    }
  });

};
