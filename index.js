const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')


if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config()
}

app.use(cors())
app.use(bodyParser.json())
app.use(morgan('tiny'))

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

const mongoUrl = process.env.MONGODB_URI
mongoose.connect(mongoUrl, { useNewUrlParser: true })
  .then( () => {
    console.log('Connected to database', mongoUrl)
  })
  .catch( error => {
    console.log('mongo error', error.message)
  })
mongoose.Promise = global.Promise

const server =http.createServer(app)
const PORT = 3003
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app,
  server,
  mongoose
}