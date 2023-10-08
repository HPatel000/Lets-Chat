const express = require('express')
const { authenticate } = require('../middlewares/auth')
const {
  getMessages,
  deleteMessage,
  saveMessage,
  reactToMsg,
} = require('../controllers/message')

const msgRouter = express.Router()

// get('/msg/*', authenticate, getMessages)
msgRouter
  .get('/:chatId/:page?/:limit?', authenticate, getMessages)
  .post('/:id?', authenticate, saveMessage)
  .put('/:id', authenticate, reactToMsg)
  .delete('/:id', authenticate, deleteMessage)

module.exports = msgRouter
