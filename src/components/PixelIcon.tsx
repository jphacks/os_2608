// 編集まわりのボタンに使う 10x10 のドット絵アイコン。K=線 のみの1色で、文字色に合わせる
const icons = {
  pencil: [
    '......KK..',
    '.....KKKK.',
    '....KKKKK.',
    '...KKKKK..',
    '..KKKKK...',
    '.KKKKK....',
    '.KKKK.....',
    'KKKK......',
    'KK........',
    '..........',
  ],
  trash: [
    '...KKKK...',
    'KKKKKKKKKK',
    '..........',
    '.KKKKKKKK.',
    '.KK.KK.KK.',
    '.KK.KK.KK.',
    '.KK.KK.KK.',
    '.KK.KK.KK.',
    '.KKKKKKKK.',
    '..........',
  ],
  check: [
    '..........',
    '.......KK.',
    '......KKK.',
    '.....KKK..',
    'KK..KKK...',
    'KKKKKK....',
    '.KKKK.....',
    '..KK......',
    '..........',
    '..........',
  ],
  cross: [
    '..........',
    '.KK....KK.',
    '.KKK..KKK.',
    '..KKKKKK..',
    '...KKKK...',
    '...KKKK...',
    '..KKKKKK..',
    '.KKK..KKK.',
    '.KK....KK.',
    '..........',
  ],
  plus: [
    '....KK....',
    '....KK....',
    '....KK....',
    '....KK....',
    'KKKKKKKKKK',
    'KKKKKKKKKK',
    '....KK....',
    '....KK....',
    '....KK....',
    '....KK....',
  ],
}

export function PixelIcon({ name, size = 24 }: { name: keyof typeof icons; size?: number }) {
  return (
    <svg viewBox="0 0 10 10" width={size} height={size} shapeRendering="crispEdges" aria-hidden="true">
      {icons[name].flatMap((row, y) =>
        [...row].map((ch, x) =>
          ch === 'K' ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="currentColor" /> : null,
        ),
      )}
    </svg>
  )
}
