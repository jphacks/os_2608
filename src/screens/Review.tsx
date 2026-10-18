import type { PetState, StressType } from '../types'

type Props = {
  pet: PetState
  onDone: () => void
}

const rows: { type: StressType; name: string }[] = [
  { type: 'physical', name: '物理的ストレス' },
  { type: 'chemical', name: '化学的ストレス' },
  { type: 'psychological', name: '心理・社会的ストレス' },
  { type: 'biological', name: '生物的ストレス' },
]

// これまでの相談で数えた4系統のつらさの点数を、合計に対する割合（%）の横棒で見せる
export function Review({ pet, onDone }: Props) {
  const total = rows.reduce((sum, r) => sum + pet.stats[r.type], 0)
  return (
    <main className="screen review">
      <h1 className="review-title">ふりかえり</h1>
      <ul className="review-list">
        {rows.map(({ type, name }) => {
          const percent = total === 0 ? 0 : Math.round((pet.stats[type] / total) * 100)
          return (
            <li key={type} className="review-row">
              <div className="status-row">
                <span>{name}</span>
                <span>{percent}%</span>
              </div>
              <div
                className="review-bar"
                role="progressbar"
                aria-label={name}
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className={`review-fill ${type}`} style={{ width: `${percent}%` }} />
              </div>
            </li>
          )
        })}
      </ul>
      <button className="link" onClick={onDone}>
        ホームへ戻る
      </button>
    </main>
  )
}
