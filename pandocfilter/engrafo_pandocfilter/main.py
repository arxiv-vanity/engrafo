# -*- coding: utf-8 -*-
import json
import sys
from pandocfilters import walk
from .footnotes import inline_footnotes
from .images import (replace_pdf_images, replace_tikz_images,
                     append_image_extensions)
from .labels import (process_display_math, insert_figure_labels,
                     insert_table_labels, insert_section_labels,
                     make_explicit_figure_captions, replace_references,
                     insert_cite_labels, replace_cite_references)
from .math import replace_smallcaps


def main():
    doc = json.loads(sys.stdin.read())

    # Save unmodified AST for debugging
    with open('pandoc-ast.json', 'w') as f:
        json.dump(doc, f)

    blocks = doc['blocks']
    meta = doc['meta']
    fmt = 'latex'

    altered = blocks

    for action in [
            replace_smallcaps,
            process_display_math,
            append_image_extensions,
            replace_pdf_images,
            replace_tikz_images,
            insert_figure_labels,
            insert_table_labels,
            insert_section_labels,
            insert_cite_labels,
            make_explicit_figure_captions,
            replace_references,
            replace_cite_references,
            inline_footnotes,
    ]:
        altered = walk(altered, action, fmt, meta)

    doc['blocks'] = altered

    # Save filtered AST for debugging
    with open('pandoc-ast-filtered.json', 'w') as f:
        json.dump(doc, f)

    json.dump(doc, sys.stdout)
    sys.stdout.flush()


if __name__ == '__main__':
    main()
