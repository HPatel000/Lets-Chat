const express = require('express')
const {
  getMessages,
  saveMessage,
  reactToMsg,
  getUserChats,
} = require('../controllers/chat')
const { authenticate } = require('../middlewares/auth')

const chatRouter = express.Router()

chatRouter.get('/', authenticate, getUserChats)
chatRouter.post('/msg/get', authenticate, getMessages)
chatRouter.post('/msg/save', authenticate, saveMessage)
chatRouter.post('/msg/react', authenticate, reactToMsg)

module.exports = chatRouter
