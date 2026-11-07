import type { Locale } from "@/lib/i18n"
import { Hero } from "./Hero"
import { Education } from "./Education"
import { Internships } from "./Internships"
import { Work } from "./Work"
import { Capabilities } from "./Capabilities"
import "./home.css"

export function Home({ locale, started, onStart }: { locale: Locale; started: boolean; onStart: () => void }) {
  return (
    <>
      <Hero locale={locale} started={started} onStart={onStart} />
      <div className="portfolio" hidden={!started}>
        <Education locale={locale} />
        <Internships locale={locale} />
        <Work locale={locale} />
        <Capabilities locale={locale} />
      </div>
    </>
  )
}
