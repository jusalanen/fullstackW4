const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')

test('get returns json of correct size', async () => {
  const resp = await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(resp.body.length).toBe(5)
})

test('post saves correct blog', async () => {

  const newBlog = {
    title: 'testing post',
    author: 'me',
    url: 'someurl/For/Testing',
    likes: 0
  }
  const resp = await api.post('/api/blogs').send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  expect(response.body.length).toBe(6)

  const urls = response.body.map(r => r.url)

  expect(urls).toContain('someurl/For/Testing')
  await Blog.findByIdAndDelete(resp.body._id)
})

afterAll( () => {
  server.close()
})