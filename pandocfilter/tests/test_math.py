import unittest
from engrafo_pandocfilter.math import replace_smallcaps
from pandocfilters import Math

class MathTestCase(unittest.TestCase):
    def test_replace_smallcaps(self):
        result = replace_smallcaps('Math', [
            {'t': 'DisplayMath'}, '\\text{\\textsc{3CosAdd} }'])
        self.assertEqual(result, Math(
            {'t': 'DisplayMath'},
            '\\text{\\rm{3C{\small OS}A{\small DD}} }'))
