import { createTooltip } from "./utils/tooltips";

function getBibItem(el, ref) {
  const href = ref.getAttribute("href");
  if (!href) {
    return;
  }
  // This could just be dom.querySelector(href) but that doesn't work if
  // there are periods in the ID. Sigh.
  return el.querySelector(`*[id='${href.slice(1)}']`);
}

function createContent(el, ref) {
  const bibItem = getBibItem(el, ref);
  if (!bibItem) {
    return;
  }
  const itemContainer = document.createElement("div");
  itemContainer.className = "ltx_bibitem";
  itemContainer.innerHTML = bibItem.innerHTML;
  itemContainer.querySelector(".ltx_tag_bibitem").remove();
  return itemContainer;
}

export default function render(el) {
  const cites = el.querySelectorAll(".ltx_cite");
  for (let cite of cites) {
    const refs = cite.querySelectorAll(".ltx_ref");

    for (let ref of refs) {
      const content = createContent(el, ref);
      if (content) {
        createTooltip(ref, content);
      }
    }

    for (let ref of refs) {
      // Make clicking links do nothing
      ref.addEventListener("click", function(e) {
        e.preventDefault();
      });
    }
  }
}
