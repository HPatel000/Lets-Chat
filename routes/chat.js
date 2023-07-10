const express = require('express')
const {
  getMessages,
  saveMessage,
  reactToMsg,
  getUserChats,
  getChatIDFromIds,
} = require('../controllers/chat')
const { authenticate } = require('../middlewares/auth')

const chatRouter = express.Router()

chatRouter.get('/', authenticate, getUserChats)
chatRouter.get('/:sender', authenticate, getChatIDFromIds)
chatRouter.get('/msg/get/:id', authenticate, getMessages)
chatRouter.post('/msg/save', authenticate, saveMessage)
chatRouter.post('/msg/react', authenticate, reactToMsg)

module.exports = chatRouter
