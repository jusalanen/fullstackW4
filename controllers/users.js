const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    if( body.password.length < 3) {
      return response.status(400)
        .send( { error: 'password must have at least 3 characters' })
    }

    const usersInDb = await User.find({})
    const usernames = usersInDb.map( u => u.username )
    if (usernames.includes(body.username)) {
      return response.status(400)
        .send({ error: 'username must be unique' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
      adult: body.adult === undefined ? true : body.adult
    })

    const savedUser = await user.save()

    response.status(201).send(savedUser)
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

usersRouter.get('/', async (request, response) => {
  try {
    const usersInDb = await User.find({})

    response.json(usersInDb)
  } catch (exeption) {
    console.log(exeption)
    response.status(500).json( { error: 'something went wrong...' })
  }
})

module.exports = usersRouter