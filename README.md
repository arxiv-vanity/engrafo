# Engrafo

[ ![Codeship Status for bfirsh/engrafo](https://app.codeship.com/projects/df36a360-5b2c-0135-2a70-66335668a83b/status?branch=master)](https://app.codeship.com/projects/237445)

Converts LaTeX documents into beautiful responsive web pages.

## Usage

The easiest way to run Engrafo is by using the Docker image. To convert `input/main.tex` into `output/index.html`, run:

    $ docker run \
      -v "$(pwd)":/workdir -w /workdir \
      arxiv-vanity/engrafo engrafo -o output/ input/main.tex

For full usage, run `docker run arxiv-vanity/engrafo engrafo --help`.

## Design

We couldn't find a good LaTeX to HTML converter. But instead of building one from scratch, we decided to combine some components that were almost there and modify them to our needs.

The downside of this approach is a fair amount of shoe-horning, but the upside is (probably) less work, and it means we can contribute our improvements to each component back to the open-source academic community.

Here is how it works:

* [Pandoc](http://pandoc.org/) does most of the heavy lifting, using [our own heavily-modified fork](https://github.com/arxiv-vanity/pandoc). It parses the LaTeX and outputs the basic HTML.
* During the Pandoc conversion, a Pandoc filter (in `pandocfilter/`) converts `tikzpicture` to SVG, inserts labels, inserts hyperlinks, and various other things.
* After the Pandoc conversion, we apply [Distill's template](https://github.com/distillpub/template) to style the output, make it responsive, create footnotes, and create hover boxes.
* Some post-processors (in `src/postprocessors/`) do layout, additional styling, math rendering, bibliography rendering, and various other things. Pandoc can only output a particular subset of HTML from its AST, so the post-processors also rename and move around some elements.

The line between the Pandoc filter and the post-processing is pretty fuzzy at the moment. If you're trying to find some logic as to where a bit of processing lives, there probably isn't any. The intention is that we do as much as possible in Pandoc, then use the post-processor to rejig anything that Pandoc can't easily do.

## Development environment

In development, you can build an image locally and use a shortcut script to run the image:

    $ script/build
    $ script/engrafo -o output/ input/main.tex

You can also run a server that allows you to view papers from Arxiv in a browser. Start it by running:

    $ script/server

And it will be available at [http://localhost:8010/](http://localhost:8010/).

### Working on Pandoc

Engrafo uses a [custom version of Pandoc](https://github.com/arxiv-vanity/pandoc). If you are working on Pandoc locally, you can continuously build the `pandoc` binary and inject it into the Engrafo image.

In your local Pandoc directory, run:

    $ ./docker-watch-build.sh

This will build an executable in `pandoc/.stack-work/install/x86_64-linux/lts-8.16/8.0.2/bin/pandoc`.

In another shell, in the Engrafo directory, run:

    $ PANDOC_BINARY=/path/to/pandoc/.stack-work/install/x86_64-linux/lts-8.16/8.0.2/bin/pandoc script/server

Now, whenever you make a change to a Pandoc source file, the binary will build and will be visible in the Engrafo container.

**Note:** This doesn't quite work as expected, probably due to Docker bugs. The watch script doesn't seem to pick up source changes, so you have to manually press enter to re-build. Then when it's built, the engrafo container can't find the mounted pandoc binary that was removed (it's not re-mounted when it's recreated) so you have to restart the engrafo container.

## Tests

Run the main test suite:

    $ script/test

You can run entire suites:

    $ script/test integration-tests/images.test.js

Or individual tests by matching a string:

    $ script/test -t "titles and headings"

There is also a test suite for the Pandoc filter:

    $ script/test-pandocfilter

### Writing integration tests

The integration tests in `integration-tests/` render small LaTeX files and ensure they produce a particular HTML output.

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
