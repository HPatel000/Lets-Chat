const Chat = require('../models/Chat')

exports.createChatService = async (user1, user2) => {
  const members = [user1, user2]

  let chat = await Chat.find({
    members: {
      $all: members,
      $size: members.length,
    },
  })
  if (chat?.length) {
    return chat[0]._id
  } else {
    chat = await Chat.create({
      members: members,
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
      { $match: { members: { $in: [user] } } },
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
          localField: 'members',
          foreignField: '_id',
          as: 'members',
        },
      },
      {
        $addFields: {
          user1_0: { $arrayElemAt: ['$members', 0] },
          memlength: { $size: '$members' },
        },
      },
      {
        $addFields: {
          sender: {
            $cond: {
              if: {
                $and: [
                  { $eq: ['$user1_0._id', req.user._id] },
                  { $eq: ['$memlength', 2] },
                ],
              },
              then: { $arrayElemAt: ['$members', 1] },
              else: { $arrayElemAt: ['$members', 0] },
              if: {
                $gt: ['$memlength', 2],
              },
              then: null,
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
          members: {
            $map: {
              input: '$members',
              as: 'member',
              in: {
                name: '$$member.name',
                _id: '$$member._id',
              },
            },
          },
          isGroup: 1,
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
