const _ = require("lodash");
const axios = require("axios");
const querystring = require("querystring");
const util = require("util");
const parseString = util.promisify(require("xml2js").parseString);

/*
 * Call grobid's /api/processCitation endpoint and get sensible data out of it
 */
async function grobidProcessCitation(grobidUrl, text) {
  const response = await axios.post(
    grobidUrl + "/api/processCitation",
    querystring.stringify({ citations: text })
  );
  const data = await parseString(response.data);
  const analytic = _.get(data, "biblStruct.analytic[0]");
  const monogr = _.get(data, "biblStruct.monogr[0]");
  if (!analytic && !monogr) {
    return;
  }

  // First try and get thing from <analytic>, then fall back to <monogr> because sometimes
  // things turn up in there if journal is not in citation.
  // e.g. "Matthew Hausknecht, Risto Miikkulainen, and Peter Stone. A neuro-evolution approach to general atari game playing. 2013."
  function get(path) {
    const v = _.get(analytic, path);
    return v ? v : _.get(monogr, path);
  }

  const result = {
    title: get("title[0]._"),
    firstAuthorForename: get("author[0].persName[0].forename[0]._"),
    firstAuthorSurname: get("author[0].persName[0].surname[0]")
  };

  return result;
}

/*
 * Call biblio-glutton's /service/lookup endpoint and don't do anything clever.
 * If 404, returns null.
 */
async function biblioGluttonLookup(biblioGluttonUrl, params) {
  try {
    const response = await axios.get(biblioGluttonUrl + "/service/lookup", {
      params: params
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // No match, ignore
      return;
    }
    throw error;
  }
}

/*
 * Get citation metadata, combining Grobid and biblio-glutton.
 *
 * It first parses the citation with Grobid to get title and author. It then
 * looks up that title and author on biblio-glutton to get metadata.
 *
 * biblio-glutton has an endpoint that tries to fetch metadata from citation text,
 * but it doesn't seem to work as well. No idea why it isn't trying to parse the
 * text with Grobid like we are.
 *
 * Returns null if there is no match.
 *
 */
async function getCitationMetadata(text, { grobidUrl, biblioGluttonUrl }) {
  const parsedCitation = await grobidProcessCitation(grobidUrl, text);
  if (!parsedCitation) {
    return;
  }
  const data = await biblioGluttonLookup(biblioGluttonUrl, {
    atitle: parsedCitation.title,
    firstAuthor: parsedCitation.firstAuthorSurname
  });
  return data;
}

module.exports = { getCitationMetadata: getCitationMetadata };
