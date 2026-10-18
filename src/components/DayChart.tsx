import { moodLabels, type DayPoint } from '../dayChart'

// 横が0〜24時、縦が4段のグラフ（ドット絵風の折れ線）
const W = 300
const H = 160
const LEFT = 76
const TOP = 12
const BOTTOM = 24
const plotW = W - LEFT - 8
const plotH = H - TOP - BOTTOM

const x = (hour: number) => LEFT + (hour / 24) * plotW
const y = (mood: number) => TOP + (mood / 3) * plotH

export function DayChart({ points }: { points: DayPoint[] }) {
  return (
    <svg className="day-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="1日のつらさの変化">
      {moodLabels.map((label, i) => (
        <g key={label}>
          <line className="day-grid" x1={LEFT} x2={W - 8} y1={y(i)} y2={y(i)} />
          <text className="day-label" x={LEFT - 6} y={y(i) + 4} textAnchor="end">
            {label}
          </text>
        </g>
      ))}
      {[0, 6, 12, 18, 24].map((h) => (
        <g key={h}>
          <line className="day-grid" x1={x(h)} x2={x(h)} y1={TOP} y2={TOP + plotH} />
          <text className="day-label" x={x(h)} y={H - 6} textAnchor="middle">
            {h}
          </text>
        </g>
      ))}
      {points.length > 1 && (
        <polyline className="day-line" fill="none" points={points.map((p) => `${x(p.hour)},${y(p.mood)}`).join(' ')} />
      )}
      {points.map((p) => (
        <g key={p.id}>
          <rect className="day-dot" x={x(p.hour) - 4} y={y(p.mood) - 4} width="8" height="8" />
          <text
            className="day-point-label"
            x={Math.min(Math.max(x(p.hour), LEFT + 24), W - 24)}
            y={p.mood === 3 ? y(p.mood) - 9 : y(p.mood) + 15}
            textAnchor="middle"
          >
            {moodLabels[p.mood]}
          </text>
        </g>
      ))}
    </svg>
  )
}
