const escape = require("escape-html");

const groupedIssueRegex = /arxiv:((\d+)\.(\d+))/gi;

module.exports = function linkifyArxiv(input) {
  return input.replace(groupedIssueRegex, (match, p1) => {
    return `<a href="https://arxiv.org/abs/${escape(p1)}">${escape(match)}</a>`;
  });
};
