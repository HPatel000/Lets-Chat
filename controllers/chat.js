const Chat = require('../models/Chat')
const Message = require('../models/Message')

exports.getUserChats = async (req, res, next) => {
  try {
    const user = req.user._id
    const chat = await Chat.find({})
      .or([{ user1: user }, { user2: user }])
      .slice('messages', -1)
      .populate('user1', 'name')
      .populate('user2', 'name')
      .populate({
        path: 'messages',
        select: 'message sender',
        populate: {
          path: 'sender',
          select: 'name',
        },
      })

    return res.status(200).json(chat)
  } catch (e) {
    return res.status(500).json({ error: 'something went wrong!' })
  }
}

exports.getChatIDFromIds = async (req, res) => {
  const sender = req.params.sender
  const receiver = req.user._id
  try {
    let chat = await Chat.find({}).or([
      { $and: [{ user1: receiver, user2: sender }] },
      { $and: [{ user1: sender, user2: receiver }] },
    ])
    if (chat.length == 0) {
      chat = await Chat.create({
        user1: sender,
        user2: receiver,
      })
    }
    return res.status(200).json({ chat })
  } catch (e) {
    return res.status(500).json({ error: 'something went wrong!' })
  }
}

exports.getMessages = async (req, res) => {
  const id = req.params.id
  const user = req.user._id
  try {
    const chat = await Chat.findById(id)
      .or([{ user1: user }, { user2: user }])
      .populate('user1', 'name')
      .populate('user2', 'name')
      .populate({
        path: 'messages',
        populate: [
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
        ],
      })
    return res.status(200).json({ chat })
  } catch (e) {
    return res.status(500).json({ error: 'something went wrong!' })
  }
}

exports.saveMessage = async (req, res) => {
  try {
    const { id, replyOf, message } = req.body
    const sender = req.user._id
    const newMessage = await Message.create({
      message,
      sender,
      replyOf,
    })

    const chat = await Chat.findById(id).or([
      { user1: sender },
      { user2: sender },
    ])
    if (chat) {
      chat.messages.push(newMessage)
      await chat.save()
    } else {
      return res.status(404).json({ error: 'no chat found!' })
    }

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
    req.app.get('socketio').emit(`${id}`, msg)
    return res.status(200).json({ success: true, data: 'Message saved' })
  } catch (e) {
    return res.status(500).json({ error: 'something went wrong!' })
  }
}

exports.reactToMsg = async (req, res, next) => {
  try {
    const { msgId, reaction } = req.body
    reaction = reaction.toString().substring(0, 1)
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
        message.reactions[i].react = reaction
        await message.save()
        return res
          .status(200)
          .json({ success: true, message: 'reaction saved' })
      }
    }
    // if no reaction found already present new one will be created
    message.reactions.push({ react: reaction, user: user._id })
    await message.save()
    return res.status(200).json({ success: true, message: 'reaction saved' })
  } catch (e) {
    return res.status(500).json({ error: 'something went wrong!' })
  }
}
