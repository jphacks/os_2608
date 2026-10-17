import { useState } from 'react'
import { Pet } from '../components/Pet'
import { SpeechBubble } from '../components/SpeechBubble'
import {
  categoryOptions,
  categoryQuestion,
  intensityOptions,
  intensityQuestion,
  responseExpression,
  responseLines,
} from '../dialogue'
import type { Category, Intensity, Level, StressRecord } from '../types'

type Props = {
  level: Level
  onSave: (record: StressRecord) => void
  onDone: () => void
}

type Step = 'category' | 'intensity' | 'response'

function newId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function Consult({ level, onSave, onDone }: Props) {
  const [step, setStep] = useState<Step>('category')
  const [category, setCategory] = useState<Category>()
  const [record, setRecord] = useState<StressRecord>()

  const finish = (category: Category, intensity?: Intensity) => {
    const saved: StressRecord = {
      id: newId(),
      createdAt: new Date().toISOString(),
      category,
      intensity,
    }
    onSave(saved)
    setRecord(saved)
    setStep('response')
  }

  if (step === 'response' && record) {
    return (
      <main className="screen consult">
        <SpeechBubble lines={responseLines(record)} />
        <div className="pet-stage">
          <Pet level={level} expression={responseExpression(record)} />
        </div>
        <button className="primary" onClick={onDone}>
          ホームへ戻る
        </button>
      </main>
    )
  }

  const question = step === 'category' ? categoryQuestion : intensityQuestion

  return (
    <main className="screen consult">
      <SpeechBubble lines={[question]} />
      <div className="pet-stage small">
        <Pet level={level} expression="normal" scale={4} />
      </div>
      <div className="choices">
        {step === 'category' &&
          categoryOptions.map((o) => (
            <button
              key={o.value}
              onClick={() => {
                // 「今日は大丈夫だった」のときは強さを聞かず、そのまま記録する
                if (o.value === 'good_day') {
                  finish(o.value)
                } else {
                  setCategory(o.value)
                  setStep('intensity')
                }
              }}
            >
              {o.label}
            </button>
          ))}
        {step === 'intensity' &&
          intensityOptions.map((o) => (
            <button
              key={o.value}
              onClick={() => category && finish(category, o.value)}
            >
              {o.label}
            </button>
          ))}
      </div>
      <button className="link" onClick={onDone}>
        やめてホームへ戻る
      </button>
    </main>
  )
}
