// チュートリアルを開くボタンの絵（12x12 のドット絵の「？」）。K=枠 W=ふきだし R=文字
const rows = [
  '..KKKKKKKK..',
  '.KWWWWWWWWK.',
  'KWWWWRRWWWWK',
  'KWWWRWWRWWWK',
  'KWWWWWWRWWWK',
  'KWWWWWRWWWWK',
  'KWWWWRWWWWWK',
  'KWWWWWWWWWWK',
  'KWWWWRWWWWWK',
  '.KWWWWWWWWK.',
  '..KKKKWKKK..',
  '......KK....',
]

const colors: Record<string, string> = {
  K: '#5b4636',
  W: '#ffffff',
  R: '#e07a5f',
}

export function HelpIcon() {
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
