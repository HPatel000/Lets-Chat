const express = require('express')
const { authenticate } = require('../middlewares/auth')
const {
  getMessages,
  deleteMessage,
  saveMessage,
  reactToMsg,
} = require('../controllers/messages')

const msgRouter = express.Router()

// get('/msg/*', authenticate, getMessages)
msgRouter
  .get('/:id', authenticate, getMessages)
  .post('/:id', authenticate, saveMessage)
  .put('/:id', authenticate, reactToMsg)
  .delete('/:id', authenticate, deleteMessage)

module.exports = msgRouter
