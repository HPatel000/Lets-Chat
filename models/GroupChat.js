const mongoose = require('mongoose')

const groupChatSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    isGroup: {
      type: Boolean,
      default: false,
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
  },
  { timestamps: true }
)

module.exports = mongoose.model('GroupChat', groupChatSchema)
