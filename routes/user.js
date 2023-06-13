const express = require('express')
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/user')

const userRouter = express.Router()

userRouter
  .get('/', getAllUsers)
  .post('/', createUser)
  .patch('/:id', updateUser)
  .delete('/:id', deleteUser)

module.exports = userRouter
