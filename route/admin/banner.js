module.exports = (app, getData) => {
  app.get('/banners', async (ctx, next) => {
    let banners = await getData('SELECT * FROM banner_table')
    let {
      act,
      id
    } = ctx.query
    if (act) {
      if (act === 'mod') {
        let data = await getData(`SELECT * FROM banner_table WHERE ID=${id}`)
        if (data.length === 0) {
          ctx.body = '<h1>404</h1>'
        } else {
          await ctx.render('./admin/banner.ejs', {
            banners,
            mod_data: data[0]
          })
        }
        return
      }
      if (act === 'del') {
        await getData(`DELETE FROM banner_table WHERE ID=${id}`)
        ctx.redirect('/admin/banners')
        return
      }
    }
    await ctx.render('./admin/banner.ejs', {
      banners
    })
  })

  app.post('/banners', async (ctx, next) => {
    let {
      title,
      description,
      href,
      mode_id
    } = ctx.request.body
    if (mode_id) {
      await getData(`UPDATE banner_table SET title='${title}',description='${description}',href='${href}' WHERE ID=${mode_id}`)
    } else {
      await getData(`INSERT INTO banner_table (title, description, href) VALUES ('${title}', '${description}', '${href}')`)
    }
    ctx.redirect('/admin/banners')
  })
}