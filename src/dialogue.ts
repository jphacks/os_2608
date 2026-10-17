import type { Category, CopingAction, Expression, Intensity, StressRecord } from './types'

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

export const copingQuestion = '今の自分に、なにをしてあげられそう？'
export const copingOptions: { value: CopingAction; label: string }[] = [
  { value: 'rest', label: '少し休む' },
  { value: 'talk', label: '誰かに話す' },
  { value: 'walk', label: '少し歩く・体を動かす' },
  { value: 'unsure', label: 'まだわからない' },
]

const copingLines: Record<CopingAction, string> = {
  rest: '休むことも、明日の自分を育てる大事な行動だよ。',
  talk: '話せる人がいるのは心強いね。',
  walk: '少し体を動かすと、気分が変わるかもね。',
  unsure: 'わからなくても大丈夫。ここに来てくれただけで十分だよ。',
}

// 相談の最後にペットが返す台詞（1行目: 気持ちへの共感、2行目: 選んだ行動への声かけ）
export function responseLines(record: StressRecord): string[] {
  let first: string
  if (record.category === 'good_day') first = '大丈夫な日だったんだね。教えてくれてうれしいな。'
  else if (record.intensity === 3) first = 'それはつらかったね。今日は無理しなくていいよ。'
  else first = '話してくれてありがとう。今日を乗り切ったんだね。'
  return [first, copingLines[record.copingAction]]
}

export function responseExpression(record: StressRecord): Expression {
  if (record.copingAction === 'rest') return 'rest'
  if (record.intensity === 3) return 'worried'
  return 'happy'
}

export const petLine = 'えへへ、うれしいな。'
export const lookLine = '今日もいっしょにいるよ。'
export const historyNotReadyLine = 'きろくを見る画面は、いま準備中だよ。'
