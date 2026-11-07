import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react"
import music from "@/assets/audio/simplicity.mp3"

const MusicContext = createContext<{ muted: boolean; start: () => void; toggle: () => void } | null>(null)

export function BackgroundMusic({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [muted, setMuted] = useState(true)
  const requestId = useRef(0)

  const start = () => {
    const audio = audioRef.current
    if (!audio) return
    const request = ++requestId.current
    audio.volume = 0.35
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
    <MusicContext.Provider value={{ muted, start, toggle }}>
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
