let utils = require("./utils");

var css = `
h2, h3, h4, h5, h6 {
  position: relative;
}

.section-number {
  font-family: Baskerville, Georgia, serif;
  font-style: normal;
  color: rgba(0, 0, 0, 0.3);
  position: absolute;
  width: 150px;
  right: 0;
  text-align: right;
}

.section-number a,
.section-number a:active {
  border-bottom: none;
}

.section-number a:hover {
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
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

.paragraph-heading {
  margin-right: 0.5em;
}
`;

module.exports = function(dom) {
  utils.addStylesheet(dom, css);

  let sectionNumbers = dom.querySelectorAll(".section-number");
  Array.from(sectionNumbers).forEach(span => {
    let a = utils.nodeFromString(dom, '<a></a>');
    a.href = "#" + span.parentNode.id;
    utils.moveChildren(span, a);
    span.appendChild(a);
  });

  var paragraphHeadings = Array.from(dom.querySelectorAll("h5"));
  paragraphHeadings = paragraphHeadings.concat(dom.querySelectorAll("h6"));
  paragraphHeadings.forEach(heading => {
    var p = heading.nextElementSibling;
    if (p && p.tagName == "P") {
      // Put at start of <p>
      p.insertBefore(dom.createTextNode(" "), p.firstChild);
      p.insertBefore(heading, p.firstChild);
      // Turn it into <strong>
      var newHeading = utils.nodeFromString(
        dom,
        '<strong class="paragraph-heading"></strong>'
      );
      utils.replaceAndKeepChildren(heading, newHeading);
    }
  });
};
