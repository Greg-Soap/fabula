import { useCallback, useEffect, useRef, useState } from 'react'
import { getYouTubeVideoId } from '@/lib/youtube'

const YT_SCRIPT_URL = 'https://www.youtube.com/iframe_api'
const PLAYER_STATE_PLAYING = 1
const AUTOPLAY_CHECK_MS = 1500

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string,
        options: {
          videoId: string
          height?: string
          width?: string
          events?: { onReady?: (event: { target: YTPlayer }) => void }
        },
      ) => YTPlayer
      PlayerState?: { PLAYING: number }
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

interface YTPlayer {
  playVideo: () => void
  setVolume: (volume: number) => void
  getPlayerState?: () => number
}

export interface UseThemeAutoplayResult {
  videoId: string | null
  containerId: string | null
  playTheme: () => void
  playFailed: boolean
}

export function useThemeAutoplay(themeUrl: string | null): UseThemeAutoplayResult {
  const videoId = getYouTubeVideoId(themeUrl)
  const [playFailed, setPlayFailed] = useState(false)
  const playerRef = useRef<YTPlayer | null>(null)
  const containerId = videoId ? `theme-player-${videoId}` : null

  const playTheme = useCallback(() => {
    const player = playerRef.current
    if (player?.playVideo) {
      player.playVideo()
      if (player.setVolume) player.setVolume(100)
    }
  }, [])

  useEffect(() => {
    if (!videoId || !containerId) return

    let timeoutId: ReturnType<typeof setTimeout> | null = null

    function createPlayer() {
      const YT = window.YT
      if (!YT?.Player) return

      try {
        new YT.Player(containerId, {
          videoId,
          height: '100%',
          width: '100%',
          events: {
            onReady(event: { target: YTPlayer }) {
              const target = event.target
              playerRef.current = target
              target.playVideo()
              if (target.setVolume) target.setVolume(100)
              timeoutId = setTimeout(() => {
                const state = target.getPlayerState?.()
                if (state !== PLAYER_STATE_PLAYING) {
                  setPlayFailed(true)
                }
              }, AUTOPLAY_CHECK_MS)
            },
          },
        })
      } catch {
        setPlayFailed(true)
      }
    }

    if (window.YT?.Player) {
      createPlayer()
    } else {
      window.onYouTubeIframeAPIReady = createPlayer
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const script = document.createElement('script')
        script.src = YT_SCRIPT_URL
        script.async = true
        document.head.appendChild(script)
      }
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      playerRef.current = null
    }
  }, [videoId, containerId])

  return {
    videoId,
    containerId,
    playTheme,
    playFailed,
  }
}
