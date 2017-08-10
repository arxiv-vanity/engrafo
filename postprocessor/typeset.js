module.exports = function(dom) {
  let headingEls = [].slice.call(dom.querySelectorAll('dt-article h1, dt-article h2, dt-article h3, dt-article h4'));
headingEls.forEach(headingEl => {
  preventWidows(dom, headingEl);
});
};

function preventWidows(dom, el) {
  var textNodes = dom.createTreeWalker(
    el,
    dom.defaultView.NodeFilter.SHOW_TEXT
  );
  // Wind to end
  while(textNodes.nextNode()) {}
  // Step backwards through nodes
  do {
    var n = textNodes.currentNode;
    var text = n.nodeValue;
    var i = text.lastIndexOf(" ");
    if (i !== -1) {
      n.nodeValue = text.substr(0, i) + "\u00A0" + text.substr(i + 1);
      break;
    }
  } while(textNodes.previousNode());
}
