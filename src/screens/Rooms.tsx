import { SpeechBubble } from '../components/SpeechBubble'
import { affectionLevel } from '../affection'
import { rooms } from '../rooms'
import type { PetState } from '../types'

type Props = {
  pet: PetState
  onSelect: (roomId: string) => void
  onDone: () => void
}

export function Rooms({ pet, onSelect, onDone }: Props) {
  const level = affectionLevel(pet.affection.pats)
  return (
    <main className="screen rooms">
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
                aria-pressed={selected}
                onClick={() => onSelect(room.id)}
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
      <button className="link" onClick={onDone}>
        ホームへ戻る
      </button>
    </main>
  )
}
