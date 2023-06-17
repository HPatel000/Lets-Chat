const mongoose = require('mongoose')

const groupChatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  grpImg: String,
  members: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  ],
  admin: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  ],
  owner: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  messages: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Message',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('GroupChat', groupChatSchema)
