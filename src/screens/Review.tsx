import { useState } from 'react'
import { AffectionGauge } from '../components/AffectionGauge'
import { buy, ownedPoints, shopItems } from '../shop'
import type { PetState, StressType } from '../types'

type Props = {
  pet: PetState
  onUpdate: (pet: PetState) => void
  onDone: () => void
}

const rows: { type: StressType; name: string }[] = [
  { type: 'physical', name: '物理的ストレス' },
  { type: 'chemical', name: '化学的ストレス' },
  { type: 'psychological', name: '心理・社会的ストレス' },
  { type: 'biological', name: '生物的ストレス' },
]

// これまでの相談で数えた4系統のつらさの点数を、合計に対する割合（%）の横棒で見せる
export function Review({ pet, onUpdate, onDone }: Props) {
  const [message, setMessage] = useState('')
  const owned = ownedPoints(pet)
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
      <section className="shop" aria-label="ショップ">
        <div className="status-row">
          <h2 className="shop-title">ショップ</h2>
          <span>{owned}ポイント</span>
        </div>
        <ul className="shop-list">
          {shopItems.map((item) => (
            <li key={item.id} className="shop-item">
              <span>
                {item.name}（{item.price}ポイント）
              </span>
              <button
                className="primary"
                disabled={owned < item.price}
                onClick={() => {
                  const result = buy(pet, item)
                  if (!result) return
                  onUpdate(result.pet)
                  setMessage(
                    result.leveledUp
                      ? `${item.name}をあげた！ 新しいお部屋が開いたよ！`
                      : `${item.name}をあげた！ なかよしがふえたよ`,
                  )
                }}
              >
                あげる
              </button>
            </li>
          ))}
        </ul>
        {message && <p className="shop-message">{message}</p>}
        <AffectionGauge pats={pet.affection.pats} />
      </section>
      <button className="link" onClick={onDone}>
        ホームへ戻る
      </button>
    </main>
  )
}
