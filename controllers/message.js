const { default: mongoose } = require('mongoose')
const Message = require('../models/Message')
const { createChatService } = require('./chat')

exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params
    const page = req.params.page || 0
    const limit = req.params.limit || 0

    if (!mongoose.isValidObjectId(chatId)) {
      return res.status(400).json([])
    }

    const messages = await Message.find({})
      .where({ chatId: chatId })
      .sort({ createdAt: 1 })
      .populate([
        {
          path: 'sender',
          select: 'name',
        },
      ])
      .skip(page * limit)
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

    if (!chatId) {
      chatId = await createChatService(user1, sendTo)
    }

    const newMessage = await Message.create({
      chatId: chatId,
      message: message,
      replyOf: replyOf,
      sender: req.user._id,
    })

    const msg = await Message.findById(newMessage._id).populate([
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
    ])
    req.app.get('socketio').emit(`${chatId}`, {
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
    react = reaction.toString().substring(0, 1)
    const user = req.user._id
    const message = await Message.findById(msgId)
    if (!message) {
      return res.status(404).json({ error: 'no message found!' })
    }
    // check if user has already made reaction
    // reaction will be updated without new entry
    for (let i = 0; i < message.reactions?.length; i++) {
      const r = message.reactions[i]
      if (r.user == user) {
        message.reactions[i].react = react
        await message.save()
        return res
          .status(200)
          .json({ success: true, message: 'reaction saved' })
      }
    }
    // if no reaction found already present, new one will be created
    message.reactions.push({ react: react, user: user._id })
    await message.save()
    req.app.get('socketio').emit(`${message.chatId}`, {
      event: 'reacted',
      msg: message,
    })
    return res.status(201).json({ success: true, message: 'reaction saved' })
  } catch (e) {
    return res.status(500).json({ error: 'something went wrong!' })
  }
}
