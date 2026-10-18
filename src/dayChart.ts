import { categoryTypes } from './growth'
import type { Answer, StressRecord, StressType } from './types'

// 1日のようすグラフの縦軸。0=いいこと、1=ちょっとだけ、2=まあまあ、3=かなりつらい
export const moodLabels = ['いいこと', 'ちょっとだけ', 'まあまあ', 'かなりつらい'] as const

export const typeNames: Record<StressType, string> = {
  physical: '物理的',
  chemical: '化学的',
  psychological: '心理・社会的',
  biological: '生物的',
}

export type DayPoint = {
  id: string
  // 0〜24（時 + 分/60）
  hour: number
  time: string
  mood: 0 | 1 | 2 | 3
  types: StressType[]
}

// 「今日はいいことがあった」は、固定の選択肢として別に追加される（category が 'good_thing'）。
// 古い「今日は大丈夫だった」('good_day') の記録も「いいこと」として扱う
const isGoodDay = (a: Answer) => ['good_thing', 'good_day'].includes(a.category as string)

const answerType = (a: Answer): StressType | undefined => a.type ?? (a.category ? categoryTypes[a.category] : undefined)

// 端末の日付で YYYY-MM-DD にする
export function dayKey(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

// 1回の相談を1つの点にする。つらさがあれば、いちばん強いもの。「いいこと」だけなら0。どちらも無ければ点にしない
export function dayPoints(records: StressRecord[], day: string): DayPoint[] {
  const points: DayPoint[] = []
  for (const r of records) {
    const at = new Date(r.createdAt)
    if (Number.isNaN(at.getTime()) || dayKey(at) !== day) continue
    const stress = r.answers.filter((a) => !isGoodDay(a) && (a.type || a.category))
    const pad = (n: number) => String(n).padStart(2, '0')
    const base = { id: r.id, hour: at.getHours() + at.getMinutes() / 60, time: `${at.getHours()}:${pad(at.getMinutes())}` }
    if (stress.length > 0) {
      const mood = Math.max(...stress.map((a) => a.intensity ?? 1)) as 1 | 2 | 3
      const types = [...new Set(stress.map(answerType).filter((t): t is StressType => !!t))]
      points.push({ ...base, mood, types })
    } else if (r.answers.some(isGoodDay)) {
      points.push({ ...base, mood: 0, types: [] })
    }
  }
  return points.sort((a, b) => a.hour - b.hour)
}
