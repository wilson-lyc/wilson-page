import { useEffect, useRef, useState } from "react"
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react"
import {
  FolderIcon,
  MailIcon,
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
import publicSecurityIcon from "@/assets/images/ba.png"
import { openContactEmail } from "@/lib/contact"
import { githubProfile, siteSlogan } from "@/content/home"

function GithubMark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
  )
}

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

  useEffect(() => {
    if (!menuOpen) return
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    const onFocusIn = (event: FocusEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("focusin", onFocusIn)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("focusin", onFocusIn)
    }
  }, [menuOpen])

  const navigation = (mobile = false) => (
    <nav
      aria-label={t.navigation}
      className={cn("flex gap-1", mobile && "flex-col gap-2")}
    >
      {(["home", "projects"] as const).map((item) => (
        <a
          key={item}
          href={item === "home" ? "#/" : githubProfile}
          target={item === "projects" ? "_blank" : undefined}
          rel={item === "projects" ? "noopener noreferrer" : undefined}
          aria-current={item === "home" && page === "home" ? "page" : undefined}
          onClick={() => setMenuOpen(false)}
          className={cn("nav-link", mobile && "nav-link-mobile")}
        >
          <span>{t[item]}</span>
        </a>
      ))}
    </nav>
  )

  const preferences = (mobile = false) => (
    <div className="flex items-center gap-2">
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
      <div className="flex h-4" aria-hidden="true">
        <Separator orientation="vertical" />
      </div>
      <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size={mobile ? "icon-lg" : "icon"}
        nativeButton={false}
        render={<a href={githubProfile} target="_blank" rel="noopener noreferrer" />}
        aria-label={t.githubProfile}
        title={t.githubProfile}
      >
        <GithubMark />
      </Button>
      <Button
        variant="ghost"
        size={mobile ? "icon-lg" : "icon"}
        aria-label={t.sendEmail}
        title={t.sendEmail}
        onClick={openContactEmail}
      >
        <MailIcon aria-hidden="true" />
      </Button>
      </div>
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
        <motion.div
          id="mobile-menu"
          className="mobile-menu"
          initial={false}
          inert={!menuOpen}
          aria-hidden={!menuOpen}
          animate={{
            opacity: menuOpen ? 1 : 0,
            y: menuOpen || reducedMotion ? 0 : -8,
            clipPath: menuOpen ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
          }}
          transition={{ duration: reducedMotion ? 0 : menuOpen ? 0.24 : 0.18, ease: [0.22, 1, 0.36, 1] }}
          style={{ pointerEvents: menuOpen ? "auto" : "none" }}
        >
          {navigation(true)}
          <Separator />
          <div className="flex flex-wrap items-center justify-between gap-4">
            {preferences(true)}
          </div>
        </motion.div>
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
      {entered && (
        <footer className="site-footer">
          <div className="site-footer-inner">
            <div className="site-footer-signature">
              <strong>Yongchao Lai<span aria-hidden="true">.</span></strong>
              <p>{siteSlogan[locale]}</p>
            </div>
            <div className="site-footer-contact-links">
              <Button variant="ghost" size="icon-lg" nativeButton={false} className="site-footer-contact-link" aria-label={t.githubProfile} title={t.githubProfile} render={<a href={githubProfile} target="_blank" rel="noopener noreferrer" />}>
                <GithubMark />
              </Button>
              <Button variant="ghost" size="icon-lg" className="site-footer-contact-link" aria-label={t.sendEmail} title={t.sendEmail} onClick={openContactEmail}>
                <MailIcon aria-hidden="true" />
              </Button>
            </div>
          </div>
          <div className="site-footer-bottom">
            <span>© {new Date().getFullYear()} Yongchao Lai</span>
            <div className="site-footer-records" aria-label={locale === "zh" ? "网站备案信息" : "Website registration"}>
              <a className="site-footer-security-record" href="https://beian.mps.gov.cn/#/query/webSearch?code=44020402000374" target="_blank" rel="noopener noreferrer"><img src={publicSecurityIcon} alt="" width={20} height={22} />粤公网安备44020402000374号</a>
              <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">粤ICP备2023033182号</a>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}

export function App() {
  return <BackgroundMusic><Site /></BackgroundMusic>
}

export default App
