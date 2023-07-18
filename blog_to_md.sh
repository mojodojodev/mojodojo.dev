#!/bin/bash
# Converts any Jupyter notebooks in the `blog` folder to markdown.
# When a jupyter notebook has generated images `nbconvert` puts them in a folder named
# [filename]_files, this script moves them to the root of the website and edits
# the markdown to change the image links

cd blog

for i in *.ipynb
do
  # remove the extension from filename
  filename="${i%.*}"
  
  # convert ipynb to md
  jupyter nbconvert --to markdown $i

  # move generated images to root of website
  if [ -d "${filename}_files" ]; then
    mv "${filename}_files"/* ../.vuepress/public/
  fi
  
  # edit the .md file to reference images at root
  if [ -f "${filename}.md" ]; then
    sed -i -r "s|!\[png\]\(${filename}_files/|![png](/|g" "${filename}.md"
  fi

    # remove the now empty folder
  rm -r "${filename}_files"
done
