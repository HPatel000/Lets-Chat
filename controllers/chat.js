const Chat = require('../models/Chat')

exports.getMessages = async (req, res) => {
  try {
    const chat = Chat.find({})
    return res.status(200).json({ data: req.user })
  } catch (e) {
    return res.status(500).json({ error: 'something went wrong!' })
  }
}
