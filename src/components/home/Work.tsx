import { projects } from "@/content/projects"
import type { Locale } from "@/lib/i18n"

export function Work({ locale }: { locale: Locale }) {
  const zh = locale === "zh"
  return (
    <section className="work" aria-labelledby="work-heading">
      <header className="work-intro">
        <h2 id="work-heading">{zh ? "项目实践" : "Project Experience"}</h2>
      </header>
      <div className="work-grid">
        {projects.map((project) => (
          <article className="work-example" key={project.name}>
            <a
              className="work-card"
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${zh ? "查看 GitHub 仓库" : "View GitHub repository"} · ${project.name}`}
            >
              <div
                className="work-cover"
                title={zh ? "项目概念示意图" : "Conceptual illustration"}
              >
                <img
                  src={project.cover}
                  alt=""
                  width={1200}
                  height={900}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <p className="work-type">{project[locale][0]}</p>
              <h3>{project.name}</h3>
              <p className="work-description">{project[locale][1]}</p>
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}
