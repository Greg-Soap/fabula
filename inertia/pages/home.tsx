import type { SharedProps } from '@adonisjs/inertia/types'
import { Head, Link } from '@inertiajs/react'
import { ArrowRight, BookOpen, Film } from 'lucide-react'
import { PublicLayout } from '@/components/layouts/public'
import { Button } from '@/components/ui/button'

export default function Home(props: SharedProps) {
  const isLoggedIn = Boolean(props.isLoggedIn)

  return (
    <PublicLayout showFooter={false}>
      <Head title='Fabula' />

      <section className='relative flex min-h-screen flex-col items-center justify-center px-6'>
        {/* Animated gradient + blobs (wrapper so blobs can extend without clipping) */}
        <div className='pointer-events-none absolute inset-0  min-h-screen' aria-hidden>
          <div className='absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-accent/10 animate-fabula-gradient-shift' />
          <div
            className='absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/40 blur-[90px] animate-fabula-glow-pulse'
            style={{ animationDuration: '5s' }}
          />
          <div
            className='absolute right-[10%] top-[15%] h-[320px] w-[320px] rounded-full bg-accent/35 blur-3xl animate-fabula-float'
            style={{ animationDuration: '8s' }}
          />
          <div
            className='absolute bottom-[20%] left-[5%] h-[280px] w-[280px] rounded-full bg-primary/30 blur-3xl animate-fabula-float-slow'
            style={{ animationDuration: '12s', animationDirection: 'reverse' }}
          />
        </div>

        <div className='flex flex-col items-center text-center'>
          <h1
            className='font-heading text-5xl font-normal tracking-tight sm:text-6xl md:text-8xl opacity-0 animate-fabula-fade-in-up'
            style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            Fabula
          </h1>
          <p
            className='mt-4 text-lg text-muted-foreground sm:text-xl opacity-0 animate-fabula-fade-in-up'
            style={{ animationDelay: '0.35s', animationFillMode: 'forwards' }}>
            Stories for friends
          </p>
          <p
            className='mt-2 max-w-md text-sm text-muted-foreground/80 opacity-0 animate-fabula-fade-in-up'
            style={{ animationDelay: '0.55s', animationFillMode: 'forwards' }}>
            A shared catalog of series and novels — discover, rate, and share what you love.
          </p>

          <div
            className='mt-12 flex flex-col gap-4 sm:flex-row sm:gap-4 opacity-0 animate-fabula-fade-in-up'
            style={{ animationDelay: '0.75s', animationFillMode: 'forwards' }}>
            <Button size='lg' variant='default' leftIcon={<Film className='h-4 w-4' />} asChild>
              <Link href='/series'>Browse Series</Link>
            </Button>
            <Button size='lg' variant='outline' leftIcon={<BookOpen className='h-4 w-4' />} asChild>
              <Link href='/novels'>Browse Novels</Link>
            </Button>
            {isLoggedIn ? (
              <Button
                size='lg'
                variant='secondary'
                rightIcon={<ArrowRight className='h-4 w-4' />}
                asChild>
                <Link href='/dashboard'>Dashboard</Link>
              </Button>
            ) : (
              <Button
                size='lg'
                variant='secondary'
                rightIcon={<ArrowRight className='h-4 w-4' />}
                asChild>
                <Link href='/login'>Sign in</Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
