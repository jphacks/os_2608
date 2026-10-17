// お部屋を選ぶボタンの絵（12x12 のドット絵の家）。K=枠 R=屋根 W=壁 B=ドア Y=ドアノブ
const rows = [
  '.....KK.....',
  '....KRRK....',
  '...KRRRRK...',
  '..KRRRRRRK..',
  '.KRRRRRRRRK.',
  'KKKKKKKKKKKK',
  '.KWWWWWWWWK.',
  '.KWWKKKKWWK.',
  '.KWWKBBKWWK.',
  '.KWWKBYKWWK.',
  '.KWWKBBKWWK.',
  '.KKKKKKKKKK.',
]

const colors: Record<string, string> = {
  K: '#5b4636',
  R: '#e07a5f',
  W: '#ffffff',
  B: '#9a5a3c',
  Y: '#f2cc5c',
}

export function HouseIcon() {
  return (
    <svg
      className="house-icon"
      viewBox="0 0 12 12"
      width="36"
      height="36"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {rows.flatMap((row, y) =>
        [...row].map((ch, x) =>
          colors[ch] ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={colors[ch]} /> : null,
        ),
      )}
    </svg>
  )
}
