import tippy from "tippy.js/esm";

export function createTooltip(el, content) {
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
          boundariesElement: "viewport",
        },
      },
    },
    // https://github.com/atomiks/tippyjs/issues/260
    onShow: (instance) => {
      tippy.hideAll({ exclude: instance });
    },
  });
  // For progressive enhancement in CSS
  el.className += " ltx_engrafo_tooltip";
}
