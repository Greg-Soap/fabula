import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface FormCardProps {
  children: ReactNode
  className?: string
  description?: ReactNode
  title?: ReactNode
}

export function FormCard({ children, className, description, title }: FormCardProps) {
  return (
    <div className={cn('rounded-lg border border-border bg-card p-4', className)}>
      {title != null ? <div className='font-medium mb-2'>{title}</div> : null}
      {description != null ? (
        <p className='text-sm text-muted-foreground mb-3'>{description}</p>
      ) : null}
      {children}
    </div>
  )
}
