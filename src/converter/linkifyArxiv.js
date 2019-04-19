const escape = require("escape-html");

// Match:
// - "arxiv", followed by 1-10 characters, then an arxiv ID. This matches things like "arxiv/1234.5678" or "as seen in arXiv report 1234.5678"
// - "abs/" followed immediately by an arXiv ID
// See linkifyArxiv.test.js for lots of examples
const groupedIssueRegex = /(arxiv.{1,10}?|abs\/)((\d+)\.(\d+))/gi;

module.exports = function linkifyArxiv(input) {
  return input.replace(groupedIssueRegex, (match, _, p2) => {
    return `<a href="https://arxiv.org/abs/${escape(p2)}">${escape(match)}</a>`;
  });
};
