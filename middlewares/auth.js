const jwt = require('jsonwebtoken')
const env = require('../env')
const User = require('../models/User')
const GroupChat = require('../models/GroupChat')

exports.authenticate = async (req, res, next) => {
  try {
    token = req.cookies.token
    if (!token) {
      return res.status(401).json({ error: 'Unautorized Access' })
    }

    const decode = jwt.verify(token, env.JWT_SECRET)
    req.user = await User.findById(decode.id)
    next()
  } catch (e) {
    return res.status(500).json({ error: 'something went wrong!' })
  }
}

exports.isAdminofGroup = async (req, res, next) => {
  try {
    const user = req.user._id
    const { id } = req.params
    const group = await GroupChat.findById(id)
    if (!group) {
      return res.status(404).json({ error: 'no group found' })
    }
    const isUserAdmin = group.admin.indexOf(user)
    if (isUserAdmin == -1) {
      return res.status(400).json({ error: 'you are unauthorized' })
    }
    next()
  } catch (e) {
    return res.status(500).json({ error: 'something went wrong!' })
  }
}

exports.isOwnerofGroup = async (req, res, next) => {
  try {
    const user = req.user._id
    const { id } = req.params
    const group = await GroupChat.findById(id)
    if (!group) {
      return res.status(404).json({ error: 'no group found' })
    }
    const isUserAdmin = group.admin.indexOf(user)
    if (isUserAdmin == -1) {
      return res.status(400).json({ error: 'you are unauthorized' })
    }
    next()
  } catch (e) {
    return res.status(500).json({ error: 'something went wrong!' })
  }
}
