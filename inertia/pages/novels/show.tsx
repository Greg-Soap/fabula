import { Head, Link } from '@inertiajs/react'
import { ArrowLeft, BookOpen, ExternalLink, Star } from 'lucide-react'
import { CalmPageBackground } from '@/components/calm-page-background'
import { PublicLayout } from '@/components/layouts/public'
import { Button } from '@/components/ui/button'

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
  }
}

function getCoverUrl(coverImage: NovelShowProps['novel']['coverImage']): string | null {
  if (!coverImage || typeof coverImage !== 'object') return null
  return (coverImage as { url?: string }).url ?? null
}

export default function NovelShow({ novel }: NovelShowProps) {
  const coverUrl = getCoverUrl(novel.coverImage)

  return (
    <PublicLayout>
      <Head title={novel.title} />
      <CalmPageBackground />
      <div className='relative max-w-screen-xl mx-auto px-6 py-12'>
        <Button
          variant='ghost'
          size='sm'
          leftIcon={<ArrowLeft className='h-4 w-4' />}
          className='opacity-0 animate-fabula-fade-in-up-subtle'
          style={{ animationDelay: '0.05s', animationFillMode: 'forwards' }}
          asChild>
          <Link href='/novels'>Back to Novels</Link>
        </Button>

        <div className='mt-8 grid gap-8 lg:grid-cols-[300px_1fr]'>
          <div
            className='aspect-[2/3] w-full max-w-[300px] overflow-hidden rounded-lg bg-muted opacity-0 animate-fabula-fade-in-up-subtle'
            style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}>
            {coverUrl ? (
              <img src={coverUrl} alt={novel.title} className='h-full w-full object-cover' />
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
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
