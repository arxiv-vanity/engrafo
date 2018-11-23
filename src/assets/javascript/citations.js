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
  return itemContainer;
}

export default function render(el) {
  const cites = el.querySelectorAll(".ltx_cite");
  for (let cite of cites) {
    const refs = cite.querySelectorAll(".ltx_ref");

    // Lots of references, separate tooltips otherwise it won't fit on the screen
    if (refs.length > 3) {
      for (let ref of refs) {
        const content = createContent(el, ref);
        if (content) {
          createTooltip(ref, content);
        }
      }
    }
    // Not many references, put 'em all in one tooltip
    else {
      const content = document.createElement("div");
      for (let ref of refs) {
        const itemContent = createContent(el, ref);
        if (itemContent) {
          content.appendChild(itemContent);
        }
      }
      if (content.children.length > 0) {
        createTooltip(cite, content);
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
