# Bridge bidding system generator

This package generates bridge bidding systems in html from adoc.

Requires [Node.js](https://nodejs.org/) v12+ to run.

## Installation
```sh
npm i
```

## HTML generation
```sh
./run.sh
```

If the host system is Linux, it will watch and regenerate on changes in `./src/*.adoc`. Styles and html are placed within `./doc/`.

## Previous attempts
Inspired by [BML](https://github.com/Kungsgeten/bml), but software seems broken and unmantained, so asciidoc was chosen as the base. 
