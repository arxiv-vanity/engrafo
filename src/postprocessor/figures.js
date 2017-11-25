let utils = require("./utils");

var css = `
  dt-article table th,
  dt-article table td {
    padding-right: 1rem;
  }

  dt-article table th:last-child,
  dt-article table td:last-child {
    padding-right: 0;
  }

  dt-article figure {
    overflow-x: auto;
  }

  dt-article figure img {
    width: 100%;
    height: auto;
    margin-bottom: 15px;
  }

  @media (min-width: 1080px) {
    dt-article figure {
      overflow: visible;
    }

    dt-article figure .images {
      display: flex;
    }
    dt-article figure .images > div {
      margin-right: 15px;
    }
  }
`;

module.exports = function(dom) {
  utils.addStylesheet(dom, css);

};
