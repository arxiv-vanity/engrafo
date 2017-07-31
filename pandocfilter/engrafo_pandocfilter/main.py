# -*- coding: utf-8 -*-

import os
import uuid
import subprocess
import re
import string
from collections import namedtuple
import sys
import json
from pandocfilters import (
    Image, Math, Str, Space, Para, Span, walk, Link,
    Header, Table, Div, LineBreak
)


_logfile = None
def log(*s):
    global _logfile
    if _logfile is None:
        _logfile = open('debug.log', 'w')
    _logfile.write('%s\n' % ', '.join(['%s' % x for x in s]))


PDF_REGEX = re.compile(r'^(.+)\.pdf$')
REF_REGEX = re.compile(r'^ref\{([^\}]+)\}$')
LABEL_REGEX = re.compile(r'\\label\{([^\}]+)\}')

# - State
# Label indexes
label_map = {}
# Section position state for generating section numbers
sec_lengths = [0] * 10
is_appendix = False


Label = namedtuple('Label', [
    'name', 'index', 'abbreviation', 'prepend_name'
])


def next_label_index(name):
    indices = [label.index for label in label_map.values()
               if label.name == name]
    return max(indices) + 1 if indices else 1


def insert_figure_labels(key, val, fmt, meta):
    '''
    Insert "Figure 3: " style labels before figure captions
    and wrap in span with id=figure-3 etc.
    '''
    if key == 'Image':
        alt = val[1]
        for i, obj in enumerate(alt):
            if obj['t'] == 'Span':
                span_val = obj['c'][0][2]
                if (len(span_val) == 1
                    and len(span_val[0]) == 2
                    and span_val[0][0] == 'data-label'):
                    label = span_val[0][1]
                    index = next_label_index('figure')

                    label_map[label] = Label(
                        name='figure',
                        index=index,
                        abbreviation='fig.',
                        prepend_name=True
                    )

                    span_index = i
                    alt.pop(span_index)
                    alt.insert(0, Str('Figure %d: ' % index))

                    children = [
                        Image(*val),
                        Span(['', ['engrafo-figcaption'], []], alt)
                    ]

                    return Span(['figure-%d' % index, ['engrafo-figure'], []],
                                children)


def insert_table_labels(key, val, fmt, meta):
    '''
    Insert "Table 3:" style prefixes before table captions
    and wrap in span with id=table-3 etc.
    '''
    if key == 'Table':
        caption = val[0]
        for i, obj in enumerate(caption):
            if obj['t'] == 'Span':
                span_val = obj['c'][0][2]
                if (len(span_val) == 1
                    and len(span_val[0]) == 2
                    and span_val[0][0] == 'data-label'):
                    label = span_val[0][1]
                    index = next_label_index('table')

                    label_map[label] = Label(
                        name='table',
                        index=index,
                        abbreviation='tab.',
                        prepend_name=True
                    )

                    span_index = i
                    caption.pop(span_index)
                    caption.insert(0, Str('Table %d: ' % index))
                    return Div(
                        ['table-%d' % index, ['engrafo-table'], []],
                        [Table(*val)]
                    )


def process_display_math(key, val, fmt, meta):
    """
    Block-level math is inside paragraphs for some reason, so split the
    paragraph and pull out into a div.
    """
    if key != 'Para' or not val:
        return
    paras = []
    last_math_index = 0
    for i, child in enumerate(val):
        if child['t'] == 'Math' and child['c'][0]['t'] == 'DisplayMath':
            # This filter doesn't seem to work if it follows this filter in
            # walk, so let's just call it from here
            equation_id, new_children = insert_equation_labels(child['c'])

            paras.append(Para(val[last_math_index:i]))
            paras.append(Div([equation_id, ['engrafo-equation'], []],
                             [Para(new_children)]))
            last_math_index = i + 1
    if last_math_index == 0:
        return
    paras.append(Para(val[last_math_index:]))
    return paras


