import glob
import os
import re
import sys
import argparse
from nbconvert.exporters import MarkdownExporter
from nbformat import read

# Setup argument parser
parser = argparse.ArgumentParser()
parser.add_argument("-f", "--file", help="File path of the .ipynb file to convert")
args = parser.parse_args()

ipynb_files = []

# If file path is given as an argument, use it
if args.file:
    if os.path.isfile(args.file):
        ipynb_files.append(args.file)
    else:
        print(f"Error: File '{args.file}' does not exist.")
        sys.exit(1)
# Otherwise, default to original glob behaviour
else:
    ipynb_files = glob.glob('guides/**/*.ipynb', recursive=True)

markdown_exporter = MarkdownExporter()
ansi_escape = re.compile(r'\x1b\[[0-9;]*m')

for filepath in ipynb_files:
    with open(filepath, 'r') as f:
        notebook_node = read(f, as_version=4)
        (body, resources) = markdown_exporter.from_notebook_node(notebook_node)

    body = ansi_escape.sub('', body)
    md_filepath = filepath.rsplit('.', 1)[0] + '.md'
    with open(md_filepath, 'w') as f:
        f.write(body)
