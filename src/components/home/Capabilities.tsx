import { type CSSProperties } from "react"
import { Popover } from "@base-ui/react/popover"
import { Tooltip } from "@base-ui/react/tooltip"
import { Badge } from "@/components/ui/badge"
import { Braces, Cpu, Network } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import tigerGif from "@/assets/images/hero/tiger.gif"
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

const branches = [
  { id: "software", zh: "软件工程", en: "Software Engineering", icon: Braces, groups: [
    { zh: "", en: "", capability: capabilities[0], tags: [
      ["后端开发", "Backend development"],
    ] },
    { zh: "", en: "", capability: capabilities[1], tags: [["前端开发", "Frontend development"]] },
    { zh: "", en: "", capability: capabilities[0], tags: [["数据存储", "Data storage"]] },
    { zh: "", en: "", capability: capabilities[2], tags: [["部署与运维", "Deployment & operations"]] },
  ] },
  { id: "data", zh: "数据科学", en: "Data Science", icon: Network, groups: [
    { zh: "", en: "", capability: capabilities[4], tags: [
      ["数据挖掘", "Data mining"], ["数据清洗", "Data cleaning"],
      ["数据可视化", "Data visualization"],
      ["模型设计", "Model design"], ["模型训练", "Model training"],
      ["模型评估", "Model evaluation"],
    ] },
  ] },
  { id: "infra", zh: "AI Infra", en: "AI Infrastructure", icon: Cpu, groups: [
    { zh: "", en: "", capability: capabilities[3], tags: [
      ["模型量化与压缩", "Model quantization & compression"], ["推理算子优化", "Inference operator optimization"],
    ] },
  ] },
]
const branchX = (index: number) => 190 + index * 390
function branchRows(branch: (typeof branches)[number], locale: Locale) {
  return branch.groups.flatMap(group => [
    ...(group[locale] ? [{ id: `${group.capability.id}-heading`, tag: group[locale], capability: group.capability, heading: true, learning: false }] : []),
    ...group.tags.map(tag => ({ id: `${group.capability.id}-${tag[1]}`, tag: tag[locale === "zh" ? 0 : 1], capability: group.capability, heading: false, learning: branch.id === "infra" })),
  ])
}
const softwareAbilities = [
  {
    zh: "后端开发", en: "Backend development", tags: ["Java", "Spring Boot / Cloud", "RESTful API", "WebSocket", "SSE", "MyBatis-Plus", "Sa-Token", "OpenFeign", "Spring Cloud Gateway", "Nacos", "Sentinel", "Swagger", "Apifox", "Postman"],
    description: {
      zh: "能够围绕业务需求设计与实现后端服务，合理划分职责与服务边界。关注系统的健壮性、数据一致性与可维护性，在异常和并发场景下保障服务的可靠运行。",
      en: "Design and implement backend services around business needs, with clear responsibilities and service boundaries. Focus on robustness, data consistency, and maintainability to keep services reliable under failures and concurrent workloads.",
    },
  },
  {
    zh: "前端开发", en: "Frontend development", tags: ["Vue", "uni-app"],
    description: {
      zh: "能够开发网页和小程序，实现页面布局、交互流程与接口对接，将业务需求转化为可用的用户界面。",
      en: "Build websites and mini-apps, implementing page layouts, user interactions, and API integration to turn business needs into usable interfaces.",
    },
  },
  {
    zh: "数据存储", en: "Data storage", tags: ["MySQL", "Redis", "MongoDB", "PostgreSQL"],
    description: {
      zh: "能够围绕业务需求设计数据模型，完成数据存储、查询与缓存管理。关注数据一致性与访问效率，持续学习不同数据库的使用方式。",
      en: "Design data models around business needs and implement data storage, queries, and caching. Focus on data consistency and access efficiency while continuing to explore different databases.",
    },
  },
  {
    zh: "部署与运维", en: "Deployment & operations", tags: ["CI/CD", "GitHub", "Gitea", "Docker", "Docker Compose", "Linux", "1Panel", "Nginx", "SSL/TLS", "腾讯云 EdgeOne", "Cloudflare"],
    description: {
      zh: "能够搭建自动化构建与部署流程，编排应用与依赖服务的容器，配置和维护服务器运行环境。关注服务的稳定运行与访问安全，完成 HTTPS 证书配置、反向代理及访问校验等工作。",
      en: "Set up automated build and deployment workflows, orchestrate containers for applications and their dependencies, and maintain server environments. Focus on reliable operation and secure access, including HTTPS certificates, reverse proxies, and visitor verification.",
    },
  },
]
const dataMiningAbility = {
  zh: "数据挖掘", en: "Data mining", tags: ["Python", "Selenium"],
  description: {
    zh: "能够编写浏览器自动化采集流程，获取后续清洗与分析所需的数据。",
    en: "Build browser automation workflows to collect data for subsequent cleaning and analysis.",
  },
}
const dataCleaningAbility = {
  zh: "数据清洗", en: "Data cleaning", tags: ["NumPy", "pandas"],
  description: {
    zh: "能够识别和处理数据中的缺失值，根据数据情况删除空值，或使用均值、中位数等方式填补缺失，为后续分析与建模准备数据。",
    en: "Identify and handle missing data by removing missing values or filling them with means or medians as appropriate, preparing data for analysis and modeling.",
  },
}
const dataVisualizationAbility = {
  zh: "数据可视化", en: "Data visualization", tags: ["Matplotlib", "Seaborn"],
  description: {
    zh: "能够将数据与分析结果转化为图表，展示数据分布、变化趋势和对比关系，辅助理解与表达分析结论。",
    en: "Turn data and analysis results into charts that show distributions, trends, and comparisons, helping interpret and communicate findings.",
  },
}
const modelDesignAbility = {
  zh: "模型设计", en: "Model design", tags: ["PyTorch", "MLP", "CNN", "RNN"],
  description: {
    zh: "能够使用 PyTorch 设计和搭建神经网络模型，了解全连接神经网络（MLP）、卷积神经网络（CNN）和循环神经网络（RNN），并根据任务需求组织网络结构。",
    en: "Design and build neural network models with PyTorch, with familiarity with fully connected neural networks (MLPs), convolutional neural networks (CNNs), and recurrent neural networks (RNNs), structuring networks around task requirements.",
  },
}
const modelTrainingAbility = {
  zh: "模型训练", en: "Model training",
  tags: ["PyTorch", "DataLoader", "Adam", "SGD", "LR Scheduler", "Early Stopping", "Checkpoint", "TensorBoard", "AMP"],
  description: {
    zh: "能够组织数据加载、损失计算与参数更新，完成神经网络的训练流程。通过调整学习率和优化策略、观察训练与验证曲线，改善模型收敛并控制过拟合。",
    en: "Build neural network training workflows covering data loading, loss calculation, and parameter updates. Adjust learning rates and optimization strategies and monitor training and validation curves to improve convergence and manage overfitting.",
  },
}
const modelEvaluationAbility = {
  zh: "模型评估", en: "Model evaluation",
  tags: ["scikit-learn", "Accuracy", "Precision", "Recall", "F1", "ROC-AUC", "Confusion Matrix", "MAE", "RMSE", "Cross-validation"],
  description: {
    zh: "能够根据分类或回归任务选择评估指标，在独立数据上比较模型表现。结合混淆矩阵与误差分析定位问题，关注模型的泛化能力及不同类别的表现。",
    en: "Select evaluation metrics for classification or regression tasks and compare models on held-out data. Use confusion matrices and error analysis to identify issues, examining generalization and performance across classes.",
  },
}
const skillDescriptionsEnabled = false

