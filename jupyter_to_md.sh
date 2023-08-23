#!/bin/bash

# Makes ** run through all files in current directory and nested directories
shopt -s globstar

cd guides
jupyter nbconvert --to markdown **/*.ipynb


# Get rid of ANSI escapes
for file in **/*.md; do
    sed -i -e 's/\x1b\[[0-9;]*m//g' "$file"
done
