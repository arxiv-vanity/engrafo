const biblioGlutton = require("../biblioGlutton");

module.exports = async function(document, { biblioGluttonUrl, grobidUrl }) {
  if (!biblioGluttonUrl || !grobidUrl) {
    return;
  }

  console.log("Adding bibliography links...");

  const bibitems = document.querySelectorAll(".ltx_bibliography .ltx_bibitem");
  for (let bibitem of bibitems) {
    // ignore if it already has a link
    if (bibitem.querySelector("a")) {
      continue;
    }

    const bibitemCopy = bibitem.cloneNode(true);
    // Remove "Arjovsky et al. (2017)" etc prefix, because it confuses grobid
    const tag = bibitemCopy.querySelector(".ltx_tag");
    if (tag) {
      tag.remove();
    }

    let data;
    try {
      data = await biblioGlutton.getCitationMetadata(
        bibitemCopy.textContent.trim(),
        { biblioGluttonUrl, grobidUrl }
      );
      if (!data) {
        continue;
      }
    } catch (error) {
      console.error(`Error getting citation metadata: ${error}`);
      continue;
    }

    let url = data.oaLink ? data.oaLink : data.URL;
    if (!url) {
      continue;
    }

    // Wrap citation in <a>
    const a = document.createElement("a");
    a.setAttribute("href", url);

    for (let bibblock of bibitem.querySelectorAll(".ltx_bibblock")) {
      a.appendChild(bibblock);
    }
    bibitem.appendChild(a);
  }
};
