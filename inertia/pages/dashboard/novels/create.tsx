import { Head, Link, useForm } from '@inertiajs/react'
import { useState } from 'react'
import { FormCard, TextInput } from '@/components/combination'
import { CoverImagePreview } from '@/components/dashboard/cover-image-preview'
import { DashboardLayout } from '@/components/dashboard/layout'
import { PageHeader } from '@/components/dashboard/page_header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useFetchNovelInfo } from '@/hooks/use-fetch-novel-info'

export default function DashboardNovelsCreate() {
  const [fetchQuery, setFetchQuery] = useState('')

  const form = useForm({
    title: '',
    shortDescription: '',
    longDescription: '',
    rating: '' as string | number,
    personalReview: '',
    externalLink: '',
    numberOfChapters: '' as string | number,
    coverImage: null as File | null,
    coverImageUrl: '',
    themeUrl: '',
    genre: '',
    releaseYear: '' as string | number,
  })

  const { mutate: fetchInfo, isPending: isFetching } = useFetchNovelInfo({
    onSuccess: (data) => {
      form.setData({
        ...form.data,
        ...(data.title != null && { title: data.title }),
        ...(data.shortDescription != null && { shortDescription: data.shortDescription }),
        ...(data.longDescription != null && { longDescription: data.longDescription }),
        ...(data.externalLink != null && { externalLink: data.externalLink }),
        ...(data.coverImageUrl != null && { coverImageUrl: data.coverImageUrl }),
        ...(data.genre != null && { genre: data.genre }),
        ...(data.releaseYear != null && { releaseYear: data.releaseYear }),
      })
    },
  })

  function handleFetchInfo() {
    fetchInfo(fetchQuery)
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    form.post('/dashboard/novels', { forceFormData: true })
  }

  return (
    <DashboardLayout>
      <Head title='Add Novel' />
      <div className='space-y-6'>
        <PageHeader
          title='Add novel'
          description='Add a new novel to the catalog.'
          backHref='/dashboard/novels'
        />

        <FormCard
          className='max-w-2xl'
          description="We'll fill title, description, and link from Open Library. Add your rating and personal review, then save.">
          <div className='flex gap-2'>
            <Input
              placeholder='e.g. 1984'
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
              label='Cover image'
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
              label='External link (Amazon / Kindle / Novel Updates)'
              name='externalLink'
              value={form.data.externalLink}
              onChange={(e) => form.setData('externalLink', e.target.value)}
              error={form.errors.externalLink}
              type='url'
              placeholder='https://...'
            />

            <TextInput
              label='Number of chapters'
              name='numberOfChapters'
              value={form.data.numberOfChapters === '' ? '' : form.data.numberOfChapters}
              onChange={(e) =>
                form.setData(
                  'numberOfChapters',
                  e.target.value === '' ? '' : Number(e.target.value),
                )
              }
              error={form.errors.numberOfChapters}
              type='number'
              min={0}
            />

            <TextInput
              label='Theme / soundtrack URL (YouTube, Spotify, etc.)'
              name='themeUrl'
              value={form.data.themeUrl}
              onChange={(e) => form.setData('themeUrl', e.target.value)}
              error={form.errors.themeUrl}
              type='url'
              placeholder='https://www.youtube.com/watch?v=...'
            />

            <TextInput
              label='Genre'
              name='genre'
              value={form.data.genre}
              onChange={(e) => form.setData('genre', e.target.value)}
              error={form.errors.genre}
              placeholder='e.g. Fantasy, Romance'
            />

            <TextInput
              label='Release year'
              name='releaseYear'
              value={form.data.releaseYear === '' ? '' : form.data.releaseYear}
              onChange={(e) =>
                form.setData('releaseYear', e.target.value === '' ? '' : Number(e.target.value))
              }
              error={form.errors.releaseYear}
              type='number'
              min={1900}
              max={2100}
              placeholder='e.g. 2020'
            />

            <div className='flex gap-4'>
              <Button type='submit' disabled={form.processing}>
                {form.processing ? 'Saving...' : 'Create novel'}
              </Button>
              <Button type='button' variant='outline' asChild>
                <Link href='/dashboard/novels'>Cancel</Link>
              </Button>
            </div>
          </form>
          <CoverImagePreview
            coverImageFile={form.data.coverImage}
            coverImageUrl={form.data.coverImageUrl}
            className='lg:sticky lg:top-6'
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
