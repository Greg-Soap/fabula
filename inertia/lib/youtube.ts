/**
 * Extract YouTube video ID from watch or short URL.
 * Returns null if not a YouTube URL.
 */
export function getYouTubeVideoId(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string') return null
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
  return match ? match[1] : null
}

export interface YouTubeEmbedOptions {
  mute?: boolean
}

/**
 * Build YouTube embed URL for iframe src.
 */
export function getYouTubeEmbedUrl(
  url: string | null | undefined,
  options?: YouTubeEmbedOptions,
): string | null {
  const videoId = getYouTubeVideoId(url)
  if (!videoId) return null
  const params = new URLSearchParams()
  if (options?.mute) params.set('mute', '1')
  const query = params.toString()
  return query
    ? `https://www.youtube.com/embed/${videoId}?${query}`
    : `https://www.youtube.com/embed/${videoId}`
}
