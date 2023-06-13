const express = require('express')
const { getMessages } = require('../controllers/chat')

const chatRouter = express.Router()

chatRouter.get('/', getMessages)
