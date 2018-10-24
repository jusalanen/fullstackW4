const Blog = require('../models/blog')
const blogsRouter = require('express').Router()

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', (request, response) => {
  try {
    const blog = new Blog(request.body)
    console.log(blog)
    blog
      .save()
      .then(result => {
        response.status(201).json(result)
      })
  } catch ( err)  {
    console.log(err)
    response.status(500).json({ error: 'something wrong' })
  }
})

module.exports = blogsRouter
