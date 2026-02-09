import { Head, Link } from '@inertiajs/react'
import { BookOpen, Star } from 'lucide-react'
import { CalmPageBackground } from '@/components/calm-page-background'
import { PublicLayout } from '@/components/layouts/public'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface NovelItem {
  id: string
  title: string
  slug: string
  shortDescription: string | null
  rating: number | null
  coverImage: { url?: string } | null
}

interface NovelsIndexProps {
  novels: NovelItem[]
}

function getCoverUrl(coverImage: NovelItem['coverImage']): string | null {
  if (!coverImage || typeof coverImage !== 'object') return null
  return (coverImage as { url?: string }).url ?? null
}

export default function NovelsIndex({ novels }: NovelsIndexProps) {
  return (
    <PublicLayout>
      <Head title='Novels' />
      <CalmPageBackground />
      <div className='relative max-w-screen-xl mx-auto px-6 py-12'>
        <h1
          className='font-heading text-3xl font-normal tracking-tight opacity-0 animate-fabula-fade-in-up-subtle'
          style={{ animationDelay: '0.05s', animationFillMode: 'forwards' }}>
          Novels
        </h1>
        <p
          className='text-muted-foreground mt-2 opacity-0 animate-fabula-fade-in-up-subtle'
          style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}>
          Discover and share your favourite novels.
        </p>

        <div className='mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {novels.map((item, index) => {
            const coverUrl = getCoverUrl(item.coverImage)
            return (
              <Link
                key={item.id}
                href={`/novels/${item.slug}`}
                className='group opacity-0 animate-fabula-fade-in-up-subtle'
                style={{
                  animationDelay: `${0.25 + index * 0.06}s`,
                  animationFillMode: 'forwards',
                }}>
                <Card className='h-full overflow-hidden transition-shadow hover:shadow-md'>
                  <div className='aspect-[2/3] w-full bg-muted'>
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt={item.title}
                        className='h-full w-full object-cover'
                        loading='lazy'
                      />
                    ) : (
                      <div className='flex h-full w-full items-center justify-center'>
                        <BookOpen className='h-16 w-16 text-muted-foreground/50' />
                      </div>
                    )}
                  </div>
                  <CardHeader className='pb-2'>
                    <CardContent className='p-0'>
                      <h2 className='font-semibold leading-tight group-hover:text-primary'>
                        {item.title}
                      </h2>
                      {item.rating != null && (
                        <div className='mt-1 flex items-center gap-1 text-sm text-muted-foreground'>
                          <Star className='h-4 w-4 fill-amber-400 text-amber-400' />
                          <span>{Number(item.rating).toFixed(1)}</span>
                        </div>
                      )}
                      {item.shortDescription && (
                        <p className='mt-2 line-clamp-2 text-sm text-muted-foreground'>
                          {item.shortDescription}
                        </p>
                      )}
                    </CardContent>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </div>

        {novels.length === 0 && (
          <div
            className='mt-16 text-center text-muted-foreground opacity-0 animate-fabula-fade-in-up-subtle'
            style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}>
            <BookOpen className='mx-auto h-12 w-12 opacity-50' />
            <p className='mt-4'>No novels in the catalog yet.</p>
          </div>
        )}
      </div>
    </PublicLayout>
  )
}
