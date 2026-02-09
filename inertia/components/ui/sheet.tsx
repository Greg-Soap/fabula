'use client'

import { Dialog as BaseDialog } from '@base-ui/react/dialog'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/lib/utils'

const Sheet = BaseDialog.Root

const SheetTrigger = BaseDialog.Trigger

const SheetClose = BaseDialog.Close

const SheetPortal = BaseDialog.Portal

const sheetOverlayStyles =
  'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-100'

const SheetOverlay = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseDialog.Backdrop>
>(({ className, ...props }, ref) => (
  <BaseDialog.Backdrop
    data-slot='sheet-overlay'
    className={cn(sheetOverlayStyles, className)}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = 'SheetOverlay'

const sheetContentBase =
  'fixed z-50 gap-4 bg-background p-6 shadow-lg ring-1 ring-border outline-none duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out'

const sheetVariants = cva(sheetContentBase, {
  variants: {
    side: {
      top: 'inset-x-0 top-0 rounded-b-lg border-b data-[state=closed]:slide-out-to-top data-[state=closed]:duration-200 data-[state=open]:slide-in-from-top data-[state=open]:duration-200',
      bottom:
        'inset-x-0 bottom-0 rounded-t-lg border-t data-[state=closed]:slide-out-to-bottom data-[state=closed]:duration-200 data-[state=open]:slide-in-from-bottom data-[state=open]:duration-200',
      left: 'inset-y-0 left-0 h-full w-3/4 rounded-r-lg border-r sm:max-w-sm data-[state=closed]:slide-out-to-left data-[state=closed]:duration-200 data-[state=open]:slide-in-from-left data-[state=open]:duration-200',
      right:
        'inset-y-0 right-0 h-full w-3/4 rounded-l-lg border-l sm:max-w-sm data-[state=closed]:slide-out-to-right data-[state=closed]:duration-200 data-[state=open]:slide-in-from-right data-[state=open]:duration-200',
    },
  },
  defaultVariants: {
    side: 'right',
  },
})

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof BaseDialog.Popup>,
    VariantProps<typeof sheetVariants> {}

const sheetCloseStyles =
  'absolute right-4 top-4 rounded-md p-1 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none [&_svg]:size-4'

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ side = 'right', className, children, ...props }, ref) => (
    <SheetPortal>
      <SheetOverlay />
      <BaseDialog.Viewport>
        <BaseDialog.Popup
          data-slot='sheet-content'
          ref={ref}
          className={cn(sheetVariants({ side }), className)}
          {...props}>
          {children}
          <BaseDialog.Close className={cn(sheetCloseStyles)}>
            <X />
            <span className='sr-only'>Close</span>
          </BaseDialog.Close>
        </BaseDialog.Popup>
      </BaseDialog.Viewport>
    </SheetPortal>
  ),
)
SheetContent.displayName = 'SheetContent'

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot='sheet-header'
    className={cn('flex flex-col space-y-2 text-center sm:text-left', className)}
    {...props}
  />
)
SheetHeader.displayName = 'SheetHeader'

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot='sheet-footer'
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-2', className)}
    {...props}
  />
)
SheetFooter.displayName = 'SheetFooter'

const SheetTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      data-slot='sheet-title'
      className={cn('text-lg font-semibold text-foreground', className)}
      {...props}
    />
  ),
)
SheetTitle.displayName = 'SheetTitle'

const SheetDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot='sheet-description'
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
SheetDescription.displayName = 'SheetDescription'

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
}
