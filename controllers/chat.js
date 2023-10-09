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
    const page = req.params.page || 1
    const limit = req.params.limit || 10
    const chat = await Chat.aggregate([
      { $match: { $or: [{ user1: user }, { user2: user }] } },
      {
        $lookup: {
          from: 'messages',
          localField: '_id',
          foreignField: 'chatId',
          as: 'messages',
        },
      },
      { $unwind: '$messages' },
      { $sort: { 'messages.createdAt': -1 } },
      {
        $group: {
          _id: '$chatId',
          lastMessage: { $first: '$messages' },
          chat: { $first: '$$ROOT' },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ['$chat', { lastMessage: '$lastMessage' }],
          },
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'user1',
          foreignField: '_id',
          as: 'user1',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user2',
          foreignField: '_id',
          as: 'user2',
        },
      },
      {
        $addFields: {
          user1: { $arrayElemAt: ['$user1', 0] },
          user2: { $arrayElemAt: ['$user2', 0] },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'messages.sender',
          foreignField: '_id',
          as: 'messages.sender',
        },
      },
      {
        $addFields: {
          'messages.sender': { $arrayElemAt: ['$messages.sender', 0] },
        },
      },
      {
        $project: {
          'user1.name': 1,
          'user2.name': 1,
          'messages.sender.name': 1,
          'messages.message': 1,
          'messages._id': 1,
          'messages.chatId': 1,
          'messages.createdAt': 1,
          _id: 1,
        },
      },
    ])

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
