const User = require('../models/User')

exports.login = async (req, res) => {
  const { username, password } = req.body

  try {
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: 'Please provide an username and password' })
    }

    // Check for user
    const user = await User.findOne({ username }).select('+password')

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    sendTokenResponse(user, 200, res)
  } catch (e) {
    res.status(500).json({ error: 'something went wrong!' })
  }
}

exports.signin = async (req, res) => {
  try {
    const { name, username, email, password } = req.body

    const checkUser = await User.find({})
      .or([{ username: username, email: email }])
      .exec()
    if (checkUser.length > 0) {
      return res.status(401).json({ error: 'User Already Exists!' })
    }

    // Create user
    const user = await User.create({
      name,
      username,
      email,
      password,
    })

    sendTokenResponse(user, 200, res)
  } catch (error) {
    let errors = {}
    if (error.name === 'ValidationError') {
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message
      })
    }
    if (error.name === 'MongoServerError' && error.code === 11000) {
      const field = error.message.includes('username') ? 'username' : 'email'
      errors[field] = `${field} must be unique`
    }
    res.status(500).json({ error: errors })
  }
}

exports.logout = async (req, res) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    })

    res.status(200).json({
      data: {},
    })
  } catch (e) {
    res.status(500).json({ error: 'something went wrong!' })
  }
}

exports.checkUser = async (req, res) => {
  if (req.user) {
    return res.status(200).json(req.user)
  }
  return res.status(401).json({})
}

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken()

  const options = {
    expires: new Date(
      Date.now() + +process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  }

  if (process.env.NODE_ENV === 'production') {
    options.secure = true
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    })
}
