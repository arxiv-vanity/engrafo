const axios = require("axios");

/*
 * Call biblio-glutton's /service/lookup endpoint and don't do anything clever.
 * If 404, returns null.
 */
async function biblioGluttonLookup(biblioGluttonUrl, params) {
  try {
    const response = await axios.get(biblioGluttonUrl + "/service/lookup", {
      params: params,
      timeout: 15000
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
 * Get citation metadata using biblio-glutton.
 *
 * Returns null if there is no match.
 *
 */
async function getCitationMetadata(text, { biblioGluttonUrl }) {
  const data = await biblioGluttonLookup(biblioGluttonUrl, {
    biblio: text
  });
  return data;
}

module.exports = { getCitationMetadata: getCitationMetadata };
