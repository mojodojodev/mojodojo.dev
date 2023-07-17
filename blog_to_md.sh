#!/bin/bash
cd blog
for i in *.ipynb
do
  # remove the extension
  filename="${i%.*}"
  
  # convert ipynb to md
  jupyter nbconvert --to markdown $i

  # move generated files
  if [ -d "${filename}_files" ]; then
    mv "${filename}_files"/* ../.vuepress/public/
  fi
  
  # edit the .md file
  if [ -f "${filename}.md" ]; then
    sed -i -r "s|!\[png\]\(${filename}_files/|![png](/|g" "${filename}.md"
  fi

  rm -r "${filename}_files"
done
