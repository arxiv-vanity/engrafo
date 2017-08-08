let utils = require('./utils');
let yaml = require('js-yaml');

module.exports = function(dom) {
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

  // Front matter
  var frontMatter = {
    title: title.innerHTML,
  }

  // Set up front matter
  frontMatterEl = dom.createElement('script');
  frontMatterEl.setAttribute('type', 'text/front-matter');
  frontMatterEl.appendChild(dom.createTextNode(yaml.safeDump(frontMatter)));
  dom.head.appendChild(frontMatterEl);

};
