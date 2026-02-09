import { Head, Link, router } from '@inertiajs/react'
import { Film, LayoutGrid, List, Search, Shuffle, SlidersHorizontal, Star, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CalmPageBackground } from '@/components/calm-page-background'
import { FabulaSelect, FabulaSheet } from '@/components/combination'
import { PublicLayout } from '@/components/layouts/public'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const SERIES_VIEW_KEY = 'fabula-series-view'

interface SeriesItem {
  id: string
  title: string
  slug: string
  shortDescription: string | null
  rating: number | null
  coverImage: { url?: string } | null
  genre: string | null
  releaseYear: number | null
}

type SortOption =
  | 'name_asc'
  | 'name_desc'
  | 'date_desc'
  | 'date_asc'
  | 'rating_desc'
  | 'year_desc'
  | 'year_asc'

interface SeriesIndexProps {
  series: SeriesItem[]
  searchQuery?: string
  sort?: SortOption
  ratedOnly?: boolean
  genre?: string
  genres: string[]
}

function getCoverUrl(coverImage: SeriesItem['coverImage']): string | null {
  if (!coverImage || typeof coverImage !== 'object') return null
  return (coverImage as { url?: string }).url ?? null
}

const SORT_LABELS: Record<SortOption, string> = {
  name_asc: 'Name (A–Z)',
  name_desc: 'Name (Z–A)',
  date_desc: 'Recently added',
  date_asc: 'Oldest added',
  rating_desc: 'Rating (high to low)',
  year_desc: 'Year (newest first)',
  year_asc: 'Year (oldest first)',
}

