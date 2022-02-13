# Bridge bidding system generator

This package generates bridge bidding systems in html from asciidoc or markdown.

Requires [Node.js](https://nodejs.org/) v16+ to run.

## Installation
```sh
npm i
```

## HTML generation
```sh
./run.sh
```

If the host system is Linux, it will watch and regenerate on changes in `./src/*`. Styles and html are placed within `./doc/`.

## Previous attempts
Inspired by [BML](https://github.com/Kungsgeten/bml), but software seems broken and unmantained, so asciidoc was chosen as the base. 
