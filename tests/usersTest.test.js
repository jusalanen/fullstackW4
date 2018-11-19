const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)

test('too short password is not accepted', async () => {
  const user = {
    username: 'testuser',
    name: 'user',
    password: '1'
  }
  try {
    await api.post('api/users').send(user).expect(400)

    const resp = await api.get('api/users')
    expect(resp.body.length).toBe(1)
  } catch (err) {
    console.log(err.message)
  }
})

test('duplicate username is not accepted', async () => {
  const user = {
    'username': 'firstuser',
    'name': 'Number Two',
    'password': 'dos'
  }
  try {
    await api.post('api/users').send(user).expect(400)
    const users = await api.get('api/users')
    expect(users.body.length).toBe(1)
  } catch (err) {
    console.log(err.message)
  }
  
})

afterAll( () => {
  server.close()
})