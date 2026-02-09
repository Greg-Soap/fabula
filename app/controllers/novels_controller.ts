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

export default class NovelsController {
  async index({ inertia }: HttpContext) {
    const novels = await Novel.query().orderBy('created_at', 'desc')
    return inertia.render('novels/index', { novels: novels.map((n) => n.serialize()) })
  }

  async show({ params, inertia, response }: HttpContext) {
    const novel = await Novel.findBy('slug', params.slug)
    if (!novel) return response.notFound()
    return inertia.render('novels/show', { novel: novel.serialize() })
  }

  async dashboardIndex({ inertia }: HttpContext) {
    const novels = await Novel.query().orderBy('created_at', 'desc')
    return inertia.render('dashboard/novels/index', { novels: novels.map((n) => n.serialize()) })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('dashboard/novels/create', {})
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createNovelValidator)
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
