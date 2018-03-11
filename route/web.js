const Router = require('koa-router')
const web = new Router

module.exports = (app) => {
  web.get('/', async (ctx, next) => {
    ctx.body = '<h1>web</h1>'
  })
  app.use('/', web.routes())
  app.use('/', web.allowedMethods())
}