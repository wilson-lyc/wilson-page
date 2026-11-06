import { useRef, type ReactNode } from "react"
import { motion, useScroll, useTransform, type MotionValue } from "motion/react"

type Scene = {
  title: string
  description: string
  label?: string
  visual: ReactNode
}

function Frame({
  progress,
  index,
  count,
  children,
}: {
  progress: MotionValue<number>
  index: number
  count: number
  children: ReactNode
}) {
  // Each row occupies an equal share of the track. Blend near the row boundary.
  const center = (index + 0.5) / count
  const stops = [-0.68, -0.28, 0.28, 0.68].map(
    (offset) => center + offset / count
  )
  const opacity = useTransform(progress, stops, [
    index === 0 ? 1 : 0,
    1,
    1,
    index === count - 1 ? 1 : 0,
  ])
  const y = useTransform(progress, stops, [
    index === 0 ? 0 : 25,
    0,
    0,
    index === count - 1 ? 0 : -25,
  ])
  return (
    <motion.div className="story-frame" style={{ opacity, y }}>
      {children}
    </motion.div>
  )
}

export function ScrollStory({ scenes }: { scenes: Scene[] }) {
  const track = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start center", "end center"],
  })
  return (
    <div className="story-track" ref={track}>
      <div className="story-stage" aria-hidden="true">
        {scenes.map((scene, index) => (
          <Frame
            key={index}
            progress={scrollYProgress}
            index={index}
            count={scenes.length}
          >
            {scene.visual}
          </Frame>
        ))}
      </div>
      <div className="story-steps">
        {scenes.map((scene) => (
          <article className="story-step" key={scene.title}>
            <div className="inline-visual" aria-hidden="true">
              {scene.visual}
            </div>
            <div>
              {scene.label && <p className="project-tags">{scene.label}</p>}
              <h3>{scene.title}</h3>
              <p>{scene.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
