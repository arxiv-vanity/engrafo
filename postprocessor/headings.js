let utils = require('./utils');

var css = `
h2, h3, h4, h5, h6 {
  position: relative;
}

.section-number {
  position: absolute;
  width: 6em;
  left: -7.5em;
  padding-right: 1.5em;
  color: rgba(0, 0, 0, 0.3);
  text-align: right;
  font-style: italic;
}

a.section-number,
a.section-number:active,
a.section-number:hover {
  border-bottom: none;
}

a.section-number:hover {
  text-decoration: underline;
}
`;

module.exports = function(dom) {
  utils.addStylesheet(dom, css);

  let sectionNumbers = dom.getElementsByClassName('section-number');
  Array.from(sectionNumbers).forEach((span) => {
    let a = dom.createElement('a');
    a.href = "#"+span.parentNode.id;
    a.className = 'section-number';
    utils.replaceAndKeepChildren(span, a);
  })
};
