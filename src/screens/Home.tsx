import { useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { DevPanel } from '../components/DevPanel'
import { HouseIcon } from '../components/HouseIcon'
import { LevelGauge } from '../components/LevelGauge'
import { Pet } from '../components/Pet'
import { SpeechBubble } from '../components/SpeechBubble'
import { AffectionGauge } from '../components/AffectionGauge'
import { pat } from '../affection'
import { greeting, lookLine, petLimitLine, petLine, roomUnlockedLine } from '../dialogue'
import { findRoom } from '../rooms'
import type { Expression, PetState } from '../types'

type Props = {
  pet: PetState
  onChangePet: (pet: PetState) => void
  onConsult: () => void
  onRooms: () => void
}

// 「ようすを見る」ボタンは今は出さない（後で使う）。true にするとボタンが戻る
const SHOW_LOOK_BUTTON = false

// なでる動き: 左右に何px動かすと「1回なぞった」とするか、何回なぞると1回なでたことにするか
const STROKE_DISTANCE = 24
const STROKES_PER_PAT = 4
// なでてから親密度ゲージを消すまでの時間
const AFFECTION_HIDE_MS = 2000

export function Home({ pet, onChangePet, onConsult, onRooms }: Props) {
  const [lines, setLines] = useState<string[]>([greeting])
  const [expression, setExpression] = useState<Expression>('normal')
  // 親密度ゲージはなでたときだけ表示する
  const [showAffection, setShowAffection] = useState(false)
  // ハートを出し直すたびに key を変えて、アニメーションを最初から再生する
  const [heartKey, setHeartKey] = useState(0)
  // なでている間は、ほかのUIを隠して、ハートと親密度ゲージだけを見せる
  const [petting, setPetting] = useState(false)
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const gaugeVisible = useRef(false)
  // 別の画面に移るときは、残っているタイマーを止める
  useEffect(() => () => clearTimeout(hideTimer.current), [])
  // 開発者モード: レベルゲージを5回続けてタップすると開く
  const [devOpen, setDevOpen] = useState(false)
  const [devTaps, setDevTaps] = useState(0)
  const onGaugeTap = () => {
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
    gaugeVisible.current = true
    // 2秒以内にまたなでたら、そこから数え直す。ゲージが消えるとき、指が離れていればほかのUIも戻す
    clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => {
      gaugeVisible.current = false
      setShowAffection(false)
      if (!swipe.current.active) setPetting(false)
    }, AFFECTION_HIDE_MS)
    if (result.kind === 'limit') {
      setLines([petLimitLine])
      setExpression('normal')
      return
    }
    setLines(result.leveledUp ? [petLine, roomUnlockedLine] : [petLine])
    setExpression('happy')
    setHeartKey((k) => k + 1)
  }

  const onLook = () => {
    setLines([lookLine])
    setExpression('normal')
    setShowAffection(false)
  }

  // ペットの上で指を左右になぞると、なでたことにする（1回なぞり始めてから離すまでに最大1回）
  const swipe = useRef({ active: false, anchorX: 0, direction: 0, strokes: 0, done: false })
  const onPointerDown = (e: PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    swipe.current = { active: true, anchorX: e.clientX, direction: 0, strokes: 0, done: false }
  }
  const onPointerMove = (e: PointerEvent) => {
    const s = swipe.current
    if (!s.active || s.done) return
    const dx = e.clientX - s.anchorX
    if (Math.abs(dx) < STROKE_DISTANCE) return
    setPetting(true)
    const direction = Math.sign(dx)
    if (direction !== s.direction) {
      s.direction = direction
      s.strokes += 1
    }
    s.anchorX = e.clientX
    if (s.strokes >= STROKES_PER_PAT) {
      s.done = true
      onPat()
    }
  }
  const onPointerEnd = () => {
    swipe.current.active = false
    // ゲージが出ていなければ（親密度が増えなかったとき）、すぐ戻す。出ていれば、ゲージが消えるときに戻る
    if (!gaugeVisible.current) setPetting(false)
  }

  const room = findRoom(pet.roomId)

  return (
    <main className={`screen home room ${room.id}${petting ? ' petting' : ''}`}>
      <header className="topbar">
        <button className="icon-button" onClick={onRooms} aria-label="おへやをえらぶ">
          <HouseIcon />
        </button>
        <div className="topbar-gauge" onClick={onGaugeTap}>
          <LevelGauge experience={pet.experience} level={pet.level} />
        </div>
        <div className="login-days" aria-label="合計ログイン日数">
          ログイン
          <br />
          {pet.loginDays}日
        </div>
      </header>

      <div
        className="pet-stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
      >
        {showAffection && (
          <AffectionGauge pats={pet.affection.pats} />
        )}
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

      {devOpen && <DevPanel pet={pet} onChangePet={onChangePet} onClose={() => setDevOpen(false)} />}

      <footer className="home-bottom">
        {SHOW_LOOK_BUTTON && <button onClick={onLook}>ようすを見る</button>}
        <button className="primary" onClick={onConsult}>
          もやもやを食べてもらう
        </button>
        <p className="note">
          記録はこの端末のブラウザ内に保存されます。これは医療的な診断を行うアプリではなく、日々の気持ちを振り返るためのサポートです。
        </p>
      </footer>
    </main>
  )
}
