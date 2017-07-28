from setuptools import setup

setup(
    name="engrafo_pandocfilters",
    packages=[
        'engrafo_pandocfilter',
    ],
    install_requires=[
        'pandocfilters==1.4.1',
    ],
    entry_points={
        'console_scripts': [
            'engrafo_pandocfilter=engrafo_pandocfilter.engrafo_pandocfilter:main',
        ],
    },
)
