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
