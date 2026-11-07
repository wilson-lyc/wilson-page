import { useEffect, useRef, useState } from "react"
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react"
import {
  ArrowUpRightIcon,
  FolderIcon,
  MenuIcon,
  MoonIcon,
  SunIcon,
  Volume2Icon,
  VolumeXIcon,
  XIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import { usePreferences } from "@/hooks/use-preferences"
import { messages } from "@/lib/i18n"
import { Home } from "@/components/home/Home"
import { BackgroundMusic, useBackgroundMusic } from "@/components/BackgroundMusic"
import { cn } from "@/lib/utils"

type Page = "home" | "projects"
const currentPage = (): Page =>
  location.hash === "#/projects" ? "projects" : "home"
const entrySessionKey = "wilson-page:started"

function Site() {
  const [entered, setEntered] = useState(() => {
    try {
      return sessionStorage.getItem(entrySessionKey) === "true"
    } catch {
      return false
    }
  })
  const { muted, volume, setVolume, start: startMusic, toggle: toggleMusic } = useBackgroundMusic()
  const { locale, theme, setLocale, setTheme } = usePreferences()
  const t = messages[locale]
  const [page, setPage] = useState<Page>(currentPage)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(() => window.scrollY > 0)
  const { scrollY } = useScroll()
  const reducedMotion = useReducedMotion()
  useMotionValueEvent(scrollY, "change", (value) => setScrolled(value > 0))

  useEffect(() => {
    const onHashChange = () => {
      if (
        location.hash !== "#/" &&
        location.hash !== "#/projects" &&
        location.hash !== ""
      )
        return
      window.scrollTo({ top: 0, behavior: "instant" })
      document.getElementById("main-content")?.focus({ preventScroll: true })
      setPage(currentPage())
      setMenuOpen(false)
    }
    const desktop = matchMedia("(min-width: 768px)")
    const onResize = () => {
      if (desktop.matches) setMenuOpen(false)
    }
    window.addEventListener("hashchange", onHashChange)
    desktop.addEventListener("change", onResize)
    return () => {
      window.removeEventListener("hashchange", onHashChange)
      desktop.removeEventListener("change", onResize)
    }
  }, [])

  useEffect(() => {
    const header = headerRef.current
    if (!header) return
    const updateHeight = () => {
      document.documentElement.style.setProperty(
        "--site-header-height",
        `${header.getBoundingClientRect().height}px`,
      )
    }
    updateHeight()
    const observer = new ResizeObserver(updateHeight)
    observer.observe(header)
    return () => {
      observer.disconnect()
      document.documentElement.style.removeProperty("--site-header-height")
    }
  }, [entered])

  useEffect(() => {
    if (entered) {
      window.scrollTo({ top: 0, behavior: "instant" })
      document.getElementById("main-content")?.focus({ preventScroll: true })
    }
  }, [entered])

  useEffect(() => {
    if (entered) return
    const root = document.documentElement
    const previousOverflow = root.style.overflow
    const previousBodyOverflow = document.body.style.overflow
    root.style.overflow = "hidden"
    document.body.style.overflow = "hidden"
    window.scrollTo({ top: 0, behavior: "instant" })
    return () => {
      root.style.overflow = previousOverflow
      document.body.style.overflow = previousBodyOverflow
    }
  }, [entered])

  const navigation = (mobile = false) => (
    <nav
      aria-label={t.navigation}
      className={cn("flex gap-1", mobile && "flex-col gap-2")}
    >
      {(["home", "projects"] as const).map((item) => (
        <a
          key={item}
          href={item === "home" ? "#/" : "#/projects"}
          aria-current={page === item ? "page" : undefined}
          onClick={() => setMenuOpen(false)}
          className={cn("nav-link", mobile && "nav-link-mobile")}
        >
          <span>{t[item]}</span>
          {mobile && <ArrowUpRightIcon className="size-4" aria-hidden="true" />}
        </a>
      ))}
    </nav>
  )

  const preferences = (mobile = false) => (
    <div className="flex items-center gap-2">
      <div className="music-control">
        <Button
          variant="ghost"
          size={mobile ? "icon-lg" : "icon"}
          aria-label={muted ? t.enableMusic : t.muteMusic}
          title={muted ? t.enableMusic : t.muteMusic}
          aria-pressed={!muted}
          onClick={toggleMusic}
        >
          {muted ? (
            <VolumeXIcon aria-hidden="true" />
          ) : (
            <Volume2Icon aria-hidden="true" />
          )}
        </Button>
        <div className="music-volume-reveal">
          <div className="music-volume-inner">
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={muted ? 0 : Math.round(volume * 100)}
              onChange={(event) => setVolume(Number(event.target.value) / 100)}
              aria-label={t.musicVolume}
              aria-valuetext={`${muted ? 0 : Math.round(volume * 100)}%`}
              title={`${t.musicVolume}: ${muted ? 0 : Math.round(volume * 100)}%`}
              className="music-volume"
            />
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size={mobile ? "default" : "sm"}
        aria-label={t.language}
        title={t.language}
        onClick={() => setLocale(locale === "en" ? "zh" : "en")}
      >
        <span>{locale === "en" ? "中" : "EN"}</span>
      </Button>
      <div className="flex h-4" aria-hidden="true">
        <Separator orientation="vertical" />
      </div>
      <Button
        variant="ghost"
        size={mobile ? "icon-lg" : "icon"}
        aria-label={theme === "dark" ? t.light : t.dark}
        title={theme === "dark" ? t.light : t.dark}
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? (
          <SunIcon aria-hidden="true" />
        ) : (
          <MoonIcon aria-hidden="true" />
        )}
      </Button>
    </div>
  )

  return (
    <div className="site-shell" data-started={entered}>
      <a
        className="skip-link" inert={!entered}
        href="#main-content"
        onClick={(event) => {
          event.preventDefault()
          document.getElementById("main-content")?.focus()
          window.scrollTo(0, 0)
        }}
      >
        {t.skip}
      </a>
      <header
        ref={headerRef}
        inert={!entered}
        className="site-header"
        onKeyDown={(event) => {
          if (event.key === "Escape" && menuOpen) {
            setMenuOpen(false)
            menuButton.current?.focus()
          }
        }}
      >
        <motion.div
          aria-hidden="true"
          className="header-surface"
          initial={false}
          animate={{ opacity: scrolled ? 1 : 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.22, ease: "easeOut" }}
        />
        <div className="header-inner">
          <div className="desktop-navigation">{navigation()}</div>
          <div className="desktop-preferences">{preferences()}</div>
          <Button
            ref={menuButton}
            variant="ghost"
            size="icon-lg"
            className="mobile-menu-button md:hidden"
            aria-label={menuOpen ? t.closeMenu : t.openMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <XIcon aria-hidden="true" />
            ) : (
              <MenuIcon aria-hidden="true" />
            )}
          </Button>
        </div>
        <div id="mobile-menu" className="mobile-menu" hidden={!menuOpen}>
          {navigation(true)}
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">
              {t.preferences}
            </span>
            {preferences(true)}
          </div>
        </div>
      </header>
      <main
        id="main-content"
        tabIndex={-1}
        className={page === "home" ? "home-shell" : "content-shell"}
      >
        {!entered || page === "home" ? (
          <Home locale={locale} started={entered} onStart={() => {
            startMusic()
            try {
              sessionStorage.setItem(entrySessionKey, "true")
            } catch {
              // The entry still works when browser storage is unavailable.
            }
            setEntered(true)
          }} />
        ) : (
          <>
            <div className="section-heading">
              <div className="flex flex-col gap-3">
                <p className="section-eyebrow">{t.section}</p>
                <h1>
                  {t[page]}
                  <span className="heading-period">.</span>
                </h1>
              </div>
              <span className="section-index" aria-hidden="true">
                02 / 02
              </span>
            </div>
            <section className="content-canvas" aria-label={t[page]}>
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <FolderIcon aria-hidden="true" />
                  </EmptyMedia>
                  <EmptyTitle>{t.projectsTitle}</EmptyTitle>
                  <EmptyDescription>{t.projectsDescription}</EmptyDescription>
                </EmptyHeader>
              </Empty>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export function App() {
  return <BackgroundMusic><Site /></BackgroundMusic>
}

export default App
