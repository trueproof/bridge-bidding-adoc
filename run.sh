#!/bin/bash

npm start

while inotifywait -e modify ./src/*.adoc; do
  npm start
done
