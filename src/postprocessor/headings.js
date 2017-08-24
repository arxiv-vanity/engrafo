let utils = require("./utils");

var css = `
dt-article h2,
dt-article h3,
dt-article h4 {
  position: relative;
  /* Space for section number */
  padding-right: 40px;
}

@media(min-width: 768px) {
  dt-article h2,
  dt-article h3,
  dt-article h4 {
    padding-right: 0;
  }
}

dt-article .section-number {
  font-family: Baskerville, Georgia, serif;
  font-style: normal;
  color: rgba(0, 0, 0, 0.3);
  position: absolute;
  width: 150px;
  right: 0;
  text-align: right;
  font-size: 0.9em;
}

dt-article .section-number a,
dt-article .section-number a:active {
  border-bottom: none;
}

dt-article .section-number a:hover {
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
}

@media(min-width: 768px) {
  dt-article .section-number {
    right: unset;
    left: -170px;
  }
}

@media (min-width: 1080px) {
  dt-article .section-number {
    right: unset;
    left: -180px;
  }
}

dt-article .paragraph-heading {
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
