import { useState, type CSSProperties } from "react"
import { Braces, Code2, Container, Cpu, Network, Sparkles } from "lucide-react"
import type { Locale } from "@/lib/i18n"

const capabilities = [
  {
    id: "backend", tags: ["Java", "Spring Boot", "Spring Cloud", "MySQL", "Redis", "API Gateway", "Nacos", "RocketMQ"],
    zh: { title: "后端开发", label: "主要方向", intro: "以 Java 为主，从业务需求、接口与数据模型出发，构建后端服务与微服务系统。", details: ["使用 Spring Boot 开发业务服务，结合 MySQL 完成数据存储与访问，使用 Redis 支持缓存与会话管理等场景。", "基于 Spring Cloud 组织微服务，通过 API Gateway 统一服务入口，使用 Nacos 管理服务注册、发现与配置。", "使用 RocketMQ 处理异步消息，将订单、支付等业务流程解耦；在项目中实践权限鉴权、事务处理与接口幂等。"] },
    en: { title: "Backend development", label: "Primary focus", intro: "Java-first backend development, connecting business requirements, APIs, and data models to working services.", details: ["Build business services with Spring Boot and MySQL, using Redis for caching and session management.", "Organize microservices with Spring Cloud, route requests through an API Gateway, and manage service discovery and configuration with Nacos.", "Use RocketMQ for asynchronous workflows and service decoupling, with project experience in authorization, transactions, and API idempotency."] },
  },
  {
    id: "frontend", tags: ["Vue", "UniApp", "Element Plus", "React", "shadcn/ui"],
    zh: { title: "前端开发", label: "配合后端，完成产品", intro: "使用 Vue、UniApp 与 Element Plus 开发业务界面，连接接口与交互流程，完成 Web 与小程序端的功能交付。", details: ["正在学习 React 与 shadcn/ui，拓展前端组件化开发与界面实现能力。"] },
    en: { title: "Frontend development", label: "Connecting services to users", intro: "Build web and mini-app interfaces with Vue, UniApp, and Element Plus, connecting APIs to complete user flows.", details: ["Currently learning React and shadcn/ui to broaden my component-based interface development skills."] },
  },
  {
    id: "delivery", tags: ["Docker", "Docker Compose", "Git", "GitHub Actions", "CI/CD"],
    zh: { title: "部署与维护", label: "从代码到运行", intro: "用 Docker 打包应用，通过 Docker Compose 编排多容器环境，让应用与依赖服务一起运行。", details: ["使用 Git 管理版本，借助 GitHub Actions 配置 CI/CD 流程，完成项目的自动构建与部署。"] },
    en: { title: "Deployment & maintenance", label: "From code to running services", intro: "Package applications with Docker and coordinate application and dependency containers with Docker Compose.", details: ["Manage versions with Git and configure GitHub Actions workflows for automated builds and deployments."] },
  },
  {
    id: "inference", tags: ["Python", "LLM Evaluation", "Perplexity", "KL Divergence", "Accuracy", "F1"],
    zh: { title: "AI 推理与自动化评测", label: "正在深入的方向", intro: "使用 Python 构建自动化测评流程，对不同模型或配置运行实验，从推理性能与任务效果两个维度比较结果。", details: ["将任务执行、指标计算与结果汇总串联起来，减少重复的手动操作，支持多组实验的持续评测。", "结合困惑度、KL 散度观察模型输出差异，并用 Accuracy、F1 等任务指标评估实际效果。"] },
    en: { title: "AI inference & automated evaluation", label: "An evolving focus", intro: "Build Python evaluation workflows to compare models and configurations across inference performance and downstream task quality.", details: ["Connect task execution, metric calculation, and result collection to reduce repetitive manual work across experiments.", "Use perplexity and KL divergence to examine model output differences, alongside task metrics such as accuracy and F1."] },
  },
  {
    id: "ml", tags: ["Data Cleaning", "Data Mining", "Model Training", "Model Evaluation", "CNN", "RNN"],
    zh: { title: "数据与机器学习实践", label: "具备基础与项目实践", intro: "实践过从数据清洗、数据挖掘，到建模、训练与评估的完整流程，能够参与基础的数据分析与模型实验。", details: ["了解神经网络与深度学习基础，对卷积神经网络、循环神经网络等常见结构有一定认识，仍在持续学习。"] },
    en: { title: "Data & machine learning practice", label: "Foundations and hands-on experience", intro: "Hands-on experience across data cleaning, mining, modeling, training, and evaluation, supporting foundational analysis and model experiments.", details: ["Familiar with neural network and deep learning fundamentals, including CNNs and RNNs, and continuing to develop these skills."] },
  },
] as const

