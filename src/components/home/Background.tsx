import { useRef } from "react"
import { ArrowUpRight, BriefcaseBusiness, GraduationCap } from "lucide-react"
import { motion, useReducedMotion, useScroll } from "motion/react"
import { career } from "@/content/career"
import type { Locale } from "@/lib/i18n"

export function Background({ locale }: { locale: Locale }) {
  const zh = locale === "zh"
  const track = useRef<HTMLOListElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: track, offset: ["start 75%", "end 65%"] })

  return (
    <section className="career-section" aria-labelledby="career-heading">
      <header className="career-intro">
        <p className="kicker">{zh ? "学习 · 实践 · 成长" : "Learn · Practice · Grow"}</p>
        <h2 id="career-heading">{zh ? "生涯经历" : "My journey"}</h2>
        <p>{zh ? "从软件工程到人工智能，在学习与实践中不断向前。" : "From software engineering to AI. Moving forward through study and practice."}</p>
        <span className="career-hint">{zh ? "按开始时间排列" : "Ordered by start date"}</span>
      </header>
      <ol className="career-timeline" ref={track}>
        <motion.li className="career-progress" aria-hidden="true" style={{ scaleY: reduceMotion ? 1 : scrollYProgress }} />
        {career.map((record, index) => {
          const copy = record[locale]
          const Icon = record.kind === "education" ? GraduationCap : BriefcaseBusiness
          return (
            <motion.li className="career-node" key={record.id}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.45 }}>
              <article className="career-record" aria-labelledby={`career-${record.id}`}>
                <header className="career-milestone">
                  <span className="career-dot" aria-hidden="true"><Icon size={17} /></span>
                  <span className="career-meta"><span>{record.dates}</span><span>{record.kind === "education" ? (zh ? "教育" : "Education") : (zh ? "实习" : "Internship")}</span></span>
                  <div className="career-summary"><div><h3 className="career-place" id={`career-${record.id}`}>{copy.place}</h3><p className="career-role">{copy.role}</p></div></div>
                </header>
                <div className="career-details">
                  <p className="career-chapter"><span>0{index + 1}</span> {copy.chapter}</p>
                  <p className="career-department">{copy.department}</p>
                  <ul className="career-facts">{copy.facts.map(fact => <li key={fact}>{fact}</li>)}</ul>
                  <ul className="career-description">{copy.details.map(detail => <li key={detail}>{detail}</li>)}</ul>
                  {"href" in record && <a className="text-link" href={record.href} target="_blank" rel="noopener noreferrer">{zh ? "访问研究院官网" : "Visit the institute website"}<ArrowUpRight size={15} /></a>}
                </div>
              </article>
            </motion.li>
          )
        })}
      </ol>
    </section>
  )
}
