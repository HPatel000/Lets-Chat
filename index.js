const express = require('express')
const connectDB = require('./DB/connectDB')
const cookieParser = require('cookie-parser')
const userRouter = require('./routes/user')
const cors = require('cors')
const chatRouter = require('./routes/chat')
const authRouter = require('./routes/auth')
const groupChatRouter = require('./routes/groupchat')
const msgRouter = require('./routes/message')
const { authenticate } = require('./middlewares/auth')
const fileRouter = require('./routes/files')
const path = require('path')

const app = new express()
const server = app.listen(5000, () => {
  console.log('SERVER STARTED AT PORT 5000...')
})
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
})
app.set('socketio', io)

app.use(express.json())
app.use(cors({ orgin: process.env.URL }))
app.use(cookieParser())

connectDB()

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/chat', authenticate, chatRouter)
app.use('/api/msg', authenticate, msgRouter)
app.use('/api/group', authenticate, groupChatRouter)
app.use('/api/file', authenticate, fileRouter)

app.use(express.static(path.join(__dirname, 'chat-client', 'build')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'chat-client', 'build', 'index.html'))
})
