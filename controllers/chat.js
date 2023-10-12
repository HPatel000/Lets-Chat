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
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'chat.user1',
          foreignField: '_id',
          as: 'chat.user1',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'chat.user2',
          foreignField: '_id',
          as: 'chat.user2',
        },
      },
      {
        $addFields: {
          'chat.user1': { $arrayElemAt: ['$chat.user1', 0] },
          'chat.user2': { $arrayElemAt: ['$chat.user2', 0] },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'chat.lastMessage.sender',
          foreignField: '_id',
          as: 'chat.lastMessage.sender',
        },
      },
      {
        $addFields: {
          'chat.lastMessage.sender': {
            $arrayElemAt: ['$chat.lastMessage.sender', 0],
          },
        },
      },
      {
        $project: {
          'chat.user1.name': 1,
          'chat.user1._id': 1,
          'chat.user1.name': 1,
          'chat.user2._id': 1,
          'chat.lastMessage.sender.name': 1,
          'chat.lastMessage.sender._id': 1,
          'chat.lastMessage.message': 1,
          'chat.lastMessage._id': 1,
          'chat.lastMessage.chatId': 1,
          'chat.lastMessage.createdAt': 1,
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

// [
//   { $match: { $or: [{ user1: user }, { user2: user }] } },
//   {
//     $lookup: {
//       from: 'messages',
//       localField: '_id',
//       foreignField: 'chatId',
//       as: 'lastMessage',
//     },
//   },
//   { $unwind: '$lastMessage' },
//   { $sort: { 'lastMessage.createdAt': -1 } },
//   {
//     $group: {
//       _id: '$_id',
//       chat: { $first: '$$ROOT' },
//     },
//   },
//   { $skip: (page - 1) * limit },
//   { $limit: limit },
//   {
//     $lookup: {
//       from: 'users',
//       localField: 'chat.user1',
//       foreignField: '_id',
//       as: 'chat.user1',
//     },
//   },
//   {
//     $lookup: {
//       from: 'users',
//       localField: 'chat.user2',
//       foreignField: '_id',
//       as: 'chat.user2',
//     },
//   },
//   {
//     $addFields: {
//       'chat.user1': { $arrayElemAt: ['$chat.user1', 0] },
//       'chat.user2': { $arrayElemAt: ['$chat.user2', 0] },
//     },
//   },
//   {
//     $lookup: {
//       from: 'users',
//       localField: 'chat.lastMessage.sender',
//       foreignField: '_id',
//       as: 'chat.lastMessage.sender',
//     },
//   },
//   {
//     $addFields: {
//       'chat.lastMessage.sender': {
//         $arrayElemAt: ['$chat.lastMessage.sender', 0],
//       },
//     },
//   },
//   {
//     $project: {
//       'chat.user1.name': 1,
//       'chat.user2.name': 1,
//       'chat.lastMessage.sender.name': 1,
//       'chat.lastMessage.message': 1,
//       'chat.lastMessage._id': 1,
//       'chat.lastMessage.chatId': 1,
//       'chat.lastMessage.createdAt': 1,
//     },
//   },
// ]
