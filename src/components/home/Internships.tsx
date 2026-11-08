// import { useRef } from "react"
// import { useInView, useReducedMotion } from "motion/react"
import type { Locale } from "@/lib/i18n"

const internships = [
  {
    id: "yy", dates: "2024.12 — 2025.03",
    zh: { company: "广州方硅信息技术有限公司 · YY 直播", role: "软件测试实习生", description: "参与 YY 语音等产品的需求评审、功能与接口测试，跟进缺陷修复与回归验证。协同产品和研发完成验收，保障版本交付质量。" },
    en: { company: "Guangzhou Fanggui · YY Live", role: "Software Testing Intern", description: "Reviewed requirements and tested features and APIs for products including YY Voice, following defects through fixes and regression testing. Worked with product and engineering teams on release acceptance and quality." },
  },
  {
    id: "um-ici", dates: "2026.01 — 2026.07",
    zh: { company: "澳门大学创新创业中心", role: "IT Helper · 网站开发与维护", description: "独立完成协同创新研究院中英文官网的开发，并负责部门网站与活动专题页面的维护。推进“大健康+加速器”官网响应式改版，优化移动端浏览体验。" },
    en: { company: "University of Macau · Centre for Innovation and Entrepreneurship", role: "IT Helper · Web Development & Maintenance", description: "Independently built the bilingual Institute of Collaborative Innovation website and maintained departmental and event pages. Redesigned the Big Health+ Accelerator website for responsive layouts and a better mobile experience." },
  },
] as const

export function Internships({ locale }: { locale: Locale }) {
  // Animation temporarily disabled; retain the observer setup for restoration.
  // const timeline = useRef<HTMLOListElement>(null)
  // const visible = useInView(timeline, { once: true, amount: 0.25 })
  // const reducedMotion = useReducedMotion()
  return (
    <section className="internships" aria-labelledby="internships-heading">
      <h2 id="internships-heading">{locale === "zh" ? "实习" : "Internships"}</h2>
      {/* Animation props: ref={timeline} data-visible={visible || !!reducedMotion} */}
      <ol className="internship-list">
        {internships.map(record => {
          const t = record[locale]
          return (
            <li className="internship-entry" key={record.id}>
              <article className="internship-content" aria-labelledby={`internship-${record.id}`}>
                <div className="internship-period"><p>{record.dates}</p></div>
                <h3 id={`internship-${record.id}`}>{t.company}</h3>
                <p className="internship-role">{t.role}</p>
                <p className="internship-description">{t.description}</p>
              </article>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
