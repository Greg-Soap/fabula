import { Head, Link } from '@inertiajs/react'
import { ArrowLeft, BookOpen, ExternalLink, Music2, Share2, Star } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { DetailPageBackground } from '@/components/detail-page-background'
import { PublicLayout } from '@/components/layouts/public'
import { Button } from '@/components/ui/button'
import { useThemeAutoplay } from '@/hooks/use-theme-autoplay'
import { getYouTubeEmbedUrl } from '@/lib/youtube'

interface NovelShowProps {
  novel: {
    id: string
    title: string
    slug: string
    shortDescription: string | null
    longDescription: string | null
    coverImage: { url?: string } | null
    rating: number | null
    personalReview: string | null
    externalLink: string | null
    numberOfChapters: number | null
    themeUrl: string | null
    genre: string | null
    releaseYear: number | null
  }
  seo?: {
    canonicalUrl: string
    ogImageUrl?: string
    description?: string
    title: string
  }
}

function getCoverUrl(coverImage: NovelShowProps['novel']['coverImage']): string | null {
  if (!coverImage || typeof coverImage !== 'object') return null
  return (coverImage as { url?: string }).url ?? null
}

export default function NovelShow({ novel, seo }: NovelShowProps) {
  const [sharing, setSharing] = useState(false)
  const coverUrl = getCoverUrl(novel.coverImage)
  const {
    videoId: themeVideoId,
    containerId: themeContainerId,
    playTheme,
    playFailed,
  } = useThemeAutoplay(novel.themeUrl)
  const themeEmbedUrlFallback = getYouTubeEmbedUrl(novel.themeUrl, { mute: true })
  const title = seo?.title ?? novel.title
  const description = seo?.description ?? novel.shortDescription ?? undefined

  async function handleShare() {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    if (!url) return
    setSharing(true)
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          url,
          title: novel.title,
          text: novel.shortDescription ?? undefined,
        })
        toast.success('Link shared')
      } else {
        await navigator.clipboard.writeText(url)
        toast.success('Link copied to clipboard')
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        await navigator.clipboard?.writeText(url).catch(() => {})
        toast.success('Link copied to clipboard')
      }
    } finally {
      setSharing(false)
    }
  }

  return (
    <PublicLayout>
      <Head title={title}>
        {description && <meta name='description' content={description} />}
        {seo?.canonicalUrl && <link rel='canonical' href={seo.canonicalUrl} />}
        {seo?.ogImageUrl && <meta property='og:image' content={seo.ogImageUrl} />}
        <meta property='og:title' content={title} />
        {description && <meta property='og:description' content={description} />}
        {seo?.canonicalUrl && <meta property='og:url' content={seo.canonicalUrl} />}
        <meta property='og:type' content='website' />
        <meta name='twitter:card' content={seo?.ogImageUrl ? 'summary_large_image' : 'summary'} />
        <meta name='twitter:title' content={title} />
        {description && <meta name='twitter:description' content={description} />}
        {seo?.ogImageUrl && <meta name='twitter:image' content={seo.ogImageUrl} />}
      </Head>
      <DetailPageBackground imageUrl={coverUrl} />
      <div className='relative max-w-screen-xl mx-auto px-6 py-12'>
        <div
          className='flex flex-wrap items-center justify-between gap-2 opacity-0 animate-fabula-fade-in-up-subtle'
          style={{ animationDelay: '0.05s', animationFillMode: 'forwards' }}>
          <Button variant='ghost' size='sm' leftIcon={<ArrowLeft className='h-4 w-4' />} asChild>
            <Link href='/novels'>Back to Novels</Link>
          </Button>
          <Button
            variant='outline'
            size='sm'
            leftIcon={<Share2 className='h-4 w-4' />}
            onClick={handleShare}
            disabled={sharing}>
            {sharing ? 'Sharing…' : 'Share'}
          </Button>
        </div>

        <div className='mt-8 grid gap-8 lg:grid-cols-[300px_1fr]'>
          <div
            className='aspect-[2/3] w-full max-w-[300px] overflow-hidden rounded-lg bg-muted opacity-0 animate-fabula-fade-in-up-subtle'
            style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}>
            {coverUrl ? (
              <img
                src={coverUrl}
                alt={novel.title}
                className='h-full w-full object-cover'
                loading='lazy'
              />
            ) : (
              <div className='flex h-full w-full items-center justify-center'>
                <BookOpen className='h-24 w-24 text-muted-foreground/50' />
              </div>
            )}
          </div>

          <div
            className='space-y-6 opacity-0 animate-fabula-fade-in-up-subtle'
            style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}>
            <div>
              <h1 className='font-heading text-3xl font-normal tracking-tight'>{novel.title}</h1>
              <div className='mt-2 flex flex-wrap items-center gap-3 text-muted-foreground'>
                {novel.releaseYear != null && <span>{novel.releaseYear}</span>}
                {novel.genre && <span>{novel.genre}</span>}
                {novel.rating != null && (
                  <span className='flex items-center gap-1'>
                    <Star className='h-4 w-4 fill-amber-400 text-amber-400' />
                    {Number(novel.rating).toFixed(1)} / 10
                  </span>
                )}
                {novel.numberOfChapters != null && <span>{novel.numberOfChapters} chapters</span>}
              </div>
            </div>

            {novel.shortDescription && (
              <p className='text-muted-foreground'>{novel.shortDescription}</p>
            )}

            {novel.longDescription && (
              <div>
                <h2 className='text-lg font-semibold'>Description</h2>
                <p className='mt-2 whitespace-pre-wrap text-muted-foreground'>
                  {novel.longDescription}
                </p>
              </div>
            )}

            {novel.personalReview && (
              <div>
                <h2 className='text-lg font-semibold'>Personal review</h2>
                <p className='mt-2 whitespace-pre-wrap text-muted-foreground'>
                  {novel.personalReview}
                </p>
              </div>
            )}

            {novel.externalLink && (
              <div>
                <Button asChild rightIcon={<ExternalLink className='h-4 w-4' />}>
                  <a href={novel.externalLink} target='_blank' rel='noopener noreferrer'>
                    Find on Amazon / Kindle / Novel Updates
                  </a>
                </Button>
              </div>
            )}

            {novel.themeUrl && (
              <div>
                <h2 className='text-lg font-semibold'>Theme</h2>
                <div className='mt-2 flex flex-col gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    asChild
                    rightIcon={<ExternalLink className='h-4 w-4' />}>
                    <a href={novel.themeUrl} target='_blank' rel='noopener noreferrer'>
                      Listen to theme
                    </a>
                  </Button>
                  {themeVideoId && themeContainerId ? (
                    <>
                      <div className='aspect-video w-full max-w-md overflow-hidden rounded-lg bg-muted'>
                        <div id={themeContainerId} className='h-full w-full' />
                      </div>
                      {playFailed && (
                        <Button
                          type='button'
                          variant='secondary'
                          size='sm'
                          leftIcon={<Music2 className='h-4 w-4' />}
                          onClick={playTheme}>
                          Play theme
                        </Button>
                      )}
                    </>
                  ) : (
                    themeEmbedUrlFallback && (
                      <div className='aspect-video w-full max-w-md overflow-hidden rounded-lg bg-muted'>
                        <iframe
                          title='Theme'
                          src={themeEmbedUrlFallback}
                          className='h-full w-full'
                          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                          allowFullScreen
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
