<p align="center">
  <a href="https://travis-ci.org/ccckmit/aslt"><img src="https://img.shields.io/travis/ccckmit/aslt.svg" alt="Travis"></a>
  <a href="http://standardjs.com"><img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="Standard - JavaScript Style Guide"></a>
  <a href="https://www.npmjs.com/package/aslt"><img src="https://img.shields.io/npm/dm/aslt.svg" alt="npm downloads"></a>
  <a href="https://www.npmjs.com/package/aslt"><img src="https://img.shields.io/npm/v/aslt.svg" alt="npm version"></a>
</p>

# ASLT : Artifical Spoken Language Toolket

中文：人造交談語言工具 - 翻譯與剖析

## Install

```
$ npm install aslt
```

## BNF

We design 2 rules for any language. It's easy !

```
S = P* .+
P = a* (N+|V+)?
```

## Example

File: mtTest.js

```
var MT = require('aslt')

MT.analysis('小明 和 小英:N 一起吃蘋果。\n')
MT.analysis('小明有5個蘋果，給了小華3個蘋果，請問他還剩幾個蘋果？\n')
MT.analysis('黑黑的天，大大的風，爸爸去捕魚，為甚麼 還 不 回 家？\n')
MT.analysis('John:N 與 瑪莉:N 是 一 對 戀人。\n')
MT.analysis('風與日。風日爭，旅人至，脫者勝，風狂吹，人緊衣，風敗，日暖照，人脫衣，日勝。\n')
MT.analysis('蘋果和牛奶很好吃。蘋果牛奶很好喝。很好喝的蘋果牛奶。')
MT.analysis('好大的蘋果。')
```

## Run 

```
$ node mtTest.js
["小明","和","小英:N","一起","吃","蘋果","。","↓"]
 小明:N/ 和:V/ 小英:N:N/ 一起:a 吃:V/ 蘋果:N/ 。:. ↓:.
["_xiǎo_míng","and","_xiǎo_yīng","together","eat","apple","。","↓"]
=========================
["小明","有","5","個","蘋果","，","給","了","小華","3","個","蘋果","，","請問","他","還","剩","幾個","蘋果","？","↓"]
 小明:N/ 有:V/ 5:a 個:a 蘋果:N/ ，:.
 給:V/ 了:a 小華:N/ 3:a 個:a 蘋果:N/ ，:.
 請問:V/ 他:N/ 還:a 剩:V/ 幾個:a 蘋果:N/ ？:. ↓:.
["_xiǎo_míng","have","5","_gè","apple","，","give","_le","_xiǎo_huá","3","_gè","apple","，","Q","he","still","remain","several","apple","？","↓"]
=========================
["黑","黑","的","天","，","大大的","風","，","爸爸","去","捕","魚","，","為甚麼","還","不","回","家","？","↓"]
 黑:a 黑:a 的:a 天:N/ ，:.
 大大的:N 風:N/ ，:.
 爸爸:N/ 去:V 捕:V/ 魚:N/ ，:.
 為甚麼:V/ 還:a 不:a 回:V/ 家:N/ ？:. ↓:.
["black","black","_de","sky","，","big","wind","，","papa","go","hunt","fish","，","why","still","no","back","home","？","↓"]
=========================
["John:N","與","瑪莉:N","是","一","對","戀人","。","↓"]
 John:N:N/ 與:V/ 瑪莉:N:N/ 是:V/ 一:a 對:a 戀人:N/ 。:. ↓:.
["John","and3","_mǎ_lì","is","one","correct","lover","。","↓"]
=========================
["風","與","日","。","風","日","爭","，","旅人","至","，","脫","者","勝","，","風","狂","吹","，","人","緊","衣","，","風","敗","，","日","暖","照","，","人","脫","衣","，","日","勝","。","↓"]
 風:N/ 與:V/ 日:N/ 。:.
 風:N 日:N/ 爭:V/ ，:.
 旅人:N/ 至:V/ ，:.
 脫:V/ 者:N/ 勝:V/ ，:.
 風:N/ 狂:V 吹:V/ ，:.
 人:N/ 緊:V/ 衣:N/ ，:.
 風:N/ 敗:V/ ，:.
 日:N/ 暖:V 照:V/ ，:.
 人:N/ 脫:V/ 衣:N/ ，:.
 日:N/ 勝:V/ 。:. ↓:.
["wind","and3","sun","。","wind","sun","compete","，","traveler","come","，","takeOff","guy","win","，","wind","wild","blow","，","people","tight","cloth","，","wind","lose","，","sun","warm","shine","，","people","takeOff","cloth","，","sun","win","。","↓"]
=========================
["蘋果","和","牛奶","很","好吃","。","蘋果","牛奶","很","好","喝","。","很","好","喝","的","蘋果","牛奶","。"]
 蘋果:N/ 和:V/ 牛奶:N/ 很:a 好吃:V/ 。:.
 蘋果:N 牛奶:N/ 很:a 好:a 喝:V/ 。:.
 很:a 好:a 喝:V/ 的:a 蘋果:N 牛奶:N/ 。:.
["apple","and","milk","very","good to eat","。","apple","milk","very","good","drink","。","very","good","drink","_de","apple","milk","。"]
=========================
["好","大","的","蘋果","。"]
 好:a 大:a 的:a 蘋果:N/ 。:.
["good","big","_de","apple","。"]
=========================
```

## comment

我們用《結巴》字典做基礎，用程式將《結巴的詞性》對應到《a,N,V》等人造語的詞性上。

這些詞性標註還沒辦法完全正確，因此人造語的字典還改進的空間！

結巴字典的來源如下：

* <https://github.com/yanyiwu/nodejieba/blob/master/dict/jieba.dict.utf8>


