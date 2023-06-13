const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
  message: String,
  file: String,
  user1: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  user2: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  messages: [
    {
      message: String,
      file: String,
      sender: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      date: {
        type: Date,
        default: () => Date.now,
      },
    },
  ],
})

module.exports = mongoose.model('chat', chatSchema)
