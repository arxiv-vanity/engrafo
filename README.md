# Engrafo

[ ![Codeship Status for bfirsh/engrafo](https://app.codeship.com/projects/df36a360-5b2c-0135-2a70-66335668a83b/status?branch=master)](https://app.codeship.com/projects/237445)

Converts LaTeX documents into beautiful, readable, responsive web pages.

## Design

Engrafo stands on a lot of other shoulders because parsing LaTeX is really hard. The main thing is written in Node.js, but it calls lots of other things. Here is roughly how it works:

* Engrafo calls Pandoc to do a basic conversion of LaTeX to HTML, using [our own fork of Pandoc](https://github.com/andreasjansson/pandoc).
* During the Pandoc conversion, a Pandoc filter written in Python (in `pandocfilter/`) does things like converting `tikzpicture` to SVG, inserting labels, inserting hyperlinks, etc.
* After the Pandoc conversion, a few things from [Distill's template](https://github.com/distillpub/template) are run on the output to style it, create footnotes, create hover boxes, etc.
* Intermingled with the Distill processing is some of Engrafo runs its own post-processing. Pandoc can only output a particular subset of HTML from its AST, so the post-processor improves various things. It also prepares it for Distill's processing and adds styling.

The line between the Python Pandoc filter and the Node.js post-processing is pretty fuzzy at the moment. It is intended that we do as much as possible in Pandoc, then use the Node post-processor to rejig anything that Pandoc doesn't do as we like.

## Building Docker image

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

Or tests in a single module:

    $ script/test -- formatting

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
