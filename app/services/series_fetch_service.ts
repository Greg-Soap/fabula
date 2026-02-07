import env from '#start/env'

const TMDB_BASE = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

export interface SeriesFetchResult {
  title?: string
  shortDescription?: string
  longDescription?: string
  rating?: number
  numberOfSeasons?: number
  trailerUrl?: string
  coverImageUrl?: string
}

export class SeriesFetchService {
  async fetchByQuery(query: string): Promise<SeriesFetchResult> {
    const apiKey = env.get('TMDB_API_KEY')
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('TMDB API key not configured')
    }

    const trimmed = query.trim()
    if (!trimmed) {
      throw new Error('Query is required')
    }

    const searchRes = await fetch(
      `${TMDB_BASE}/search/tv?api_key=${encodeURIComponent(apiKey)}&query=${encodeURIComponent(trimmed)}`,
    )
    if (!searchRes.ok) {
      throw new Error('TMDB search failed')
    }
    const searchData = (await searchRes.json()) as { results?: { id: number }[] }
    const first = searchData.results?.[0]
    if (!first?.id) {
      throw new Error('No series found')
    }

    const [detailsRes, videosRes] = await Promise.all([
      fetch(`${TMDB_BASE}/tv/${first.id}?api_key=${encodeURIComponent(apiKey)}`),
      fetch(`${TMDB_BASE}/tv/${first.id}/videos?api_key=${encodeURIComponent(apiKey)}`),
    ])

    if (!detailsRes.ok) {
      throw new Error('TMDB details failed')
    }

    const details = (await detailsRes.json()) as {
      name?: string
      overview?: string
      number_of_seasons?: number
      vote_average?: number
      poster_path?: string | null
    }

    let trailerUrl: string | undefined
    if (videosRes.ok) {
      const videosData = (await videosRes.json()) as {
        results?: { type?: string; key?: string }[]
      }
      const trailer = videosData.results?.find((v) => v.type === 'Trailer' || v.type === 'Teaser')
      if (trailer?.key) {
        trailerUrl = `https://www.youtube.com/watch?v=${trailer.key}`
      }
    }

    const overview = details.overview?.trim() ?? undefined
    const title = details.name?.trim() ?? undefined
    const rating =
      details.vote_average != null && Number.isFinite(details.vote_average)
        ? details.vote_average
        : undefined
    const numberOfSeasons =
      details.number_of_seasons != null && Number.isInteger(details.number_of_seasons)
        ? details.number_of_seasons
        : undefined
    const coverImageUrl =
      details.poster_path != null && details.poster_path !== ''
        ? `${TMDB_IMAGE_BASE}${details.poster_path}`
        : undefined

    return {
      title,
      shortDescription: overview ? overview.slice(0, 500) : undefined,
      longDescription: overview,
      rating,
      numberOfSeasons,
      trailerUrl,
      coverImageUrl,
    }
  }
}
