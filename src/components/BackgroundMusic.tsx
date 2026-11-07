import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react"
import music from "@/assets/audio/simplicity.mp3"

const MusicContext = createContext<{ muted: boolean; volume: number; setVolume: (volume: number) => void; start: () => void; toggle: () => void } | null>(null)

export function BackgroundMusic({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [muted, setMuted] = useState(true)
  const [volume, setVolumeState] = useState(0.35)
  const lastVolume = useRef(0.35)
  const requestId = useRef(0)

  const playAtVolume = (nextVolume: number) => {
    const audio = audioRef.current
    if (!audio) return
    const request = ++requestId.current
    audio.volume = nextVolume
    audio.muted = false
    setMuted(false)
    // Call play directly in the Start click to preserve browser user activation.
    void audio.play().catch(() => {
      if (request === requestId.current) {
        audio.muted = true
        setMuted(true)
      }
    })
  }

  const start = () => {
    const nextVolume = volume > 0 ? volume : lastVolume.current
    setVolumeState(nextVolume)
    playAtVolume(nextVolume)
  }

  const setVolume = (value: number) => {
    const nextVolume = Math.max(0, Math.min(1, value))
    setVolumeState(nextVolume)
    const audio = audioRef.current
    if (audio) audio.volume = nextVolume
    if (nextVolume === 0) {
      requestId.current++
      if (audio) audio.muted = true
      setMuted(true)
      return
    }
    lastVolume.current = nextVolume
    if (muted || audio?.paused) playAtVolume(nextVolume)
  }

  const toggle = () => {
    if (muted) return start()
    requestId.current++
    if (audioRef.current) audioRef.current.muted = true
    setMuted(true)
  }

  useEffect(() => {
    const audio = audioRef.current
    return () => audio?.pause()
  }, [])

  return (
    <MusicContext.Provider value={{ muted, volume, setVolume, start, toggle }}>
      <audio ref={audioRef} src={music} preload="auto" loop aria-hidden="true" />
      {children}
    </MusicContext.Provider>
  )
}

export function useBackgroundMusic() {
  const music = useContext(MusicContext)
  if (!music) throw new Error("BackgroundMusic provider is required")
  return music
}
