const express = require('express')
const {
  getMessages,
  saveMessage,
  deleteMessage,
  reactToMsg,
  getUserChats,
  getChatIDFromIds,
} = require('../controllers/chat')
const { authenticate } = require('../middlewares/auth')

const chatRouter = express.Router()

chatRouter.get('/', authenticate, getUserChats)
chatRouter.get('/:sender', authenticate, getChatIDFromIds)
chatRouter.get('/msg/get/:id', authenticate, getMessages)
chatRouter.delete('/msg/:id', authenticate, deleteMessage)
chatRouter.post('/msg/save', authenticate, saveMessage)
chatRouter.post('/msg/react', authenticate, reactToMsg)

module.exports = chatRouter
