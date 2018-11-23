module.exports = function(document) {
  Array.from(document.querySelectorAll(".ltx_equation .ltx_Math")).forEach(
    math => {
      // Disambiguate display maths
      math.className = "ltx_DisplayMath";
      // Add markup so mathjax picks it up
      math.innerHTML = `\\[ ${math.innerHTML} \\]`;
    }
  );

  Array.from(document.querySelectorAll(".ltx_equationgroup")).forEach(math => {
    // These are sometimes not figures so add class to parent so we can make
    // it scroll on overflow
    math.parentNode.className += " ltx_equationgroup_container";
  });

  Array.from(document.querySelectorAll(".ltx_Math")).forEach(math => {
    math.innerHTML = `\\(${math.innerHTML}\\)`;
  });
};
