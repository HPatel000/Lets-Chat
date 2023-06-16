const express = require('express')
const { getMessages, saveMessage, reactToMsg } = require('../controllers/chat')
const { authenticate } = require('../middlewares/auth')

const chatRouter = express.Router()

chatRouter.post('/get', authenticate, getMessages)
chatRouter.post('/save', authenticate, saveMessage)
chatRouter.post('/react', authenticate, reactToMsg)

module.exports = chatRouter
