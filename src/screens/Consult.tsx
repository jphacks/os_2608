import { useState } from 'react'
import { AffectionGauge } from '../components/AffectionGauge'
import { LevelGauge } from '../components/LevelGauge'
import { Pet } from '../components/Pet'
import { SpeechBubble } from '../components/SpeechBubble'
import {
  categoryConfirm,
  choiceAddLabel,
  choiceCancelLabel,
  choiceDeleteLabel,
  choiceEditLabel,
  choiceErrorLine,
  choiceNotStressLine,
  choiceOkLabel,
  choicePlaceholder,
  categoryQuestion,
  intensityOptions,
  intensityQuestion,
  notStressLine,
  responseExpression,
  responseLines,
  roomUnlockedLine,
  textErrorLine,
  textOr,
  textPlaceholder,
  textSend,
  textWaitingLine,
  textWarning,
} from '../dialogue'
import { PixelIcon } from '../components/PixelIcon'
import { CHOICE_MAX, goodThingChoice, loadChoices, saveChoices, type Choice } from '../choices'
import { analyzeText, consultApiUrl } from '../gemini'
import type { ConsultResult } from '../growth'
import type { Answer, Intensity, PetState } from '../types'

type Props = {
  pet: PetState
  // 相談の内容を記録し、ペットの状態に反映した結果を返す
  onFinish: (answers: Answer[]) => ConsultResult
  onDone: () => void
}

const NEW = 'new'

type Step = 'category' | 'intensity' | 'response'