export default function SeriesIndex({
  series,
  searchQuery = '',
  sort = 'name_asc',
  ratedOnly = false,
  genre = '',
  genres = [],
}: SeriesIndexProps) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [localSort, setLocalSort] = useState<SortOption>(sort)
  const [localRatedOnly, setLocalRatedOnly] = useState(ratedOnly)
  const [localGenre, setLocalGenre] = useState(genre)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    if (typeof window === 'undefined') return 'grid'
    return (localStorage.getItem(SERIES_VIEW_KEY) as 'grid' | 'list') || 'grid'
  })

  useEffect(() => {
    if (sheetOpen) {
      setLocalSort(sort)
      setLocalRatedOnly(ratedOnly)
      setLocalGenre(genre)
    }
  }, [sheetOpen, sort, ratedOnly, genre])

  useEffect(() => {
    try {
      localStorage.setItem(SERIES_VIEW_KEY, viewMode)
    } catch {
      // ignore
    }
  }, [viewMode])

  function applyFilters() {
    const params: Record<string, string> = {}
    if (searchQuery) params.q = searchQuery
    if (localSort !== 'name_asc') params.sort = localSort
    if (localRatedOnly) params.rated_only = '1'
    if (localGenre) params.genre = localGenre
    router.get('/series', Object.keys(params).length ? params : {})
    setSheetOpen(false)
  }

  function goToRandom() {
    if (series.length === 0) return
    const item = series[Math.floor(Math.random() * series.length)]
    router.visit(`/series/${item.slug}`)
  }

  return (
    <PublicLayout>
      <Head title='Series' />
      <CalmPageBackground />
      <div className='relative max-w-screen-xl mx-auto px-6 py-12'>
        <h1
          className='font-heading text-3xl font-normal tracking-tight opacity-0 animate-fabula-fade-in-up-subtle'
          style={{ animationDelay: '0.05s', animationFillMode: 'forwards' }}>
          Series
        </h1>
        <p
          className='text-muted-foreground mt-2 opacity-0 animate-fabula-fade-in-up-subtle'
          style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}>
          Discover and share your favourite series.
        </p>

        <div
          className='mt-8 flex flex-col gap-3 opacity-0 animate-fabula-fade-in-up-subtle sm:flex-row sm:items-center sm:gap-3'
          style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          <form method='get' action='/series' className='w-full sm:flex-1 sm:min-w-0 sm:max-w-md'>
            <input type='hidden' name='sort' value={sort} />
            {ratedOnly && <input type='hidden' name='rated_only' value='1' />}
            {genre && <input type='hidden' name='genre' value={genre} />}
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                type='search'
                name='q'
                defaultValue={searchQuery}
                placeholder='Search by title or description…'
                className='h-11 rounded-full border-border bg-background/80 pl-10 pr-10 focus-visible:ring-2'
                autoComplete='off'
              />
              {searchQuery ? (
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full text-muted-foreground hover:text-foreground'
                  aria-label='Clear search'
                  onClick={() => {
                    const params: Record<string, string> = {}
                    if (sort !== 'name_asc') params.sort = sort
                    if (ratedOnly) params.rated_only = '1'
                    if (genre) params.genre = genre
                    router.get('/series', params)
                  }}>
                  <X className='h-4 w-4' />
                </Button>
              ) : null}
            </div>
          </form>
          <FabulaSheet
            trigger={
              <Button variant='outline' size='sm' className='h-11 gap-2 shrink-0'>
                <SlidersHorizontal className='h-4 w-4' />
                Filters
              </Button>
            }
            title='Filters'
            side='right'
            contentClassName='w-full sm:max-w-sm'
            open={sheetOpen}
            onOpenChange={setSheetOpen}>
            <div className='space-y-6'>
              <div className='space-y-2'>
                <Label>Sort by</Label>
                <FabulaSelect
                  value={localSort}
                  onValueChange={(v) => setLocalSort(v as SortOption)}
                  options={(Object.keys(SORT_LABELS) as SortOption[]).map((key) => ({
                    value: key,
                    label: SORT_LABELS[key],
                  }))}
                  selectedLabel={SORT_LABELS[localSort]}
                />
              </div>
              {genres.length > 0 && (
                <div className='space-y-2'>
                  <Label>Genre</Label>
                  <FabulaSelect
                    value={localGenre || '_'}
                    onValueChange={(v) => setLocalGenre(v === '_' || v == null ? '' : v)}
                    options={[
                      { value: '_', label: 'All genres' },
                      ...genres.map((g) => ({ value: g, label: g })),
                    ]}
                    placeholder='All genres'
                  />
                </div>
              )}
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='rated-only'
                  checked={localRatedOnly}
                  onCheckedChange={(checked) => setLocalRatedOnly(checked === true)}
                />
                <Label htmlFor='rated-only' className='cursor-pointer font-normal'>
                  Rated only
                </Label>
              </div>
              <Button onClick={applyFilters} className='w-full'>
                Apply filters
              </Button>
            </div>
          </FabulaSheet>
          <div className='flex flex-wrap items-center gap-1 sm:shrink-0'>
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size='icon'
              className='h-11 w-11'
              aria-label='Grid view'
              onClick={() => setViewMode('grid')}>
              <LayoutGrid className='h-4 w-4' />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size='icon'
              className='h-11 w-11'
              aria-label='List view'
              onClick={() => setViewMode('list')}>
              <List className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              size='sm'
              className='h-11 gap-2'
              onClick={goToRandom}
              disabled={series.length === 0}
              aria-label='Surprise me'>
              <Shuffle className='h-4 w-4' />
              Surprise me
            </Button>
          </div>
        </div>

        <div
          className={
            viewMode === 'grid'
              ? 'mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'mt-10 flex flex-col gap-2'
          }>
          {series.map((item, index) => {
            const coverUrl = getCoverUrl(item.coverImage)
            const meta = [item.releaseYear, item.genre].filter(Boolean).join(' · ')
            if (viewMode === 'list') {
              return (
                <Link
                  key={item.id}
                  href={`/series/${item.slug}`}
                  className='group opacity-0 animate-fabula-fade-in-up-subtle'
                  style={{
                    animationDelay: `${0.25 + index * 0.03}s`,
                    animationFillMode: 'forwards',
                  }}>
                  <Card className='overflow-hidden transition-shadow hover:shadow-md'>
                    <div className='flex flex-row'>
                      <div className='w-20 shrink-0 bg-muted sm:w-28'>
                        {coverUrl ? (
                          <img
                            src={coverUrl}
                            alt={item.title}
                            className='h-full w-full object-cover'
                            loading='lazy'
                          />
                        ) : (
                          <div className='flex aspect-[2/3] w-full items-center justify-center'>
                            <Film className='h-8 w-8 text-muted-foreground/50 sm:h-10 sm:w-10' />
                          </div>
                        )}
                      </div>
                      <CardHeader className='min-w-0 flex-1 py-3 pr-4'>
                        <CardContent className='p-0'>
                          <h2 className='font-semibold leading-tight group-hover:text-primary'>
                            {item.title}
                          </h2>
                          {(meta || item.rating != null) && (
                            <div className='mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-muted-foreground'>
                              {meta && <span>{meta}</span>}
                              {item.rating != null && (
                                <span className='flex items-center gap-1'>
                                  <Star className='h-3.5 w-3.5 fill-amber-400 text-amber-400' />
                                  {Number(item.rating).toFixed(1)}
                                </span>
                              )}
                            </div>
                          )}
                          {item.shortDescription && (
                            <p className='mt-1 line-clamp-2 text-sm text-muted-foreground'>
                              {item.shortDescription}
                            </p>
                          )}
                        </CardContent>
                      </CardHeader>
                    </div>
                  </Card>
                </Link>
              )
            }
            return (
              <Link
                key={item.id}
                href={`/series/${item.slug}`}
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
                        <Film className='h-16 w-16 text-muted-foreground/50' />
                      </div>
                    )}
                  </div>
                  <CardHeader className='pb-2'>
                    <CardContent className='p-0'>
                      <h2 className='font-semibold leading-tight group-hover:text-primary'>
                        {item.title}
                      </h2>
                      {(meta || item.rating != null) && (
                        <div className='mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-muted-foreground'>
                          {meta && <span>{meta}</span>}
                          {item.rating != null && (
                            <span className='flex items-center gap-1'>
                              <Star className='h-4 w-4 fill-amber-400 text-amber-400' />
                              {Number(item.rating).toFixed(1)}
                            </span>
                          )}
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

        {series.length === 0 && (
          <div
            className='mt-16 text-center text-muted-foreground opacity-0 animate-fabula-fade-in-up-subtle'
            style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}>
            <Film className='mx-auto h-12 w-12 opacity-50' />
            <p className='mt-4'>
              {searchQuery ? 'No series match your search.' : 'No series in the catalog yet.'}
            </p>
          </div>
        )}
      </div>
    </PublicLayout>
  )
}
