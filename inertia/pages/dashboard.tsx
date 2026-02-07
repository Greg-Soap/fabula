import { Head, Link } from '@inertiajs/react'
import { BookOpen, Film } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/layout'
import { PageHeader } from '@/components/dashboard/page_header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DashboardProps {
  seriesCount: number
  novelCount: number
}

export default function Dashboard({ seriesCount, novelCount }: DashboardProps) {
  const stats = [
    { title: 'Series', value: String(seriesCount), href: '/dashboard/series', icon: Film },
    { title: 'Novels', value: String(novelCount), href: '/dashboard/novels', icon: BookOpen },
  ]

  return (
    <DashboardLayout>
      <Head title='Dashboard' />
      <div className='space-y-6'>
        <PageHeader title='Welcome back!' description='Manage your catalog of series and novels.' />

        <div className='grid gap-4 md:grid-cols-2'>
          {stats.map((stat) => (
            <Link key={stat.title} href={stat.href}>
              <Card className='transition-shadow hover:shadow-md'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
                  <stat.icon className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{stat.value}</div>
                  <p className='text-xs text-muted-foreground'>Catalog entries</p>
                  <Button variant='link' className='mt-2 h-auto p-0 text-primary'>
                    Manage {stat.title}
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
