import { useState } from 'react'
import { HelpIcon } from '../components/HelpIcon'
import { SpeechBubble } from '../components/SpeechBubble'
import { NAME_UNLOCK_LEVEL, affectionLevel, gaugeRatio } from '../affection'
import { PLAYER_NAME_MAX, playerCallName } from '../dialogue'
import { rooms } from '../rooms'
import type { PetState } from '../types'

type Props = {
  pet: PetState
  onSelect: (roomId: string) => void
  onRename: (name: string) => void
  onTutorial: () => void
  onDone: () => void
}

export function Rooms({ pet, onSelect, onRename, onTutorial, onDone }: Props) {
  const level = affectionLevel(pet.affection.pats)
  const [previewId, setPreviewId] = useState(pet.roomId)
  const ratio = gaugeRatio(pet.affection.pats)
  const nameUnlocked = level >= NAME_UNLOCK_LEVEL
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(pet.playerName ?? '')
  return (
    <main className={`screen rooms room ${previewId}`}>
      <div className="rooms-veil" aria-hidden="true" />
      <button className="icon-button help-button" onClick={onTutorial} aria-label="チュートリアル">
        <HelpIcon />
      </button>
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
      {editing ? (
        <form
          className="name-form"
          onSubmit={(e) => {
            e.preventDefault()
            onRename(draft.trim())
            setEditing(false)
          }}
        >
          <label>
            キミのことを、なんて呼ぼうか？
            <input
              value={draft}
              maxLength={PLAYER_NAME_MAX}
              placeholder={playerCallName(pet.level)}
              onChange={(e) => setDraft(e.target.value)}
            />
          </label>
          <button className="primary" type="submit">
            保存する
          </button>
        </form>
      ) : (
        <button disabled={!nameUnlocked} onClick={() => setEditing(true)}>
          呼び方をかえる
          {!nameUnlocked && `（なかよしLv ${NAME_UNLOCK_LEVEL} で開く）`}
        </button>
      )}
      <button className="link" onClick={onDone}>
        ホームへ戻る
      </button>
    </main>
  )
}
