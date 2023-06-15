const jwt = require('jsonwebtoken')
const env = require('../env')
const User = require('../models/User')

exports.authenticate = async (req, res, next) => {
  try {
    token = req.cookies.token
    if (!token) {
      return res.status(401).json({ error: 'Unautorized Access' })
    }

    const decode = jwt.verify(token, env.JWT_SECRET)
    req.user = await User.findById(decode.id)
    next()
  } catch (e) {
    return res.status(500).json({ error: 'something went wrong!' })
  }
}

exports.autorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `${req.user.role} is not authorized to access this route`,
      })
    }
    next()
  }
}
