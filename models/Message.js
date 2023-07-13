const mongoose = require('mongoose')
const Chat = require('./Chat')
const GroupChat = require('./GroupChat')

const MessageSchema = new mongoose.Schema({
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

MessageSchema.pre('deleteOne', { document: true }, async function (next) {
  const messageId = this._id

  // Delete chat messages that reference this message
  await Chat.updateMany(
    { messages: messageId },
    { $pull: { messages: messageId } }
  )

  // Delete group chat messages that reference this message
  await GroupChat.updateMany(
    { messages: messageId },
    { $pull: { messages: messageId } }
  )

  next()
})

module.exports = mongoose.model('Message', MessageSchema)
