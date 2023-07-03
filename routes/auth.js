const express = require('express')
const { login, signin, logout, checkUser } = require('../controllers/auth')
const { authenticate } = require('../middlewares/auth')

const authRouter = express.Router()

authRouter
  .post('/login', login)

  .post('/signin', signin)

  .get('/logout', logout)

  .get('/checkuser', authenticate, checkUser)

module.exports = authRouter
