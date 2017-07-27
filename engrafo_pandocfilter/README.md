# engrafo_pandocfilter

One single
monolithic [Pandoc filter](http://pandoc.org/scripting.html) for all
of Engrafo's prettifications.

For example:
* Convert PDF and `tikzpicture` images to SVG
* Insert labels and hyperlinks for figures, sections, and equations
* Move figure captions from hidden `alt` texts to visible paragraphs

## Installation

```sh
python setup.py install
```

## Usage

```sh
pandoc \
    --from latex+raw_tex \
    --to html \
    --standalone \
    --mathjax \
    --filter engrafo_pandocfilter \
    --output index.html \
    lstm-syl.tex
```
