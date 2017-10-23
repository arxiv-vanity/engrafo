let utils = require("./utils");

module.exports = function(dom) {
  // HACK: remove table captions in tables inside tables. this needs fixing
  // in pandoc, but easier to do here for now
  // https://github.com/arxiv-vanity/engrafo/issues/124
  let captions = dom.querySelectorAll('table table caption');
  Array.from(captions).forEach(caption => {
    caption.remove();
  });
};
