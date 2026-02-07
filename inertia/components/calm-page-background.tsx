/**
 * Subtle calm background for series/novels index and detail pages.
 * Soft gradient + two gentle floating blobs.
 */
export function CalmPageBackground() {
  return (
    <div className='pointer-events-none fixed inset-0 ' aria-hidden>
      <div className='absolute inset-0 bg-gradient-to-br from-primary/[0.07] via-transparent to-accent/[0.05] animate-fabula-gradient-shift-slow' />
      <div
        className='absolute right-[5%] top-[20%] h-[280px] w-[280px] rounded-full bg-primary/[0.12] blur-3xl animate-fabula-float'
        style={{ animationDuration: '14s' }}
      />
      <div
        className='absolute bottom-[15%] left-[8%] h-[220px] w-[220px] rounded-full bg-accent/[0.1] blur-3xl animate-fabula-float-slow'
        style={{ animationDuration: '18s', animationDirection: 'reverse' }}
      />
    </div>
  )
}
