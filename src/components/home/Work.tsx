import { Badge } from "@/components/ui/badge"
import type { Locale } from "@/lib/i18n"

const demos = [
  { id: "A", zh: { title: "让想法成为界面", type: "交互探索", description: "一个关于信息与交互的示例作品，尝试用简单的界面串联日常任务。", tags: ["界面设计", "交互原型"] }, en: { title: "An idea, made visible", type: "Interaction study", description: "A demo exploring how a simple interface can connect information and everyday tasks.", tags: ["Interface design", "Prototyping"] } },
  { id: "B", zh: { title: "连接系统的每一环", type: "系统实验", description: "一个虚构的服务实验，用于展示从界面到服务的数据流与整体思路。", tags: ["系统设计", "服务开发"] }, en: { title: "Connecting the pieces", type: "System experiment", description: "A fictional service experiment illustrating the flow of data from interface to backend.", tags: ["System design", "Services"] } },
  { id: "C", zh: { title: "留一点空间给探索", type: "创意练习", description: "一份尚未定型的创意示例，用来尝试新的表达方式与技术可能。", tags: ["创意编程", "技术探索"] }, en: { title: "Room for exploration", type: "Creative practice", description: "An open-ended demo for trying new forms of expression and exploring technical possibilities.", tags: ["Creative coding", "Exploration"] } },
] as const

export function Work({ locale }: { locale: Locale }) {
  const zh = locale === "zh"
  return (
    <section className="work" aria-labelledby="work-heading">
      <header className="work-intro">
        <h2 id="work-heading">{zh ? "作品" : "Work"}</h2>
        <p>{zh ? "以下均为 Demo 示例，用于预览作品展示效果" : "Demo examples for previewing the work layout"}</p>
      </header>
      <div className="work-grid">
        {demos.map(demo => {
          const t = demo[locale]
          return (
            <article className="work-example" key={demo.id}>
              <div className="work-cover" data-work={demo.id} aria-hidden="true">
                <span className="work-cover-label">DEMO / {demo.id}</span>
                <span className="work-cover-letter">{demo.id}</span>
                <div className="work-cover-shape" />
              </div>
              <p className="work-type">{t.type}</p>
              <h3>{t.title}</h3>
              <p className="work-description">{t.description}</p>
              <ul className="work-tags">{t.tags.map(tag => <li key={tag}><Badge variant="secondary" size="comfortable">{tag}</Badge></li>)}</ul>
            </article>
          )
        })}
      </div>
    </section>
  )
}
