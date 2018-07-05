const tippy = require("tippy.js");

function render() {
  const refs = document.querySelectorAll(".ltx_ref");
  for (let ref of refs) {
    const href = ref.getAttribute("href");
    if (!href) {
      continue;
    }
    // This could just be dom.querySelector(a.getAttribute("href")) but
    // querySelector doesn't work if there are periods in the ID. Sigh.
    const bibItem = document.getElementById(href.slice(1));
    if (!bibItem) {
      continue;
    }
    ref.setAttribute("title", bibItem.innerHTML);
  }

  tippy(refs, {
    arrow: true,
    animateFill: false,
    animation: "fade",
    delay: [0, 250],
    duration: [0, 300],
    interactive: true,
    interactiveBorder: 5,
    placement: "top-start",
    size: "large",
    theme: "engrafo"
  });
}

module.exports = {
  render: render
};
