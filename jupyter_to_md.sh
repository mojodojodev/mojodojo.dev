cd guides && jupyter nbconvert --to markdown **/**/*.ipynb && \
# Get rid of ANSI escapes
for file in **/**/*.md; do
    sed -i -e 's/\x1b\[[0-9;]*m//g' "$file"
done
