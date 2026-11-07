import { useRef } from "react"
import { motion, useInView, useReducedMotion } from "motion/react"

const reel = Array.from({ length: 30 }, (_, index) => index % 10)

export function RollingNumber({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const visible = useInView(ref, { once: true, amount: 0.8 })
  const reducedMotion = useReducedMotion()

  return (
    <span className="rolling-number" ref={ref}>
      <span className="sr-only">{value}</span>
      <span className="rolling-number-visual" aria-hidden="true">
        {Array.from(value).map((character, index) => {
          if (!/\d/.test(character) || reducedMotion) return <span key={index}>{character}</span>
          return (
            <span className="rolling-number-window" key={index}>
              <motion.span className="rolling-number-reel"
                initial={{ y: "0em" }}
                animate={{ y: visible ? `${-(20 + Number(character)) * 1.15}em` : "0em" }}
                transition={{ duration: 1.65 + index * 0.12, delay: index * 0.09, ease: [0.16, 1, 0.3, 1] }}>
                {reel.map((digit, position) => <span key={position}>{digit}</span>)}
              </motion.span>
            </span>
          )
        })}
      </span>
    </span>
  )
}
