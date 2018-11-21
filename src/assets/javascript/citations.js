import tippy from "tippy.js";

// https://github.com/atomiks/tippyjs/issues/260
function onShow(instance) {
  document.querySelectorAll(".tippy-popper").forEach(popper => {
    if (popper !== instance.popper) {
      popper._tippy.hide();
    }
  });
}

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

function makeTippy(el, content) {
  tippy(el, {
    content: content,
    arrow: true,
    animateFill: false,
    animation: "fade",
    delay: [0, 250],
    duration: [0, 300],
    interactive: true,
    interactiveBorder: 5,
    interactiveDebounce: 100,
    placement: "top-start",
    size: "large",
    theme: "light-border",
    popperOptions: {
      modifiers: {
        // If document overflows on mobile, still keep tooltip within viewport
        preventOverflow: {
          boundariesElement: "viewport"
        }
      }
    },
    onShow: onShow
  });
  // For progressive enhancement in CSS
  el.className += " ltx_engrafo_tooltip";
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
          makeTippy(ref, content);
        }
      }
    }
    // Not many references, put 'em all in one tooltip
    else {
      const content = document.createElement("div");
      for (let ref of refs) {
        content.appendChild(createContent(el, ref));
        // Used in CSS for progressive enhancement
      }
      makeTippy(cite, content);
    }

    for (let ref of refs) {
      // Make clicking links do nothing
      ref.addEventListener("click", function(e) {
        e.preventDefault();
      });
    }
  }
}
