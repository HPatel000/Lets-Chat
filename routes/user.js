const express = require('express')
const {
  searchUserByUsername,
  updateUser,
  deleteUser,
} = require('../controllers/user')
const { authenticate } = require('../middlewares/auth')

const userRouter = express.Router()

userRouter
  .get('/:name', authenticate, searchUserByUsername)
  .patch('/:id', updateUser)
  .delete('/:id', deleteUser)

module.exports = userRouter
