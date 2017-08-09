let utils = require('./utils');
let yaml = require('js-yaml');

module.exports = function(dom, data) {
  for (var scriptSrc of [
    'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.5.0-beta4/html2canvas.js',
    '/js/jquery-1.12.4.min.js',
    '/js/html-script.js',
  ]) {
    utils.addExternalScript(dom, scriptSrc);
  }

  for (var styleHref of [
    '/css/html-style.css',
  ]) {
    utils.addExternalStylesheet(dom, styleHref);
  }

  // Get rid of <header>
  Array.from(dom.body.getElementsByTagName('header')).forEach((header) => {
    utils.removeAndFlattenChildren(header);
  });

  let title = dom.body.getElementsByTagName('h1')[0];

  // No title, bail out because there isn't much we can do here.
  if (!title) {
    return;
  }

  data.title = title.innerHTML;

  // Remove <strong> or <em> from title
  let titleChild = title.firstChild;
  if (titleChild.tagName === 'STRONG' || titleChild.tagName === 'EM') {
    utils.removeAndFlattenChildren(titleChild);
  }

  // Remove new lines from title
  Array.from(title.children).forEach((child) => {
    if (child.tagName === 'BR') {
      title.removeChild(child);
    }
  });


  // Insert byline after title
  let dtByline = dom.createElement('dt-byline');
  title.parentNode.insertBefore(dtByline, title.nextSibling);

};
