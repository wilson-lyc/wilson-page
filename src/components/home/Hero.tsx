import { useEffect, useRef, useState, type CSSProperties } from "react"
import { ArrowDown, ArrowUpRight, Pause, Play } from "lucide-react"
import { useReducedMotion } from "motion/react"
import type { Locale } from "@/lib/i18n"
import { githubProfile } from "@/content/home"
import welcomeGif from "@/assets/images/hero/welcome.gif"
import gdufsLogo from "@/assets/images/hero/gdufs-logo-c.png"
import gdufsLogoDark from "@/assets/images/hero/gdufs-logo-w.png"
import umLogo from "@/assets/images/hero/um-logo-c.png"
import umLogoDark from "@/assets/images/hero/um-logo-w.png"
import { Button } from "@/components/ui/button"

const slides = {
  en: [
    ["Hi, I'm", "Yongchao Lai", "Welcome to my page"],
    ["Studying Data Science at the University of Macau", ""],
    ["My research interest: backend service", ""],
    ["End-to-end thinking", "From idea to real system"],
    ["Stay curious · Keep learning", ""],
  ],
  zh: [
    ["Hi, I'm", "Yongchao Lai", "Welcome to my page"],
    ["正于澳门大学攻读硕士学位", ""],
    ["研究兴趣：后端服务", "从应用后端到模型服务，探索系统如何更高效地运行"],
    ["端到端思考", "从想法，到真正可用的系统"],
    ["心怀好奇，笃学不倦", ""],
  ],
} as const

const holdDuration = 5000
const exitDuration = 500
const fadeDuration = 550
const letterStagger = 28
// Each entrance ends when its last element finishes animating.
const entranceDurations = {
  en: [Math.max((slides.en[0][0].length - 1) * letterStagger + fadeDuration, 350 + 900), 1700 + 700, 1600 + 650, 650 + 2 * 180 + fadeDuration, 650 + fadeDuration],
  zh: [Math.max((slides.zh[0][0].length - 1) * letterStagger + fadeDuration, 350 + 900), 1700 + 700, 1600 + 650, 650 + 2 * 180 + fadeDuration, 650 + fadeDuration],
}
const clamp = (value: number) => Math.max(0, Math.min(1, value))

