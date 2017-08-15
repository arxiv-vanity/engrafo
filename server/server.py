# -*- coding: utf-8 -*-

import re
import json
import base64
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

from feedback import Feedback

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
    'debug_panels.PDFDebugPanel',
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


def _get_latex_path_from_output(output):
    text = "Rendering tex file "
    for line in output.split('\n'):
        if line.startswith(text):
            return line[len(text):]


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

    try:
        html_path, stdout, stderr = convert_latex_to_html(folder, pandoc_only=pandoc_only)
    except PandocError as e:
        return Response('''Engrafo failed to convert LaTeX (error code %d)

stdout:
%s

stderr:
%s

%s:
%s
''' % (e.returncode,
       e.stdout,
       e.stderr,
       e.error_filename,
       e.latex_source),
                        mimetype='text/plain',
                        status=400)

    with open(html_path) as f:
        response = make_response(f.read())
    response.engrafo_debug_data = {
        'render_directory': folder,
        'latex_path': _get_latex_path_from_output(stdout),
        'stdout': stdout,
        'stderr': stderr,
    }
    return response


@app.route('/html/<arxiv_id>/<path:filename>')
def paper_static(arxiv_id, filename):
    folder = get_folder(arxiv_id)
    return send_from_directory(folder, filename)


@app.route('/bug-report', methods=['POST'])
def bug_report():
    data = request.form
    arxiv_id = data['arxivId']
    jpg_data_b64 = data.get('jpgData')
    if jpg_data_b64:
        jpg_data = base64.b64decode(jpg_data_b64)
    else:
        jpg_data = None
    text = request.form['text']

    # TODO: this properly
    github_access_token = open('github-access-token.txt').read().strip()
    feedback = Feedback(github_access_token)
    issue_url = feedback.create_issue(arxiv_id, text, jpg_data)

    return jsonify({'issue_url': issue_url})


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


def convert_latex_to_html(folder, pandoc_only=False):
    timeout = 30

    html_path = os.path.join(folder, 'index.html')

    cmd = [
        'timeout',
        '%d' % timeout,
        os.path.join(ENGRAFO_PATH, 'bin/engrafo'),
        folder
    ]

    # TODO(bfirsh): move pandoc_only to engrafo itself
    # if pandoc_only:
    #     cmd += [
    #         'pandoc',
    #         '--from', 'latex+raw_tex+latex_macros',
    #         '--to', 'html',
    #         '--mathjax',
    #         '--standalone',
    #         '--output', html_path,
    #         latex_path
    #     ]

    process = subprocess.Popen(
        cmd, cwd=folder, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = process.communicate()
    stdout = stdout.decode('utf-8')
    stderr = stderr.decode('utf-8')

    if process.returncode != 0:

        error_path = _get_latex_path_from_output(stdout)

        if process.returncode in (129, 124):
            message = 'Timed out after %d seconds' % timeout

        else:
            message = 'Pandoc failed to convert LaTeX'
            error_match = re.search(r'Error at "(.+)" \(line ', stderr)
            if error_match:
                error_filename = error_match.group(1)
                if error_filename != 'source':
                    error_path = os.path.join(folder, error_filename)

        latex_source = ''
        if error_path:
            with open(error_path) as f:
                latex_source = ''.join(
                    ['%04d  %s' % (i + 1, line)
                     for i, line in enumerate(f.readlines())])
            latex_source = latex_source.decode('utf-8')
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
