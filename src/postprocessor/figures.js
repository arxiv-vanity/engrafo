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

  dt-article figure img,
  dt-article figure table,
  dt-article figure .ltx_listing {
    width: 100%;
    height: auto;
    margin-bottom: 15px;
  }

  dt-article table td.ltx_subfigure {
    border: 0;
    padding: 0 1rem 0 0;
  }

  dt-article .ltx_subfigure figure {
    margin: 0;
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

  /* listings */
  .ltx_listing {
    font-size: 0.8em;
  }
  .ltx_listingline { white-space:nowrap; min-height:1em; }
  .ltx_lst_numbers_left .ltx_listingline .ltx_tag {
    background-color:transparent;
    margin-left:-3em; width:2.5em;
    position:absolute;
    text-align:right; }
  .ltx_lst_numbers_right .ltx_listingline .ltx_tag {
      background-color:transparent;
      width:2.5em;
      position:absolute; right:3em;
      text-align:right; }
`;

module.exports = function(dom) {
  utils.addStylesheet(dom, css);

  Array.from(dom.querySelectorAll("figure")).forEach(figure => {
    if (figure.querySelector(".ltx_subfigure")) {
      figure.className += " l-page";
    }
  });
};
