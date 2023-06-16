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
            populate: {
              path: 'sender',
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
