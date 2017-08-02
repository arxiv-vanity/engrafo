from pandocfilters import LineBreak, Span


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
