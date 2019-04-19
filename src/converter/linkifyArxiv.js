const escape = require("escape-html");

const groupedIssueRegex = /(arxiv:|abs\/)((\d+)\.(\d+))/gi;

module.exports = function linkifyArxiv(input) {
  return input.replace(groupedIssueRegex, (match, _, p2) => {
    return `<a href="https://arxiv.org/abs/${escape(p2)}">${escape(match)}</a>`;
  });
};
