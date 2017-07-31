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
