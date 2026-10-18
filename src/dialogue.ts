import type { Answer, Expression, Intensity } from './types'

// ペットがプレイヤーを呼ぶ名前。かえていなければ、経験値レベル1・2は「あるじ」、3以上は「あるじどの」
export const PLAYER_NAME_MAX = 8
export function playerCallName(level: number, custom?: string): string {
  if (custom) return custom
  return level >= 3 ? 'あるじどの' : 'あるじ'
}

export const greeting = (name: string) => `${name}、おかえり。今日はどうだった？`

export const categoryQuestion = 'どうしたの？ あてはまるものを、いくつでも選んでね。'
export const categoryConfirm = '決定'
export const choiceNotStressLine = 'ストレスの話ではないかもしれません。ちがう言い方で書いてみてね。'
export const choiceErrorLine = 'うまく判定できなかったよ。もう一度ためしてね。'
export const choiceAddLabel = '選択肢を追加'
export const choiceEditLabel = '編集'
export const choiceDeleteLabel = '削除'
export const choiceOkLabel = '確定'
export const choiceCancelLabel = 'キャンセル'
export const choicePlaceholder = 'あたらしい選択肢'

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
  if (hasHeavy(answers)) first = 'それはつらかったね。今日は無理しなくていいよ。'
  else first = '話してくれてありがとう。今日を乗り切ったんだね。'
  return evolved ? [first, evolveLine] : [first]
}

export function responseExpression(answers: Answer[]): Expression {
  return hasHeavy(answers) ? 'worried' : 'happy'
}

// 相談のクールタイム中に「もやもやを食べてもらう」を押したときの台詞（毎回ランダムに1つ）
export const fullLines = [
  'お腹いっぱいだから食べられない！',
  'もうお腹いっぱい…またあとでね。',
  'ちょっと休ませて〜。まだ食べられないよ。',
]
export const pickFullLine = () => fullLines[Math.floor(Math.random() * fullLines.length)]

export const evolveLine = '進化したよ！ 新しい姿になったよ。'
export const petLine = (name: string) => `えへへ、うれしいな、${name}。`
export const petLimitLine = '今日はもうたくさんなでてもらったよ。また明日ね。'
export const roomUnlockedLine = '新しいお部屋が開いたよ！'
export const lookLine = '今日もいっしょにいるよ。'
