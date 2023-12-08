const Chat = require('../models/Chat')
const mongoose = require('mongoose')

const singleChatAggregation = (userId) => [
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
    },
  },
  {
    $addFields: {
      sender: {
        $cond: [
          {
            $and: [
              { $eq: ['$user1_0._id', userId] },
              { $eq: ['$isGroup', false] },
              { $eq: [{ $size: '$members' }, 2] },
            ],
          },
          { $arrayElemAt: ['$members', 1] },
          { $arrayElemAt: ['$members', 0] },
        ],
      },
      receiver: {
        $cond: {
          if: { $eq: ['$user1_0._id', userId] },
          then: { $arrayElemAt: ['$members', 0] },
          else: { $arrayElemAt: ['$members', 1] },
        },
      },
    },
  },
]

const groupChatAggregation = () => [
  {
    $lookup: {
      from: 'users',
      localField: 'admin',
      foreignField: '_id',
      as: 'admin',
    },
  },
  {
    $lookup: {
      from: 'users',
      localField: 'owner',
      foreignField: '_id',
      as: 'owner',
    },
  },
  {
    $addFields: {
      owner: {
        $cond: {
          if: { $eq: ['$isGroup', true] },
          then: { $arrayElemAt: ['$owner', 0] },
          else: '$$REMOVE',
        },
      },
    },
  },
]

const lastMessageAggregation = (userId) => [
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
            $eq: ['$lastMessage.sender._id', userId],
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
]

exports.createChatService = async (user1, user2) => {
  const members = [user1, user2]

  if (user1 === user2) {
    members.splice(1, 1)
  }

  let chat = await Chat.find({
    members: {
      $all: members,
      $size: members.length,
    },
  })
  chat = chat[0]
  if (!chat) {
    chat = await Chat.create({
      members: members,
    })
  }

  chat = await Chat.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(chat._id) } },
    ...singleChatAggregation(user1),
    {
      $project: {
        isGroup: 1,
        'receiver._id': 1,
        'receiver.name': 1,
        'sender._id': 1,
        'sender.name': 1,
      },
    },
  ])
  return chat[0]
}

exports.getChatIdFromUsers = async (req, res, next) => {
  try {
    const user1 = req.user._id
    const user2 = req.params.user
    if (user1 && user2) {
      const chat = await this.createChatService(
        user1.toString(),
        user2.toString()
      )
      return res.status(200).json(chat)
    }
    return res.status(400).json({ error: 'error in getting chat' })
  } catch (e) {
    return res.status(500).json({ error: 'something went wrong!' })
  }
}

exports.deleteChatIfEmpty = async (req, res, next) => {
  try {
    const { id } = req.params
    const chat = await Chat.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'messages',
          localField: '_id',
          foreignField: 'chatId',
          as: 'messages',
        },
      },
    ])
    if (chat[0].messages.length == 0 && !chat[0].isGroup) {
      await this.deleteChat(req, res, next)
    }
    return res.status(200)
  } catch (e) {
    return res.status(500).json({ error: 'something went wrong!' })
  }
}

exports.getUserChats = async (req, res, next) => {
  try {
    const user = req.user._id
    const page = req.params.page || 1
    const limit = req.params.limit || 10
    const chat = await Chat.aggregate([
      { $match: { members: { $in: [user] } } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      ...lastMessageAggregation(req.user._id),
      ...singleChatAggregation(req.user._id),
      ...groupChatAggregation(),
      {
        $project: {
          members: {
            $cond: {
              if: { $eq: ['$isGroup', true] },
              then: {
                $map: {
                  input: '$members',
                  as: 'member',
                  in: {
                    name: '$$member.name',
                    _id: '$$member._id',
                  },
                },
              },
              else: '$$REMOVE',
            },
          },
          isGroup: 1,
          admin: {
            $cond: {
              if: { $eq: ['$isGroup', true] },
              then: {
                $map: {
                  input: '$admin',
                  as: 'admin',
                  in: {
                    name: '$$admin.name',
                    _id: '$$admin._id',
                  },
                },
              },
              else: '$$REMOVE',
            },
          },
          name: {
            $cond: {
              if: { $eq: ['$isGroup', true] },
              then: '$name',
              else: '$$REMOVE',
            },
          },
          grpImg: {
            $cond: {
              if: { $eq: ['$isGroup', true] },
              then: '$grpImg',
              else: '$$REMOVE',
            },
          },
          owner: {
            $cond: {
              if: { $eq: ['$isGroup', true] },
              then: {
                name: '$owner.name',
                _id: '$owner._id',
              },
              else: '$$REMOVE',
            },
          },
          sender: {
            $cond: {
              if: { $eq: ['$isGroup', false] },
              then: {
                name: '$sender.name',
                _id: '$sender._id',
              },
              else: '$$REMOVE',
            },
          },
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
