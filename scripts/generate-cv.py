"""Publish the exact owner-approved Application PDF, without re-typesetting it.

The filename is retained for compatibility with earlier local instructions.
No CV prose or layout is generated from JSON. The approved source and SHA-256
are selected explicitly in src/data/cv.json. Requires only Python's standard
library; ordinary website builds use the equivalent Node asset check.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import tempfile

ROOT = Path(__file__).resolve().parents[1]


def approved_pdf():
    document = json.loads((ROOT / 'src/data/cv.json').read_text())['document']
    if document.get('kind') != 'owner-approved-pdf':
        raise ValueError('CV must select an owner-approved PDF; automatic typesetting is disabled.')
    if document.get('publicPath') != '/cv.pdf' or document.get('pageCount') != 1:
        raise ValueError('The approved Application CV must be the one-page /cv.pdf.')
    digest = document.get('sha256', '')
    if not re.fullmatch(r'[a-f0-9]{64}', digest):
        raise ValueError('The approved PDF needs an explicit SHA-256.')
    source = (ROOT / document['source']).resolve()
    if not source.is_relative_to(ROOT / 'assets/cv'):
        raise ValueError('The approved PDF source must be inside assets/cv/.')
    data = source.read_bytes()
    if not data.startswith(b'%PDF-') or hashlib.sha256(data).hexdigest() != digest:
        raise ValueError('Approved source PDF does not match its recorded SHA-256; nothing was published.')
    return data, digest


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Verify the public PDF without modifying files.')
    args = parser.parse_args()
    data, digest = approved_pdf()
    output = ROOT / 'public/cv.pdf'
    if output.is_symlink():
        raise ValueError('public/cv.pdf must be a regular file, not a symlink.')
    if output.exists() and output.read_bytes() == data:
        print(f'Approved Application PDF verified: {digest}')
        return
    if args.check:
        raise ValueError('public/cv.pdf differs from the approved Application PDF; run this script without --check to restore it.')
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(dir=output.parent, prefix='.cv-', suffix='.pdf', delete=False) as stream:
            temporary = Path(stream.name)
            stream.write(data)
        temporary.chmod(0o644)
        os.replace(temporary, output)
    finally:
        if temporary is not None and temporary.exists():
            temporary.unlink()
    print(f'Published exact approved Application PDF: {digest}')


if __name__ == '__main__':
    main()
