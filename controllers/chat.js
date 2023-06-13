const Chat = require('../models/Chat')

exports.getMessages = async (req, res) => {
  try {
    const chat = Chat.find({})
  } catch (e) {
    res.status(500).json({ error: 'something went wrong!' })
  }
}
