import type { Expression, Level, StressType } from '../types'

// 仮の絵。本番の絵に差し替えるときは src/assets/pet/ の同じ名前のファイルを置き換える（docs/pet-assets.md）
const images = import.meta.glob<string>('../assets/pet/*.{svg,png}', { eager: true, import: 'default' })

const lookup = (name: string) => images[`../assets/pet/${name}.png`] ?? images[`../assets/pet/${name}.svg`]

// 進化後は系統ごとの絵（lv2-physical-happy など）。無ければ共通の絵、表情が無ければ通常の絵に切り替える
function findImage(level: Level, branch: StressType | undefined, expression: Expression): string | undefined {
  const bases = branch && level >= 2 ? [`lv${level}-${branch}`, `lv${level}`] : [`lv${level}`]
  for (const base of bases) {
    const found = lookup(`${base}-${expression}`) ?? lookup(`${base}-normal`)
    if (found) return found
  }
}

type Props = {
  level: Level
  // 最初に進化したときの傾向。Lv2以降の見た目の差分
  branch?: StressType
  expression: Expression
  // 32px のドット絵を何倍で表示するか。ぼやけないよう整数倍にする
  scale?: number
}

export function Pet({ level, branch, expression, scale = 6 }: Props) {
  const size = 32 * Math.round(scale)
  return (
    <img
      className="pet"
      src={findImage(level, branch, expression)}
      width={size}
      height={size}
      alt="ペット"
      draggable={false}
    />
  )
}
