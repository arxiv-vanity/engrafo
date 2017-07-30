module.exports = function(dom) {
  // Get rid of <header>
  Array.from(dom.body.getElementsByTagName('header')).forEach((header) => {
    while(header.firstChild) {
      header.parentNode.insertBefore(header.firstChild, header);
    }
    header.parentNode.removeChild(header);
  });

  // Remove new lines from title
  let title = dom.body.getElementsByTagName('h1')[0];
  Array.from(title.children).forEach((child) => {
    if (child.tagName === 'BR') {
      title.removeChild(child);
    }
  });
};
