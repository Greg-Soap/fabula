import { Head, Link, useForm } from '@inertiajs/react'
import { DashboardLayout } from '@/components/dashboard/layout'
import { PageHeader } from '@/components/dashboard/page_header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function DashboardSeriesCreate() {
  const form = useForm({
    title: '',
    shortDescription: '',
    longDescription: '',
    rating: '' as string | number,
    personalReview: '',
    trailerUrl: '',
    numberOfSeasons: '' as string | number,
    coverImage: null as File | null,
  })

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    form.post('/dashboard/series', { forceFormData: true })
  }

  return (
    <DashboardLayout>
      <Head title='Add Series' />
      <div className='space-y-6'>
        <PageHeader
          title='Add series'
          description='Add a new series to the catalog.'
          backHref='/dashboard/series'
        />

        <form onSubmit={onSubmit} className='max-w-2xl space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='title'>Title *</Label>
            <Input
              id='title'
              value={form.data.title}
              onChange={(e) => form.setData('title', e.target.value)}
              required
            />
            {form.errors.title && <p className='text-sm text-destructive'>{form.errors.title}</p>}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='shortDescription'>Short description</Label>
            <Input
              id='shortDescription'
              value={form.data.shortDescription}
              onChange={(e) => form.setData('shortDescription', e.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='longDescription'>Long description</Label>
            <Textarea
              id='longDescription'
              value={form.data.longDescription}
              onChange={(e) => form.setData('longDescription', e.target.value)}
              rows={4}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='coverImage'>Cover image</Label>
            <Input
              id='coverImage'
              type='file'
              accept='image/*'
              onChange={(e) => form.setData('coverImage', e.target.files?.[0] ?? null)}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='rating'>Rating (0–10)</Label>
            <Input
              id='rating'
              type='number'
              min={0}
              max={10}
              step={0.5}
              value={form.data.rating === '' ? '' : form.data.rating}
              onChange={(e) =>
                form.setData('rating', e.target.value === '' ? '' : Number(e.target.value))
              }
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='personalReview'>Personal review</Label>
            <Textarea
              id='personalReview'
              value={form.data.personalReview}
              onChange={(e) => form.setData('personalReview', e.target.value)}
              rows={3}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='trailerUrl'>Trailer URL (YouTube)</Label>
            <Input
              id='trailerUrl'
              type='url'
              value={form.data.trailerUrl}
              onChange={(e) => form.setData('trailerUrl', e.target.value)}
              placeholder='https://www.youtube.com/watch?v=...'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='numberOfSeasons'>Number of seasons</Label>
            <Input
              id='numberOfSeasons'
              type='number'
              min={0}
              value={form.data.numberOfSeasons === '' ? '' : form.data.numberOfSeasons}
              onChange={(e) =>
                form.setData('numberOfSeasons', e.target.value === '' ? '' : Number(e.target.value))
              }
            />
          </div>

          <div className='flex gap-4'>
            <Button type='submit' disabled={form.processing}>
              {form.processing ? 'Saving...' : 'Create series'}
            </Button>
            <Button type='button' variant='outline' asChild>
              <Link href='/dashboard/series'>Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
