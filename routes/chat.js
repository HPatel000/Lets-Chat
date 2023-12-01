const express = require('express')
const {
  getUserChats,
  deleteChat,
  getChatIdFromUsers,
  deleteChatIfEmpty,
} = require('../controllers/chat')
const { isOwnerofGroup } = require('../middlewares/auth')

const chatRouter = express.Router()

chatRouter
  .get('/user/:user', getChatIdFromUsers)
  .get('/checkChat/:id', deleteChatIfEmpty)
  .get('/:page?/:limit?', getUserChats)
  .delete('/:id', isOwnerofGroup, deleteChat)

module.exports = chatRouter
