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

const app = new express()
const server = app.listen(5000, () => {
  console.log('SERVER STARTED AT PORT 5000...')
})
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
})
app.set('socketio', io)

app.use(express.json())
app.use(cors({ orgin: 'http://localhost:3000' }))
app.use(cookieParser())

const gfs = connectDB()
app.set('gfs', gfs)

app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/chat', authenticate, chatRouter)
app.use('/msg', authenticate, msgRouter)
app.use('/group', authenticate, groupChatRouter)
app.use('/file', authenticate, fileRouter)
