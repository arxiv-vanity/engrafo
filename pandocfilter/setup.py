from setuptools import setup
from pip.req import parse_requirements

install_reqs = parse_requirements('requirements.txt')

setup(
    name="engrafo_pandocfilter",
    packages=[
        'engrafo_pandocfilter',
    ],
    install_requires=[str(ir.req) for ir in install_reqs],
    entry_points={
        'console_scripts': [
            'engrafo_pandocfilter=enfrafo_pandocfilter.main:main',
        ],
    },
)
