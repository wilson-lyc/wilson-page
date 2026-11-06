import type { projects } from "@/content/projects"

export function ProjectArt({
  kind,
}: {
  kind: (typeof projects)[number]["art"]
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 300 145"
      className="project-art"
      fill="none"
      stroke="currentColor"
    >
      {kind === "ordering" && (
        <g strokeLinejoin="round">
          {[0, 1, 2].map((i) => (
            <g
              key={i}
              transform={`translate(${70 + i * 52} ${36 + (i % 2) * 19}) skewY(-15)`}
            >
              <rect width="40" height="64" rx="3" fill="var(--module-face)" />
              <path d="M6 12h28M7 20h12M7 27h22M7 36h17" opacity=".55" />
              <rect
                x="7"
                y="48"
                width="24"
                height="6"
                fill="currentColor"
                stroke="none"
              />
            </g>
          ))}
          <path d="M88 105v9h102v-9M141 114v-8" strokeDasharray="3 3" />
        </g>
      )}
      {kind === "map" && (
        <g>
          <g opacity=".28" transform="rotate(-16 150 70)">
            {Array.from({ length: 32 }, (_, i) => (
              <rect
                key={i}
                x={(i % 8) * 48 - 40}
                y={Math.floor(i / 8) * 51 - 24}
                width={34}
                height={36}
                rx="3"
                fill="var(--module-face)"
              />
            ))}
          </g>
          <path d="m75 104 49-15-5-22 65-19 7 24 31-9" strokeWidth="3" />
          {[
            [75, 104],
            [222, 63],
          ].map(([x, y]) => (
            <g key={x}>
              <circle cx={x} cy={y} r="10" fill="var(--module-face)" />
              <circle cx={x} cy={y} r="4" fill="currentColor" />
            </g>
          ))}
        </g>
      )}
      {kind === "tiles" && (
        <g transform="matrix(1 .44 -1 .44 150 14)">
          {Array.from({ length: 64 }, (_, i) => (
            <rect
              key={i}
              x={(i % 8) * 16}
              y={Math.floor(i / 8) * 16}
              width="14"
              height="14"
              fill="currentColor"
              fillOpacity={((i * 7 + Math.floor(i / 8) * 3) % 11) / 12}
            />
          ))}
        </g>
      )}
    </svg>
  )
}
