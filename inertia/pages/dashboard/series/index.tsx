import { Head, Link, router, usePage } from '@inertiajs/react'
import { Film, Pencil, Plus, Star, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/combination'
import { DashboardLayout } from '@/components/dashboard/layout'
import { PageHeader } from '@/components/dashboard/page_header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface SeriesItem {
  id: string
  title: string
  slug: string
  shortDescription: string | null
  rating: number | null
  coverImage: { url?: string } | null
}

interface DashboardSeriesIndexProps {
  series: SeriesItem[]
}

function getCoverUrl(coverImage: SeriesItem['coverImage']): string | null {
  if (!coverImage || typeof coverImage !== 'object') return null
  return (coverImage as { url?: string }).url ?? null
}

export default function DashboardSeriesIndex({ series }: DashboardSeriesIndexProps) {
  const flashSuccess = (usePage().props as { flashSuccess?: string }).flashSuccess
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    if (flashSuccess) toast.success(flashSuccess)
  }, [flashSuccess])

  return (
    <DashboardLayout>
      <Head title='Manage Series' />
      <div className='space-y-6'>
        <PageHeader
          title='Series'
          description='Add and edit series in the catalog.'
          actions={
            <Button asChild leftIcon={<Plus className='h-4 w-4' />}>
              <Link href='/dashboard/series/create'>Add series</Link>
            </Button>
          }
        />

        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {series.map((item) => {
            const coverUrl = getCoverUrl(item.coverImage)
            return (
              <Card key={item.id} className='flex h-full flex-col overflow-hidden'>
                <div className='aspect-[2/3] w-full bg-muted'>
                  {coverUrl ? (
                    <img src={coverUrl} alt={item.title} className='h-full w-full object-cover' />
                  ) : (
                    <div className='flex h-full w-full items-center justify-center'>
                      <Film className='h-16 w-16 text-muted-foreground/50' />
                    </div>
                  )}
                </div>
                <CardHeader className='pb-2'>
                  <CardContent className='flex flex-1 flex-col p-0'>
                    <h2 className='font-semibold leading-tight'>{item.title}</h2>
                    {item.rating != null && (
                      <div className='mt-1 flex items-center gap-1 text-sm text-muted-foreground'>
                        <Star className='h-4 w-4 fill-amber-400 text-amber-400' />
                        <span>{Number(item.rating).toFixed(1)}</span>
                      </div>
                    )}
                    {item.shortDescription && (
                      <p className='mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground'>
                        {item.shortDescription}
                      </p>
                    )}
                    <div className='mt-4 flex gap-2'>
                      <Button variant='outline' size='sm' asChild>
                        <Link href={`/dashboard/series/${item.id}/edit`}>
                          <Pencil className='h-4 w-4' />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => setDeleteId(item.id)}
                        className='text-destructive hover:text-destructive'>
                        <Trash2 className='h-4 w-4' />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </CardHeader>
              </Card>
            )
          })}
        </div>

        <ConfirmDialog
          open={deleteId !== null}
          onOpenChange={(open) => !open && setDeleteId(null)}
          title='Delete this series?'
          description='This cannot be undone.'
          confirmLabel='Delete'
          cancelLabel='Cancel'
          variant='destructive'
          onConfirm={() => {
            if (deleteId) router.delete(`/dashboard/series/${deleteId}`)
            setDeleteId(null)
          }}
        />

        {series.length === 0 && (
          <Card>
            <CardContent className='flex flex-col items-center justify-center py-16'>
              <Film className='h-12 w-12 text-muted-foreground' />
              <p className='mt-4 text-muted-foreground'>No series yet.</p>
              <Button className='mt-4' asChild leftIcon={<Plus className='h-4 w-4' />}>
                <Link href='/dashboard/series/create'>Add your first series</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
