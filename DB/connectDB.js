const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/MERNCRUD', {})
    console.log('DB CONNECTED...')
  } catch (e) {
    process.exit(1)
  }
}

module.exports = { connectDB }
