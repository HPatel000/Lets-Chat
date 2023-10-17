const express = require('express')
const { getUserChats, deleteChat } = require('../controllers/chat')
const { authenticate } = require('../middlewares/auth')

const chatRouter = express.Router()

chatRouter
  .get('/:page?/:limit?', authenticate, getUserChats)
  .delete('/:id', authenticate, deleteChat)

module.exports = chatRouter
