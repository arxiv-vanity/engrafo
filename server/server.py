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
import random

from flask import (
    Flask, session, redirect, url_for, request, render_template, g, jsonify,
    send_from_directory, Response, make_response
)
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__, static_url_path='', static_folder='static')
app.logger.setLevel(logging.DEBUG)
app.debug = True
app.config['SECRET_KEY'] = 'unsafe-for-development'
app.config['DEBUG_TB_PANELS'] = [
    'flask_debugtoolbar.panels.timer.TimerDebugPanel',
    'debug_panels.LatexSourceDebugPanel',
    'debug_panels.PandocDebugPanel',
    'debug_panels.PandocFilteredDebugPanel',
    'debug_panels.EngrafoOutputDebugPanel',
]
toolbar = DebugToolbarExtension(app)

CURRENT_PATH = os.path.dirname(os.path.realpath(__file__))
ENGRAFO_PATH = os.path.realpath(os.path.join(CURRENT_PATH, '..'))
PAPERS_PATH = 'papers'


@app.route('/')
def index():
    data = request.args.get('data', 'cached')
    pandoc_only = 'pandoc_only' in request.args
    if data == 'live':
        text = requests.get('http://arxiv-sanity.com').text
    elif data == 'top':
        with open('arxiv-sanity-snapshots/top-20170727.html') as f:
            text = f.read()
    else:
        with open('arxiv-sanity-snapshots/live-20170727.html') as f:
            text = f.read()
    papers = json.loads([line for line in text.splitlines()
                       if line.startswith('var papers = ')][0][len('var papers = '):-1])
    #random.shuffle(papers)

    # TODO: fix parse errors in these papers.
    # for now, omit them so we can focus on fixing pandocfilter errors
    known_non_parsing_papers = set([
        '1609.01704v7',
        '1607.06450v1',
        '1608.05343v2',
        '1602.05179v5',
        '1608.08225v3',
        '1612.08810v3',
        '1606.00704v3',
        '1702.07825v2',
    ])
    papers = [p for p in papers if p['pid'] not in known_non_parsing_papers]

    return render_template(
        'index.html', papers=papers, pandoc_only=pandoc_only)


@app.route('/html/<arxiv_id>/')
def html(arxiv_id):
    pandoc_only = 'pandoc_only' in request.args
    folder = get_folder(arxiv_id)
    app.logger.info('%s: Using folder %s', arxiv_id, folder)
    if not os.path.exists(folder):
        os.makedirs(folder)
        app.logger.info('%s: Downloading sources', arxiv_id)
        download_sources(folder, arxiv_id)
        app.logger.info('%s: Extracting sources', arxiv_id)
        extract_sources(folder)
    app.logger.info('%s: Converting to HTML', arxiv_id)

    latex_path = pick_latex_path(folder)

    try:
        html_path, stdout, stderr = convert_latex_to_html(latex_path, pandoc_only=pandoc_only)
    except PandocError as e:
        return Response('''Engrafo failed to convert LaTeX (error code %d)

stdout:
%s

stderr:
%s

%s:
%s
''' % (e.returncode,
       e.stdout.decode('utf-8'),
       e.stderr.decode('utf-8'),
       e.error_filename.decode('utf-8'),
       e.latex_source.decode('utf-8')),
                        mimetype='text/plain',
                        status=400)

    with open(html_path) as f:
        response = make_response(f.read())
    response.engrafo_debug_data = {
        'render_directory': folder,
        'latex_path': latex_path,
        'stdout': stdout,
        'stderr': stderr,
    }
    return response


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


def pick_latex_path(folder):
    main_path = os.path.join(folder, 'main.tex')
    ms_path = os.path.join(folder, 'ms.tex')
    if os.path.exists(ms_path):
        return ms_path
    elif os.path.exists(main_path):
        return main_path
    else:
        latex_paths = glob('%s/*.tex' % folder)

    if len(latex_paths) == 1:
        return latex_paths[0]

    candidates = []
    for path in latex_paths:
        with open(path) as f:
            if r'\documentclass' in f.read():
                candidates.append(path)

    if candidates > 1:
        bbl_candidates = []
        for path in candidates:
            if os.path.exists(path.replace('.tex', '.bbl')):
                bbl_candidates.append(path)
        candidates = bbl_candidates

    if len(candidates) != 1:
        raise BadRequest('Ambiguous LaTeX path, len candidates: %d' % len(candidates))

    return candidates[0]


def convert_latex_to_html(latex_path, pandoc_only=False):
    timeout = 30

    folder = os.path.dirname(latex_path)

    html_path = os.path.join(folder, 'index.html')

    cmd = [
        'timeout',
        '%d' % timeout,
    ]
    if pandoc_only:
        cmd += [
            'pandoc',
            '--from', 'latex+raw_tex+latex_macros',
            '--to', 'html',
            '--mathjax',
            '--standalone',
            '--output', html_path,
            latex_path
        ]
    else:
        cmd += [
            os.path.join(ENGRAFO_PATH, 'bin/engrafo'),
            latex_path
        ]
    process = subprocess.Popen(
        cmd, cwd=folder, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = process.communicate()

    if process.returncode != 0:

        error_path = latex_path

        if process.returncode in (129, 124):
            message = 'Timed out after %d seconds' % timeout

        else:
            message = 'Pandoc failed to convert LaTeX'
            error_match = re.search(r'Error at "(.+)" \(line ', stderr)
            if error_match:
                error_filename = error_match.group(1)
                if error_filename != 'source':
                    error_path = os.path.join(folder, error_filename)

        with open(error_path) as f:
            latex_source = ''.join(
                ['%04d  %s' % (i + 1, line)
                 for i, line in enumerate(f.readlines())])
        raise PandocError(message, process.returncode, stdout, stderr,
                          error_path, latex_source)

    return html_path, stdout, stderr


class PandocError(Exception):

    def __init__(self, message, returncode, stdout, stderr, error_filename, latex_source):
        super(PandocError, self).__init__(self, message)
        self.returncode = returncode
        self.stdout = stdout
        self.stderr = stderr
        self.error_filename = error_filename
        self.latex_source = latex_source


if __name__ == '__main__':
    if not os.path.exists(PAPERS_PATH):
        os.makedirs(PAPERS_PATH)
    app.run(host='0.0.0.0', port=8010, threaded=True)
