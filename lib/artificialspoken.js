/* ASLT : Artifical Spoken Language Toolket (人造交談語言工具 - 翻譯與剖析)
S = P* .+                // 句子 = 短語* 符號+
P = a* (N+|V+)?          // 短語 = 修飾* (名詞+|動詞+)
*/
var pinyinJs = require('pinyin.js')
var kb = require('./kb')

var wi, words, errors, tags, cuts

function isTag (tag) {
  var word = words[wi]
  if (typeof word === 'undefined') return false
  return (tag === word.tag)
}

function next (tag) {
  var w = words[wi]
  tags.push(w.tag)
  cuts[wi] = ''
  if (isTag(tag)) {
    errors[wi] = ''
    wi++
    return w
  } else {
    errors[wi] = w.tag + '≠' + tag
    throw Error(errors[wi])
  }
}

// S = P* .+
function S () {
  try {
    while (!isTag('.')) P()
    do { next('.') } while (isTag('.'))
  } catch (err) {
    for (; wi < words.length && words[wi].tag !== '.'; wi++) {}
    for (; wi < words.length && words[wi].tag === '.'; wi++) {}
  }
  cuts[wi - 1] = '\n'
}

// P = a* (N+|V+)?
function P () {
  while (isTag('a')) next('a')

  if (!isTag('.')) {
    var t = words[wi].tag
    while (isTag(t)) next(t)
  }
  cuts[wi - 1] = '/'
}

var exps = [
  /^\s+([\u4E00-\u9FFF]{1,8}):([a-z])(=(\w+))?\s+/i,
//  /^\s*(\w{1,20}):([a-z])\s+/i,
  /^(\w{1,20})(:([a-z]))?/i,
  /^[\u4E00-\u9FFF]{4}/,
  /^[\u4E00-\u9FFF]{3}/,
  /^[\u4E00-\u9FFF]{2}/,
  /^./]

function clex (text) {
  text = text.replace(/\n/g, '↓')
  var m
  var lwords = []
  var tokens = []
  for (var i = 0; i < text.length;) {
    for (var ri = 0; ri < exps.length; ri++) {
      var word = null
      m = exps[ri].exec(text.substr(i, 50))
      if (m) {
        if (ri === 0) { // ex: 瑪莉:N
          word = {cn: m[1], en: m[4], tag: m[2]}
          kb.setByCn(word)
        } else if (ri === 1) { // ex: John:N
          var tag = (m[2] == null) ? 'N' : m[2]
          word = {cn: m[1], en: m[1], tag: tag}
        } else { // 1-4 字的中文詞
          word = kb.get(m[0])
        }
        if (word == null && ri === exps.length - 1) { // 單一字元 .
          word = {cn: m[0], en: m[0], tag: '.'}
        }
        if (word != null) {
          if (word.cn !== ' ' && word.cn !== '\n') {
            lwords.push(word)
            tokens.push(m[0].trim())
          }
          break
        }
      }
    }
    i = i + m[0].length
  }
  return {tokens: tokens, words: lwords}
}

function parse (lex) {
  words = lex.words
  errors = []
  tags = []
  cuts = []
  for (wi = 0; wi < words.length;) {
    S()
  }
  return {tokens: lex.tokens, words: words, errors: errors, tags: tags, cuts: cuts}
}

function english (word) {
  if (word.en == null || word.en === '') {
    return '_' + pinyinJs(word.cn).toString().replace(',', '_')
  } else {
    return word.en
  }
}

function mt (words) {
  var eWords = []
  for (var i in words) {
    eWords.push(english(words[i]))
  }
  return eWords
}

function analyze (text) {
  var lex = clex(' ' + text)
//  console.log('詞彙：%j', lex.words)
  var p = parse(lex)
//  console.log('詞性：%j', p.tags)
//  console.log('錯誤：%j', p.errors)
  p.en = mt(lex.words)
  return p
}

function report (p) {
  console.log('%j', p.tokens)
//  console.log('詞性：%j', p.tags)
  console.log(' %s', formatParse(p).join(' ').trim())
//  console.log('錯誤：%j', p.errors)
  console.log('%j', p.en)
  console.log('%s', p.en.join(' '))
  console.log('=========================')
}

function analysis (text) {
  var p = analyze(text)
  report(p)
}

function formatParse (p) {
  var outs = []
  for (var i = 0; i < p.words.length; i++) {
    outs.push(p.tokens[i] + ':' + p.tags[i] + p.cuts[i])
  }
  return outs
}

module.exports = {
  kb: kb,
  parse: parse,
  clex: clex,
  mt: mt,
  english: english,
  formatParse: formatParse,
  report: report,
  analyze: analyze,
  analysis: analysis
}
