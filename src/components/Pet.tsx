import type { Expression, Level } from '../types'

// 仮の絵。本番の絵に差し替えるときは src/assets/pet/ の同じ名前のファイルを置き換える（docs/pet-assets.md）
const images = import.meta.glob<string>('../assets/pet/*.{svg,png}', { eager: true, import: 'default' })

function findImage(level: Level, expression: Expression): string | undefined {
  const name = `lv${level}-${expression}`
  return (
    images[`../assets/pet/${name}.png`] ??
    images[`../assets/pet/${name}.svg`] ??
    images[`../assets/pet/lv${level}-normal.png`] ??
    images[`../assets/pet/lv${level}-normal.svg`]
  )
}

type Props = {
  level: Level
  expression: Expression
  // 32px のドット絵を何倍で表示するか。ぼやけないよう整数倍にする
  scale?: number
}

export function Pet({ level, expression, scale = 6 }: Props) {
  const size = 32 * Math.round(scale)
  return (
    <img
      className="pet"
      src={findImage(level, expression)}
      width={size}
      height={size}
      alt="ペット"
    />
  )
}
