// 出来事カテゴリ（相談フロー第1問の選択肢と1対1）
export type Category = 'commute' | 'task' | 'relationships' | 'tired' | 'good_day'

// つらさの強さ（第2問）。「今日は大丈夫だった」のときは聞かない
export type Intensity = 1 | 2 | 3

// ストレスの4分類。アプリ内部で判定し、成長の方向に使う（判定ルールは未定）
export type StressType = 'physical' | 'chemical' | 'psychological' | 'biological'

export type StressRecord = {
  id: string
  createdAt: string
  category: Category
  intensity?: Intensity
  stressType?: StressType
}

export type Level = 1 | 2 | 3

// 能力値は4分類のストレスごとの内部パラメータ（画面には出さない）。
// 相談内容を4分類のどれかに振り分け、成長の方向を決めるのに使う。増え方は未定で、いまは初期値のまま保存だけする
export type StressStats = Record<StressType, number>

export type PetState = {
  level: Level
  experience: number
  stats: StressStats
}

export type Expression = 'normal' | 'happy' | 'worried' | 'rest'
