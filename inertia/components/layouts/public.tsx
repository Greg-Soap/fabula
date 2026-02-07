import type { SharedProps } from '@adonisjs/inertia/types'
import { Link, router, usePage } from '@inertiajs/react'
import { ArrowRight, Menu } from 'lucide-react'
import { FabulaDropdown } from '@/components/combination'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { cn } from '@/lib/utils'

interface PublicLayoutProps {
  children: React.ReactNode
  showHeader?: boolean
  actions?: React.ReactNode
  headerSticky?: boolean
  headerBorder?: boolean
  showFooter?: boolean
  footer?: React.ReactNode
}

function PublicNavbarActions({ extraActions }: { extraActions?: React.ReactNode }) {
  const page = usePage<SharedProps>()
  const isLoggedIn = Boolean(page.props.isLoggedIn)

  return (
    <div className='flex items-center gap-2'>
      {/* Desktop links */}
      <div className='hidden md:flex items-center gap-2'>
        <Button variant='ghost' asChild>
          <Link href='/'>Home</Link>
        </Button>
        <Button variant='ghost' asChild>
          <Link href='/series'>Series</Link>
        </Button>
        <Button variant='ghost' asChild>
          <Link href='/novels'>Novels</Link>
        </Button>
      </div>

      {/* Desktop auth CTAs + optional extra actions */}
      <div className='hidden md:flex items-center gap-2'>
        {isLoggedIn ? (
          <Button asChild rightIcon={<ArrowRight className='h-4 w-4' />}>
            <Link href='/dashboard'>Dashboard</Link>
          </Button>
        ) : (
          <Button asChild rightIcon={<ArrowRight className='h-4 w-4' />}>
            <Link href='/login'>Sign In</Link>
          </Button>
        )}
        {extraActions}
      </div>

      <ThemeToggle />

      {/* Mobile menu */}
      <div className='md:hidden'>
        <FabulaDropdown
          trigger={
            <Button variant='ghost' size='icon' aria-label='Open menu'>
              <Menu className='h-5 w-5' />
            </Button>
          }
          items={[
            { label: 'Home', onClick: () => router.visit('/') },
            { label: 'Series', onClick: () => router.visit('/series') },
            { label: 'Novels', onClick: () => router.visit('/novels') },
            ...(isLoggedIn
              ? [{ label: 'Dashboard', onClick: () => router.visit('/dashboard') }]
              : [{ label: 'Sign In', onClick: () => router.visit('/login') }]),
          ]}
          align='end'
        />
      </div>
    </div>
  )
}

export function PublicLayout({
  children,
  showHeader = true,
  actions,
  headerSticky = true,
  showFooter = true,
  footer,
}: PublicLayoutProps) {
  return (
    <div className='min-h-screen  dark:bg-background flex flex-col'>
      {showHeader && (
        <header
          className={cn(
            'z-50',
            headerSticky
              ? 'sticky top-0 bg-transparent supports-[backdrop-filter]:backdrop-blur'
              : 'bg-transparent',
          )}>
          <div className='max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between'>
            <Link href='/' className='flex items-center gap-2 w-fit'>
              <span className='font-heading text-xl font-normal tracking-tight text-foreground'>
                Fabula
              </span>
            </Link>
            <PublicNavbarActions extraActions={actions} />
          </div>
        </header>
      )}
      <main className='flex-1'>{children}</main>

      {showFooter && (
        <>
          {footer ?? (
            <footer className='border-t border-border py-8 px-6'>
              <div className='max-w-screen-xl mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='leading-tight'>
                    <div className='font-semibold'>{import.meta.env.VITE_APP_NAME}</div>
                    <div className='text-sm text-muted-foreground'>
                      {import.meta.env.VITE_APP_DESCRIPTION}
                    </div>
                  </div>
                </div>
                <div className='text-sm text-muted-foreground flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3'>
                  {/* <a
                    href={`mailto:${import.meta.env.VITE_SUPPORT_EMAIL}`}
                    className='hover:text-foreground'>
                    {import.meta.env.VITE_SUPPORT_EMAIL}
                  </a>
                  <span className='hidden sm:inline'>•</span> */}
                  <span>
                    © {new Date().getFullYear()} {import.meta.env.VITE_APP_NAME}
                  </span>
                </div>
              </div>
            </footer>
          )}
        </>
      )}
    </div>
  )
}
