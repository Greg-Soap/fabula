/**
 * Full-bleed background for series/novels detail pages.
 * When imageUrl is provided: blurred image + dark overlay + optional subtle scale motion.
 * When missing: falls back to CalmPageBackground (gradient + blobs).
 */
import { CalmPageBackground } from '@/components/calm-page-background'

interface DetailPageBackgroundProps {
  imageUrl?: string | null
}

export function DetailPageBackground({ imageUrl }: DetailPageBackgroundProps) {
  if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
    return <CalmPageBackground />
  }

  return (
    <div className='pointer-events-none fixed inset-0' aria-hidden>
      <div className='absolute inset-0 overflow-hidden'>
        <img
          src={imageUrl}
          alt=''
          className='h-full w-full object-cover blur-2xl animate-fabula-detail-bg-zoom'
          fetchPriority='low'
        />
        <div className='absolute inset-0 bg-black/50' />
      </div>
    </div>
  )
}
