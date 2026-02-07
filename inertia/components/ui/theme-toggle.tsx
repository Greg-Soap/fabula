import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/use-theme'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  function handleToggle() {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={handleToggle}
      aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
      {resolvedTheme === 'dark' ? (
        <Moon className='h-5 w-5 transition-opacity' />
      ) : (
        <Sun className='h-5 w-5 transition-opacity' />
      )}
    </Button>
  )
}
