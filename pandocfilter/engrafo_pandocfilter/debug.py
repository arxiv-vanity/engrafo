import sys

def log(*s):
    sys.stderr.write('%s\n' % ', '.join(['%s' % x for x in s]))
