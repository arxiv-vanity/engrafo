const { nodeFromString } = require("./utils");

// Put footnotes in authors underneath authors
function authorFootnotes(document) {
  const authors = document.querySelector(".ltx_authors");
  if (!authors) {
    return;
  }
  const notes = authors.querySelectorAll(".ltx_note");
  if (!notes.length) {
    return;
  }
  const authorNotesContainer = nodeFromString(
    document,
    '<div class="ltx_engrafo_author_notes"></div>'
  );
  authors.appendChild(authorNotesContainer);
  // In the laTeXML's output several authors can have the same note text
  // and we want to deduplicate them. We'll use a dictionary to keep track of
  // unique note texts.
  const noteTextToMark = {};
  for (let note of notes) {
    const authorNote = nodeFromString(
      document,
      '<div class="ltx_note_outer"></div>'
    );
    const noteContent = note.querySelector(".ltx_note_content");
    const noteMark = note.querySelector(".ltx_note_mark");

    const noteText = noteContent.lastChild.textContent;
    if (!(noteText in noteTextToMark)) {
      noteTextToMark[noteText] = Object.keys(noteTextToMark).length + 1;
      authorNote.appendChild(noteContent);
      authorNotesContainer.appendChild(authorNote);
    }

    noteMark.innerHTML = noteTextToMark[noteText];
    // Remove the footnote and replace with just the mark, because it isn't really a footnote any longer
    note.parentNode.replaceChild(noteMark, note);
  }
}

module.exports = function (document) {
  authorFootnotes(document);
};
