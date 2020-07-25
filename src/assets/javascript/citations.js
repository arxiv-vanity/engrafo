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

function createContent(bibItem) {
  const itemContainer = document.createElement("div");
  itemContainer.className = "ltx_bibitem";
  itemContainer.innerHTML = bibItem.innerHTML;
  itemContainer.querySelector(".ltx_tag_bibitem").remove();
  return itemContainer;
}

export default function render(el) {
  const cites = el.querySelectorAll(".ltx_cite");
  for (let cite of cites) {
    const refs = cite.querySelectorAll("a.ltx_ref");

    for (let ref of refs) {
      const bibItem = getBibItem(el, ref);
      if (!bibItem) {
        continue;
      }
      // Create tooltip
      const content = createContent(bibItem);
      createTooltip(ref, content);

      // Make clicking citation actually to citation
      const link = bibItem.querySelector("a");
      if (link) {
        ref.setAttribute("href", link.getAttribute("href"));
        ref.setAttribute("target", "_blank");
      } else {
        ref.addEventListener("click", function (e) {
          e.preventDefault();
        });
        ref.className += " engrafo_not_a_link";
      }
    }
  }
}
