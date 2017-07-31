let utils = require('./utils');

var css = `
h2, h3, h4, h5, h6 {
  position: relative;
}

.section-number {
  font-family: HoeflerText-Regular, Georgia, serif;
  font-style: italic;
  color: rgba(0, 0, 0, 0.3);
  position: absolute;
  width: 150px;
  right: 0;
  text-align: right;
}

a.section-number,
a.section-number:active,
a.section-number:hover {
  border-bottom: none;
}

a.section-number:hover {
  text-decoration: underline;
}

@media(min-width: 768px) {
  .section-number {
    right: unset;
    left: -170px;
  }
}

@media (min-width: 1080px) {
  .section-number {
    right: unset;
    left: -180px;
  }
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
