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
import { cn } from "@/lib/utils"

type Page = "home" | "projects"
const currentPage = (): Page =>
  location.hash === "#/projects" ? "projects" : "home"

export function App() {
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
  }, [])

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
    <div className="site-shell">
      <a
        className="skip-link"
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
        {page === "home" ? (
          <Home locale={locale} />
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

export default App