def insert_equation_labels(val):
    '''
    Insert equation numbers as strings after equations. Returns the ID
    of the equation and its new children.
    '''
    latex = val[1]
    match = LABEL_REGEX.search(latex)
    if match:
        val[1] = val[1].replace(match.group(0), '')
        label = match.group(1)
        index = next_label_index('equation')

        label_map[label] = Label(
            name='equation',
            index=index,
            abbreviation=None,
            prepend_name=False
        )
        equation_id = 'equation-%d' % index
        number = Span(['', ['engrafo-equation-number'], []],
                      [Str('(%d)' % index)])
        return equation_id, [Math(*val), number]
    return '', [Math(*val)]


def insert_section_labels(key, val, fmt, meta):
    '''
    Insert section labels for headings like
    1 This is a top level heading
    1.1 This is a subsection
    A This is a top-level appendix
    A.1 This is an appendix subheader
    etc.

    Also inserts a dummy div with id=appendix-below before the appendix.
    '''

    global is_appendix

    if key == 'RawBlock' and val[1] == r'\appendix':
        is_appendix = True
        sec_lengths[0] = 0

        return Div(['engrafo-appendix-below', [], []], [])

    if key == 'Header':
        level, attrs, children = val

        unnumbered = 'unnumbered' in val[1][1]

        label = attrs[0]
        sec_lengths[level - 1] += 1
        sec_lengths[level:] = [0] * (len(sec_lengths) - level)

        if is_appendix:
            # appendix: h1 is alpha
            sec_number = '.'.join(
                [chr(x + ord('A') - 1) if i == 0 else str(x)
                 for i, x in enumerate(sec_lengths[:level])])
        else:
            sec_number = '.'.join([str(x) for x in sec_lengths[:level]])

        if label and label not in label_map:
            label_map[label] = Label(
                name='appendix' if is_appendix else 'section',
                index=sec_number,
                abbreviation='appendix' if is_appendix else 'sec.',
                prepend_name=True
            )

        if not unnumbered:
            span = Span(['', ['section-number'], []], [Str(sec_number)])
            children = [span, Space()] + children
        attrs[0] = 'section-%s' % sec_number.lower()

        # Decrease levels one more than Pandoc outputs (<h1> -> <h2>)
        level += 1

        return Header(level, attrs, children)


def make_explicit_figure_captions(key, val, fmt, meta):
    '''
    Lift image captions out from alt text to a span.
    '''
    if key == 'Image':
        caption = val[1]
        return [
            Image(*val),
            Span(['', ['figure-caption'], []], caption),
        ]


def replace_references(key, val, fmt, meta):
    '''
    Replace

    [Str("Foo"), Space(), RawInLine("latex", "figref")]
    with
    [Str("Foo"), Space(), Link([Str("Figure"), Space(), Str("7")])]

    and

    [Str("Figure"), Space(), RawInLine("latex", "figref")]
    with
    [Link([Str("Figure"), Space(), Str("7")])]

    also works with abbreviations.
    '''

    if isinstance(val, list):
        altered = []
        for i, obj in enumerate(val):
            new_objs = [obj]
            if (isinstance(obj, dict)
                and obj['t'] == 'RawInline'
                and obj['c'][0] == 'latex'):

                label = match_ref(obj['c'][1])
                if label and label in label_map:
                    name, index, abbreviation, prepend_name = label_map[label]
                    prev = val[i - 1] if i > 0 else None
                    prevprev = val[i - 2] if i > 1 else None

                    new_objs = []

                    # handle "Table ", "(Table" etc.
                    if (prepend_name
                        and prevprev and prev['t'] == 'Space'
                        and 'c' in prevprev and prevprev['t'] == 'Str'):
                        prevprev_lower = prevprev['c'].lower()
                        for needle in [name, abbreviation]:
                            if prevprev_lower.endswith(needle):
                                altered = altered[:-2]
                                prefix = prevprev_lower[:-len(needle)]
                                if prefix:
                                    new_objs.append(Str(prefix))

                    # hack around bug in pandoc where non-breaking space doesn't tokenize properly
                    if (prepend_name
                        and prev['t'] == 'Str'
                        and prev['c'].replace(u'\xa0', ' ').strip().lower() in (name, abbreviation)):
                        altered = altered[:-1]

                    link_content = []

                    if prepend_name:
                        link_content += [
                            Str(string.capwords(name)),
                            Space(),
                        ]

                    link_content.append(Str('%s' % index))
                    new_objs += [Link(['', [], []], link_content,
                                     ['#%s-%s' % (name, index), ''])]

            altered += new_objs

        return {'t': key, 'c': altered}


