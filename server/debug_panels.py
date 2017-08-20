import flask
from flask_debugtoolbar.panels import DebugPanel
from flask import render_template
import json
import pprint
import os.path


class LatexSourceDebugPanel(DebugPanel):
    name = 'latex-source'
    has_content = True

    def title(self):
        return 'LaTeX source'

    def nav_title(self):
        return self.title()

    def url(self):
        return ''

    def process_response(self, request, response):
        debug_data = getattr(response, 'engrafo_debug_data', {})
        self.latex_path = debug_data.get('latex_path')

    def content(self):
        if not self.latex_path:
            return 'Nothing rendered.'
        try:
            with open(self.latex_path) as f:
                src = f.read().decode('utf-8')
        except IOError:
            return 'Could not find latex source.'
        return u'<pre style="white-space: pre-wrap">%s</pre>' % flask.escape(src)


class PandocDebugPanel(DebugPanel):
    name = 'pandoc'
    has_content = True
    ast_filename = 'pandoc-ast.json'

    def title(self):
        return 'Pandoc AST (before filtering)'

    def nav_title(self):
        return self.title()

    def url(self):
        return ''

    def process_response(self, request, response):
        debug_data = getattr(response, 'engrafo_debug_data', {})
        self.render_directory = debug_data.get('render_directory')

    def content(self):
        if not self.render_directory:
            return 'Nothing rendered.'
        path = os.path.join(self.render_directory, self.ast_filename)
        try:
            with open(path) as f:
                ast = json.load(f)
        except IOError:
            return 'Could not find AST.'
        # pprint is much more readable than json.dump
        ast_pprint = pprint.pformat(ast)
        # HACK: remove u''. Either do something more clever or upgrade to py3
        ast_pprint = ast_pprint.replace(u"u'", u"'")
        ast_json = json.dumps(ast, sort_keys=True,
                              indent=4, separators=(',', ': '))
        return render_template('debug-panels/pandoc.html',
                               ast_pprint=ast_pprint, ast_json=ast_json)


class PandocFilteredDebugPanel(PandocDebugPanel):
    name = 'pandoc-filtered'
    ast_filename = 'pandoc-ast-filtered.json'

    def title(self):
        return 'Pandoc AST (after filtering)'


class EngrafoOutputDebugPanel(DebugPanel):
    name = 'engrafo-output'
    has_content = True

    def title(self):
        return 'Engrafo console output'

    def nav_title(self):
        return self.title()

    def url(self):
        return ''

    def process_response(self, request, response):
        debug_data = getattr(response, 'engrafo_debug_data', {})
        self.stdout = debug_data.get('stdout')
        self.stderr = debug_data.get('stderr')

    def content(self):
        if self.stdout is None:
            return 'Nothing rendered.'
        return '<h3>stdout</h3><pre style="white-space: pre-wrap">%s</pre><h3>stderr</h3><pre style="white-space: pre-wrap">%s</pre>' % (flask.escape(self.stdout), flask.escape(self.stderr))


class PDFDebugPanel(DebugPanel):
    name = 'pdf'
    has_content = True

    def title(self):
        return 'PDF output'

    nav_title = title

    def process_response(self, request, response):
        self.arxiv_id = request.view_args.get('arxiv_id')

    def content(self):
        if not self.arxiv_id:
            return
        url = 'https://arxiv.org/pdf/' + self.arxiv_id
        return '<a href="{url}">{url}</a><iframe src="{url}" style="width: 100%; height: 100%">'.format(url=url)

    def url(self):
        return ''
