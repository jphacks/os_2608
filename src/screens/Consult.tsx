import { useState } from 'react'
import { Pet } from '../components/Pet'
import { SpeechBubble } from '../components/SpeechBubble'
import {
  categoryOptions,
  categoryQuestion,
  copingOptions,
  copingQuestion,
  intensityOptions,
  intensityQuestion,
  responseExpression,
  responseLines,
} from '../dialogue'
import type { Category, CopingAction, Intensity, Level, StressRecord } from '../types'

type Props = {
  level: Level
  onSave: (record: StressRecord) => void
  onDone: () => void
}

type Step = 'category' | 'intensity' | 'coping' | 'response'

function newId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function Consult({ level, onSave, onDone }: Props) {
  const [step, setStep] = useState<Step>('category')
  const [category, setCategory] = useState<Category>()
  const [intensity, setIntensity] = useState<Intensity>()
  const [record, setRecord] = useState<StressRecord>()

  const finish = (copingAction: CopingAction) => {
    if (!category) return
    const saved: StressRecord = {
      id: newId(),
      createdAt: new Date().toISOString(),
      category,
      intensity: category === 'good_day' ? undefined : intensity,
      copingAction,
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

  const question =
    step === 'category' ? categoryQuestion : step === 'intensity' ? intensityQuestion : copingQuestion

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
                setCategory(o.value)
                // 「今日は大丈夫だった」のときは強さを聞かない
                setStep(o.value === 'good_day' ? 'coping' : 'intensity')
              }}
            >
              {o.label}
            </button>
          ))}
        {step === 'intensity' &&
          intensityOptions.map((o) => (
            <button
              key={o.value}
              onClick={() => {
                setIntensity(o.value)
                setStep('coping')
              }}
            >
              {o.label}
            </button>
          ))}
        {step === 'coping' &&
          copingOptions.map((o) => (
            <button key={o.value} onClick={() => finish(o.value)}>
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