export function Consult({ pet: current, onFinish, onDone }: Props) {
  const [step, setStep] = useState<Step>('category')
  const [choices, setChoices] = useState<Choice[]>(loadChoices)
  const [selected, setSelected] = useState<string[]>([])
  // 選んだ出来事ごとのつらさ
  const [intensities, setIntensities] = useState<Partial<Record<string, Intensity>>>({})
  const [answers, setAnswers] = useState<Answer[]>([])
  const [result, setResult] = useState<ConsultResult>()
  // 文章での相談: 入力中の文章、判定中か、判定のあとにペットが言う台詞
  const [text, setText] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [notice, setNotice] = useState<string>()
  const finish = (finished: Answer[]) => {
    setAnswers(finished)
    setResult(onFinish(finished))
    setStep('response')
  }

  const sendText = async () => {
    setAnalyzing(true)
    setNotice(undefined)
    try {
      const analyzed = await analyzeText(text.trim())
      if (analyzed.kind === 'not_stress') {
        // ストレスの話ではなかったので、もう一度入力してもらう
        setText('')
        setNotice(notStressLine)
      } else {
        finish(analyzed.answers)
      }
    } catch {
      setNotice(textErrorLine)
    } finally {
      setAnalyzing(false)
    }
  }

  // 「いいことがあった」は、ストレスの選択肢とは一緒に選べない（選ぶと、もう一方は外れる）
  const toggle = (value: string) =>
    setSelected((chosen) => {
      if (chosen.includes(value)) return chosen.filter((c) => c !== value)
      if (value === goodThingChoice.id) return [value]
      return [...chosen.filter((c) => c !== goodThingChoice.id), value]
    })

  // 選択肢の編集。editing は編集中の選択肢の id（追加のときは NEW）
  const [editing, setEditing] = useState<string>()
  const [draft, setDraft] = useState('')
  const [judging, setJudging] = useState(false)
  const [editNotice, setEditNotice] = useState<string>()

  const startEdit = (id: string, label: string) => {
    setEditing(id)
    setDraft(label)
    setEditNotice(undefined)
  }
  const stopEdit = () => {
    setEditing(undefined)
    setEditNotice(undefined)
  }
  const updateChoices = (next: Choice[]) => {
    setChoices(next)
    saveChoices(next)
  }
  const removeChoice = (id: string) => {
    updateChoices(choices.filter((c) => c.id !== id))
    setSelected((chosen) => chosen.filter((c) => c !== id))
  }
  // 確定したときに一度だけ Gemini で判定し、その結果を選択肢に保存する（2回目以降は使い回す）
  const confirmEdit = async () => {
    const label = draft.trim()
    const current = choices.find((c) => c.id === editing)
    if (current && current.label === label) return stopEdit()
    setJudging(true)
    setEditNotice(undefined)
    try {
      const analyzed = await analyzeText(label)
      if (analyzed.kind === 'not_stress') return setEditNotice(choiceNotStressLine)
      const choice: Choice = { id: current?.id ?? `custom-${Date.now()}`, label, answers: analyzed.answers }
      updateChoices(current ? choices.map((c) => (c.id === current.id ? choice : c)) : [...choices, choice])
      stopEdit()
    } catch {
      setEditNotice(choiceErrorLine)
    } finally {
      setJudging(false)
    }
  }

  if (step === 'response' && result) {
    const { pet, leveledUp, roomUnlocked } = result
    return (
      <main className="screen consult">
        <SpeechBubble lines={[...responseLines(answers, leveledUp), ...(roomUnlocked ? [roomUnlockedLine] : [])]} />
        <div className="pet-stage">
          <Pet level={pet.level} branch={pet.branch} expression={responseExpression(answers)} />
        </div>
        <LevelGauge experience={pet.experience} level={pet.level} />
        <AffectionGauge pats={pet.affection.pats} />
        <button className="primary" onClick={onDone}>
          ホームへ戻る
        </button>
      </main>
    )
  }

  const chosen = [goodThingChoice, ...choices].filter((c) => selected.includes(c.id))
  // つらさを聞く選択肢（最初の4つ）と、判定済みの答えをそのまま使う選択肢（追加・編集したもの）
  const asked = chosen.filter((c) => c.category && !c.answers)
  const fixedAnswers = chosen.flatMap((c) => c.answers ?? [])

  const editRow = (id: string) => (
    <div key={id} className="choice-edit">
      <div className="choice-row">
        <input
          type="text"
          value={draft}
          maxLength={CHOICE_MAX}
          placeholder={choicePlaceholder}
          disabled={judging}
          autoFocus
          onChange={(e) => setDraft(e.target.value)}
        />
        <button
          className="icon-button"
          aria-label={choiceOkLabel}
          disabled={judging || draft.trim() === ''}
          onClick={confirmEdit}
        >
          <PixelIcon name="check" />
        </button>
        <button className="icon-button" aria-label={choiceCancelLabel} disabled={judging} onClick={stopEdit}>
          <PixelIcon name="cross" />
        </button>
      </div>
      {judging ? <p className="note">{textWaitingLine}</p> : editNotice && <p className="note">{editNotice}</p>}
    </div>
  )

  return (
    <main className="screen consult">
      <SpeechBubble
        lines={[analyzing ? textWaitingLine : (notice ?? (step === 'category' ? categoryQuestion : intensityQuestion))]}
      />
      <div className="pet-stage small">
        <Pet level={current.level} branch={current.branch} expression="normal" scale={4} />
      </div>
      {step === 'category' && consultApiUrl && (
        <div className="text-consult">
          <textarea
            value={text}
            maxLength={300}
            rows={3}
            placeholder={textPlaceholder}
            disabled={analyzing}
            onChange={(e) => setText(e.target.value)}
          />
          <p className="note">{textWarning}</p>
          <button className="primary" disabled={analyzing || text.trim() === ''} onClick={sendText}>
            {textSend}
          </button>
          <p className="note or">{textOr}</p>
        </div>
      )}
      <div className="choices">
        {step === 'category' && (
          <div className="choice-row">
            <button
              className="check"
              role="checkbox"
              aria-checked={selected.includes(goodThingChoice.id)}
              onClick={() => toggle(goodThingChoice.id)}
            >
              <span className="box" aria-hidden="true">
                {selected.includes(goodThingChoice.id) ? '■' : '□'}
              </span>
              {goodThingChoice.label}
            </button>
          </div>
        )}
        {step === 'category' &&
          choices.map((o) =>
            editing === o.id ? (
              editRow(o.id)
            ) : (
              <div key={o.id} className="choice-row">
                <button
                  className="check"
                  role="checkbox"
                  aria-checked={selected.includes(o.id)}
                  onClick={() => toggle(o.id)}
                >
                  <span className="box" aria-hidden="true">
                    {selected.includes(o.id) ? '■' : '□'}
                  </span>
                  {o.label}
                </button>
                {consultApiUrl && (
                  <>
                    <button className="icon-button" aria-label={choiceEditLabel} onClick={() => startEdit(o.id, o.label)}>
                      <PixelIcon name="pencil" />
                    </button>
                    <button className="icon-button" aria-label={choiceDeleteLabel} onClick={() => removeChoice(o.id)}>
                      <PixelIcon name="trash" />
                    </button>
                  </>
                )}
              </div>
            ),
          )}
        {step === 'category' &&
          consultApiUrl &&
          (editing === NEW ? (
            editRow(NEW)
          ) : (
            <button className="add-choice" aria-label={choiceAddLabel} onClick={() => startEdit(NEW, '')}>
              <PixelIcon name="plus" size={28} />
            </button>
          ))}
        {step === 'intensity' &&
          asked.map((c) => c.id).map((category) => (
            <fieldset key={category} className="intensity-row">
              <legend>{choices.find((o) => o.id === category)?.label}</legend>
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
            // 追加・編集した選択肢は判定済みなので、つらさを聞くのは最初の選択肢だけ
            if (asked.length === 0) finish(fixedAnswers)
            else setStep('intensity')
          }}
        >
          {categoryConfirm}
        </button>
      )}
      {step === 'intensity' && (
        <button
          className="primary"
          disabled={asked.some((c) => !intensities[c.id])}
          onClick={() =>
            finish([
              ...fixedAnswers,
              ...asked.map((c) => ({ category: c.category, intensity: intensities[c.id] })),
            ])
          }
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
