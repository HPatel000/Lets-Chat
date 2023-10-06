const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
)

module.exports = mongoose.model('Chat', chatSchema)
