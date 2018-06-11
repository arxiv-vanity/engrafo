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

In development, you can build an image locally and use a script to run the image:

    $ script/build
    $ script/engrafo -o output/ tests/documents/sample2e.tex

You can also run a server for developing CSS. It renders a file then runs a server that will automatically reload the CSS when you change it. Start it by running:

    $ script/server tests/documents/sample2e.tex

And it will be available at [http://localhost:8000/](http://localhost:8000/).

## Tests

Run the main test suite:

    $ script/test

You can run entire suites:

    $ script/test integration-tests/images.test.js

Or individual tests by matching a string:

    $ script/test -t "titles and headings"

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

    $ script/test -t "bold text renders correctly" -u

Check the output looks correct in `tests/__snapshots__/integration.test.js.snap`. You can re-run that command without the `-u` option to ensure the test passes.

The test will fail if the output changes in the future. If the change is expected, then you can simply re-run the test with `-u` to overwrite the snapshot and fix the test.

## Installing new yarn packages

All the Node dependencies are inside the Docker container, which makes managing dependencies a bit unusual. To add a new dependency, use `script/yarn` and rebuild the image:

    $ script/yarn add leftpad
    $ script/build

Similarly,

    $ script/yarn remove leftpad
    $ script/build

## Sponsors

Thanks to our generous sponsors for supporting the development of Arxiv Vanity! [Sponsor us to get your logo here.](https://www.patreon.com/arxivvanity)

[<img src="docs/sponsor-yld.png" alt="YLD" width="250" />](https://www.yld.io/)
