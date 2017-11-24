let utils = require("./utils");

module.exports = function(dom) {
  var elements = dom.querySelectorAll(".ltx_note_outer");

  // If there are footnotes, put the container element in the appendix.
  // Distill will automatically fill it with footnotes.
  if (elements.length > 0) {
    // Distill does all numbering for us, so remove latexml generated stuff
    var noteMarks = dom.querySelectorAll(".ltx_note_mark");
    Array.from(noteMarks).forEach(noteMark => {
      noteMark.parentNode.removeChild(noteMark);
    });

    var dtAppendix = dom.querySelector("dt-appendix");
    dtAppendix.appendChild(utils.nodeFromString(dom, "<h3>Footnotes</h3>"));
    dtAppendix.appendChild(dom.createElement("dt-fn-list"));
  }

  // Replace footnotes with Distill footnotes
  Array.from(elements).forEach(span => {
    let dtFn = dom.createElement("dt-fn");
    utils.replaceAndKeepChildren(span, dtFn);
  });
};