const backendTechnologyGroups = [
  { zh: "接口与通信", en: "Interfaces", tags: ["RESTful API", "WebSocket", "SSE"] },
  { zh: "服务实现", en: "Service implementation", tags: ["Java", "Go", "Node.js", "Spring Boot / Cloud"] },
  { zh: "数据与安全", en: "Data & security", tags: ["MyBatis-Plus", "Sa-Token"] },
  { zh: "微服务治理", en: "Service governance", tags: ["OpenFeign", "Spring Cloud Gateway", "Nacos", "Sentinel"] },
  { zh: "文档与调试", en: "Documentation & testing", tags: ["Swagger", "Apifox", "Postman"] },
]

function LearningTechnology({ technology, locale }: { technology: string; locale: Locale }) {
  return <Tooltip.Provider delay={0}>
    <Tooltip.Root>
      <Tooltip.Trigger delay={0} render={<Badge variant="learning" size="compact" tabIndex={0} />}>{technology}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner side="top" sideOffset={6}>
          <Tooltip.Popup className="skill-learning-tip">{locale === "zh" ? "努力学习中" : "Actively learning"}</Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
}

function AbilityTechnologies({ ability, locale }: { ability: (typeof softwareAbilities)[number]; locale: Locale }) {
  if (ability === softwareAbilities[1]) {
    const platforms = [
      { zh: "网页", en: "Web", technology: "Vue" },
      { zh: "小程序", en: "Mini-apps", technology: "uni-app" },
    ]
    return <dl className="skill-tech-groups">{platforms.map((platform, index) => (
      <div className="skill-architecture-layer" key={platform.en}>
        <dt><span className="skill-layer-number">{String(index + 1).padStart(2, "0")}</span>{platform[locale]}</dt>
        <dd className="skill-platform-stack">
          <div className="skill-architecture-blocks"><Badge variant="architecture" size="compact">{platform.technology}</Badge></div>
          {platform.technology === "uni-app" && (
            <div className="skill-platform-targets">
              <span className="skill-platform-caption">{locale === "zh" ? "跨端小程序" : "Cross-platform mini-apps"}</span>
              <div className="skill-architecture-blocks">
                {(locale === "zh" ? ["微信", "支付宝", "更多平台…"] : ["WeChat", "Alipay", "More platforms…"]).map(target => <Badge key={target} variant="architecture" size="compact">{target}</Badge>)}
              </div>
            </div>
          )}
        </dd>
      </div>
    ))}</dl>
  }
  if (ability === softwareAbilities[2]) {
    const groups = [
      { zh: "关系型数据库", en: "Relational databases", tags: ["MySQL", "PostgreSQL"] },
      { zh: "NoSQL", en: "NoSQL", tags: ["Redis", "MongoDB"] },
    ]
    return <dl className="skill-tech-groups">{groups.map((group, index) => (
      <div className="skill-architecture-layer" key={group.en}>
        <dt><span className="skill-layer-number">{String(index + 1).padStart(2, "0")}</span>{group[locale]}</dt>
        <dd className="skill-architecture-blocks">{group.tags.map(technology => technology === "PostgreSQL"
          ? <LearningTechnology key={technology} technology={technology} locale={locale} />
          : <Badge key={technology} variant="architecture" size="compact">{technology}</Badge>)}</dd>
      </div>
    ))}</dl>
  }
  if (ability === softwareAbilities[3]) {
    const groups = [
      { zh: "持续集成与部署", en: "CI/CD", tags: ["GitHub", "Gitea"] },
      { zh: "容器与服务器", en: "Containers & servers", tags: ["Docker", "Docker Compose", "Linux", "1Panel"] },
      { zh: "网络与证书", en: "Networking & certificates", tags: ["Nginx", "SSL / TLS"] },
      { zh: "边缘安全", en: "Edge security", tags: [locale === "zh" ? "腾讯云 EdgeOne" : "Tencent Cloud EdgeOne", "Cloudflare"] },
    ]
    return <dl className="skill-tech-groups">{groups.map((group, index) => (
      <div className="skill-architecture-layer" key={group.en}>
        <dt><span className="skill-layer-number">{String(index + 1).padStart(2, "0")}</span>{group[locale]}</dt>
        <dd className="skill-architecture-blocks">{group.tags.map(technology => <Badge key={technology} variant="architecture" size="compact">{technology}</Badge>)}</dd>
      </div>
    ))}</dl>
  }
  if (ability !== softwareAbilities[0]) {
    return <div className="skill-popover-tags">{ability.tags.map(technology => <Badge key={technology} variant="secondary" size="compact">{technology}</Badge>)}</div>
  }
  return (
    <dl className="skill-tech-groups">
      {backendTechnologyGroups.map((group, index) => (
        <div className="skill-architecture-layer" key={group.en}>
          <dt><span className="skill-layer-number">{String(index + 1).padStart(2, "0")}</span>{group[locale]}</dt>
          <dd className="skill-architecture-blocks">{group.tags.map(technology => {
            const learning = technology === "Go" || technology === "Node.js"
            if (!learning) return <Badge key={technology} variant="architecture" size="compact">{technology}</Badge>
            return <LearningTechnology key={technology} technology={technology} locale={locale} />
          })}</dd>
        </div>
      ))}
    </dl>
  )
}

