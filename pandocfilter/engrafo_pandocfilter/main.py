# -*- coding: utf-8 -*-
import json
import sys
from pandocfilters import walk
from .figures import make_figures
from .footnotes import inline_footnotes
from .images import (replace_pdf_images, replace_tikz_images,
                     append_image_extensions, replace_eps_images)
from .labels import (process_display_math, insert_figure_labels,
                     insert_table_labels, insert_section_labels,
                     replace_references, insert_cite_labels,
                     replace_cite_references)
from .links import add_http_to_links, wrap_urls_in_anchors
from .math import replace_smallcaps


def main():
    doc = json.loads(sys.stdin.read())

    # Save unmodified AST for debugging
    with open('pandoc-ast.json', 'w') as f:
        json.dump(doc, f)

    meta = doc['meta']
    fmt = 'latex'

    for action in [
            add_http_to_links,
            wrap_urls_in_anchors,
            replace_smallcaps,
            process_display_math,
            append_image_extensions,
            replace_eps_images,
            replace_pdf_images,
            replace_tikz_images,
            make_figures,
            insert_figure_labels,
            insert_table_labels,
            insert_section_labels,
            insert_cite_labels,
            replace_references,
            replace_cite_references,
            inline_footnotes,
    ]:
        doc['blocks'] = walk(doc['blocks'], action, fmt, meta)

    for action in [
            add_http_to_links,
            wrap_urls_in_anchors,
            replace_references,
            replace_cite_references,
            inline_footnotes,
    ]:
        if 'title' in doc['meta']:
            doc['meta']['title'] = walk(doc['meta']['title'], action, fmt, meta)
        if 'author' in doc['meta']:
            doc['meta']['author'] = walk(doc['meta']['author'], action, fmt, meta)
        if 'abstract' in doc['meta']:
            doc['meta']['abstract'] = walk(doc['meta']['abstract'], action, fmt, meta)

    if 'date' in doc['meta']:
        del doc['meta']['date']

    # Save filtered AST for debugging
    with open('pandoc-ast-filtered.json', 'w') as f:
        json.dump(doc, f)

    json.dump(doc, sys.stdout)
    sys.stdout.flush()


if __name__ == '__main__':
    main()
