const supertest = require('supertest')
const { app, server, mongoose } = require('../index')
const api = supertest(app)

test('get returns json of correct size', async () => {
  const resp = await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(resp.body.length).toBe(4)
})

test('post returns correct blog', async () => {
  const newblog = {
    title: 'testing post',
    author: 'me',
    url: 'someurl/For/Testing',
    likes: 0
  }
  await api.post('api/blogs').send(newblog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const resp = await api.get('/api/blogs')

  const urls = resp.body.map(r => r.url)
  expect(urls).toContain('someurl/For/Testing')
})

afterAll( async () => {
  await mongoose.disconnect()
  await server.close()
})