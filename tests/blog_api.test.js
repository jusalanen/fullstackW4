const supertest = require('supertest')
const { app, server, mongoose } = require('../index')
const api = supertest(app)

test('get returns json of correct size', async () => {
  const resp = await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(resp.body.length).toBe(4)
})

afterAll( async () => {
  await mongoose.disconnect()
  await server.close()
})

