const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      match: [/^[a-zA-Z0-9 ]*$/, 'special characters are not allowed'],
    },
    username: {
      type: String,
      required: [true, 'username is required'],
      unique: [true, 'Username not avaiable!'],
    },
    email: {
      type: String,
      required: [true, 'Email Id is required'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      validate: {
        validator: (v) => v.length >= 8,
        message: (props) =>
          `${props.value.length} is shorter length than the minimum allowed length (8)`,
      },
      maxlength: [20, 'Max length requried for password is 20'],
      select: false,
    },
  },
  { timestamps: true }
)

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('User', UserSchema)
