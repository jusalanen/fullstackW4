const Blog = require('../models/blog')
const blogsRouter = require('express').Router()

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {

  const body = request.body
  if(body.author === undefined || body.url === undefined ||
  body.author === '' || body.url === '') {
    return response.status(400)
      .send({ error: 'author or url missing' })
  }
  try {
    const blog = new Blog ({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined || body.likes ==='' ? 0 : body.likes
    })

    const savedBlog = await blog.save()
    console.log(savedBlog)
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
    likes: body.likes
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true } )
    resp.json(updatedBlog)
  }  catch (err) {
    console.log(err.message)
    resp.status(400).send({ error: 'bad id' })
  }
})

module.exports = blogsRouter
