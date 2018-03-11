const Koa = require('koa')
const views = require('koa-views')
const path = require('path')
const render = require('koa-views-render')
const session = require('koa-session');
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')
const static = require('koa-static')
const multer = require('koa-multer')
const upload = multer({ dest: './static/upload/' })
const app = new Koa()

app.use(upload.any())

app.keys = ['some secret hurr'];

app.use(session(app))

app.use(bodyParser())

app.use(views(__dirname + '/template', {
  map: {
    html: 'ejs'
  }
}));


var router = new Router()
const admin = require('./route/admin')
const web = require('./route/web')

admin(router)
web(router)

app.use(router.routes())
app.use(router.allowedMethods())


app.use(static(path.resolve(__dirname, "./static")))

app.listen(8080, () => {
  console.log('port 8080!')
})
