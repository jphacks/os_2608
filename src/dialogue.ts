import type { Answer, Category, Expression, Intensity } from './types'

export const greeting = 'おかえり。今日はどうだった？'

export const categoryQuestion = 'どうしたの？ あてはまるものを、いくつでも選んでね。'
export const categoryConfirm = '決定'
export const categoryOptions: { value: Category; label: string }[] = [
  { value: 'commute', label: '通学・移動がつらかった' },
  { value: 'task', label: '課題や仕事が大変だった' },
  { value: 'relationships', label: '人とのことで疲れた' },
  { value: 'tired', label: 'なんとなく疲れた' },
  { value: 'good_day', label: '今日は大丈夫だった' },
]

export const intensityQuestion = 'それぞれ、どのくらいつらかった？'
export const intensityOptions: { value: Intensity; label: string }[] = [
  { value: 1, label: '少しだけ' },
  { value: 2, label: 'まあまあ' },
  { value: 3, label: 'かなりつらい' },
]

const hasHeavy = (answers: Answer[]) => answers.some((a) => a.intensity === 3)

// 相談の最後にペットが返す台詞。「かなりつらい」が1つでもあれば、いたわる台詞にする
export function responseLines(answers: Answer[], evolved: boolean): string[] {
  let first: string
  if (answers.every((a) => a.category === 'good_day')) first = '大丈夫な日だったんだね。教えてくれてうれしいな。'
  else if (hasHeavy(answers)) first = 'それはつらかったね。今日は無理しなくていいよ。'
  else first = '話してくれてありがとう。今日を乗り切ったんだね。'
  return evolved ? [first, evolveLine] : [first]
}

export function responseExpression(answers: Answer[]): Expression {
  return hasHeavy(answers) ? 'worried' : 'happy'
}

export const evolveLine = '進化したよ！ 新しい姿になったよ。'
export const petLine = 'えへへ、うれしいな。'
export const petLimitLine = '今日はもうたくさんなでてもらったよ。また明日ね。'
export const roomUnlockedLine = '新しいお部屋が開いたよ！'
export const lookLine = '今日もいっしょにいるよ。'
