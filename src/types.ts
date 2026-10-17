// 出来事カテゴリ（相談フロー第1問の選択肢と1対1）
export type Category = 'commute' | 'task' | 'relationships' | 'tired' | 'good_day'

// つらさの強さ（第2問）。「今日は大丈夫だった」のときは聞かない
export type Intensity = 1 | 2 | 3

// 今どうしたいか（第3問）
export type CopingAction = 'rest' | 'talk' | 'walk' | 'unsure'

// ストレスの4分類。アプリ内部で判定し、成長の方向に使う（判定ルールは未定）
export type StressType = 'physical' | 'chemical' | 'psychological' | 'biological'

export type StressRecord = {
  id: string
  createdAt: string
  category: Category
  intensity?: Intensity
  copingAction: CopingAction
  stressType?: StressType
}

export type Level = 1 | 2 | 3

// 能力値・経験値の増え方は未定。いまは初期値のまま保存だけする
export type PetState = {
  level: Level
  experience: number
  acceptance: number
  recovery: number
  connection: number
  affection: number
}

export type Expression = 'normal' | 'happy' | 'worried' | 'rest'