def tikz2image(tikz_src, prefix):
    '''
    Render tikzpicture as SVG.
    '''
    try:
        tex_filename = '%s.tex' % prefix
        pdf_filename = '%s.pdf' % prefix
        svg_filename = '%s.svg' % prefix
        with open(tex_filename, 'w') as f:
            f.write('''\\documentclass{standalone}
                     \\usepackage{tikz}
                     \\usetikzlibrary{shapes}
                     \\begin{document}
                     ''')
            f.write(tikz_src)
            f.write('\n\\end{document}\n')
        try:
            subprocess.check_output(
                ['pdflatex', '-interaction=nonstopmode', tex_filename])
        except subprocess.CalledProcessError as e:
            # an actual error occurred
            if "Fatal error occurred" in e.output:
                print >>sys.stderr, e.output
                raise
            # pdflatex tends to return 1 regardless
            pass
        pdf2svg(pdf_filename, svg_filename)
    finally:
        for filename in [
                tex_filename, pdf_filename,
                '%s.aux' % prefix, '%s.log' % prefix]:
            if os.path.exists(filename):
                os.remove(filename)


def replace_tikz_images(key, val, fmt, meta):
    '''
    Replace tikzpictures with SVGs and change the div format
    generated by our pandoc fork to match that of images.
    '''

    if (key == 'Div'
        and 'tikzpicture' in val[0][1]
        and val[1]
        and val[1][0]
        and isinstance(val[1][0], dict)
        and val[1][0]['t'] == 'RawBlock'):
        code = val[1][0]['c'][1]

        if re.match(r'\\begin\{tikzpicture\}', code):
            prefix = 'tikz-%s' % str(uuid.uuid4())
            svg_filename = '%s.svg' % prefix
            tikz2image(code, prefix)

            if len(val[1]) > 1:
                caption = val[1][1]['c']
            else:
                caption = []

            return Para([Image(['', [], []], caption, [svg_filename, ''])])


def replace_pdf_images(key, val, fmt, meta):
    '''
    Replace PDFs with SVGs.
    '''
    if key == 'Image':
        image_path = val[2][0]
        match = PDF_REGEX.match(image_path)
        if match:
            prefix = match.group(1)
            svg_path = '%s.svg' % prefix
            pdf2svg(image_path, svg_path)
            val[2][0] = svg_path
            return Image(*val)


def pdf2svg(src, dest):
    subprocess.check_output([
        'pdf2svg',
        src,
        dest,
    ])


def flatten_blocks(elements):
    """
    Flatten blocks into line breaks so that it is an inline element.
    """
    result = []
    for element in elements:
        # Insert line breaks between elements
        if result:
            result.extend([LineBreak(), LineBreak()])
        result.extend(element['c'])
    return result


def inline_footnotes(key, val, fmt, meta):
    """
    Replace Pandoc footnotes with spans so we can post-process into Distill
    footnotes.
    """
    if key == 'Note':
        return Span(['', ['engrafo-footnote'], []], flatten_blocks(val))


def match_ref(s):
    match = REF_REGEX.search(s)
    if match:
        return match.group(1)
    return None


def match_label(s):
    match = LABEL_REGEX.search(s)
    if match:
        return match.group(1)
    return None


def main():
    doc = json.loads(sys.stdin.read())
    blocks = doc['blocks']
    meta = doc['meta']
    fmt = 'latex'

    altered = blocks

    for action in [
            process_display_math,
            replace_pdf_images,
            replace_tikz_images,
            insert_figure_labels,
            insert_table_labels,
            insert_section_labels,
            make_explicit_figure_captions,
            replace_references,
            inline_footnotes,
    ]:
        altered = walk(altered, action, fmt, meta)

    doc['blocks'] = altered

    json.dump(doc, sys.stdout)
    sys.stdout.flush()


if __name__ == '__main__':
    main()
