import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import Series from '#models/series'
import { SeriesFetchService } from '#services/series_fetch_service'
import { downloadImageToBuffer, slugify } from '#utils/functions'
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

function escapeLikePattern(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_')
}

export default class SeriesController {
  async index({ inertia, request }: HttpContext) {
    const searchQuery = (request.input('q') ?? '').trim()
    const sort = (request.input('sort') ?? 'name_asc') as string
    const ratedOnly = request.input('rated_only') === '1' || request.input('rated_only') === true
    const genre = (request.input('genre') ?? '').trim()
    const query = Series.query()

    if (searchQuery) {
      const pattern = `%${escapeLikePattern(searchQuery)}%`
      query.where((builder) => {
        builder
          .whereRaw('title ILIKE ?', [pattern])
          .orWhereRaw('short_description ILIKE ?', [pattern])
      })
    }

    if (ratedOnly) {
      query.whereNotNull('rating')
    }

    if (genre) {
      query.where('genre', genre)
    }

    switch (sort) {
      case 'name_desc':
        query.orderBy('title', 'desc')
        break
      case 'date_desc':
        query.orderBy('created_at', 'desc')
        break
      case 'date_asc':
        query.orderBy('created_at', 'asc')
        break
      case 'rating_desc':
        query.orderByRaw('rating DESC NULLS LAST')
        break
      case 'year_desc':
        query.orderByRaw('release_year DESC NULLS LAST')
        break
      case 'year_asc':
        query.orderByRaw('release_year ASC NULLS LAST')
        break
      default:
        query.orderBy('title', 'asc')
    }

    const series = await query
    const genres = await Series.query()
      .select('genre')
      .whereNotNull('genre')
      .whereNot('genre', '')
      .distinct('genre')
      .orderBy('genre', 'asc')
      .then((rows) => rows.map((r) => r.genre).filter(Boolean) as string[])

    const validSort =
      sort === 'name_desc' ||
      sort === 'date_desc' ||
      sort === 'date_asc' ||
      sort === 'rating_desc' ||
      sort === 'year_desc' ||
      sort === 'year_asc'
        ? sort
        : 'name_asc'

    return inertia.render('series/index', {
      series: series.map((s) => s.serialize()),
      searchQuery,
      sort: validSort,
      ratedOnly,
      genre: genre || undefined,
      genres,
    })
  }

  async show({ params, inertia, request, response }: HttpContext) {
    const series = await Series.findBy('slug', params.slug)
    if (!series) return response.notFound()
    const baseUrl = `${request.protocol()}://${request.host()}`
    const canonicalUrl = request.completeUrl()
    const serialized = series.serialize() as { coverImage?: { url?: string } | null }
    const coverUrl = serialized.coverImage?.url
    const ogImageUrl =
      coverUrl && !coverUrl.startsWith('http')
        ? `${baseUrl}${coverUrl.startsWith('/') ? '' : '/'}${coverUrl}`
        : (coverUrl ?? null)
    const description =
      (series.shortDescription ?? series.longDescription ?? '').slice(0, 160) || undefined
    return inertia.render('series/show', {
      series: serialized,
      seo: {
        canonicalUrl,
        ogImageUrl: ogImageUrl ?? undefined,
        description,
        title: series.title,
      },
    })
  }

  async dashboardIndex({ inertia }: HttpContext) {
    const series = await Series.query().orderBy('title', 'asc')
    return inertia.render('dashboard/series/index', { series: series.map((s) => s.serialize()) })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('dashboard/series/create', {})
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createSeriesValidator)
    const normalizedTitle = payload.title.trim().toLowerCase()
    const existing = await Series.query()
      .whereRaw('LOWER(TRIM(title)) = ?', [normalizedTitle])
      .first()
    if (existing) {
      session.flash('warning', {
        type: 'already_in_catalog',
        catalog: 'series',
        existingSlug: existing.slug,
        existingTitle: existing.title,
      })
    }

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
    series.tmdbId = payload.tmdbId ?? null
    series.backdropUrl = payload.backdropUrl ?? null
    series.themeUrl = payload.themeUrl ?? null
    series.genre = payload.genre ?? null
    series.releaseYear = payload.releaseYear ?? null

    const coverFile = request.file('coverImage')
    if (coverFile?.isValid) {
      const attachmentManager = await app.container.make('jrmc.attachment')
      series.coverImage = (await attachmentManager.createFromFile(coverFile)) as NonNullable<
        Series['coverImage']
      >
    } else if (payload.coverImageUrl) {
      const buffer = await downloadImageToBuffer(payload.coverImageUrl)
      if (buffer) {
        const attachmentManager = await app.container.make('jrmc.attachment')
        series.coverImage = (await attachmentManager.createFromBuffer(
          buffer,
          'cover.jpg',
        )) as NonNullable<Series['coverImage']>
      }
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
    series.tmdbId = payload.tmdbId ?? null
    series.backdropUrl = payload.backdropUrl ?? null
    series.themeUrl = payload.themeUrl ?? null
    series.genre = payload.genre ?? null
    series.releaseYear = payload.releaseYear ?? null

    const coverFile = request.file('coverImage')
    if (coverFile?.isValid) {
      const attachmentManager = await app.container.make('jrmc.attachment')
      series.coverImage = (await attachmentManager.createFromFile(coverFile)) as NonNullable<
        Series['coverImage']
      >
    } else if (payload.coverImageUrl) {
      const buffer = await downloadImageToBuffer(payload.coverImageUrl)
      if (buffer) {
        const attachmentManager = await app.container.make('jrmc.attachment')
        series.coverImage = (await attachmentManager.createFromBuffer(
          buffer,
          'cover.jpg',
        )) as NonNullable<Series['coverImage']>
      }
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

  async fetchInfo({ request, response }: HttpContext) {
    const query = request.input('query')
    const trimmed = typeof query === 'string' ? query.trim() : ''
    if (!trimmed) {
      return response.badRequest({ message: 'Query is required' })
    }

    const service = new SeriesFetchService()
    try {
      const payload = await service.fetchByQuery(trimmed)
      return response.ok(payload)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch series info'
      if (message === 'TMDB API key not configured') {
        return response.serviceUnavailable({ message })
      }
      if (message === 'No series found') {
        return response.notFound({ message })
      }
      return response.badRequest({ message })
    }
  }
}
