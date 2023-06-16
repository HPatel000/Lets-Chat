const Chat = require('../models/Chat')
const Message = require('../models/Message')

exports.getMessages = async (req, res) => {
  const sender = req.user._id
  const sentTo = req.body.sentTo
  try {
    const chat = await Chat.find({})
      .or([
        { $and: [{ user1: sentTo, user2: sender }] },
        { $and: [{ user1: sender, user2: sentTo }] },
      ])
      .populate('user1', 'name -_id')
      .populate('user2', 'name -_id')
      .populate({
        path: 'messages',
        populate: [
          {
            path: 'sender',
            select: 'name -_id',
          },
          {
            path: 'replyOf',
            select: '-reactions',
            populate: {
              path: 'sender',
              select: 'name -_id',
            },
          },
          {
            path: 'reactions',
            populate: {
              path: 'user',
              select: 'name -_id',
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
    const { sentTo, replyOf, message } = req.body
    const sender = req.user._id

    const newMessage = await Message.create({
      message,
      sender,
      replyOf,
    })

    const chat = await Chat.findOne({}).or([
      { $and: [{ user1: sentTo, user2: sender }] },
      { $and: [{ user1: sender, user2: sentTo }] },
    ])

    if (chat) {
      chat.messages.push(newMessage)
      await chat.save()
      return res.status(200).json({ success: true, data: 'Message saved' })
    } else {
      await Chat.create({
        user1: sender,
        user2: sentTo,
        messages: [newMessage],
      })
      return res.status(200).json({ success: true, data: 'Message saved' })
    }
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