function SkillTag({ tag, capability, locale }: { tag: string; capability: (typeof capabilities)[number]; locale: Locale }) {
  const ability = [...softwareAbilities, dataMiningAbility, dataCleaningAbility, dataVisualizationAbility, modelDesignAbility, modelTrainingAbility, modelEvaluationAbility].find(item => item[locale] === tag)
  if (!ability && !skillDescriptionsEnabled) return <span className="skill-leaf skill-leaf-static">{tag}</span>
  const copy = capability[locale]
  return (
    <Popover.Root>
      <Popover.Trigger className="skill-leaf" openOnHover delay={150} closeDelay={0}
        onClick={event => {
          if (window.matchMedia("(min-width: 768px) and (hover: hover)").matches) {
            event.preventBaseUIHandler()
          }
        }}>{tag}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner side="right" align="start" sideOffset={8} collisionPadding={16}>
          <Popover.Popup className="skill-popover" data-layout={ability === softwareAbilities[0] ? "architecture" : undefined} initialFocus={false}>
            <Popover.Title className="skill-popover-title">{tag}</Popover.Title>
            {ability ? (
              <>
                <Popover.Description>{ability.description[locale]}</Popover.Description>
                <AbilityTechnologies ability={ability} locale={locale} />
              </>
            ) : tag === "Java" ? (
              <Popover.Description>{locale === "zh"
                ? "我从本科的面向对象编程课程开始接触和学习 Java。了解 Java 中的 HashMap、Set 等常用集合。"
                : "I started learning Java in an undergraduate object-oriented programming course. I’m familiar with common Java collections such as HashMap and Set."}</Popover.Description>
            ) : (
              <>
                <p className="skill-popover-label">{copy.title} · {copy.label}</p>
                <Popover.Description>{copy.intro}</Popover.Description>
                <ul>{copy.details.map(detail => <li key={detail}>{detail}</li>)}</ul>
              </>
            )}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}

export function Capabilities({ locale }: { locale: Locale }) {
  const zh = locale === "zh"
  const reducedMotion = useReducedMotion()
  return (
    <section className="capabilities" aria-labelledby="capabilities-heading">
      <header className="capabilities-intro">
        <h2 id="capabilities-heading">{zh ? "技能" : "Skills"}</h2>
      </header>
      <div className="skill-mobile-tags">
        {branches.map(branch => (
          <div className="skill-tag-group" key={branch.id}>
            <h3>{branch[locale]}{branch.id === "infra" && <small className="skill-learning">{zh ? "学习中" : "Learning"}</small>}</h3>
            <ul>
              {branchRows(branch, locale).map(row => (
                <li key={row.id} className={row.heading ? "skill-tag-subheading" : undefined}>
                  {row.heading ? <h4>{row.tag}</h4> : <SkillTag tag={row.tag} capability={row.capability} locale={locale} />}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="skill-tree-hint">{zh ? "左右滑动探索技能树" : "Swipe to explore the skill tree"}</p>
      <div className="skill-tree-scroll" tabIndex={0} role="region" aria-label={zh ? "交互技能树，可横向滚动" : "Interactive skill tree, horizontally scrollable"}>
        <motion.div className="skill-tree" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          <svg className="skill-connections" viewBox="0 0 1160 940" aria-hidden="true">
            {branches.map((branch, index) => {
              const x = branchX(index)
              const tags = branchRows(branch, locale)
              return <g key={branch.id}>
                <motion.path className="skill-path" d={`M 580 154 C 580 210 ${x} 230 ${x} 320`}
                  variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 1 } }}
                  transition={{ delay: reducedMotion ? 0 : 0.35, duration: reducedMotion ? 0 : 0.65 }} />
                {tags.map((tag, leafIndex) => {
                  const y = 386 + leafIndex * 42
                  return <motion.path key={tag.id} className="skill-path" d={`M ${x} 350 H ${x - 155} V ${y} H ${x - 130}`}
                    variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 1 } }}
                    transition={{ delay: reducedMotion ? 0 : 1.1 + leafIndex * 0.09, duration: reducedMotion ? 0 : 0.35 }} />
                })}
              </g>
            })}
          </svg>
          <motion.div className="skill-core" variants={{ hidden: { opacity: 0, scale: 0.85 }, visible: { opacity: 1, scale: 1 } }} transition={{ duration: reducedMotion ? 0 : 0.35 }}>
            <img src={tigerGif} alt={zh ? "小老虎" : "Tiger"} />
            <strong>Me</strong>
          </motion.div>
          {branches.map((branch, index) => {
            const Icon = branch.icon
            const title = branch[locale]
            const tags = branchRows(branch, locale)
            return (
              <div className="skill-branch" key={branch.id}
                style={{ left: branchX(index) } as CSSProperties}>
                <motion.div className="skill-branch-heading"
                  variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} transition={{ delay: reducedMotion ? 0 : 0.9, duration: reducedMotion ? 0 : 0.3 }}
                  >
                  <span className="skill-branch-icon"><Icon size={20} aria-hidden="true" /></span>
                  <span>{title}</span>
                  {branch.id === "infra" && <small className="skill-learning">{zh ? "学习中" : "Learning"}</small>}
                </motion.div>
                <ul className="skill-leaves">
                  {tags.map(({ id, tag, capability, heading, learning }, leafIndex) => (
                    <motion.li key={id} style={{ top: 78 + leafIndex * 42 }}
                      variants={{ hidden: { opacity: 0, x: -8 }, visible: { opacity: 1, x: 0 } }}
                      transition={{ delay: reducedMotion ? 0 : 1.4 + leafIndex * 0.09, duration: reducedMotion ? 0 : 0.3 }}>
                      {heading ? <span className="skill-leaf skill-subheading">{tag}</span> : <><SkillTag tag={tag} capability={capability} locale={locale} />{learning && <small className="skill-leaf-learning">{zh ? "学习中" : "Learning"}</small>}</>}
                    </motion.li>
                  ))}
                </ul>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