export function Hero({ locale, started, onStart }: { locale: Locale; started: boolean; onStart: () => void }) {
  const entrances = entranceDurations[locale]
  const introDuration = entrances[0]
  // Keep every exit inside its slide so the next entrance starts after it finishes.
  const durations = entrances.map(entrance => entrance + holdDuration + exitDuration)
  const totalDuration = durations.reduce((sum, duration) => sum + duration, 0)
  const reducedMotion = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const playhead = useRef(0)
  const zh = locale === "zh"
  const playing = started && !paused && !dragging && !reducedMotion

  useEffect(() => {
    if (started && !playing) return
    let previous = performance.now()
    let frame: number
    const tick = (now: number) => {
      if (!document.hidden) {
        const nextTime = playhead.current + now - previous
        playhead.current = started ? nextTime % totalDuration : Math.min(nextTime, introDuration)
        setElapsed(playhead.current)
      }
      previous = now
      if (started || playhead.current < introDuration) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [playing, started, introDuration, totalDuration])

  let active = 0
  let localTime = elapsed
  while (active < durations.length - 1 && localTime >= durations[active]) {
    localTime -= durations[active]
    active++
  }
  const reveal = (delay: number, duration = fadeDuration) => reducedMotion ? 1 : clamp((localTime - delay) / duration)
  const exitProgress = reducedMotion ? 0 : clamp((localTime - entrances[active] - holdDuration) / exitDuration)
  const leaving = active === slides[locale].length - 1
    ? exitProgress * exitProgress * (3 - 2 * exitProgress)
    : exitProgress
  const fadeStyle = (delay: number): CSSProperties => {
    const progress = reveal(delay)
    return { opacity: progress, transform: `translateY(${(1 - progress) * 16}px)`, filter: `blur(${(1 - progress) * 10}px)` }
  }

  const wipeStyle = (delay: number): CSSProperties => {
    const progress = 1 - Math.pow(1 - reveal(delay, 700), 3)
    return {
      opacity: clamp(progress * 3),
      clipPath: `inset(0 0 ${(1 - progress) * 100}% 0)`,
      transform: `translateY(${(1 - progress) * -20}px)`,
    }
  }

  return (
    <div className="hero-player" lang={locale} data-started={started}>
      <input disabled={!started} className="hero-seek" type="range" min={0} max={totalDuration} step={10}
        value={elapsed} aria-label={zh ? "Hero 播放进度" : "Hero playback progress"}
        aria-valuetext={`${Math.round(elapsed / 1000)} / ${totalDuration / 1000} ${zh ? "秒" : "seconds"} · ${zh ? "第" : "Slide"} ${active + 1} / ${durations.length}`}
        style={{ "--hero-progress": `${elapsed / totalDuration * 100}%` } as CSSProperties}
        onPointerDown={event => { event.currentTarget.setPointerCapture(event.pointerId); setDragging(true) }}
        onPointerUp={() => setDragging(false)} onPointerCancel={() => setDragging(false)} onLostPointerCapture={() => setDragging(false)}
        onChange={event => { playhead.current = Number(event.target.value); setElapsed(playhead.current) }} />
      <section className="hero" aria-labelledby="hero-heading" data-paused={!playing} data-closing={active === 4}>
      <button className="hero-play-toggle" type="button" onClick={() => setPaused(value => !value)}
        aria-label={paused || reducedMotion ? (zh ? "播放 Hero" : "Play Hero") : (zh ? "暂停 Hero" : "Pause Hero")}
        disabled={!started || !!reducedMotion}>
        {paused || reducedMotion ? <Play size={15} strokeWidth={1.5} aria-hidden="true" /> : <Pause size={15} strokeWidth={1.5} aria-hidden="true" />}
      </button>
      <div className="hero-light" aria-hidden="true"><i /><i /><i /></div>
      {active === 4 && <div className="hero-finale-backdrop" aria-hidden="true" style={{ opacity: reveal(0, 700) * (1 - leaving) }}><i /></div>}
      <div className="hero-copy">
        <h1 id="hero-heading" className="sr-only">{slides[locale][0].join(" ")}</h1>
        <p className="sr-only">{zh ? slides.zh[1][0] : slides.en[1][0]}</p>
        <p className="sr-only">{zh ? "研究兴趣：后端服务。从应用后端到模型服务，探索系统如何更高效地运行。从业务需求出发，设计系统架构与服务接口，探索微服务的拆分、协作与可靠运行。将关注点延伸至 AI 模型服务，探索大语言模型推理优化，以及响应延迟、吞吐量与资源利用率之间的平衡。" : "My research interest is backend services: from backend architecture and microservices development to high-performance AI model serving and LLM inference optimization."}</p>
        <p className="sr-only">{zh ? "心怀好奇，笃学不倦。端到端思考。从想法，到真正可用的系统。精选作品：作品 A、作品 B 和作品 C 均为演示占位内容。" : "Stay curious. Keep learning. End-to-end thinking. From idea to real system. Selected work: Work A, Work B, and Work C are demo placeholders."}</p>
        <div className="hero-slides" aria-hidden="true">
          <div className="hero-slide" data-education={active === 1} data-welcome={active === 0} data-research={active === 2} data-work={active === 3} data-closing={active === 4}
            style={{ opacity: 1 - leaving, transform: `translateY(${-12 * leaving}px)`, filter: `blur(${8 * leaving}px)` }}>
            <div className="hero-slide-copy">
            {active === 4 ? (
              <div className="hero-finale-message">
                <p className="hero-headline" style={fadeStyle(250)}>{zh ? "心怀好奇" : "Stay curious"}</p>
                <p className="hero-headline hero-finale-accent" style={fadeStyle(450)}>{zh ? "笃学不倦" : "Keep learning"}</p>
              </div>
            ) : slides[locale][active].map((line, lineIndex) => line && (
              <p className={lineIndex === 0 || (active === 0 && lineIndex === 1) ? "hero-headline hero-line" : "hero-subtitle"} key={line}
                style={active === 0 && lineIndex === 0 ? undefined : fadeStyle(lineIndex * 200)}>
                {active === 0 && lineIndex === 0 ? line.split(/(\s+)/).map((word, wordIndex, words) => (
                  <span className="hero-word" key={wordIndex}>
                    {Array.from(word).map((letter, letterIndex) => (
                      <span className="hero-letter" key={letterIndex} style={fadeStyle((
                        (lineIndex === 0 ? 0 : slides[locale][active][0].length) +
                        words.slice(0, wordIndex).join("").length + letterIndex
                      ) * letterStagger)}>{letter === " " ? "\u00a0" : letter}</span>
                    ))}
                  </span>
                )) : line.split(/(澳门大学|数据科学硕士|University of Macau|Data Science|后端服务|backend service)/).map((part, partIndex) => (
                  /^(澳门大学|数据科学硕士|University of Macau|Data Science|后端服务|backend service)$/.test(part)
                    ? <span className="hero-highlight" key={partIndex}>{part}</span>
                    : part
                ))}
              </p>
            ))}
            </div>
            {active === 0 && (
              <figure className="hero-polaroid" style={{
                opacity: reveal(350, 800),
                transform: `translateY(${(1 - reveal(350, 900)) * 32}px) rotate(${-4 + reveal(350, 900) * 7}deg) scale(${0.94 + reveal(350, 900) * 0.06})`,
              }}>
                <img src={welcomeGif} width={478} height={358} alt="" fetchPriority="high" decoding="async" />
              </figure>
            )}
            {active === 3 && (
              <div className="hero-selected-work">
                <div className="hero-work-atmosphere" style={{ opacity: reveal(100, 1000) }}><i /><i /></div>
                <p className="hero-work-label" style={fadeStyle(450)}>{zh ? "精选作品 · 演示" : "SELECTED WORK · DEMO"}</p>
                <div className="hero-work-grid">
                  {["A", "B", "C"].map((work, workIndex) => (
                    <article className="hero-work-item" key={work} style={fadeStyle(650 + workIndex * 180)}>
                      <div className="hero-work-preview"><span>{work}</span></div>
                      <h2>{zh ? "作品" : "Work"} {work}</h2>
                      <p>{zh ? "项目详情即将更新" : "Project details to come"}</p>
                    </article>
                  ))}
                </div>

              </div>
            )}
            {active === 2 && (
              <div className="hero-research-flow">
                <article className="hero-research-stage" style={{
                  opacity: reveal(550, 650), transform: `translateX(${(1 - reveal(550, 650)) * -24}px)`,
                }}>
                  <p className="hero-research-period">{zh ? "最初的方向" : "WHERE I STARTED"}</p>
                  <h2>{zh ? "应用后端" : "Application backend"}</h2>
                  <p>{(zh
                    ? ["从业务需求出发，设计系统架构，", "构建清晰的服务接口与可靠的微服务，", "探索服务之间的协作与稳定运行。"]
                    : ["Designing scalable backend architectures,", "building reliable, connected microservices,", "and supporting real-world application needs."]
                  ).map(line => <span className="hero-research-description-line" key={line}>{line}</span>)}</p>
                  <ul className="hero-research-topics"><li>{zh ? "系统架构" : "System architecture"}</li><li>{zh ? "微服务" : "Microservices"}</li></ul>
                </article>
                <div className="hero-research-arrow">
                  <svg viewBox="0 0 144 72" fill="none" aria-hidden="true">
                    <path d="M 9 51 C 34 22, 80 12, 130 34"
                      pathLength="1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                      strokeDasharray="1" strokeDashoffset={1 - reveal(1150, 650)} />
                    <path d="M 112 17 Q 121 25, 131 34 Q 118 35, 108 43"
                      pathLength="1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      strokeDasharray="1" strokeDashoffset={1 - reveal(1700, 250)} />
                  </svg>
                </div>
                <article className="hero-research-stage hero-research-current" style={{
                  opacity: reveal(1600, 650), transform: `translateX(${(1 - reveal(1600, 650)) * 24}px)`,
                }}>
                  <p className="hero-research-period">{zh ? "目前的探索" : "WHAT I EXPLORE NOW"}</p>
                  <h2>{zh ? "模型后端" : "Model backend"}</h2>
                  <p>{(zh
                    ? ["将关注点延伸至高性能 AI 模型服务，", "探索大语言模型推理与服务性能优化，", "平衡响应延迟、吞吐量与资源利用率。"]
                    : ["Exploring high-performance model serving,", "optimizing LLM inference efficiency,", "and balancing latency and throughput."]
                  ).map(line => <span className="hero-research-description-line" key={line}>{line}</span>)}</p>
                  <ul className="hero-research-topics"><li>{zh ? "推理优化" : "Inference optimization"}</li><li>{zh ? "服务性能" : "Serving performance"}</li></ul>
                </article>
              </div>
            )}
            {active === 1 && (
              <div className="hero-education">
                <div className="hero-education-rail" style={{ transform: `scaleX(${1 - Math.pow(1 - reveal(550, 650), 3)})` }} />
                <ol className="hero-education-stages">
                  {[
                    { logo: gdufsLogo, darkLogo: gdufsLogoDark, date: "2021.09 — 2025.06", school: zh ? "广东外语外贸大学" : "Guangdong University of Foreign Studies", degree: zh ? "工学学士学位" : "Bachelor of Engineering", major: zh ? "软件工程" : "Software Engineering", gpa: "3.84" },
                    { logo: umLogo, darkLogo: umLogoDark, date: zh ? "2025.08 — 至今" : "2025.08 — Present", school: zh ? "澳门大学" : "University of Macau", degree: zh ? "理学硕士学位" : "Master of Science", major: zh ? "数据科学（人工智能应用）" : "Data Science (Artificial Intelligence Applications)", gpa: "3.92" },
                  ].map((stage, stageIndex) => (
                    <li key={stage.date}>
                      <span className="hero-education-dot" style={{ opacity: reveal(1200 + stageIndex * 100, 250), transform: `scale(${reveal(1200 + stageIndex * 100, 250)})` }} />
                      <div className="hero-education-content" style={wipeStyle(1550 + stageIndex * 150)}>
                      <span className="hero-education-date">{stage.date}</span>
                      <div className="hero-school-logo" data-school={stage.logo === umLogo ? "um" : "gdufs"}>
                        <img className="hero-school-logo-light" src={stage.logo} alt={stage.school} decoding="async" />
                        <img className="hero-school-logo-dark" src={stage.darkLogo} alt={stage.school} decoding="async" />
                      </div>
                      <h2>{stage.degree}</h2>
                      <p>{stage.major}</p>
                      <p className="hero-education-gpa">{zh ? "绩点" : "GPA"} <strong>{stage.gpa}/4.0</strong></p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
        {active === 4 && (
          <div className="hero-contact" style={{ ...fadeStyle(650), opacity: reveal(650) * (1 - leaving) }}>
            <a className="solid-link" href={githubProfile} target="_blank" rel="noopener noreferrer">
              {zh ? "联系我" : "Contact me"} <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
        )}
      </div>
      <div className="hero-start" inert={started} aria-hidden={started}>
        <Button size="lg" onClick={onStart}>Start <ArrowUpRight data-icon="inline-end" aria-hidden="true" /></Button>
      </div>
      <button className="hero-scroll" type="button" disabled={!started} onClick={() => {
        const target = document.getElementById("education-heading")
        target?.focus({ preventScroll: true })
        target?.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth" })
      }}>
        <span>{zh ? "了解更多" : "Scroll to discover more"}</span>
        <ArrowDown size={17} aria-hidden="true" />
      </button>
      </section>
    </div>
  )
}
