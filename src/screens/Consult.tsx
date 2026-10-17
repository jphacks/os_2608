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
import type { Answer, Category, Intensity, PetState } from '../types'

type Props = {
  pet: PetState
  // 相談の内容を記録し、ペットの状態に反映した結果を返す
  onFinish: (answers: Answer[]) => ConsultResult
  onDone: () => void
}

type Step = 'category' | 'intensity' | 'response'

export function Consult({ pet: current, onFinish, onDone }: Props) {
  const [step, setStep] = useState<Step>('category')
  const [selected, setSelected] = useState<Category[]>([])
  // 選んだ出来事ごとのつらさ
  const [intensities, setIntensities] = useState<Partial<Record<Category, Intensity>>>({})
  const [answers, setAnswers] = useState<Answer[]>([])
  const [result, setResult] = useState<ConsultResult>()
  const finish = (finished: Answer[]) => {
    setAnswers(finished)
    setResult(onFinish(finished))
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
        <SpeechBubble lines={responseLines(answers, leveledUp)} />
        <div className="pet-stage">
          <Pet level={pet.level} branch={pet.branch} expression={responseExpression(answers)} />
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
          selected.map((category) => (
            <fieldset key={category} className="intensity-row">
              <legend>{categoryOptions.find((o) => o.value === category)?.label}</legend>
              <div className="intensity-options" role="radiogroup">
                {intensityOptions.map((o) => (
                  <button
                    key={o.value}
                    role="radio"
                    aria-checked={intensities[category] === o.value}
                    onClick={() => setIntensities((current) => ({ ...current, [category]: o.value }))}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </fieldset>
          ))}
      </div>
      {step === 'category' && (
        <button
          className="primary"
          disabled={selected.length === 0}
          onClick={() => {
            // 「今日は大丈夫だった」だけのときは、つらさを聞かない
            if (selected.every((c) => c === 'good_day')) finish(selected.map((category) => ({ category })))
            else setStep('intensity')
          }}
        >
          {categoryConfirm}
        </button>
      )}
      {step === 'intensity' && (
        <button
          className="primary"
          disabled={selected.some((c) => !intensities[c])}
          onClick={() => finish(selected.map((category) => ({ category, intensity: intensities[category] })))}
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
