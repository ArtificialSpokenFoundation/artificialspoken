var assert = require('assert')
var spoken = require('../lib/artificialspoken')

describe('Artificial Spoken Language', function () {
  it('Chinese Sentence Analysis', function () {
    assert.equal(
      spoken.analyze('小明有5個蘋果，給了小華3個蘋果，請問他還剩幾個蘋果？').en.join(' '),
      '_xiǎo_míng have 5 _gè apple ， give _le _xiǎo_huá 3 _gè apple ， Q he still remain several apple ？')
  })
})