const branchPositions = [
  { x: 210, y: 270 },
  { x: 580, y: 125 },
  { x: 950, y: 270 },
  { x: 860, y: 655 },
  { x: 300, y: 655 },
]
const branchIcons = [Braces, Code2, Container, Cpu, Network]

export function Capabilities({ locale }: { locale: Locale }) {
  const zh = locale === "zh"
  const [selected, setSelected] = useState("backend")
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  const active = capabilities.find(capability => capability.id === selected) ?? capabilities[0]
  const copy = active[locale]
  return (
    <section className="capabilities" aria-labelledby="capabilities-heading">
      <header className="capabilities-intro">
        <h2 id="capabilities-heading">{zh ? "我能做什么" : "What I can do"}</h2>
        <p>{zh ? "以我为起点，探索不断生长的技能树 · 点击分支或技能点了解更多" : "An evolving skill tree · Select a branch or skill to explore"}</p>
      </header>
      <p className="skill-tree-hint">{zh ? "左右滑动探索技能树" : "Swipe to explore the skill tree"}</p>
      <div className="skill-tree-scroll" tabIndex={0} role="region" aria-label={zh ? "交互技能树，可横向滚动" : "Interactive skill tree, horizontally scrollable"}>
        <div className="skill-tree">
          <svg className="skill-connections" viewBox="0 0 1160 850" aria-hidden="true">
            <circle className="skill-orbit" cx="580" cy="420" r="140" />
            <circle className="skill-orbit" cx="580" cy="420" r="275" />
            {branchPositions.map((position, index) => (
              <g key={capabilities[index].id} data-active={selected === capabilities[index].id}>
                <path className="skill-path" d={`M 580 420 Q ${position.x} 420 ${position.x} ${position.y}`} />
                <circle className="skill-signal" r="3">
                  <animateMotion dur={`${4 + index * 0.5}s`} repeatCount="indefinite" path={`M 580 420 Q ${position.x} 420 ${position.x} ${position.y}`} />
                </circle>
              </g>
            ))}
          </svg>
          <div className="skill-core">
            <span className="skill-core-symbol"><Sparkles size={28} aria-hidden="true" /></span>
            <strong>Yongchao Lai</strong>
            <span>{zh ? "后端开发 · 持续探索" : "Backend developer · Always exploring"}</span>
          </div>
          {capabilities.map((capability, index) => {
            const Icon = branchIcons[index]
            const t = capability[locale]
            return (
              <div className="skill-branch" data-active={selected === capability.id} key={capability.id}
                style={{ left: branchPositions[index].x, top: branchPositions[index].y, "--float-delay": `${-index * 1.3}s` } as CSSProperties}>
                <button className="skill-branch-heading" type="button" aria-pressed={selected === capability.id}
                  onClick={() => { setSelected(capability.id); setSelectedSkill(null) }} aria-controls="skill-detail">
                  <span className="skill-branch-icon"><Icon size={20} aria-hidden="true" /></span>
                  <span>{t.title}</span>
                </button>
                <div className="skill-twigs" aria-hidden="true"><i /><i /><i /></div>
                <ul className="skill-leaves">
                  {capability.tags.map(tag => (
                    <li key={tag}><button type="button" className="skill-leaf" data-selected={selected === capability.id && selectedSkill === tag}
                      aria-pressed={selected === capability.id && selectedSkill === tag} aria-controls="skill-detail"
                      onClick={() => { setSelected(capability.id); setSelectedSkill(tag) }}><span aria-hidden="true" />{tag}</button></li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
      <article className="skill-detail" id="skill-detail" aria-live="polite" aria-atomic="true">
        <header><p>{copy.label}{selectedSkill ? ` / ${selectedSkill}` : ""}</p><h3>{copy.title}</h3></header>
        <div><p>{copy.intro}</p><ul>{copy.details.map(detail => <li key={detail}>{detail}</li>)}</ul></div>
      </article>
    </section>
  )
}
