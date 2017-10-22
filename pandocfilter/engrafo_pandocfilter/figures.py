from pandocfilters import Span, Div, Para


def make_figures(key, val, fmt, meta):
    """
    Turn <p><img alt="some caption"><img></p> into
    <div class="engrafo-figure"><img><img>
    <span class="engrafo-figcaption">some caption</span></div>
    """
    if key != 'Para' or not val:
        return
    children = [c for c in val if c['t'] == 'Image']
    if not children:
        return
    # Pick first child's caption to be the caption. This is because pandoc
    # gives each image in a figure the same caption.
    alt = children[0]['c'][1]
    # Pandoc sets alt text to "image" if there is none
    if alt and alt != [{u'c': u'image', u't': u'Str'}]:
        children.append(Span(['', ['engrafo-figcaption'], []], alt))
    # Pandoc requires that a Div has a Para in it, so insert a single Para to
    # wrap all the children
    return Div(['', ['engrafo-figure'], []], [Para(children)])
