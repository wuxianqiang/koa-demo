const crypto = require('crypto')

function getData (param) {
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

function md5 (str) {
  const obj = crypto.createHash('md5') //使用md5签名
  obj.update(str) //签名的str
  return obj.digest('hex') //返回16进制的结果
}

module.exports = {
  MD5_SUFFIX: 'sdkfjskfjsdkfjdnvmxvnafjiutiqjdxsfkdfjkds',
  md5,
  getData
}