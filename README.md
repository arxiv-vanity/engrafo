# Engrafo

**Note:** Engrafo is being rewritten, so we recommend not to not use the version in master. If you want to convert documents, see the "Usage" section below, where there are instructions on how to use the stable 1.1.0 version.

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
      arxivvanity/engrafo:1.1.0 engrafo input/main.tex output/

For full usage, run `docker run arxivvanity/engrafo:1.1.0 engrafo --help`.

## Development environment

First, install [Node](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/en/docs/install#mac-stable). Then, install the Node dependencies:

    $ yarn

### Frontend development

For developing the CSS and frontend JavaScript, there are a bunch of pre-rendered documents you can use to work with. This means you don't need to install any LaTeX or Docker stuff.

Run this command:

    $ yarn run storybook

Then, all the documents will be available as a Storybook at [http://localhost:6006](http://localhost:6006). Any chances you make to the CSS and JS in `src/assets/` will be automatically updated in the Storybook.

### Converting documents

The LaTeXML and LaTeX toolchain runs inside Docker. If you want to work on the code that actually converts documents, you will need to install Docker.

[Install Docker](https://docs.docker.com/install/) and build the Docker image:

    $ script/docker-build

You can convert documents with `yarn run convert`:

    $ yarn run convert tests/documents/sample2e.tex output/

There is also a development server, which is useful for developing CSS and JavaScript. When you make changes to the JavaScript or CSS, it will automatically update in the browser:

    $ yarn run server tests/documents/sample2e.tex

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

## Code style

All code must be formatted with [Prettier](https://prettier.io/). To automatically format the code, run:

    $ yarn run prettier

## Sponsors

Thanks to our generous sponsors for supporting the development of Arxiv Vanity! [Sponsor us to get your logo here.](https://www.patreon.com/arxivvanity)

[<img src="docs/sponsor-yld.png" alt="YLD" width="250" />](https://www.yld.io/)

Tested by:

[<img src="docs/sponsor-percy.png" alt="Percy" width="350" />](https://percy.io/)
