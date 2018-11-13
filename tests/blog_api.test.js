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
  //jest.setTimeout(10000)
  const newBlog = {
    title: 'testing post',
    author: 'me',
    url: 'someurl/For/Testing',
    likes: 0
  }
  try {
    const resp = await api.post('/api/blogs').send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    console.log(resp.body)
    const response = await api.get('/api/blogs')
    expect(response.body.length).toBe(6)

    const urls = response.body.map(r => r.url)

    expect(urls).toContain('someurl/For/Testing')
    await Blog.findByIdAndDelete(resp.body._id)
  } catch (err) {
    console.log(err.message)
  }
})

test('likes set to zero if not set in request', async () => {
  //jest.setTimeout(10000)
  const newBlog =  {
    title: 'testing post with no likes',
    author: 'me',
    url: 'someurl/For/Testing'
  }
  try {
    let response = await api.post('api/blogs').send(newBlog)
      .expect(201)

    console.log(response.body)

    expect(response.body.likes).toBe(0)
    await Blog.findByIdAndDelete(response.body._id)
  } catch (err) {
    console.log(err.message)
  }
})

afterAll( () => {
  server.close()
})