import type { Answer, Category, Expression, Intensity } from './types'

// ペットがプレイヤーを呼ぶ名前。かえていなければ、経験値レベル1・2は「あるじ」、3以上は「あるじどの」
export const PLAYER_NAME_MAX = 8
export function playerCallName(level: number, custom?: string): string {
  if (custom) return custom
  return level >= 3 ? 'あるじどの' : 'あるじ'
}

export const greeting = (name: string, petName?: string) =>
  petName ? `${name}、おかえり！ ${petName}だよ。今日はどうだった？` : `${name}、おかえり。今日はどうだった？`

export const categoryQuestion = 'どうしたの？ あてはまるものを、いくつでも選んでね。'
export const categoryConfirm = '決定'
export const categoryOptions: { value: Category; label: string }[] = [
  { value: 'commute', label: '通学・移動がつらかった' },
  { value: 'task', label: '課題や仕事が大変だった' },
  { value: 'relationships', label: '人とのことで疲れた' },
  { value: 'tired', label: 'なんとなく疲れた' },
  { value: 'good_day', label: '今日は大丈夫だった' },
]

export const textPlaceholder = '今日のもやもやを、書いてみてね'
export const textSend = '食べてもらう'
export const textWarning = '※ 書いた文章はAIで判定します。名前や住所など、個人情報は書かないでね。'
export const textOr = 'または、選んで答える'
export const notStressLine = 'もやもやを食べさせてほしいな'
export const textErrorLine = 'うまく聞き取れなかったよ。もう一度書くか、選んで教えてね。'
export const textWaitingLine = 'もぐもぐ…'

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
export const petLine = (name: string) => `えへへ、うれしいな、${name}。`
export const petLimitLine = '今日はもうたくさんなでてもらったよ。また明日ね。'
export const roomUnlockedLine = '新しいお部屋が開いたよ！'
export const lookLine = '今日もいっしょにいるよ。'

// チュートリアル（Issue #33）。ペットの名前は8文字まで
export const PET_NAME_MAX = 8
export const tutorialIntro = ['わぁ！お人間さんだぁ！！初めて見た！！！']
export const tutorialAsk = ['なんか悩んでいるんだね？', 'ぼくに、そのもやもやを教えてくれる？']
export const tutorialPlaceholder = '悩んでいることを、なんでも書いてみてね'
export const tutorialSend = '食べてもらう'
export const tutorialEat = ['…えい！', 'もぐもぐ…']
export const tutorialPurified = 'ストレスが浄化されたよ！'
export const tutorialExplain = ['えへへ驚いた？', 'ぼくはストレスを食べれるんだぁ！すごいでしょ！']
export const tutorialPatHint = 'ぼくの上を、左右になでてみてね'
export const tutorialPatDone = 'わぁ撫でてくれたの！嬉しい！！！'
export const tutorialNameAsk = ['…そうだ！ねぇねぇ！', 'ぼく名前がないからさ、ぼくに名前をつけてくれない？']
export const tutorialNamePlaceholder = 'ペットの名前'
export const tutorialNameDecide = 'この名前にする'
export const tutorialNamed = (name: string) => `${name}…いい名前だよ！ありがとう！`
export const tutorialBye = 'またお悩みがあったらいつでも此処に来てね！'
