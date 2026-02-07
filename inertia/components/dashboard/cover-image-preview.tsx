import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface CoverImagePreviewProps {
  coverImageFile: File | null
  coverImageUrl: string
  existingCoverUrl?: string | null
  className?: string
}

export function CoverImagePreview({
  coverImageFile,
  coverImageUrl,
  existingCoverUrl,
  className,
}: CoverImagePreviewProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!coverImageFile) {
      setObjectUrl(null)
      return
    }
    const url = URL.createObjectURL(coverImageFile)
    setObjectUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [coverImageFile])

  const previewSrc =
    objectUrl ?? (coverImageUrl && coverImageUrl.trim() !== '' ? coverImageUrl : null) ?? existingCoverUrl ?? null

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card p-4 flex flex-col items-center justify-center min-h-[200px] w-full max-w-[280px] shrink-0',
        className,
      )}>
      <span className='text-sm font-medium text-muted-foreground mb-3'>Cover preview</span>
      {previewSrc ? (
        <img
          src={previewSrc}
          alt='Cover preview'
          className='rounded-md object-contain max-h-[320px] w-full border border-border'
        />
      ) : (
        <div className='rounded-md border border-dashed border-border bg-muted/30 size-full min-h-[180px] flex items-center justify-center'>
          <span className='text-xs text-muted-foreground'>No cover yet</span>
        </div>
      )}
    </div>
  )
}
