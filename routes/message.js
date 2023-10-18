const express = require('express')
const {
  getMessages,
  deleteMessage,
  saveMessage,
  reactToMsg,
} = require('../controllers/message')

const msgRouter = express.Router()

// get('/msg/*', authenticate, getMessages)
msgRouter
  .get('/:chatId/:page?/:limit?', getMessages)
  .post('/:id?', saveMessage)
  .put('/:id', reactToMsg)
  .delete('/:id', deleteMessage)

module.exports = msgRouter
