const Blog = require('../models/blog')
const blogsRouter = require('express').Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 } )
  response.json(blogs.map(Blog.format))
})

blogsRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    if(body.author === undefined || body.url === undefined ||
    body.author === '' || body.url === '') {
      return response.status(400)
        .send({ error: 'author or url missing' })
    }

    const user = await User.findById(decodedToken.id)

    const blog = new Blog ({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined ? 0 : body.likes,
      user: user._id
    })

    const savedBlog = await blog.save()
    console.log(savedBlog)

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)

  } catch (exeption) {
    if (exeption.name === 'JsonWebTokenError' ) {
      response.status(401).json({ error: exeption.message })
    } else {
      console.log(exeption.message)
      response.status(500).json({ error: 'something went wrong...' })
    } 
  }
})

blogsRouter.delete('/:id', async (request, response) => {

  try {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (err) {
    console.log(err.message)
    response.status(404).send( { error: 'bad id' })
  }
})

blogsRouter.put('/:id', async (req, resp) => {
  const body = req.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: body.user
  }

  try {
    const updatedBlog = await Blog
      .findByIdAndUpdate(req.params.id, blog, { new: true } )
    resp.json(updatedBlog)
  }  catch (err) {
    console.log(err.message)
    resp.status(400).send({ error: 'bad id' })
  }
})

module.exports = blogsRouter
