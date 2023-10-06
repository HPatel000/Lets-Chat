const Chat = require('../models/Chat')

exports.createChatService = async (user1, user2) => {
  const chat = await Chat.findOne({}).or([
    { $and: [{ user1: user1, user2: user2 }] },
    { $and: [{ user1: user2, user2: user1 }] },
  ])
  if (chat) {
    return chat._id
  } else {
    chat = await Chat.create({
      user1: user1,
      user2: user2,
    })
    return chat._id
  }
}

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

exports.deleteChat = async (req, res) => {
  try {
    const id = req.params.id
    const chat = Chat.findByIdAndDelete(id)
    return res.status(204).json({ success: true, data: 'Chat deleted' })
  } catch (e) {
    return res.status(500).json({ error: 'something went wrong!' })
  }
}

exports.getChatIDFromIds = async (req, res) => {
  const sender = req.params.id
  const receiver = req.user._id
  try {
    let chat = await Chat.find({})
      .or([
        { $and: [{ user1: receiver, user2: sender }] },
        { $and: [{ user1: sender, user2: receiver }] },
      ])
      .select('-messages')
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
