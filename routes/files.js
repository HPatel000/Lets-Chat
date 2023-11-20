const mongoose = require('mongoose')
const express = require('express')
const fileRouter = express.Router()

fileRouter.get('/:filename', (req, res, next) => {
  try {
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads',
    })
    res.setHeader('Content-Disposition', 'inline')
    const downloadStream = bucket.openDownloadStreamByName(req.params.filename)
    downloadStream.pipe(res)
  } catch (e) {
    return res.status(500).json({ error: 'something went wrong!' })
  }
})
module.exports = fileRouter

//  /*
//         GET: Fetches a particular image and render on browser
//     */
//     fileRouter.route('/image/:filename')
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
