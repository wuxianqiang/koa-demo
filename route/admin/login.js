module.exports = (app, getData, common) => {
  app.get('/login', async (ctx, next) => {
    await ctx.render('./admin/login.ejs', {})
  })
  app.post('/login', async (ctx, next) => {
    let {
      username,
      password
    } = ctx.request.body
    let pw = common.md5(password + common.MD5_SUFFIX)
    let data = await getData(`SELECT * FROM admin_table WHERE username='${username}'`)
    if (data.length === 0) {
      ctx.body = '<h1>用户名不存在</h1>'
    } else {
      if (data[0].password === pw) {
        // 登入成功
        ctx.session.views = data[0].ID
        ctx.redirect('/admin')
      } else {
        // 密码错误
        ctx.body = '<h1>密码错误</h1>'
      }
    }
  })
}