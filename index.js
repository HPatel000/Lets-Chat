const express = require('express')
const { connectDB } = require('./DB/connectDB')
const userRouter = require('./routes/user')
const cors = require('cors')

const app = new express()
app.use(express.json())
app.use(cors())

connectDB()

app.get('/', (req, res) => {
  res.send('Hello')
})

app.use('/user', userRouter)

app.listen(5000, () => {
  console.log('SERVER STARTED AT PORT 5000')
})
