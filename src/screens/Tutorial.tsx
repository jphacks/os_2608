import { useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { Pet } from '../components/Pet'
import { PixelHeart } from '../components/PixelHeart'
import { SpeechBubble } from '../components/SpeechBubble'
import {
  PET_NAME_MAX,
  tutorialAsk,
  tutorialBye,
  tutorialEat,
  tutorialExplain,
  tutorialIntro,
  tutorialNameAsk,
  tutorialNameDecide,
  tutorialNamePlaceholder,
  tutorialNamed,
  tutorialPatDone,
  tutorialPatHint,
  tutorialPlaceholder,
  tutorialPurified,
  tutorialSend,
} from '../dialogue'
import { findRoom } from '../rooms'
import type { Expression } from '../types'

type Props = {
  roomId: string
  // 見直しのときは、いまの名前を入力欄に入れておく
  petName?: string
  onFinish: (petName: string) => void
  onSkip: () => void
}

// 台詞を見せてタップで進む場面（tap）、文章を入れる場面（ask）、食べる演出（eat）、なでる場面（pat）、名前を入れる場面（name）
type Step =
  | { kind: 'tap'; lines: string[]; expression?: Expression }
  | { kind: 'ask' }
  | { kind: 'eat' }
  | { kind: 'pat' }
  | { kind: 'name' }
  | { kind: 'named' }

// 本編のなでると同じ動き（Home.tsx）。左右に STROKE_DISTANCE 動くと1回なぞったことにする
const STROKE_DISTANCE = 24
const STROKES_PER_PAT = 4
const EAT_MS = 2400

const steps: Step[] = [
  { kind: 'tap', lines: tutorialIntro, expression: 'happy' },
  { kind: 'ask' },
  { kind: 'eat' },
  { kind: 'tap', lines: tutorialExplain, expression: 'happy' },
  { kind: 'pat' },
  { kind: 'tap', lines: [tutorialPatDone], expression: 'happy' },
  { kind: 'name' },
  { kind: 'named' },
  { kind: 'tap', lines: [tutorialBye], expression: 'happy' },
]

export function Tutorial({ roomId, petName, onFinish, onSkip }: Props) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [name, setName] = useState(petName ?? '')
  const [heartKey, setHeartKey] = useState(0)
  const [expression, setExpression] = useState<Expression>('normal')
  const step = steps[index]
  const next = () => setIndex((i) => i + 1)

  // 食べる演出は、少し待ってから自動で次へ進む。実際の相談ではないので、記録もレベルも変えない
  const eating = step.kind === 'eat'
  const [purified, setPurified] = useState(false)
  useEffect(() => {
    if (!eating) return
    setPurified(false)
    setExpression('rest')
    const t1 = setTimeout(() => setPurified(true), EAT_MS / 2)
    const t2 = setTimeout(() => {
      setExpression('happy')
      setIndex((i) => i + 1)
    }, EAT_MS)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [eating])

  // なで終わった指を離したときの click で、次の台詞まで飛ばないようにする
  const patEndedAt = useRef(0)
  const swipe = useRef({ active: false, anchorX: 0, direction: 0, strokes: 0, done: false })
  const onPointerDown = (e: PointerEvent) => {
    if (step.kind !== 'pat') return
    e.currentTarget.setPointerCapture(e.pointerId)
    swipe.current = { active: true, anchorX: e.clientX, direction: 0, strokes: 0, done: false }
  }
  const onPointerMove = (e: PointerEvent) => {
    const s = swipe.current
    if (step.kind !== 'pat' || !s.active || s.done) return
    const dx = e.clientX - s.anchorX
    if (Math.abs(dx) < STROKE_DISTANCE) return
    const direction = Math.sign(dx)
    if (direction !== s.direction) {
      s.direction = direction
      s.strokes += 1
    }
    s.anchorX = e.clientX
    if (s.strokes >= STROKES_PER_PAT) {
      s.done = true
      patEndedAt.current = Date.now()
      setHeartKey((k) => k + 1)
      setExpression('happy')
      next()
    }
  }
  const onPointerEnd = () => {
    swipe.current.active = false
  }

  let lines: string[] = []
  if (step.kind === 'tap') lines = step.lines
  if (step.kind === 'ask') lines = tutorialAsk
  if (step.kind === 'eat') lines = purified ? [tutorialPurified] : tutorialEat
  if (step.kind === 'pat') lines = [tutorialPatHint]
  if (step.kind === 'name') lines = tutorialNameAsk
  if (step.kind === 'named') lines = [tutorialNamed(name.trim())]

  const advance = () => {
    if (Date.now() - patEndedAt.current < 600) return
    if (step.kind === 'tap' || step.kind === 'named') {
      if (index === steps.length - 1) onFinish(name.trim())
      else next()
    }
  }
  const tappable = step.kind === 'tap' || step.kind === 'named'

  return (
    <main className={`screen home tutorial room ${findRoom(roomId).id}`}>
      <header className="topbar tutorial-top">
        <button className="link" onClick={onSkip}>
          スキップ
        </button>
      </header>

      <div
        className={`pet-stage${tappable ? ' tappable' : ''}`}
        onClick={tappable ? advance : undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
      >
        <SpeechBubble lines={lines} />
        <Pet level={1} expression={expression} />
        {heartKey > 0 && index <= 5 && (
          <div className="hearts" key={heartKey} aria-hidden="true">
            <span>
              <PixelHeart />
            </span>
            <span>
              <PixelHeart />
            </span>
            <span>
              <PixelHeart />
            </span>
          </div>
        )}
      </div>

      <footer className="home-bottom">
        {tappable && <p className="note tutorial-tap">タップですすむ</p>}
        {step.kind === 'ask' && (
          <form
            className="name-form"
            onSubmit={(e) => {
              e.preventDefault()
              setText('')
              next()
            }}
          >
            <textarea
              value={text}
              rows={3}
              placeholder={tutorialPlaceholder}
              onChange={(e) => setText(e.target.value)}
            />
            <p className="note">この文章はどこにも送られず、保存もされません。</p>
            <button className="primary" type="submit">
              {tutorialSend}
            </button>
          </form>
        )}
        {step.kind === 'name' && (
          <form
            className="name-form"
            onSubmit={(e) => {
              e.preventDefault()
              if (name.trim()) next()
            }}
          >
            <input
              value={name}
              maxLength={PET_NAME_MAX}
              placeholder={tutorialNamePlaceholder}
              onChange={(e) => setName(e.target.value)}
            />
            <button className="primary" type="submit" disabled={!name.trim()}>
              {tutorialNameDecide}
            </button>
          </form>
        )}
      </footer>
    </main>
  )
}
