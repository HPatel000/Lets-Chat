const User = require('../models/User')

exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({})
    return res.status(200).json({ count: allUsers.length, data: allUsers })
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: 'something went wrong!' })
  }
}

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body)
    return res.status(201).json(user)
  } catch (e) {
    console.log(e)
    if (e.code == 11000) {
      return res.status(500).json({ error: 'Duplicate Email' })
    }
    return res.status(500).json({ error: e })
  }
}

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    return res.status(200).json(user)
  } catch (e) {
    console.log(e)
    if (e.code == 11000) {
      return res.status(500).json({ error: 'Duplicate Email' })
    }
    return res.status(500).json({ error: 'something went wrong!' })
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id
    await User.findByIdAndDelete(id)
    return res.status(200).json({ message: 'User deleted successfully' })
  } catch (e) {
    console.log(e)
    return res.status(500).json({ error: 'something went wrong!' })
  }
}
