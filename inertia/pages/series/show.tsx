import { Head, Link } from '@inertiajs/react'
import { ArrowLeft, Film, Star } from 'lucide-react'
import { CalmPageBackground } from '@/components/calm-page-background'
import { PublicLayout } from '@/components/layouts/public'
import { Button } from '@/components/ui/button'

interface SeriesShowProps {
  series: {
    id: string
    title: string
    slug: string
    shortDescription: string | null
    longDescription: string | null
    coverImage: { url?: string } | null
    rating: number | null
    personalReview: string | null
    trailerUrl: string | null
    numberOfSeasons: number | null
  }
}

function getCoverUrl(coverImage: SeriesShowProps['series']['coverImage']): string | null {
  if (!coverImage || typeof coverImage !== 'object') return null
  return (coverImage as { url?: string }).url ?? null
}

function getYouTubeEmbedUrl(url: string | null): string | null {
  if (!url || typeof url !== 'string') return null
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : null
}

export default function SeriesShow({ series }: SeriesShowProps) {
  const coverUrl = getCoverUrl(series.coverImage)
  const embedUrl = getYouTubeEmbedUrl(series.trailerUrl)

  return (
    <PublicLayout>
      <Head title={series.title} />
      <CalmPageBackground />
      <div className='relative max-w-screen-xl mx-auto px-6 py-12'>
        <Button
          variant='ghost'
          size='sm'
          leftIcon={<ArrowLeft className='h-4 w-4' />}
          className='opacity-0 animate-fabula-fade-in-up-subtle'
          style={{ animationDelay: '0.05s', animationFillMode: 'forwards' }}
          asChild>
          <Link href='/series'>Back to Series</Link>
        </Button>

        <div className='mt-8 grid gap-8 lg:grid-cols-[300px_1fr]'>
          <div
            className='aspect-[2/3] w-full max-w-[300px] overflow-hidden rounded-lg bg-muted opacity-0 animate-fabula-fade-in-up-subtle'
            style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}>
            {coverUrl ? (
              <img src={coverUrl} alt={series.title} className='h-full w-full object-cover' />
            ) : (
              <div className='flex h-full w-full items-center justify-center'>
                <Film className='h-24 w-24 text-muted-foreground/50' />
              </div>
            )}
          </div>

          <div
            className='space-y-6 opacity-0 animate-fabula-fade-in-up-subtle'
            style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}>
            <div>
              <h1 className='font-heading text-3xl font-normal tracking-tight'>{series.title}</h1>
              <div className='mt-2 flex flex-wrap items-center gap-3 text-muted-foreground'>
                {series.rating != null && (
                  <span className='flex items-center gap-1'>
                    <Star className='h-4 w-4 fill-amber-400 text-amber-400' />
                    {Number(series.rating).toFixed(1)} / 10
                  </span>
                )}
                {series.numberOfSeasons != null && (
                  <span>
                    {series.numberOfSeasons} season{series.numberOfSeasons !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>

            {series.shortDescription && (
              <p className='text-muted-foreground'>{series.shortDescription}</p>
            )}

            {series.longDescription && (
              <div>
                <h2 className='text-lg font-semibold'>Description</h2>
                <p className='mt-2 whitespace-pre-wrap text-muted-foreground'>
                  {series.longDescription}
                </p>
              </div>
            )}

            {series.personalReview && (
              <div>
                <h2 className='text-lg font-semibold'>Personal review</h2>
                <p className='mt-2 whitespace-pre-wrap text-muted-foreground'>
                  {series.personalReview}
                </p>
              </div>
            )}

            {embedUrl && (
              <div>
                <h2 className='text-lg font-semibold'>Trailer</h2>
                <div className='mt-2 aspect-video w-full max-w-2xl overflow-hidden rounded-lg bg-muted'>
                  <iframe
                    title='Trailer'
                    src={embedUrl}
                    className='h-full w-full'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
