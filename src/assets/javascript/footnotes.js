import { createTooltip } from "./utils/tooltips";

export default function render(el) {
  const notes = el.querySelectorAll(".ltx_note");
  for (let note of notes) {
    const tooltipMark = note.querySelector(".ltx_note_mark").cloneNode(true);
    tooltipMark.className = "ltx_engrafo_note_mark_tooltip";
    note.appendChild(tooltipMark);

    const content = note.querySelector(".ltx_note_content").cloneNode(true);
    const ltxNoteMark = content.querySelector(".ltx_note_mark");
    if (ltxNoteMark) {
      ltxNoteMark.remove();
    }
    const ltxTag = content.querySelector(".ltx_tag");
    if (ltxTag) {
      ltxTag.remove();
    }

    createTooltip(tooltipMark, content);
  }
}
