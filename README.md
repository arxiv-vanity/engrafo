# Engrafo

Converts LaTeX documents to beautiful, readable, responsive web pages.

## Building

First, build Andreas' Pandoc fork in another directory:

    $ git clone https://github.com/andreasjansson/pandoc
    $ cd pandoc/
    $ docker build -t andreasjansson/pandoc .

Next, build Engrafo:

    $ script/build

## Rendering a document

    $ script/engrafo path/to/latex.tex

## Run development server

The development server allows you to view articles on Arxiv in a browser.

Start it by running:

    $ script/server

And it will be available at [http://localhost:8010/](http://localhost:8010/).

If you are working on Pandoc locally and want to pass through a Pandoc binary, set `$PANDOC_BINARY` to an absolute path to the binary. For example:

    $ PANDOC_BINARY=$HOME/projects/pandoc/pandoc script/server

## Tests

### Unit tests

So far, only the Pandoc filters have unit tests:

    $ script/test-pandocfilter

### Running integration tests

The integration tests in `integration-tests/` render small LaTeX files and ensure they produce a particular HTML output.

    $ script/test

You can run entire suites:

    $ script/test integration-tests/images.test.js

Or individual tests by matching a string:

    $ script/test -t "titles and headings"

### Writing integration tests

The integration tests use [Jest's](http://facebook.github.io/jest/) snapshotting feature.

Each test renders a LaTeX file and ensures it matches a snapshot. If it does not match, Jest prints a pretty diff and gives us the option to automatically fix the test.

First, write a test case describing in plain text what you are testing. For example, in `integration-tests/formatting.test.js`:

```javascript
test("bold text renders correctly", done => {
  utils.expectBodyToMatchSnapshot("formatting/bold.tex", done);
});
```

Then, write `integration-tests/formatting/bold.text`:

```latex
\begin{document}
  I am \textbf{bold}!
\end{document}
```

Now, run the test passing the `-u` option to write out a snapshot of what is rendered:

    $ script/test -t "bold text renders correctly" -u

Check the output looks correct in `integration-tests/__snapshots__/formatting.test.js.snap`. You can re-run that command without the `-u` option to ensure the test passes.

The test will fail if the output changes in the future. If the change is expected, then you can simply re-run the test with `-u` to overwrite the snapshot and fix the test.
