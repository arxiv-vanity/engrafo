const { nodeFromString } = require("./utils");

module.exports = function(document) {
  // Put footnotes in authors underneath authors
  const authors = document.querySelector(".ltx_authors");
  if (!authors) {
    return;
  }
  const notes = authors.querySelectorAll(".ltx_note_outer");
  if (!notes.length) {
    return;
  }
  const authorNotesContainer = nodeFromString(
    document,
    '<div class="ltx_engrafo_author_notes"></div>'
  );
  authors.appendChild(authorNotesContainer);
  for (let note of notes) {
    const authorNote = nodeFromString(
      document,
      '<div class="ltx_note_outer"></div>'
    );
    authorNote.appendChild(note.querySelector(".ltx_note_content"));
    authorNotesContainer.appendChild(authorNote);
    note.remove();
  }
};
