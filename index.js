const { readFile, writeFile } = require('fs/promises')
const asciidoctor = require('asciidoctor')()
const commonmark = require('commonmark')

const mdReader = new commonmark.Parser()
const mdWriter = new commonmark.HtmlRenderer()

const registry = asciidoctor.Extensions.create()

const suitRe = /([♣♦♥♠]|![cdhsnmM])/g
const bidRe = /([1-7])(([CDHSmM]|N(?!T))+!?)/g
const ntRe = /(?<=[\d\s])NT(?=\b)/g
const passDblRdblRe = /((?<=\b)P(?=\b)|R?DBL)(!?)/g

const suitMap = {
  '♣': '<span class="clubs">♣</span>',
  '♦': '<span class="diams">♦</span>',
  '♥': '<span class="hearts">♥</span>',
  '♠': '<span class="spades">♠</span>',
  C: '♣',
  D: '♦',
  H: '♥',
  S: '♠',
  N: '!n',
  M: '!M',
  m: '!m',
  NT: '<span class="nt">БК</span>',
  '!c': '<span class="clubs">♣</span>',
  '!d': '<span class="diams">♦</span>',
  '!h': '<span class="hearts">♥</span>',
  '!s': '<span class="spades">♠</span>',
  '!n': '<span class="nt">БК</span>',
  '!m': '<span class="nt">м</span>',
  '!M': '<span class="nt">М</span>',
  P: '<span class="nt">Пас</span>',
  DBL: '<span class="nt">Контра</span>',
  RDBL: '<span class="nt">Реконтра</span>',
}

const preprocessLine = line => line
  .replace(bidRe, (m, p1, p2) => `\`${p1}${p2
      .replace(/\w/g, m => suitMap[m])}\``)
  .replace(passDblRdblRe, (m, p1, p2) => `\`${p1}${p2}\``)

const postprocessHtml = html => html
  .replace(suitRe, m => suitMap[m])
  .replace(ntRe, m => suitMap[m])
  .replace(passDblRdblRe, (m, p1, p2) => `${suitMap[p1]}${p2}`)

const preprocessMd = md => md
  .split('\n')
  .map(preprocessLine)
  .join('\n')

const processMd = md => `<head><link rel="stylesheet" href="css/md.css"></head>
  ${postprocessHtml(mdWriter.render(mdReader.parse(preprocessMd(md))))}`

const preprocessAdoc = registry => {
  registry.preprocessor(function () {
    const self = this
    self.process((doc, reader) => {
      reader.lines.forEach((line, i) => {
        reader.lines[i] = preprocessLine(line)

        return reader
      })
    })
  })
}

const postprocessAdoc = registry => {
  registry.postprocessor(function () {
    const self = this
    self.process((doc, output) => {
      return postprocessHtml(output)
    })
  })
}

preprocessAdoc(registry)
postprocessAdoc(registry)

const convertAdoc = filename => {
  const doc = asciidoctor.convertFile(`src/${filename}`, {
    safe: 'server',
    to_dir: "doc",
    extension_registry: registry,
  })
}

const convertMd = filename => {
  readFile(`src/${filename}`, 'utf-8')
    .then(md => writeFile(`doc/${filename}.html`, processMd(md))
      .catch(err => {
        console.error(err)
      })
    )
    .catch(err => {
      console.error(err)
    })
}

convertMd('fn.md')
convertAdoc('fn.adoc')
convertAdoc('berezka.adoc')

