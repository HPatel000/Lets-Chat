const { GridFsStorage } = require('multer-gridfs-storage')
const crypto = require('crypto')
const multer = require('multer')
const path = require('path')

const storage = new GridFsStorage({
  url: 'mongodb://127.0.0.1:27017/MERNCRUD',
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) return reject(err)
        const filename = buf.toString('hex') + path.extname(file.originalname)
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads',
        }
        resolve(fileInfo)
      })
    })
  },
})

const upload = multer({ storage })

module.exports = upload
