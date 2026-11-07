import {
  ArrowRight,
  ArrowUpRight,
  Layers,
  Terminal,
  Workflow,
} from "lucide-react"
import type { Locale } from "@/lib/i18n"
import { githubProfile, homeCopy } from "@/content/home"
import { projects } from "@/content/projects"
import { Hero } from "./Hero"
import { ProjectArt } from "./ProjectArt"
import { Background } from "./Background"
import { ScrollStory } from "./ScrollStory"
import "./home.css"

const icons = [Workflow, Layers, Terminal]

export function Home({ locale }: { locale: Locale }) {
  const t = homeCopy[locale]
  return (
    <>
      <Hero locale="en" />
      <div className="portfolio">
      <section className="story-section">
        <p className="kicker">{t.capabilities}</p>
        <h2 id="capability-heading" tabIndex={-1}>
          {t.capabilityHeading}
        </h2>
        <ScrollStory
          scenes={t.steps.map(([title, description], i) => {
            const Icon = icons[i]
            const captions =
              locale === "zh"
                ? [
                    "需求 → 接口 → 数据模型",
                    t.flow.join(" → "),
                    t.agent + " → " + t.verify,
                  ]
                : [
                    "Requirements → API → Data model",
                    t.flow.join(" → "),
                    t.agent + " → " + t.verify,
                  ]
            return {
              title,
              description,
              visual: (
                <figure className="cap-diagram">
                  <Icon strokeWidth={0.8} />
                  <figcaption>{captions[i]}</figcaption>
                </figure>
              ),
            }
          })}
        />
      </section>
      <section className="story-section">
        <p className="kicker">{t.selected}</p>
        <div className="work-heading">
          <h2>{t.workHeading}</h2>
          <a className="text-link" href="#/projects">
            {t.all}
            <ArrowRight size={16} />
          </a>
        </div>
        <ScrollStory
          scenes={projects.map((p) => ({
            title: p.name,
            label: p[locale][0],
            description: p[locale][1],
            visual: (
              <figure className="project-figure">
                <ProjectArt kind={p.art} />
                <figcaption>
                  {p.name} · {t.illustration}
                </figcaption>
              </figure>
            ),
          }))}
        />
      </section>
      <Background locale={locale} />
      <section className="closing">
        <div>
          <h2>{t.closing}</h2>
          <p>{t.invitation}</p>
        </div>
        <a
          className="solid-link"
          href={githubProfile}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.github}
          <ArrowUpRight size={17} />
        </a>
      </section>
      <footer>© {new Date().getFullYear()} Wilson.</footer>
      </div>
    </>
  )
}
