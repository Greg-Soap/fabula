import { Head, Link, useForm } from '@inertiajs/react'
import { useState } from 'react'
import { FormCard, TextInput } from '@/components/combination'
import { CoverImagePreview } from '@/components/dashboard/cover-image-preview'
import { DashboardLayout } from '@/components/dashboard/layout'
import { PageHeader } from '@/components/dashboard/page_header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useFetchSeriesInfo } from '@/hooks/use-fetch-series-info'

interface SeriesEditProps {
  series: {
    id: string
    title: string
    shortDescription: string | null
    longDescription: string | null
    rating: number | null
    personalReview: string | null
    trailerUrl: string | null
    numberOfSeasons: number | null
    coverImage?: { url?: string } | null
  }
}

export default function DashboardSeriesEdit({ series }: SeriesEditProps) {
  const [fetchQuery, setFetchQuery] = useState('')

  const form = useForm({
    title: series.title,
    shortDescription: series.shortDescription ?? '',
    longDescription: series.longDescription ?? '',
    rating: series.rating ?? ('' as string | number),
    personalReview: series.personalReview ?? '',
    trailerUrl: series.trailerUrl ?? '',
    numberOfSeasons: series.numberOfSeasons ?? ('' as string | number),
    coverImage: null as File | null,
    coverImageUrl: '',
  })

  const { mutate: fetchInfo, isPending: isFetching } = useFetchSeriesInfo({
    onSuccess: (data) => {
      form.setData({
        ...form.data,
        ...(data.title != null && { title: data.title }),
        ...(data.shortDescription != null && { shortDescription: data.shortDescription }),
        ...(data.longDescription != null && { longDescription: data.longDescription }),
        ...(data.rating != null && { rating: data.rating }),
        ...(data.numberOfSeasons != null && { numberOfSeasons: data.numberOfSeasons }),
        ...(data.trailerUrl != null && { trailerUrl: data.trailerUrl }),
        ...(data.coverImageUrl != null && { coverImageUrl: data.coverImageUrl }),
      })
    },
    successMessage: 'Series info updated. Your personal review was kept.',
  })

  function handleFetchInfo() {
    fetchInfo(fetchQuery)
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    form.put(`/dashboard/series/${series.id}`, { forceFormData: true })
  }

  return (
    <DashboardLayout>
      <Head title={`Edit ${series.title}`} />
      <div className='space-y-6'>
        <PageHeader title='Edit series' description={series.title} backHref='/dashboard/series' />

        <FormCard
          className='max-w-2xl'
          description='Fetch fresh metadata from TMDB without changing your personal review.'>
          <div className='flex gap-2'>
            <Input
              placeholder='e.g. Smallville'
              value={fetchQuery}
              onChange={(e) => setFetchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleFetchInfo()
                }
              }}
              className='flex-1'
            />
            <Button type='button' onClick={handleFetchInfo} disabled={isFetching}>
              {isFetching ? 'Fetching…' : 'Fetch info'}
            </Button>
          </div>
        </FormCard>

        <div className='flex flex-col lg:flex-row gap-8 items-start'>
          <form onSubmit={onSubmit} className='max-w-2xl w-full space-y-6 shrink-0'>
            <TextInput
              label='Title'
              name='title'
              value={form.data.title}
              onChange={(e) => form.setData('title', e.target.value)}
              error={form.errors.title}
              required
            />

            <TextInput
              label='Short description'
              name='shortDescription'
              value={form.data.shortDescription}
              onChange={(e) => form.setData('shortDescription', e.target.value)}
              error={form.errors.shortDescription}
            />

            <TextInput
              label='Long description'
              name='longDescription'
              value={form.data.longDescription}
              onChange={(e) => form.setData('longDescription', e.target.value)}
              error={form.errors.longDescription}
              rows={8}
            />

            <TextInput
              label='Cover image (leave empty to keep current)'
              name='coverImage'
              onChange={(e) =>
                form.setData('coverImage', (e.target as HTMLInputElement).files?.[0] ?? null)
              }
              type='file'
              accept='image/*'
            />

            <TextInput
              label='Rating (0–10)'
              name='rating'
              value={form.data.rating === '' ? '' : form.data.rating}
              onChange={(e) =>
                form.setData('rating', e.target.value === '' ? '' : Number(e.target.value))
              }
              error={form.errors.rating}
              type='text'
              min={0}
              max={10}
              step={0.5}
            />

            <TextInput
              label='Personal review'
              name='personalReview'
              value={form.data.personalReview}
              onChange={(e) => form.setData('personalReview', e.target.value)}
              error={form.errors.personalReview}
              rows={3}
            />

            <TextInput
              label='Trailer URL (YouTube)'
              name='trailerUrl'
              value={form.data.trailerUrl}
              onChange={(e) => form.setData('trailerUrl', e.target.value)}
              error={form.errors.trailerUrl}
              type='url'
              placeholder='https://www.youtube.com/watch?v=...'
            />

            <TextInput
              label='Number of seasons'
              name='numberOfSeasons'
              value={form.data.numberOfSeasons === '' ? '' : form.data.numberOfSeasons}
              onChange={(e) =>
                form.setData('numberOfSeasons', e.target.value === '' ? '' : Number(e.target.value))
              }
              error={form.errors.numberOfSeasons}
              type='number'
              min={0}
            />

            <div className='flex gap-4'>
              <Button type='submit' disabled={form.processing}>
                {form.processing ? 'Saving...' : 'Update series'}
              </Button>
              <Button type='button' variant='outline' asChild>
                <Link href='/dashboard/series'>Cancel</Link>
              </Button>
            </div>
          </form>
          <CoverImagePreview
            coverImageFile={form.data.coverImage}
            coverImageUrl={form.data.coverImageUrl}
            existingCoverUrl={series.coverImage?.url}
            className='lg:sticky lg:top-6'
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
