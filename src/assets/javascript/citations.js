import tippy from "tippy.js";

// https://github.com/atomiks/tippyjs/issues/260
function onShow(instance) {
  document.querySelectorAll(".tippy-popper").forEach(popper => {
    if (popper !== instance.popper) {
      popper._tippy.hide();
    }
  });
}

export default function render(el) {
  const refs = el.querySelectorAll(".ltx_cite .ltx_ref");
  for (let ref of refs) {
    const href = ref.getAttribute("href");
    if (!href) {
      continue;
    }
    // This could just be dom.querySelector(href) but that doesn't work if
    // there are periods in the ID. Sigh.
    const bibItem = el.querySelector(`*[id='${href.slice(1)}']`);
    if (!bibItem) {
      continue;
    }

    tippy(ref, {
      content: bibItem.innerHTML,
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
            boundariesElement: 'viewport'
          }
        }
      },
      onShow: onShow
    });
  }
}
