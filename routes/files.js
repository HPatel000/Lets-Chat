const mongoose = require('mongoose')
const mongoDB = require('mongodb')
const express = require('express')

// connect = mongoose.createConnection('mongodb://127.0.0.1:27017/MERNCRUD', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })

// let gfs
// connect.once('open', async () => {
//   gfs = new mongoose.mongo.GridFSBucket(connect.db, {
//     bucketName: 'uploads',
//   })
//   console.log(gfs)
// })

const imageRouter = express.Router()

imageRouter.get('/:filename', (req, res, next) => {
  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads',
  })

  // const downloadStream = bucket.openDownloadStreamByName(req.params.filename)
  // downloadStream.pipe(res)
  mongoDB.MongoClient.connect(
    'mongodb://127.0.0.1:27017/MERNCRUD',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (error, client) => {
      const db = client.db(MERNCRUD)

      var bucket = new mongoDB.GridFSBucket(db)

      bucket.openDownloadStreamByName(req.params.filename).pipe(res)
    }
  )
})
module.exports = imageRouter

//  /*
//         GET: Fetches a particular image and render on browser
//     */
//     imageRouter.route('/image/:filename')
//         .get((req, res, next) => {
//             gfs.find({ filename: req.params.filename }).toArray((err, files) => {
//                 if (!files[0] || files.length === 0) {
//                     return res.status(200).json({
//                         success: false,
//                         message: 'No files available',
//                     });
//                 }

//                 if (files[0].contentType === 'image/jpeg' || files[0].contentType === 'image/png' || files[0].contentType === 'image/svg+xml') {
//                     // render image to browser
//                     gfs.openDownloadStreamByName(req.params.filename).pipe(res);
//                 } else {
//                     res.status(404).json({
//                         err: 'Not an image',
//                     });
//                 }
//             });
//         });
