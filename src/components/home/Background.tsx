import { ArrowUpRight } from "lucide-react"
import { background } from "@/content/background"
import type { Locale } from "@/lib/i18n"

export function Background({ locale }: { locale: Locale }) {
  const t = background[locale]
  return (
    <>
      <section className="background-section">
        <div>
          <p className="kicker">{t.experience}</p>
          <h2>{t.workTitle}</h2>
        </div>
        <ol className="work-history">
          {t.work.map((job, i) => (
            <li key={job.place}>
              <p className="record-date">{job.dates}</p>
              <h3>{job.place}</h3>
              <p className="record-role">{job.role}</p>
              <p>{job.description}</p>
              {i === 0 && (
                <a
                  className="text-link"
                  href="https://ici.um.edu.mo"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.visit}
                  <ArrowUpRight size={15} />
                </a>
              )}
            </li>
          ))}
        </ol>
      </section>
      <section className="education-section">
        <p className="kicker">{t.education}</p>
        <h2>{t.studyTitle}</h2>
        <div className="schools">
          {t.schools.map((school, i) => (
            <article key={school.name}>
              <p className="record-date">{school.dates}</p>
              <h3>{school.name}</h3>
              <p className="record-role">{school.degree}</p>
              <p>{school.result}</p>
              {i === 1 && <p>{t.honors}</p>}
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
