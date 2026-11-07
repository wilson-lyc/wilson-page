import { RollingNumber } from "./RollingNumber"
import { Badge } from "@/components/ui/badge"
import type { Locale } from "@/lib/i18n"
import gdufsColor from "@/assets/images/hero/gdufs-logo-c.png"
import gdufsWhite from "@/assets/images/hero/gdufs-logo-w.png"
import umColor from "@/assets/images/hero/um-logo-c.png"
import umWhite from "@/assets/images/hero/um-logo-w.png"

const education = [
  {
    id: "gdufs", start: "2021.09", end: "2025.06", gpa: "3.84", logos: [gdufsColor, gdufsWhite],
    zh: { stage: "本科阶段", school: "广东外语外贸大学", degree: "工学学士", major: "软件工程", department: "信息科学与技术学院", courses: ["面向对象程序设计", "数据结构", "计算机系统组成", "操作系统", "软件工程", "计算机网络", "数据库系统原理", "Web 开发", "云计算与大数据", "软件质量保证与测试", "移动软件开发"] },
    en: { stage: "Undergraduate", school: "Guangdong University of Foreign Studies", degree: "Bachelor of Engineering", major: "Software Engineering", department: "School of Information Science and Technology", courses: ["Object-Oriented Programming", "Data Structures", "Computer Architecture", "Operating Systems", "Software Engineering", "Computer Networks", "Database Systems", "Web Development", "Cloud Computing and Big Data", "Software Quality Assurance and Testing", "Mobile Software Development"] },
  },
  {
    id: "um", start: "2025.08", end: null, gpa: "3.92", logos: [umColor, umWhite],
    zh: { stage: "研究生阶段", school: "澳门大学", degree: "理学硕士（在读）", major: "数据科学（人工智能应用）", department: "人工智能与脑科学研究院", courses: ["深度学习导论", "数据科学编程", "数据库与数据挖掘", "人工智能原理", "机器学习实践", "物联网数据分析", "自然语言处理与应用", "数据可视化"] },
    en: { stage: "Postgraduate", school: "University of Macau", degree: "Master of Science · In progress", major: "Data Science (Artificial Intelligence Applications)", department: "Institute of Artificial Intelligence and Brain Science", courses: ["Introduction to Deep Learning", "Data Science Programming", "Database and Data Mining", "Principles of Artificial Intelligence", "Machine Learning Practice", "IoT Data Analysis", "Natural Language Processing and Applications", "Data Visualization"] },
  },
] as const

export function Education({ locale }: { locale: Locale }) {
  const zh = locale === "zh"
  return (
    <section className="education" aria-labelledby="education-heading">
      <h2 id="education-heading" tabIndex={-1}>{zh ? "教育" : "Education"}</h2>
      <ol className="education-timeline">
        {education.map(record => {
          const t = record[locale]
          return (
            <li className="education-entry" key={record.id}>
              <div className="education-period">
                <span className="education-marker" aria-hidden="true" />
                <p className="education-stage">{t.stage}</p>
                <p className="education-dates">{record.start} — {record.end ?? (zh ? "至今" : "Present")}</p>
                  <div className="education-logo" data-school={record.id}>
                    <img className="education-logo-light" src={record.logos[0]} alt="" />
                    <img className="education-logo-dark" src={record.logos[1]} alt="" />
                  </div>
              </div>
              <article className="education-body" aria-labelledby={`education-${record.id}`}>
                <header className="education-school">
                  <h3 id={`education-${record.id}`}>{t.school}</h3>
                </header>
                <div className="education-details">
                  <dl className="education-summary">
                    <div className="education-qualification">
                      <dt className="sr-only">{zh ? "学位与专业" : "Degree and major"}</dt>
                      <dd><span>{t.degree}</span><span aria-hidden="true">·</span><span>{t.major}</span></dd>
                    </div>
                    <div className="education-department">
                      <dt className="sr-only">{zh ? "学院 / 研究院" : "School / Institute"}</dt>
                      <dd>{t.department}</dd>
                    </div>
                  </dl>
                  <dl className="education-stats">
                    <div><dt>{zh ? "绩点" : "GPA"}</dt><dd><strong><RollingNumber value={record.gpa} /></strong><span className="education-gpa-scale"> / 4.0</span></dd></div>
                    {record.id === "gdufs" && <div><dt>{zh ? "专业排名" : "Class ranking"}</dt><dd className="education-ranking-value">Top <strong><RollingNumber value="10" />%</strong></dd></div>}
                  </dl>
                </div>
                <div className="education-coursework">
                  <h4>{zh ? "专业课程" : "Coursework"}</h4>
                  <ul>{t.courses.map(course => <li key={course}><Badge variant="secondary" size="comfortable">{course}</Badge></li>)}</ul>
                </div>
              </article>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
