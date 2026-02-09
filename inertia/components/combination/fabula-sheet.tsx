import type { ReactNode } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

interface FabulaSheetProps {
  trigger: ReactNode
  title?: string
  description?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  children: ReactNode
  footer?: ReactNode
  contentClassName?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function FabulaSheet({
  trigger,
  title,
  description,
  side = 'right',
  children,
  footer,
  contentClassName,
  open,
  onOpenChange,
}: FabulaSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger>{trigger}</SheetTrigger>
      <SheetContent side={side} className={cn(contentClassName)}>
        {(title ?? description) && (
          <SheetHeader>
            {title && <SheetTitle>{title}</SheetTitle>}
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
        )}
        <div className={cn((title ?? description) ? 'mt-6' : '')}>{children}</div>
        {footer && <SheetFooter className='mt-6'>{footer}</SheetFooter>}
      </SheetContent>
    </Sheet>
  )
}
