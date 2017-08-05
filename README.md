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

### Local Pandoc development

If you are working on Pandoc locally, continuously build the `pandoc` binary from your local `pandoc` folder:

    $ ./docker-watch-build.sh

This will build an executable in `pandoc/.stack-work/install/x86_64-linux/lts-8.16/8.0.2/bin/pandoc` (that is then symlinked to `~/.local/bin` in the container).

In another shell, in the `engrafo-pandoc` folder, start the server with

    $ PANDOC_BINARY=/path/to/pandoc/.stack-work/install/x86_64-linux/lts-8.16/8.0.2/bin/pandoc script/server

Now, whenever you make a change to a Pandoc source file, the binary will build and will be visible in the Engrafo container.

**Note:** This doesn't quite work as expected, probably due to Docker bugs. The watch script doesn't seem to pick up source changes, so you have to manually press enter to re-build. Then when it's built, the engrafo container can't find the mounted pandoc binary that was removed (it's not re-mounted when it's recreated) so you have to restart the engrafo container.

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

Each test renders a LaTeX file and ensures it matches a snapshot. If it does not match, Jest prints a pretty diff and gives you the option to automatically fix the test.

First, write a test case describing in plain text what you are testing. For example, in `integration-tests/formatting.test.js`:

```javascript
test("bold text renders correctly", done => {
  utils.expectBodyToMatchSnapshot("formatting/bold.tex", done);
});
```

Then, write `integration-tests/formatting/bold.tex`:

```latex
\begin{document}
  I am \textbf{bold}!
\end{document}
```

Now, run the test passing the `-u` option to write out a snapshot of what is rendered:

    $ script/test -t "bold text renders correctly" -u

Check the output looks correct in `integration-tests/__snapshots__/formatting.test.js.snap`. You can re-run that command without the `-u` option to ensure the test passes.

The test will fail if the output changes in the future. If the change is expected, then you can simply re-run the test with `-u` to overwrite the snapshot and fix the test.
