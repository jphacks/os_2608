import type { Category, Expression, Intensity, StressRecord } from './types'

export const greeting = 'おかえり。今日はどうだった？'

export const categoryQuestion = 'どうしたの？'
export const categoryOptions: { value: Category; label: string }[] = [
  { value: 'commute', label: '通学・移動がつらかった' },
  { value: 'task', label: '課題や仕事が大変だった' },
  { value: 'relationships', label: '人とのことで疲れた' },
  { value: 'tired', label: 'なんとなく疲れた' },
  { value: 'good_day', label: '今日は大丈夫だった' },
]

export const intensityQuestion = 'どのくらいつらかった？'
export const intensityOptions: { value: Intensity; label: string }[] = [
  { value: 1, label: '少しだけ' },
  { value: 2, label: 'まあまあ' },
  { value: 3, label: 'かなりつらい' },
]

// 相談の最後にペットが返す台詞
export function responseLines(record: StressRecord): string[] {
  let first: string
  if (record.category === 'good_day') first = '大丈夫な日だったんだね。教えてくれてうれしいな。'
  else if (record.intensity === 3) first = 'それはつらかったね。今日は無理しなくていいよ。'
  else first = '話してくれてありがとう。今日を乗り切ったんだね。'
  return [first]
}

export function responseExpression(record: StressRecord): Expression {
  if (record.intensity === 3) return 'worried'
  return 'happy'
}

export const petLine = 'えへへ、うれしいな。'
export const petLimitLine = '今日はもうたくさんなでてもらったよ。また明日ね。'
export const roomUnlockedLine = '新しいお部屋が開いたよ！'
export const lookLine = '今日もいっしょにいるよ。'
export const historyNotReadyLine = 'きろくを見る画面は、いま準備中だよ。'
