// 標記用法 ==> N:名詞 V:動詞 n:名詞修飾 v:動詞修飾 Q:疑問詞 T:句尾詞 -:刪除該詞
// 您可以在 kb.edit.mdo 中運用這些標記對 kb.mdo 修正，但請不要直接修改 kb.mdo
var path = require('path')
var fs = require('fs')
var cc = require('chinese_convert')
var mdo = require('mdo')
var kb = {
  mainFile: path.join(__dirname, '../dictionary/kb.mdo'),
  editFile: path.join(__dirname, '../dictionary/kb.edit.mdo'),
  userFile: path.join(__dirname, '../dictionary/kb.user.mdo')
}

kb.toCn = function (dict) {
  for (var i in dict) {
    var word = dict[i]
    if (typeof word.cn !== 'undefined') {
      word.cn = cc.tw2cn(word.cn)
    }
  }
}

kb.getByCn = function (cn) {
  var word = kb.cnMap[cn]
  if (word != null && word.tag !== '') {
    return word
  } else {
    return undefined
  }
}

var str = kb.str = function (s) {
  return s || ''
}

kb.tableFormat = function (w) {
  return str(w.tag) + '|' + str(w.cn) + '|' + str(w.en)
}

kb.saveWord = function (w) {
  fs.appendFile(kb.userFile, kb.tableFormat(w) + '\n', function (err) {
    if (err) throw Error('saveWord to %s : %j fail!', kb.userFile, w)
    console.log('  append : %j success!', w)
  })
  w.cn = cc.tw2cn(w.cn)
  kb.cnMap[w.cn] = w
}

kb.setByCn = function (w) {
//  console.log('saveByCn(%j)', w)
  var w0 = kb.get(w.cn)
//  console.log(' w0=%j', w0)
  if (w0 == null) w0 = {}
  if (w0.tag === w.tag && w0.en === w.en) {
    return
  }
  if (w.en == null) w.en = w0.en
  if (w.tag == null) w.tag = w0.tag
  kb.saveWord(w)
}

kb.get = function (w) {
  var cn = cc.tw2cn(w)
  var word = kb.getByCn(cn)
  return word
}

kb.load = function () {
  var kbMdo = fs.readFileSync(kb.mainFile).toString()
  var kbArray = mdo.parseTable(kbMdo, ['count', 'pos', 'tw'])
  var editMdo = fs.readFileSync(kb.editFile).toString()
  var editArray = mdo.parseTable(editMdo)
  var userMdo = fs.readFileSync(kb.userFile).toString()
  var userArray = mdo.parseTable(userMdo)
  kb.toCn(editArray)
  kb.toCn(userArray)
  var dict = editArray.concat(userArray).concat(kbArray)
  kb.cnMap = mdo.index(dict, 'cn')
}

kb.load()

module.exports = kb
