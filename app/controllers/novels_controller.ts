import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import Novel from '#models/novel'
import { NovelsFetchService } from '#services/novels_fetch_service'
import { downloadImageToBuffer, slugify } from '#utils/functions'
import { createNovelValidator, updateNovelValidator } from '#validators/novel'

function ensureUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  return (async () => {
    let slug = baseSlug
    let n = 1
    while (true) {
      const q = Novel.query().where('slug', slug)
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

export default class NovelsController {
  async index({ inertia, request }: HttpContext) {
    const searchQuery = (request.input('q') ?? '').trim()
    const sort = (request.input('sort') ?? 'name_asc') as string
    const ratedOnly = request.input('rated_only') === '1' || request.input('rated_only') === true
    const genre = (request.input('genre') ?? '').trim()
    const query = Novel.query()

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

    const novels = await query
    const genres = await Novel.query()
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

    return inertia.render('novels/index', {
      novels: novels.map((n) => n.serialize()),
      searchQuery,
      sort: validSort,
      ratedOnly,
      genre: genre || undefined,
      genres,
    })
  }

  async show({ params, inertia, request, response }: HttpContext) {
    const novel = await Novel.findBy('slug', params.slug)
    if (!novel) return response.notFound()
    const baseUrl = `${request.protocol()}://${request.host()}`
    const canonicalUrl = request.completeUrl()
    const serialized = novel.serialize() as { coverImage?: { url?: string } | null }
    const coverUrl = serialized.coverImage?.url
    const ogImageUrl =
      coverUrl && !coverUrl.startsWith('http')
        ? `${baseUrl}${coverUrl.startsWith('/') ? '' : '/'}${coverUrl}`
        : (coverUrl ?? null)
    const description =
      (novel.shortDescription ?? novel.longDescription ?? '').slice(0, 160) || undefined
    return inertia.render('novels/show', {
      novel: serialized,
      seo: {
        canonicalUrl,
        ogImageUrl: ogImageUrl ?? undefined,
        description,
        title: novel.title,
      },
    })
  }

  async dashboardIndex({ inertia }: HttpContext) {
    const novels = await Novel.query().orderBy('title', 'asc')
    return inertia.render('dashboard/novels/index', { novels: novels.map((n) => n.serialize()) })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('dashboard/novels/create', {})
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createNovelValidator)
    const normalizedTitle = payload.title.trim().toLowerCase()
    const existing = await Novel.query()
      .whereRaw('LOWER(TRIM(title)) = ?', [normalizedTitle])
      .first()
    if (existing) {
      session.flash('warning', {
        type: 'already_in_catalog',
        catalog: 'novels',
        existingSlug: existing.slug,
        existingTitle: existing.title,
      })
    }

    const baseSlug = slugify(payload.title) || 'novel'
    const slug = await ensureUniqueSlug(baseSlug)

    const novel = new Novel()
    novel.title = payload.title
    novel.slug = slug
    novel.shortDescription = payload.shortDescription ?? null
    novel.longDescription = payload.longDescription ?? null
    novel.rating = payload.rating ?? null
    novel.personalReview = payload.personalReview ?? null
    novel.externalLink = payload.externalLink ?? null
    novel.numberOfChapters = payload.numberOfChapters ?? null
    novel.themeUrl = payload.themeUrl ?? null
    novel.genre = payload.genre ?? null
    novel.releaseYear = payload.releaseYear ?? null

    const coverFile = request.file('coverImage')
    if (coverFile?.isValid) {
      const attachmentManager = await app.container.make('jrmc.attachment')
      novel.coverImage = (await attachmentManager.createFromFile(coverFile)) as NonNullable<
        Novel['coverImage']
      >
    } else if (payload.coverImageUrl) {
      const buffer = await downloadImageToBuffer(payload.coverImageUrl)
      if (buffer) {
        const attachmentManager = await app.container.make('jrmc.attachment')
        novel.coverImage = (await attachmentManager.createFromBuffer(
          buffer,
          'cover.jpg',
        )) as NonNullable<Novel['coverImage']>
      }
    }

    await novel.save()
    session.flash('success', 'Novel created successfully.')
    return response.redirect().toRoute('dashboard.novels.index')
  }

  async edit({ params, inertia, response }: HttpContext) {
    const novel = await Novel.find(params.id)
    if (!novel) return response.notFound()
    return inertia.render('dashboard/novels/edit', { novel: novel.serialize() })
  }

  async update({ params, request, response, session }: HttpContext) {
    const novel = await Novel.find(params.id)
    if (!novel) return response.notFound()

    const payload = await request.validateUsing(updateNovelValidator)
    const baseSlug = slugify(payload.title) || 'novel'
    const slug = await ensureUniqueSlug(baseSlug, novel.id)

    novel.title = payload.title
    novel.slug = slug
    novel.shortDescription = payload.shortDescription ?? null
    novel.longDescription = payload.longDescription ?? null
    novel.rating = payload.rating ?? null
    novel.personalReview = payload.personalReview ?? null
    novel.externalLink = payload.externalLink ?? null
    novel.numberOfChapters = payload.numberOfChapters ?? null
    novel.themeUrl = payload.themeUrl ?? null
    novel.genre = payload.genre ?? null
    novel.releaseYear = payload.releaseYear ?? null

    const coverFile = request.file('coverImage')
    if (coverFile?.isValid) {
      const attachmentManager = await app.container.make('jrmc.attachment')
      novel.coverImage = (await attachmentManager.createFromFile(coverFile)) as NonNullable<
        Novel['coverImage']
      >
    } else if (payload.coverImageUrl) {
      const buffer = await downloadImageToBuffer(payload.coverImageUrl)
      if (buffer) {
        const attachmentManager = await app.container.make('jrmc.attachment')
        novel.coverImage = (await attachmentManager.createFromBuffer(
          buffer,
          'cover.jpg',
        )) as NonNullable<Novel['coverImage']>
      }
    }

    await novel.save()
    session.flash('success', 'Novel updated successfully.')
    return response.redirect().toRoute('dashboard.novels.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const novel = await Novel.find(params.id)
    if (!novel) return response.notFound()
    await novel.delete()
    session.flash('success', 'Novel deleted.')
    return response.redirect().back()
  }

  async fetchInfo({ request, response }: HttpContext) {
    const query = request.input('query')
    const trimmed = typeof query === 'string' ? query.trim() : ''
    if (!trimmed) {
      return response.badRequest({ message: 'Query is required' })
    }

    const service = new NovelsFetchService()
    try {
      const payload = await service.fetchByQuery(trimmed)
      return response.ok(payload)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch novel info'
      if (message === 'No novel found') {
        return response.notFound({ message })
      }
      return response.badRequest({ message })
    }
  }
}
