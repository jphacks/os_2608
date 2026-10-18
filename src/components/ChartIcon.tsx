// ふりかえり画面へのボタンの絵（12x12 のドット絵の横棒グラフ）。K=枠 R=赤 P=紫 B=青 G=緑
const rows = [
  'KKKKKKKKKKKK',
  'K..........K',
  'K.RRRRRR...K',
  'K.RRRRRR...K',
  'K..........K',
  'K.PPPPPPPP.K',
  'K.PPPPPPPP.K',
  'K..........K',
  'K.BBBB.....K',
  'K.GGGGGG...K',
  'K..........K',
  'KKKKKKKKKKKK',
]

const colors: Record<string, string> = {
  K: '#5b4636',
  R: '#e05a4f',
  P: '#9b6fd0',
  B: '#4f8fe0',
  G: '#5cb85c',
}

export function ChartIcon() {
  return (
    <svg className="house-icon" viewBox="0 0 12 12" width="36" height="36" shapeRendering="crispEdges" aria-hidden="true">
      {rows.flatMap((row, y) =>
        [...row].map((ch, x) =>
          colors[ch] ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={colors[ch]} /> : null,
        ),
      )}
    </svg>
  )
}
