import type { HttpContext } from '@adonisjs/core/http'
import { randomUUID } from 'node:crypto'
import User from '#models/user'
import sessionService from '#services/session_service'
import { loginValidator } from '#validators/auth'

export default class AuthController {
  async login({ request, response, auth, now, session }: HttpContext) {
    const { email, password, remember } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    await auth.use('web').login(user, remember)
    await user.merge({ lastLoginAt: now }).save()

    const deviceSessionId = randomUUID()
    session.put('deviceSessionId', deviceSessionId)
    await sessionService.createOrUpdateSession({
      deviceSessionId,
      userId: user.id,
      ipAddress: request.ip(),
      userAgent: request.header('user-agent') || null,
      lastActivity: now,
    })

    return response.ok({
      message: 'Login successful',
      data: {
        user,
        redirectTo: '/dashboard',
      },
    })
  }

  async logout({ auth, response, session }: HttpContext) {
    await auth.use('web').logout()
    session.forget('deviceSessionId')
    return response.redirect('/')
  }
}
