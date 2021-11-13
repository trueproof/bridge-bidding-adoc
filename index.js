const asciidoctor = require('asciidoctor')()

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

const preprocessBml = registry => {
  registry.preprocessor(function () {
    const self = this
    self.process((doc, reader) => {
      reader.lines.forEach((line, i) => {
        reader.lines[i] = line
          .replace(bidRe, (m, p1, p2) => `\`${p1}${p2
              .replace(/\w/g, m => suitMap[m])}\``)
          .replace(passDblRdblRe, (m, p1, p2) => `\`${p1}${p2}\``)

        return reader
      })
    })
  })
}

const postprocessBml = registry => {
  registry.postprocessor(function () {
    const self = this
    self.process((doc, output) => {
      return output
        .replace(suitRe, m => suitMap[m])
        .replace(ntRe, m => suitMap[m])
        .replace(passDblRdblRe, (m, p1, p2) => `${suitMap[p1]}${p2}`)
    })
  })
}

preprocessBml(registry)
postprocessBml(registry)

asciidoctor.convertFile('src/fn.adoc', {
  safe: 'server',
  to_dir: "doc",
  extension_registry: registry,
})

asciidoctor.convertFile('src/berezka.adoc', {
  safe: 'server',
  to_dir: "doc",
  extension_registry: registry,
})
