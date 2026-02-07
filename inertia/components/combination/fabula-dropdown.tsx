import type { ReactNode } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export interface FabulaDropdownItem {
  label: string
  onClick: () => void
  icon?: ReactNode
  variant?: 'default' | 'destructive'
}

interface FabulaDropdownProps {
  trigger: ReactNode
  items: FabulaDropdownItem[]
  contentClassName?: string
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'right' | 'bottom' | 'left'
}

export function FabulaDropdown({
  trigger,
  items,
  contentClassName,
  align = 'end',
  side = 'bottom',
}: FabulaDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align={align} side={side} className={cn(contentClassName)}>
        {items.map((item) => (
          <DropdownMenuItem
            key={item.label}
            variant={item.variant ?? 'default'}
            onClick={item.onClick}>
            {item.icon != null ? <span className='shrink-0'>{item.icon}</span> : null}
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
