const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  message: String,
  file: String,
  sender: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  replyOf: {
    type: mongoose.Types.ObjectId,
    ref: 'Message',
  },
  reactions: [
    {
      react: String,
      user: { type: mongoose.Types.ObjectId, ref: 'User' },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Message', messageSchema)
