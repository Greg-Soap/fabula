import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

import User from '#models/user'

test.group('Auth', (group) => {
  group.each.setup(async () => {
    await testUtils.db().truncate()
  })

  test('should login user with valid credentials', async ({ client, assert }) => {
    await User.create({
      fullName: 'John Doe',
      email: 'john-login@example.com',
      password: 'password123',
    })

    const response = await client
      .post('/api/v1/auth/login')
      .json({
        email: 'john-login@example.com',
        password: 'password123',
      })
      .withCsrfToken()

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Login successful' })
    response.assertBodyContains({ data: { user: { email: 'john-login@example.com' } } })
    response.assertBodyContains({ data: { redirectTo: '/dashboard' } })
  })

  test('should not login user with invalid credentials', async ({ client }) => {
    await User.create({
      fullName: 'John Doe',
      email: 'john-invalid@example.com',
      password: 'password123',
    })

    const response = await client
      .post('/api/v1/auth/login')
      .json({
        email: 'john-invalid@example.com',
        password: 'wrongpassword',
      })
      .withCsrfToken()

    response.assertStatus(401)
  })

  test('should not login non-existent user', async ({ client }) => {
    const response = await client
      .post('/api/v1/auth/login')
      .json({
        email: 'nonexistent@example.com',
        password: 'password123',
      })
      .withCsrfToken()

    response.assertStatus(401)
  })

  test('should validate required fields on login', async ({ client }) => {
    const response = await client
      .post('/api/v1/auth/login')
      .json({
        email: '',
        password: '',
      })
      .withCsrfToken()

    response.assertStatus(400)
  })

  test('should logout authenticated user', async ({ client }) => {
    await User.create({
      fullName: 'John Doe',
      email: 'john-logout@example.com',
      password: 'password123',
    })

    const loginResponse = await client
      .post('/api/v1/auth/login')
      .json({
        email: 'john-logout@example.com',
        password: 'password123',
      })
      .withCsrfToken()

    loginResponse.assertStatus(200)

    const logoutResponse = await client.get('/logout')
    logoutResponse.assertRedirectsTo('/')
  })
})
