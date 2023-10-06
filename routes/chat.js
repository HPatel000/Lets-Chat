const express = require('express')
const {
  getUserChats,
  deleteChat,
  getChatIDFromIds,
} = require('../controllers/chat')
const { authenticate } = require('../middlewares/auth')

const chatRouter = express.Router()

chatRouter.get('/', authenticate, getUserChats)
chatRouter.delete('/', authenticate, deleteChat)
chatRouter.get('/:id', authenticate, getChatIDFromIds)

module.exports = chatRouter
