import { useState } from 'react'
import { Pet } from '../components/Pet'
import { SpeechBubble } from '../components/SpeechBubble'
import { greeting, historyNotReadyLine, lookLine, petLine } from '../dialogue'
import type { Expression, PetState } from '../types'

type Props = {
  pet: PetState
  onConsult: () => void
}

export function Home({ pet, onConsult }: Props) {
  const [lines, setLines] = useState<string[]>([greeting])
  const [expression, setExpression] = useState<Expression>('normal')

  return (
    <main className="screen home">
      <SpeechBubble lines={lines} />
      <div className="pet-stage">
        <Pet level={pet.level} expression={expression} />
      </div>

      <section className="status" aria-label="ペットのようす">
        <div className="status-row">
          <span className="level">Lv {pet.level}</span>
          <span className="exp-label">けいけんち {pet.experience}</span>
        </div>
        {/* レベルアップに必要な経験値は未定のため、ゲージは0のまま */}
        <div className="exp-bar" role="progressbar" aria-valuenow={0} aria-valuemin={0} aria-valuemax={100}>
          <div className="exp-fill" style={{ width: '0%' }} />
        </div>
      </section>

      <button className="primary" onClick={onConsult}>
        ペットに相談する
      </button>
      <div className="sub-actions">
        <button
          onClick={() => {
            setLines([petLine])
            setExpression('happy')
          }}
        >
          なでる
        </button>
        <button
          onClick={() => {
            setLines([lookLine])
            setExpression('normal')
          }}
        >
          ようすを見る
        </button>
        <button
          onClick={() => {
            setLines([historyNotReadyLine])
            setExpression('normal')
          }}
        >
          きろくを見る
        </button>
      </div>

      <p className="note">
        記録はこの端末のブラウザ内に保存されます。これは医療的な診断を行うアプリではなく、日々の気持ちを振り返るためのサポートです。
      </p>
    </main>
  )
}
