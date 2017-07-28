# -*- coding: utf-8 -*-

import re
import json
import requests
import logging
from werkzeug.exceptions import BadRequest
from glob import glob
import subprocess
import os
import urllib

from flask import (
    Flask, session, redirect, url_for, request, render_template, g, jsonify,
    send_from_directory, Response
)

app = Flask(__name__, static_url_path='', static_folder='static')
app.logger.setLevel(logging.DEBUG)


PAPERS_PATH = 'papers'


@app.route('/')
def index():
    #text = requests.get('http://arxiv-sanity.com').text
    with open('arxiv-sanity-snapshot.html') as f:
        text = f.read()
    papers = json.loads([line for line in text.splitlines()
                       if line.startswith('var papers = ')][0][len('var papers = '):-1])

    return render_template('index.html', papers=papers)


@app.route('/html/<arxiv_id>/')
def html(arxiv_id):
    folder = get_folder(arxiv_id)
    app.logger.info('%s: Using folder %s', arxiv_id, folder)
    if not os.path.exists(folder):
        os.makedirs(folder)
        app.logger.info('%s: Downloading sources', arxiv_id)
        download_sources(folder, arxiv_id)
        app.logger.info('%s: Extracting sources', arxiv_id)
        extract_sources(folder)
    app.logger.info('%s: Converting to HTML', arxiv_id)
    try:
        html_path = convert_latex_to_html(folder)
    except PandocError as e:
        return Response('''Pandoc failed to convert LaTeX (error code %d)

stdout:
%s

stderr:
%s

%s:
%s
''' % (e.returncode, e.stdout, e.stderr, e.error_filename, e.latex_source.decode('utf-8')),
                        mimetype='text/plain',
                        status=400)

    with open(html_path) as f:
        return f.read()


@app.route('/html/<arxiv_id>/<path:filename>')
def paper_static(arxiv_id, filename):
    folder = get_folder(arxiv_id)
    return send_from_directory(folder, filename)


def get_folder(arxiv_id):
    return os.path.abspath(os.path.join(PAPERS_PATH, arxiv_id))


def download_sources(folder, arxiv_id):
    url = 'https://arxiv.org/e-print/%s' % arxiv_id
    path = os.path.join(folder, 'tarball.tar.gz')
    urllib.urlretrieve(url, path)


def extract_sources(folder):
    path = os.path.join(folder, 'tarball.tar.gz')
    app.logger.debug(subprocess.check_output(
        ['tar', 'xzvf', path],
        cwd=folder))


def pick_latex_path(latex_paths):
    if len(latex_paths) == 1:
        return latex_paths[0]

    candidates = []
    for path in latex_paths:
        with open(path) as f:
            if r'\documentclass' in f.read():
                candidates.append(path)

    if len(candidates) != 1:
        raise BadRequest('Ambiguous LaTeX path, len candidates: %d' % len(candidates))

    return candidates[0]


def convert_latex_to_html(folder):
    main_path = os.path.join(folder, 'main.tex')
    if os.path.exists(main_path):
        latex_path = main_path
    else:
        latex_paths = glob('%s/*.tex' % folder)
        latex_path = pick_latex_path(latex_paths)

    html_path = os.path.join(folder, 'index.html')

    cmd = [
        'pandoc',
        '--from', 'latex+raw_tex-latex_macros',
        '--to', 'html',
        '--mathjax',
        '--standalone',
        '--filter', 'engrafo_pandocfilter',
        '--output', html_path,
        latex_path
    ]
    process = subprocess.Popen(
        cmd, cwd=folder, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = process.communicate()

    if process.returncode != 0:

        error_match = re.search(r'Error at "(.+)" \(line ', stderr)
        error_path = latex_path
        if error_match:
            error_filename = error_match.group(1)
            if error_filename != 'source':
                error_path = os.path.join(folder, error_filename)

        with open(error_path) as f:
            latex_source = ''.join(
                ['%04d  %s' % (i + 1, line)
                 for i, line in enumerate(f.readlines())])
        raise PandocError(process.returncode, stdout, stderr,
                          error_path, latex_source)

    return html_path


class PandocError(Exception):

    def __init__(self, returncode, stdout, stderr, error_filename, latex_source):
        super(PandocError, self).__init__(self, 'Pandoc failed to convert LaTeX')
        self.returncode = returncode
        self.stdout = stdout
        self.stderr = stderr
        self.error_filename = error_filename
        self.latex_source = latex_source


if __name__ == '__main__':
    if not os.path.exists(PAPERS_PATH):
        os.makedirs(PAPERS_PATH)
    app.run(host='0.0.0.0', port=8010, debug=True, threaded=True)
