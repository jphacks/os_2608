import { useState } from 'react'
import { AffectionGauge } from '../components/AffectionGauge'
import { buy, ownedPoints, shopItems, unavailableReason } from '../shop'
import { DayChart } from '../components/DayChart'
import { dayKey, dayPoints, moodLabels, typeNames } from '../dayChart'
import { loadRecords } from '../storage'
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
  const [mode, setMode] = useState<'bars' | 'day'>('bars')
  // 何日前を見ているか（0=今日）
  const [daysAgo, setDaysAgo] = useState(0)
  const [records] = useState(loadRecords)
  const shown = new Date()
  shown.setDate(shown.getDate() - daysAgo)
  const points = dayPoints(records, dayKey(shown))
  const [message, setMessage] = useState('')
  const owned = ownedPoints(pet)
  const total = rows.reduce((sum, r) => sum + pet.stats[r.type], 0)
  return (
    <main className="screen review">
      <h1 className="review-title">ふりかえり</h1>
      <div className="review-tabs" role="group" aria-label="表示のしかた">
        <button className="primary" aria-pressed={mode === 'bars'} onClick={() => setMode('bars')}>
          ぼうグラフ
        </button>
        <button className="primary" aria-pressed={mode === 'day'} onClick={() => setMode('day')}>
          1日のようす
        </button>
      </div>
      {mode === 'bars' ? (
        <>
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
        </>
      ) : (
        <section className="day-section">
          <div className="day-nav">
            <button className="icon-button" aria-label="前の日" onClick={() => setDaysAgo(daysAgo + 1)}>
              ＜
            </button>
            <strong>{daysAgo === 0 ? '今日' : `${shown.getMonth() + 1}/${shown.getDate()}`}</strong>
            <button className="icon-button" aria-label="次の日" disabled={daysAgo === 0} onClick={() => setDaysAgo(daysAgo - 1)}>
              ＞
            </button>
          </div>
          <DayChart points={points} />
          <div className="history">
            <h2 className="shop-title">りれき</h2>
            {points.length === 0 ? (
              <p className="history-empty">この日の記録はないよ</p>
            ) : (
              <ul className="history-list">
                {points.map((p) => (
                  <li key={p.id}>
                    {p.time} {moodLabels[p.mood]}
                    {p.types.length > 0 && `・${p.types.map((t) => typeNames[t]).join('・')}`}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}
      <section className="shop" aria-label="ショップ">
        <div className="status-row">
          <h2 className="shop-title">ショップ</h2>
          <span>{owned}ポイント</span>
        </div>
        <ul className="shop-list">
          {shopItems.map((item) => {
            const reason = unavailableReason(pet, item)
            return (
              <li key={item.id} className="shop-item">
                <span>
                  {item.name}（{item.price}ポイント）
                  {reason && <small className="shop-reason">{reason}</small>}
                </span>
                <button
                  className="primary"
                  disabled={!!reason}
                  onClick={() => {
                    const result = buy(pet, item)
                    if (!result) return
                    onUpdate(result.pet)
                    setMessage(result.message)
                  }}
                >
                  あげる
                </button>
              </li>
            )
          })}
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
