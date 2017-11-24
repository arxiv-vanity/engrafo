let utils = require("./utils");
let toTitleCase = require("titlecase");

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

dt-article .ltx_tag_section,
dt-article .ltx_tag_subsection {
  font-family: Baskerville, Georgia, serif;
  font-style: normal;
  color: rgba(0, 0, 0, 0.3);
  position: absolute;
  width: 150px;
  right: 0;
  text-align: right;
  font-size: 0.9em;
}

dt-article .ltx_tag_section a,
dt-article .ltx_tag_subsection a,
dt-article .ltx_tag_section a:active,
dt-article .ltx_tag_subsection a:active {
  border-bottom: none;
}

dt-article .ltx_tag_section a:hover,
dt-article .ltx_tag_subsection a:hover {
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
}

@media(min-width: 768px) {
  dt-article .ltx_tag_section,
  dt-article .ltx_tag_subsection {
    right: unset;
    left: -170px;
  }
}

@media (min-width: 1080px) {
  dt-article .ltx_tag_section,
  dt-article .ltx_tag_subsection {
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

  // Things to apply to all headings
  let headings = dom.querySelectorAll("h1, h2, h3, h4, h5, h6");
  Array.from(headings).forEach(heading => {
    // Remove <strong>
    if (heading.children.length && heading.children[0].tagName === "STRONG") {
      utils.removeAndFlattenChildren(heading.children[0]);
    }

    // Remove new lines
    Array.from(heading.children).forEach(child => {
      if (child.tagName === "BR") {
        heading.removeChild(child);
      }
    });

    // We've removed a bunch of elements so text nodes might be fragmented
    heading.normalize();

    var textNodes = dom.createTreeWalker(heading, dom.defaultView.NodeFilter.SHOW_TEXT);
    while (textNodes.nextNode()) {
      let node = textNodes.currentNode;
      // UPPER CASE HEADING ARGH
      // FIXME: this will be a false positive if it's just an acronym in a tag
      if (node.nodeValue == node.nodeValue.toUpperCase()) {
        node.nodeValue = toTitleCase(node.nodeValue.toLowerCase());
      }

      // Clean up weird characters
      node.nodeValue = node.nodeValue.replace('\u3000', '');
    }
  });

  // Add section numnbers
  let sectionNumbers = dom.querySelectorAll(".ltx_tag_section");
  Array.from(sectionNumbers).forEach(span => {
    let a = utils.nodeFromString(dom, '<a></a>');
    a.href = "#" + span.parentNode.parentNode.id;
    utils.moveChildren(span, a);
    span.appendChild(a);
  });

  // Put <h5> and <h6> in front of next paragraph, if it exists.
  // TODO: still want this?
  // var paragraphHeadings = Array.from(dom.querySelectorAll("h5"));
  // paragraphHeadings = paragraphHeadings.concat(dom.querySelectorAll("h6"));
  // paragraphHeadings.forEach(heading => {
  //   var p = heading.nextElementSibling;
  //   if (p && p.tagName == "P") {
  //     // Put at start of <p>
  //     p.insertBefore(dom.createTextNode(" "), p.firstChild);
  //     p.insertBefore(heading, p.firstChild);
  //     // Turn it into <strong>
  //     var newHeading = utils.nodeFromString(
  //       dom,
  //       '<strong class="paragraph-heading"></strong>'
  //     );
  //     utils.replaceAndKeepChildren(heading, newHeading);
  //   }
  // });
};
