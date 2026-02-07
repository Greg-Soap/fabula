import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import Series from '#models/series'
import { slugify } from '#utils/functions'
import { createSeriesValidator, updateSeriesValidator } from '#validators/series'

function ensureUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  return (async () => {
    let slug = baseSlug
    let n = 1
    while (true) {
      const q = Series.query().where('slug', slug)
      if (excludeId) q.whereNot('id', excludeId)
      const existing = await q.first()
      if (!existing) return slug
      slug = `${baseSlug}-${++n}`
    }
  })()
}

export default class SeriesController {
  async index({ inertia }: HttpContext) {
    const series = await Series.query().orderBy('created_at', 'desc')
    return inertia.render('series/index', { series: series.map((s) => s.serialize()) })
  }

  async show({ params, inertia, response }: HttpContext) {
    const series = await Series.findBy('slug', params.slug)
    if (!series) return response.notFound()
    return inertia.render('series/show', { series: series.serialize() })
  }

  async dashboardIndex({ inertia }: HttpContext) {
    const series = await Series.query().orderBy('created_at', 'desc')
    return inertia.render('dashboard/series/index', { series: series.map((s) => s.serialize()) })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('dashboard/series/create', {})
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createSeriesValidator)
    const baseSlug = slugify(payload.title) || 'series'
    const slug = await ensureUniqueSlug(baseSlug)

    const series = new Series()
    series.title = payload.title
    series.slug = slug
    series.shortDescription = payload.shortDescription ?? null
    series.longDescription = payload.longDescription ?? null
    series.rating = payload.rating ?? null
    series.personalReview = payload.personalReview ?? null
    series.trailerUrl = payload.trailerUrl ?? null
    series.numberOfSeasons = payload.numberOfSeasons ?? null

    const coverFile = request.file('coverImage')
    if (coverFile?.isValid) {
      const attachmentManager = await app.container.make('jrmc.attachment')
      series.coverImage = (await attachmentManager.createFromFile(coverFile)) as NonNullable<
        Series['coverImage']
      >
    }

    await series.save()
    session.flash('success', 'Series created successfully.')
    return response.redirect().toRoute('dashboard.series.index')
  }

  async edit({ params, inertia, response }: HttpContext) {
    const series = await Series.find(params.id)
    if (!series) return response.notFound()
    return inertia.render('dashboard/series/edit', { series: series.serialize() })
  }

  async update({ params, request, response, session }: HttpContext) {
    const series = await Series.find(params.id)
    if (!series) return response.notFound()

    const payload = await request.validateUsing(updateSeriesValidator)
    const baseSlug = slugify(payload.title) || 'series'
    const slug = await ensureUniqueSlug(baseSlug, series.id)

    series.title = payload.title
    series.slug = slug
    series.shortDescription = payload.shortDescription ?? null
    series.longDescription = payload.longDescription ?? null
    series.rating = payload.rating ?? null
    series.personalReview = payload.personalReview ?? null
    series.trailerUrl = payload.trailerUrl ?? null
    series.numberOfSeasons = payload.numberOfSeasons ?? null

    const coverFile = request.file('coverImage')
    if (coverFile?.isValid) {
      const attachmentManager = await app.container.make('jrmc.attachment')
      series.coverImage = (await attachmentManager.createFromFile(coverFile)) as NonNullable<
        Series['coverImage']
      >
    }

    await series.save()
    session.flash('success', 'Series updated successfully.')
    return response.redirect().toRoute('dashboard.series.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const series = await Series.find(params.id)
    if (!series) return response.notFound()
    await series.delete()
    session.flash('success', 'Series deleted.')
    return response.redirect().back()
  }
}
