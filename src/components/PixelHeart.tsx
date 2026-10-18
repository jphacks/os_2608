// ドット絵のハート（7x6）。R=赤。ハートのエフェクトに使う
const rows = [
  '.RR.RR.',
  'RRRRRRR',
  'RRRRRRR',
  '.RRRRR.',
  '..RRR..',
  '...R...',
]

export function PixelHeart() {
  return (
    <svg viewBox="0 0 7 6" width="28" height="24" shapeRendering="crispEdges" aria-hidden="true">
      {rows.flatMap((row, y) =>
        [...row].map((ch, x) =>
          ch === 'R' ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#e0546b" /> : null,
        ),
      )}
    </svg>
  )
}
