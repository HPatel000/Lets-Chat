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
          as: 'lastMessage',
        },
      },
      { $unwind: '$lastMessage' },
      { $sort: { 'lastMessage.createdAt': -1 } },
      {
        $group: {
          _id: '$_id',
          chat: { $first: '$$ROOT' },
        },
      },
      {
        $unwind: '$chat',
      },
      {
        $replaceRoot: {
          newRoot: '$chat',
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
          user1_0: { $arrayElemAt: ['$user1', 0] },
        },
      },
      {
        $addFields: {
          sender: {
            $cond: {
              if: {
                $eq: ['$user1_0._id', req.user._id],
              },
              then: { $arrayElemAt: ['$user2', 0] },
              else: { $arrayElemAt: ['$user1', 0] },
            },
          },
          receiver: { $literal: req.user },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'lastMessage.sender',
          foreignField: '_id',
          as: 'lastMessage.sender',
        },
      },
      {
        $addFields: {
          'lastMessage.sender': { $arrayElemAt: ['$lastMessage.sender', 0] },
        },
      },
      {
        $addFields: {
          'lastMessage.sender.name': {
            $cond: {
              if: {
                $eq: ['$lastMessage.sender._id', req.user._id],
              },
              then: 'You',
              else: {
                $arrayElemAt: [
                  {
                    $split: ['$lastMessage.sender.name', ' '],
                  },
                  0,
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          'sender._id': 1,
          'sender.name': 1,
          'receiver._id': 1,
          'receiver.name': 1,
          'lastMessage.sender._id': 1,
          'lastMessage.sender.name': 1,
          'lastMessage._id': 1,
          'lastMessage.message': 1,
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
