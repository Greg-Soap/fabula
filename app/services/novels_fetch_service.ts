const OPEN_LIBRARY_SEARCH = 'https://openlibrary.org/search.json'
const OPEN_LIBRARY_BASE = 'https://openlibrary.org'

export interface NovelFetchResult {
  title?: string
  shortDescription?: string
  longDescription?: string
  coverImageUrl?: string
  externalLink?: string
  genre?: string
  releaseYear?: number
}

interface SearchDoc {
  title?: string | string[]
  cover_i?: number
  key?: string
  first_publish_year?: number
  subject?: string[]
}

interface WorkDescription {
  value?: string
}

interface WorkResponse {
  description?: string | WorkDescription
}

export class NovelsFetchService {
  async fetchByQuery(query: string): Promise<NovelFetchResult> {
    const trimmed = query.trim()
    if (!trimmed) {
      throw new Error('Query is required')
    }

    const searchRes = await fetch(
      `${OPEN_LIBRARY_SEARCH}?title=${encodeURIComponent(trimmed)}&limit=5`,
    )
    if (!searchRes.ok) {
      throw new Error('Open Library search failed')
    }
    const searchData = (await searchRes.json()) as { docs?: SearchDoc[] }
    const first = searchData.docs?.[0]
    if (!first) {
      throw new Error('No novel found')
    }

    const title =
      typeof first.title === 'string'
        ? first.title.trim()
        : Array.isArray(first.title)
          ? first.title[0]?.trim()
          : undefined

    const coverImageUrl =
      first.cover_i != null && Number.isInteger(first.cover_i)
        ? `https://covers.openlibrary.org/b/id/${first.cover_i}-L.jpg`
        : undefined

    const workKey = first.key?.startsWith('/') ? first.key : first.key ? `/${first.key}` : undefined
    const externalLink = workKey != null ? `${OPEN_LIBRARY_BASE}${workKey}` : undefined

    let longDescription: string | undefined
    if (workKey) {
      try {
        const workRes = await fetch(`${OPEN_LIBRARY_BASE}${workKey}.json`)
        if (workRes.ok) {
          const work = (await workRes.json()) as WorkResponse
          const desc = work.description
          if (typeof desc === 'string') {
            longDescription = desc.trim() || undefined
          } else if (desc && typeof desc === 'object' && typeof desc.value === 'string') {
            longDescription = desc.value.trim() || undefined
          }
        }
      } catch {
        // ignore; longDescription stays undefined
      }
    }

    const shortDescription = longDescription != null ? longDescription.slice(0, 500) : undefined

    const releaseYear =
      first.first_publish_year != null &&
      Number.isInteger(first.first_publish_year) &&
      first.first_publish_year >= 1900 &&
      first.first_publish_year <= 2100
        ? first.first_publish_year
        : undefined

    const subjects = Array.isArray(first.subject)
      ? first.subject.map((s) => (typeof s === 'string' ? s.trim() : '')).filter(Boolean)
      : []
    const genreRaw = subjects.length > 0 ? subjects.slice(0, 3).join(', ') : undefined
    const genre = genreRaw != null && genreRaw.length > 0 ? genreRaw.slice(0, 100) : undefined

    return {
      title,
      shortDescription,
      longDescription,
      coverImageUrl,
      externalLink,
      genre,
      releaseYear,
    }
  }
}
