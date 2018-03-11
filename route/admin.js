const Router = require('koa-router')
const admin = new Router
const mysql = require('mysql')
const common = require('../libs/common')
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '07690928wxq',
  database: 'learn'
})

function getData(param) {
  return new Promise((resolve, reject) => {
    db.query(param, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

module.exports = (app) => {
  require('./admin/login')(admin, getData, common)
  require('./admin/banner')(admin, getData)
  require('./admin/custom')(admin, getData)
  admin.get('*', async (ctx, next) => {
    // 没登入只能访问login页面
    if (!ctx.session.views && ctx.url !== '/admin/login') {
      ctx.redirect('/admin/login')
    } else {
      await next()
    }
  })

  admin.get('/', async (ctx, next) => {
    await ctx.render('./admin/index.ejs')
  })

  app.use('/admin', admin.routes())
  app.use('/admin', admin.allowedMethods())
}