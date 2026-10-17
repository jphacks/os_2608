import { useState } from 'react'
import { LevelGauge } from '../components/LevelGauge'
import { Pet } from '../components/Pet'
import { SpeechBubble } from '../components/SpeechBubble'
import {
  categoryConfirm,
  categoryOptions,
  categoryQuestion,
  intensityOptions,
  intensityQuestion,
  responseExpression,
  responseLines,
} from '../dialogue'
import type { ConsultResult } from '../growth'
import type { Category, Intensity, PetState } from '../types'

type Props = {
  pet: PetState
  // 相談の内容を記録し、ペットの状態に反映した結果を返す
  onFinish: (categories: Category[], intensity: Intensity | undefined) => ConsultResult
  onDone: () => void
}

type Step = 'category' | 'intensity' | 'response'

export function Consult({ pet: current, onFinish, onDone }: Props) {
  const [step, setStep] = useState<Step>('category')
  const [selected, setSelected] = useState<Category[]>([])
  const [intensity, setIntensity] = useState<Intensity>()
  const [result, setResult] = useState<ConsultResult>()
  const finish = (categories: Category[], strength: Intensity | undefined) => {
    setIntensity(strength)
    setResult(onFinish(categories, strength))
    setStep('response')
  }

  const toggle = (value: Category) =>
    setSelected((chosen) => {
      if (chosen.includes(value)) return chosen.filter((c) => c !== value)
      // 「今日は大丈夫だった」は、他のストレスとは一緒に選べない
      if (value === 'good_day') return ['good_day']
      return [...chosen.filter((c) => c !== 'good_day'), value]
    })

  if (step === 'response' && result) {
    const { pet, leveledUp } = result
    return (
      <main className="screen consult">
        <SpeechBubble lines={responseLines(selected, intensity, leveledUp)} />
        <div className="pet-stage">
          <Pet level={pet.level} branch={pet.branch} expression={responseExpression(intensity)} />
        </div>
        <LevelGauge experience={pet.experience} level={pet.level} />
        <button className="primary" onClick={onDone}>
          ホームへ戻る
        </button>
      </main>
    )
  }

  return (
    <main className="screen consult">
      <SpeechBubble lines={[step === 'category' ? categoryQuestion : intensityQuestion]} />
      <div className="pet-stage small">
        <Pet level={current.level} branch={current.branch} expression="normal" scale={4} />
      </div>
      <div className="choices">
        {step === 'category' &&
          categoryOptions.map((o) => (
            <button
              key={o.value}
              className="check"
              role="checkbox"
              aria-checked={selected.includes(o.value)}
              onClick={() => toggle(o.value)}
            >
              <span className="box" aria-hidden="true">
                {selected.includes(o.value) ? '■' : '□'}
              </span>
              {o.label}
            </button>
          ))}
        {step === 'intensity' &&
          intensityOptions.map((o) => (
            <button key={o.value} onClick={() => finish(selected, o.value)}>
              {o.label}
            </button>
          ))}
      </div>
      {step === 'category' && (
        <button
          className="primary"
          disabled={selected.length === 0}
          onClick={() => {
            // 「今日は大丈夫だった」だけのときは、つらさを聞かない
            if (selected.every((c) => c === 'good_day')) finish(selected, undefined)
            else setStep('intensity')
          }}
        >
          {categoryConfirm}
        </button>
      )}
      <button className="link" onClick={onDone}>
        やめてホームへ戻る
      </button>
    </main>
  )
}
