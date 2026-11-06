// Draw the module on an isometric grid. The same projection keeps the pins,
// traces and etched dies aligned across all three exploded layers.
const point = (u: number, v: number, h = 0) => [
  240 + (u - v) * 1.03,
  103 + (u + v) * 0.49 - h,
]
const path = (nodes: number[][]) =>
  nodes
    .map(([u, v, h], i) => (i ? "L" : "M") + point(u, v, h).join(","))
    .join(" ")
const square = (x: number, y: number, size: number, height: number) =>
  path([
    [x, y, height],
    [x + size, y, height],
    [x + size, y + size, height],
    [x, y + size, height],
  ]) + "Z"
const ticks = Array.from({ length: 20 }, (_, i) => 8 + i * 8)
function Plate({
  size,
  h,
  depth,
  inset,
}: {
  size: number
  h: number
  depth: number
  inset: number
}) {
  const a = inset,
    b = a + size
  return (
    <g strokeLinejoin="round">
      <path
        d={
          path([
            [a, b, h],
            [b, b, h],
            [b, a, h],
            [b, a, h - depth],
            [b, b, h - depth],
            [a, b, h - depth],
          ]) + "Z"
        }
        fill="var(--module-side)"
      />
      <path d={square(a, a, size, h)} fill="var(--module-face)" />
      <path
        d={square(a + 4, a + 4, size - 8, h)}
        fill="none"
        strokeWidth=".6"
      />
    </g>
  )
}
export function ComputeModule() {
  return (
    <svg
      className="compute-module"
      viewBox="0 0 480 362"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="draft-grid"
          width="16"
          height="16"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="1" r=".75" fill="currentColor" opacity=".22" />
        </pattern>
      </defs>
      <rect x="1" y="1" width="478" height="360" fill="url(#draft-grid)" />
      <g stroke="currentColor" strokeWidth="1.1">
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            transform={`translate(${i % 2 ? 469 : 11} ${i > 1 ? 351 : 11})`}
            d="M-4 0h8 M0 -4v8"
            opacity=".45"
          />
        ))}
        <Plate inset={-7} size={187} h={-35} depth={7} />
        {ticks.map((n, i) => (
          <g key={n} strokeWidth=".8">
            <path
              d={path([
                [n, -7, -36],
                [n, -15, -36],
                [n, -15, -40],
              ])}
            />
            <path
              d={path([
                [-7, n, -36],
                [-16, n, -36],
                [-16, n, -40],
              ])}
            />
            <path
              d={path([
                [180, n, -39],
                [187, n, -42],
                [187, n, -45],
              ])}
            />
            <path
              d={path([
                [n, 180, -39],
                [n, 187, -42],
                [n, 187, -45],
              ])}
            />
            <path
              d={path([
                [n, 169, -35],
                [n, 143 - (i % 4) * 4, -35],
                [n + 5, 138 - (i % 4) * 4, -35],
                [n + 5, 122, -35],
              ])}
            />
          </g>
        ))}
        <path d={square(30, 30, 110, -35)} fill="var(--module-side)" />
        {[0, 1, 2, 3].map((i) => {
          const u = i % 2 ? 169 : 3,
            v = i > 1 ? 169 : 3
          return (
            <path
              key={i}
              d={path([
                [u, v, -35],
                [u, v, 67],
              ])}
              opacity=".5"
              strokeDasharray="3 4"
            />
          )
        })}
        <Plate inset={3} size={166} h={22} depth={4} />
        {ticks.slice(0, 17).map((n, i) => (
          <g key={n} strokeWidth=".8" opacity=".76">
            <path
              d={path([
                [n + 5, 160, 22],
                [n + 5, 142, 22],
                [n + 12, 135, 22],
                [n + 12, 107 + (i % 3) * 3, 22],
              ])}
            />
            <path
              d={path([
                [160, n + 5, 22],
                [142, n + 5, 22],
                [135, n + 12, 22],
                [109, n + 12, 22],
              ])}
            />
          </g>
        ))}
        <Plate inset={19} size={134} h={71} depth={8} />
        <path d={square(27, 27, 118, 71)} fill="var(--module-ink)" />
        {Array.from({ length: 64 }, (_, i) => (
          <path
            key={i}
            d={square(31 + (i % 8) * 14, 31 + Math.floor(i / 8) * 14, 12, 71)}
            fill="var(--module-face)"
            opacity={0.18 + ((i * 13) % 7) / 10}
            stroke="none"
          />
        ))}
        {[32, 141].map((n) => (
          <path
            key={n}
            d={path([
              [n, 19, 71],
              [n, 12, 82],
              [n, -2, 82],
            ])}
            strokeWidth=".8"
          />
        ))}
      </g>
    </svg>
  )
}
