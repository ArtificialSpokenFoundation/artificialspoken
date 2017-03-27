var Koa = require('koa')
var Router = require('koa-router')
// var serve = require('koa-static')
var send = require('koa-send')
var bodyParser = require('koa-bodyparser')
var path = require('path')
var spoken = require('../lib/artificialspoken')
var app = new Koa()
var router = new Router()

app.use(bodyParser())

function asl (text) {
  var p = spoken.analyze(text)
  p.tree = spoken.formatParse(p)
  return p
}

app.use(async function (ctx, next) {
  var method = ctx.request.method
  var body
  if (method === 'GET') {
    await send(ctx, ctx.path, { root: path.join(__dirname, '../web') })
  } else if (method === 'POST') {
    if (ctx.path === '/asl') {
      body = ctx.request.body
      console.log('==========asl:source================\n' + body.source)
      ctx.body = JSON.stringify(asl(body.source), null, 2)
    }
  }
})

app.use(router.routes()).listen(8081)
