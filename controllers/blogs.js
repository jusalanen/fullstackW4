const Blog = require('../models/blog')
const blogsRouter = require('express').Router()

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  try {
    const blog = new Blog({
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes
    })
    console.log(blog)

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)

  } catch (err) {
    console.log(err)
    response.status(500).json({ error: 'something wrong' })
  }
})

module.exports = blogsRouter
