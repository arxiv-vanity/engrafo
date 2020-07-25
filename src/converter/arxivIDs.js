// from arxiv-vanity
const ARXIV_ID_PATTERN = /([a-z\-]+(?:\.[A-Z]{2})?\/\d{7}|\d{4,5}\.\d{4,5})(v\d+)?/i;

function matchArxivID(input) {
  const match = input.match(ARXIV_ID_PATTERN);
  if (match) {
    return match[0];
  }
}

module.exports = {
  matchArxivID: matchArxivID,
};
