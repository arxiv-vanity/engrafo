from pandocfilters import Math
import re
import sys

TEXTSC_REGEX = re.compile(r'\\text\{\\textsc\{([^\}]+)\} +?\}')
LOWER_REGEX = re.compile(r'[a-z]+')


def _lower_replace(match):
    return '{\small %s}' % match.group(0).upper()


def _textsc_replace(match):
    return '\\rm{%s}' % LOWER_REGEX.sub(_lower_replace, match.group(1))


def replace_smallcaps(key, val, fmt=None, meta=None):
    """
    Replaces \textsc with a hack that has the same effect.

    https://stackoverflow.com/questions/11576237/mathjax-textsc
    """
    if key != 'Math':
        return

    print >>sys.stderr, val[1]

    latex = val[1]
    latex = TEXTSC_REGEX.sub(_textsc_replace, latex)
    return Math(val[0], latex)
