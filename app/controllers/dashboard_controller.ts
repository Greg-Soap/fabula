import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class DashboardController {
  async index({ inertia }: HttpContext) {
    const [seriesRow, novelsRow] = await Promise.all([
      db.from('series').count('* as total').first(),
      db.from('novels').count('* as total').first(),
    ])
    return inertia.render('dashboard', {
      seriesCount: Number(seriesRow?.total ?? 0),
      novelCount: Number(novelsRow?.total ?? 0),
    })
  }
}
