const express = require('express')
const { getMessages, saveMessage } = require('../controllers/chat')
const { authenticate } = require('../middlewares/auth')

const chatRouter = express.Router()

chatRouter.post('/get', authenticate, getMessages)
chatRouter.post('/save', authenticate, saveMessage)

module.exports = chatRouter
