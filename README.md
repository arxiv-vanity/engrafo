# Engrafo

[ ![Codeship Status for bfirsh/engrafo](https://app.codeship.com/projects/df36a360-5b2c-0135-2a70-66335668a83b/status?branch=master)](https://app.codeship.com/projects/237445)

Engrafo converts LaTeX documents into beautiful responsive web pages using [LaTeXML](https://dlmf.nist.gov/LaTeXML/).

It is a set of stylesheets and scripts for LaTeXML output. It makes the design responsive so you can read it on phones, and adds various interactive bits like footnote tooltips.

It turns this sort of thing:

<img src="docs/screenshot-pdf.png" width="600">

Into this:

<img src="docs/screenshot-screens.png">

## Usage

The easiest way to run Engrafo is by using the Docker image. To convert `input/main.tex` into `output/index.html`, run:

    $ docker run \
      -v "$(pwd)":/workdir -w /workdir \
      arxivvanity/engrafo engrafo -o output/ input/main.tex

For full usage, run `docker run arxivvanity/engrafo engrafo --help`.

## Development environment

First, install [Node](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/en/docs/install#mac-stable). Then, install the Node dependencies:

    $ yarn

The LaTeXML and LaTeX toolchain runs inside Docker. [Install Docker](https://docs.docker.com/install/) and build the Docker image:

    $ script/docker-build

You can convert documents with `yarn run convert`:

    $ yarn run convert -o output/ tests/documents/sample2e.tex

## Tests

Run the main test suite:

    $ yarn test

You can run particular suites:

    $ yarn test tests/integration.test.js

Or particular tests by matching a string:

    $ yarn test -t "titles and headings"

### Writing integration tests

The integration tests in `tests/integration.test.js` render small LaTeX files and ensure they produce a particular HTML output. They also compare a screenshot of the output with a known good screenshot.

The integration tests use [Jest's](http://facebook.github.io/jest/) snapshotting feature.

Each test renders a LaTeX file and ensures it matches a snapshot. If it does not match, Jest prints a pretty diff and gives you the option to automatically fix the test.

First, write a test case describing in plain text what you are testing. For example, in `tests/integration.test.js`:

```javascript
test("bold text renders correctly", done => {
  utils.expectBodyToMatchSnapshot("documents/bold.tex", done);
});
```

Then, write `tests/documents/bold.tex`:

```latex
\begin{document}
  I am \textbf{bold}!
\end{document}
```

Now, run the test passing the `-u` option to write out a snapshot of what is rendered:

    $ yarn test -t "bold text renders correctly" -u

Check the output looks correct in `tests/__snapshots__/integration.test.js.snap`. You can re-run that command without the `-u` option to ensure the test passes.

The test will fail if the output changes in the future. If the change is expected, then you can simply re-run the test with `-u` to overwrite the snapshot and fix the test.

## Sponsors

Thanks to our generous sponsors for supporting the development of Arxiv Vanity! [Sponsor us to get your logo here.](https://www.patreon.com/arxivvanity)

[<img src="docs/sponsor-yld.png" alt="YLD" width="250" />](https://www.yld.io/)

Tested by:

[<img src="docs/sponsor-percy.png" alt="Percy" width="350" />](https://percy.io/)
