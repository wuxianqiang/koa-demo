const pathLib = require('path')
const fs = require('fs')

function writeName(oldPath, newPath) {
  return new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

function unFile(url) {
  return new Promise((resolve, reject) => {
    fs.unlink(url, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

module.exports = (app, getData) => {
    app.get('/custom', async (ctx, next) => {
      let {
        act,
        id
      } = ctx.query

      if (act) {
        if (act === 'mod') {
          let allData = await getData('SELECT * FROM custom_table')
          let data = await getData(`SELECT * FROM custom_table WHERE ID=${id}`)
          if (data.length === 0) {
            ctx.body = '<h1>404</h1>'
          } else {
            await ctx.render('./admin/custom.ejs', {
              data: allData,
              mod_data: data[0]
            })
          }
          return
        }
        if (act === 'del') {
          // 数据库要删除文件也要删除
          let data = await getData(`SELECT * FROM custom_table WHERE ID=${id}`)
          await getData(`DELETE FROM custom_table WHERE ID=${id}`)
          await unFile('./static/upload/' + data[0].src)
          ctx.redirect('/admin/custom')
          return
        }
      } else {
        let data = await getData('SELECT * FROM custom_table')
        ctx.body = '<h1>用户评价</h1>'
        await ctx.render('./admin/custom.ejs', {
          data
        })
      }
    }),
    app.post('/custom', async (ctx, next) => {      
      let {
        originalname,
        path,
        filename
      } = ctx.req.files[0]
      let {
        ext
      } = pathLib.parse(originalname)
      let newPath = path + ext
      let src = filename + ext
      await writeName(path, newPath)
      let {
        title,
        description,
        mode_id
      } = ctx.req.body
      if (mode_id) {
        let data = await getData(`SELECT * FROM custom_table WHERE ID=${mode_id}`)
        if (data.length === 0) {
          ctx.body = '<h1>404</h1>'
        } else {
          await unFile('./static/upload/' + data[0].src)
        }
        await getData(`UPDATE custom_table SET title='${title}',description='${description}',src='${src}' WHERE ID=${mode_id}`)
        ctx.redirect('/admin/custom')
      } else {
        await getData(`INSERT INTO custom_table (title, description, src) VALUES ('${title}', '${description}', '${src}')`)
        ctx.redirect('/admin/custom')
      }
    })
}