from setuptools import setup
from pip.req import parse_requirements

with open('requirements.txt') as f:
    install_requires = f.read().splitlines()

setup(
    name="engrafo_pandocfilter",
    packages=[
        'engrafo_pandocfilter',
    ],
    install_requires=install_requires,
    entry_points={
        'console_scripts': [
            'engrafo_pandocfilter=engrafo_pandocfilter.main:main',
        ],
    },
)
