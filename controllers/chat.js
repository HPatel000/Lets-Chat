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
    const page = req.params.page || 0
    const limit = req.params.limit || 0
    const chat = await Chat.find({})
      .or([{ user1: user }, { user2: user }])
      .slice('messages', -1)
      .populate('user1', 'name')
      .populate('user2', 'name')
      .skip(page * limit)
      .limit(limit)

    return res.status(200).json(chat)
  } catch (e) {
    return res.status(500).json({ error: 'something went wrong!' })
  }
}

exports.deleteChat = async (req, res) => {
  try {
    const id = req.params.id
    await Chat.findByIdAndDelete(id)
    return res.status(204).json({})
  } catch (e) {
    return res.status(500).json({ error: 'something went wrong!' })
  }
}
