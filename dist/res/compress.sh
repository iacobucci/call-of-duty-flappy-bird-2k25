#!/bin/zsh
for f in $(ls | grep .png);
do
	magick "$f" -quality 50 -define webp:lossless=false "${f%.*}.webp"
	rm $f
done
