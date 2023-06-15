const express = require('express')
const connectDB = require('./DB/connectDB')
const cookieParser = require('cookie-parser')
const userRouter = require('./routes/user')
const cors = require('cors')
const chatRouter = require('./routes/chat')
const authRouter = require('./routes/auth')

const app = new express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())

connectDB()

app.get('/', (req, res) => {
  res.send('Hello')
})

app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/chat', chatRouter)

app.listen(5000, () => {
  console.log('SERVER STARTED AT PORT 5000')
})
