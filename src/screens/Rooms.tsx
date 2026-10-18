import { useState } from 'react'
import { SpeechBubble } from '../components/SpeechBubble'
import { affectionLevel, gaugeRatio } from '../affection'
import { findRoom, rooms } from '../rooms'
import type { PetState } from '../types'

type Props = {
  pet: PetState
  onSelect: (roomId: string) => void
  onDone: () => void
}

export function Rooms({ pet, onSelect, onDone }: Props) {
  const level = affectionLevel(pet.affection.pats)
  const [previewId, setPreviewId] = useState(pet.roomId)
  const preview = findRoom(previewId)
  const ratio = gaugeRatio(pet.affection.pats)
  return (
    <main className="screen rooms">
      <section className="status affection" aria-label="なかよしゲージ">
        <div className="status-row">
          <span className="level">なかよし Lv {level}</span>
          <span className="exp-label">♥</span>
        </div>
        <div
          className="exp-bar"
          role="progressbar"
          aria-valuenow={Math.round(ratio * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="exp-fill heart" style={{ width: `${ratio * 100}%` }} />
        </div>
      </section>
      <div className={`room room-preview ${preview.id}`} aria-label={`${preview.name}のプレビュー`} />
      <SpeechBubble lines={['どのお部屋にいようか？']} />
      <ul className="room-list">
        {rooms.map((room) => {
          const unlocked = level >= room.unlockLevel
          const selected = pet.roomId === room.id
          return (
            <li key={room.id}>
              <button
                className={`room-item ${room.id}`}
                disabled={!unlocked}
                aria-pressed={previewId === room.id}
                onClick={() => setPreviewId(room.id)}
              >
                <span className="room-name">{unlocked ? room.name : '？？？'}</span>
                <span className="room-state">
                  {!unlocked ? `なかよしLv ${room.unlockLevel} で開く` : selected ? 'いまここ' : ''}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <button className="primary" disabled={previewId === pet.roomId} onClick={() => onSelect(previewId)}>
        このお部屋にする
      </button>
      <button className="link" onClick={onDone}>
        ホームへ戻る
      </button>
    </main>
  )
}
