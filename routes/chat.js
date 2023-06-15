const express = require('express')
const { getMessages } = require('../controllers/chat')
const { authenticate } = require('../middlewares/auth')

const chatRouter = express.Router()

chatRouter.get('/', authenticate, getMessages)

module.exports = chatRouter
