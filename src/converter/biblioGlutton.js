const axios = require("axios");

/*
 * Call biblio-glutton's /service/lookup endpoint and don't do anything clever.
 * If 404, returns null.
 */
async function biblioGluttonLookup(biblioGluttonUrl, params) {
  try {
    const response = await axios.get(biblioGluttonUrl + "/service/lookup", {
      params: params,
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    const res = error.response;
    if (
      res &&
      res.status === 404 &&
      res.data &&
      res.data.message ===
        "Best bibliographical record did not passed the post-validation"
    ) {
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
    biblio: text,
  });
  return data;
}

module.exports = { getCitationMetadata: getCitationMetadata };
