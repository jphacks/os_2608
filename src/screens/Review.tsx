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

// これまでの相談で数えた、4系統それぞれのつらさの点数の合計を横棒で見せる
export function Review({ pet, onDone }: Props) {
  const max = Math.max(1, ...rows.map((r) => pet.stats[r.type]))
  return (
    <main className="screen review">
      <h1 className="review-title">ふりかえり</h1>
      <ul className="review-list">
        {rows.map(({ type, name }) => {
          const points = pet.stats[type]
          return (
            <li key={type} className="review-row">
              <div className="status-row">
                <span>{name}</span>
                <span>{points}点</span>
              </div>
              <div
                className="review-bar"
                role="progressbar"
                aria-label={name}
                aria-valuenow={points}
                aria-valuemin={0}
                aria-valuemax={max}
              >
                <div className={`review-fill ${type}`} style={{ width: `${(points / max) * 100}%` }} />
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
