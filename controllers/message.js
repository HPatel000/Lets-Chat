const mongoose = require('mongoose')
const Message = require('../models/Message')
const { createChatService } = require('./chat')

const msgPopulate = [
  {
    path: 'sender',
    select: 'name',
  },
  {
    path: 'replyOf',
    select: '-reactions',
    populate: {
      path: 'sender',
      select: 'name',
    },
  },
  {
    path: 'reactions',
    populate: {
      path: 'user',
      select: 'name',
    },
  },
]

exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params
    const page = req.params.page || 1
    const limit = req.params.limit || 0

    if (!mongoose.isValidObjectId(chatId)) {
      return res.status(400).json([])
    }

    const messages = await Message.find({})
      .where({ chatId: chatId })
      .sort({ createdAt: -1 })
      .populate(msgPopulate)
      .skip((page - 1) * limit)
      .limit(limit)

    return res.status(200).json(messages)
  } catch (e) {
    return res.status(500).json({ error: 'something went wrong!' })
  }
}

exports.saveMessage = async (req, res) => {
  try {
    let chatId = req.params.id
    const user1 = req.user._id
    const { message, replyOf, sendTo } = req.body
    const files = []
    if (req.files) {
      req.files.forEach((file) => {
        files.push({
          filename: file.filename,
          contentType: file.contentType,
        })
      })
    }

    let chat
    if (!chatId && sendTo) {
      chat = await createChatService(user1, sendTo)
    }

    const chat_id = chat?._id ? chat._id : chatId

    const newMessage = await Message.create({
      chatId: chat_id,
      files: files,
      message: message,
      replyOf: replyOf,
      sender: req.user._id,
    })

    const msg = await Message.findById(newMessage._id).populate(msgPopulate)
    req.app.get('socketio').emit(`${chat_id}`, {
      event: 'added',
      msg: msg,
    })

    return res.status(201).json(msg)
  } catch (e) {
    return res.status(500).json({ error: 'something went wrong!' })
  }
}

exports.deleteMessage = async (req, res) => {
  const msgId = req.params.id
  try {
    const msg = await Message.findByIdAndDelete(msgId)
    if (!msg) {
      return res.status(204).json({})
    }
    req.app.get('socketio').emit(`${msg.chatId}`, {
      event: 'deleted',
      msgId: msgId,
    })
    return res.status(204).json({})
  } catch (e) {
    return res.status(500).json({ error: 'something went wrong!' })
  }
}

exports.reactToMsg = async (req, res, next) => {
  try {
    const msgId = req.params.id
    const { reaction } = req.body
    const user = req.user._id
    let message = await Message.findById(msgId)
    if (!message) {
      return res.status(404).json({ error: 'no message found!' })
    }
    // check if user has already made reaction
    // reaction will be updated without new entry
    for (let i = 0; i < message.reactions?.length; i++) {
      const r = message.reactions[i]
      if (r.user.equals(user)) {
        message.reactions[i].react = reaction
        await message.save()
        return res
          .status(200)
          .json({ success: true, message: 'reaction saved' })
      }
    }
    // if no reaction found already present, new one will be created
    message.reactions.push({ react: reaction, user: user._id })
    await message.save()
    message = await Message.find({ _id: msgId }).populate(msgPopulate)
    req.app.get('socketio').emit(`${message[0].chatId}`, {
      event: 'reacted',
      msg: message[0],
    })
    return res.status(201).json({ success: true, message: 'reaction saved' })
  } catch (e) {
    return res.status(500).json({ error: 'something went wrong!' })
  }
}
