const Blog = require('../models/blog')
const blogsRouter = require('express').Router()
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 } )
  response.json(blogs.map(Blog.format))
})

blogsRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    if(body.author === undefined || body.url === undefined ||
    body.author === '' || body.url === '') {
      return response.status(400)
        .send({ error: 'author or url missing' })
    }
    const user = await User.findById(body.userId)

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

  } catch (err) {
    console.log(err.message)
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
