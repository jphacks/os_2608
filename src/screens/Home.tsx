import { useState } from 'react'
import { DevPanel } from '../components/DevPanel'
import { LevelGauge } from '../components/LevelGauge'
import { Pet } from '../components/Pet'
import { SpeechBubble } from '../components/SpeechBubble'
import { affectionLevel, gaugeRatio, pat } from '../affection'
import {
  greeting,
  historyNotReadyLine,
  lookLine,
  petLimitLine,
  petLine,
  roomUnlockedLine,
} from '../dialogue'
import { findRoom } from '../rooms'
import type { Expression, PetState } from '../types'

type Props = {
  pet: PetState
  onChangePet: (pet: PetState) => void
  onConsult: () => void
  onRooms: () => void
}

export function Home({ pet, onChangePet, onConsult, onRooms }: Props) {
  const [lines, setLines] = useState<string[]>([greeting])
  const [expression, setExpression] = useState<Expression>('normal')
  // 親密度ゲージはなでたときだけ表示する
  const [showAffection, setShowAffection] = useState(false)
  // ハートを出し直すたびに key を変えて、アニメーションを最初から再生する
  const [heartKey, setHeartKey] = useState(0)
  // 開発者モード: 下の注意書きを5回続けてタップすると開く
  const [devOpen, setDevOpen] = useState(false)
  const [devTaps, setDevTaps] = useState(0)
  const onNoteTap = () => {
    if (devTaps + 1 >= 5) {
      setDevOpen(true)
      setDevTaps(0)
    } else {
      setDevTaps(devTaps + 1)
    }
  }

  const onPat = () => {
    const result = pat(pet.affection)
    onChangePet({ ...pet, affection: result.affection })
    setShowAffection(true)
    if (result.kind === 'limit') {
      setLines([petLimitLine])
      setExpression('normal')
      return
    }
    setLines(result.leveledUp ? [petLine, roomUnlockedLine] : [petLine])
    setExpression('happy')
    setHeartKey((k) => k + 1)
  }

  const level = affectionLevel(pet.affection.pats)
  const room = findRoom(pet.roomId)

  return (
    <main className="screen home">
      <LevelGauge experience={pet.experience} level={pet.level} />
      <div className={`pet-stage room ${room.id}`}>
        <SpeechBubble lines={lines} />
        <Pet level={pet.level} branch={pet.branch} expression={expression} />
        {heartKey > 0 && (
          <div className="hearts" key={heartKey} aria-hidden="true">
            <span>♥</span>
            <span>♥</span>
            <span>♥</span>
          </div>
        )}
      </div>

      {showAffection && (
        <section className="status affection" aria-label="なかよしゲージ">
          <div className="status-row">
            <span className="level">なかよし Lv {level}</span>
            <span className="exp-label">♥</span>
          </div>
          <div
            className="exp-bar"
            role="progressbar"
            aria-valuenow={Math.round(gaugeRatio(pet.affection.pats) * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="exp-fill heart" style={{ width: `${gaugeRatio(pet.affection.pats) * 100}%` }} />
          </div>
        </section>
      )}

      <button className="primary" onClick={onConsult}>
        ペットに相談する
      </button>
      <div className="sub-actions">
        <button onClick={onPat}>なでる</button>
        <button
          onClick={() => {
            setLines([lookLine])
            setExpression('normal')
            setShowAffection(false)
          }}
        >
          ようすを見る
        </button>
        <button
          onClick={() => {
            setLines([historyNotReadyLine])
            setExpression('normal')
            setShowAffection(false)
          }}
        >
          きろくを見る
        </button>
      </div>
      <button className="secondary" onClick={onRooms}>
        おへやをえらぶ
      </button>

      {devOpen && <DevPanel pet={pet} onChangePet={onChangePet} onClose={() => setDevOpen(false)} />}

      <p className="note" onClick={onNoteTap}>
        記録はこの端末のブラウザ内に保存されます。これは医療的な診断を行うアプリではなく、日々の気持ちを振り返るためのサポートです。
      </p>
    </main>
  )
}
