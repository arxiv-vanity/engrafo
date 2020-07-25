const { matchArxivID } = require("../arxivIDs");
const biblioGlutton = require("../biblioGlutton");

function removeNodeAndKeepChildren(node) {
  while (node.firstChild) {
    node.parentNode.insertBefore(node.firstChild, node);
  }
  node.parentNode.removeChild(node);
}

function wrapCitationInLink(document, bibitem, href) {
  const a = document.createElement("a");
  a.setAttribute("href", href);

  for (let bibblock of bibitem.querySelectorAll(".ltx_bibblock")) {
    a.appendChild(bibblock);
  }
  bibitem.appendChild(a);
}

module.exports = async function (document, { biblioGluttonUrl, grobidUrl }) {
  console.log("Adding bibliography links...");

  const bibitems = document.querySelectorAll(".ltx_bibliography .ltx_bibitem");
  for (let bibitem of bibitems) {
    // STEP 1: Max arXiv
    // If there's one link and it's already an arXiv link, make the whole thing one goddamn link
    const existingLinks = bibitem.querySelectorAll("a");
    if (existingLinks.length === 1) {
      const href = existingLinks[0].getAttribute("href");
      if (
        href.indexOf("arxiv.org") !== -1 ||
        href.indexOf("arxiv-vanity.com") !== -1
      ) {
        removeNodeAndKeepChildren(existingLinks[0]);
        wrapCitationInLink(document, bibitem, href);
        continue;
      }
    }

    // STEP 2: If there's an arXiv ID, always use the arXiv ID

    // FIXME: maybe if there is a link, do something clever? just link the ID? clobber the other link if we're confident?
    if (existingLinks.length === 0) {
      const arxivID = matchArxivID(bibitem.textContent);
      if (arxivID) {
        wrapCitationInLink(
          document,
          bibitem,
          "https://arxiv.org/abs/" + arxivID
        );
        continue;
      }
    }

    // STEP 3: THE GROBIDATOR
    // Try and turn the citation into a link using biblio-glutton and Grobid.
    // This will also process links which already have a link in them -- in that case, this gives us the opportunity to
    // find a better one!

    // If no biblio-glutton or Grobid, skip this
    if (!biblioGluttonUrl || !grobidUrl) {
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

    // If there was an existing link and we didn't find a open access alternative,
    // just give up and use what they already had
    if (existingLinks.length > 0 && !data.oaLink) {
      continue;
    }

    // Remove any existing links
    for (let a of bibitem.querySelectorAll("a")) {
      removeNodeAndKeepChildren(a);
    }

    wrapCitationInLink(document, bibitem, url);
  }
};
