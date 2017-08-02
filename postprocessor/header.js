let utils = require('./utils');
let yaml = require('js-yaml');

var css = `
@media (min-width: 1080px) {
  dt-byline .author {
    display: block;
    float: left;
    max-width: 150px;
  }
}
`;

module.exports = function(dom) {
  utils.addStylesheet(dom, css);

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
    authors: [],
    affiliations: [],
  }

  // Extract authors
  let authorEls = dom.body.getElementsByClassName('author');
  Array.from(authorEls).forEach((authorEl) => {
    var bit;
    var children = Array.from(authorEl.childNodes);
    while (children.length > 0) {
      // Extract name
      bit = children.shift();
      if (bit.nodeType !== 3) { // textNode
        continue;
      }
      var name = bit.data.trim();
      if (name.startsWith('and ')) {
        name = name.slice(3).trim();
      }
      children.shift(); // BR

      var obj = {};
      obj[name] = '';
      frontMatter.authors.push(obj);

      // Extract affiliation
      var affiliationBits = [];
      while (children.length > 0) {
        bit = children.shift();
        if (bit.nodeType !== 3) {
          continue;
        }
        // Affiliation has finished, next author starting
        let affiliation = bit.data.trim();
        if (affiliation == 'and') {
          break;
        } else if (affiliation.startsWith('and')) {
          // This line has the next author on it, so put it back so the next
          // iteration of the loop can pick it up
          children.unshift(bit);
          break;
        } else if (affiliation === '') {
          continue;
        }
        affiliationBits.push(affiliation);
      }
      let affiliation = affiliationBits.join(', ');

      var obj = {};
      obj[affiliation] = '';
      frontMatter.affiliations.push(obj);
    }

    authorEl.parentNode.removeChild(authorEl);
  });

  // Set up front matter
  frontMatterEl = dom.createElement('script');
  frontMatterEl.setAttribute('type', 'text/front-matter');
  frontMatterEl.appendChild(dom.createTextNode(yaml.safeDump(frontMatter)));
  dom.head.appendChild(frontMatterEl);

};
