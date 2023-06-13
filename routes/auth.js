const express = require('express')
const { login, signin, logout } = require('../controllers/auth')

const authRouter = express.Router()

authRouter
  .post('/login', login)

  .post('/signin', signin)

  .get('/logout', logout)
