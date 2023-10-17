const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: function () {
      return this.isGroup
    },
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
      required: true,
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
    required: function () {
      return this.isGroup
    },
  },
})

module.exports = mongoose.model('Chat', chatSchema)
