const express = require('express')
const { getUserChats, deleteChat } = require('../controllers/chat')
const { isOwnerofGroup } = require('../middlewares/auth')

const chatRouter = express.Router()

chatRouter
  .get('/:page?/:limit?', getUserChats)
  .delete('/:id', isOwnerofGroup, deleteChat)

module.exports = chatRouter
