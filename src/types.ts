// 出来事カテゴリ（相談の「どうしたの？」の選択肢と1対1）
export type Category = 'commute' | 'task' | 'relationships' | 'tired'

// つらさの強さ。選んだ出来事ごとに答える（追加・編集した選択肢は、判定済みなので聞かない）
export type Intensity = 1 | 2 | 3

// ストレスの4分類。アプリ内部で判定し、成長の方向に使う
export type StressType = 'physical' | 'chemical' | 'psychological' | 'biological'

// 1つぶんの回答。選択肢で答えたときは category、文章で相談したときは Gemini が判定した type が入る。
export type Answer = { category?: Category; type?: StressType; intensity?: Intensity }

export type StressRecord = {
  id: string
  createdAt: string
  // 1回の相談で選んだ出来事（複数選択）と、それぞれのつらさ
  answers: Answer[]
}

// レベルに上限は無い。絵はLv3（第3段階）までで、Lv4以降は色だけが変わる
export type Level = number

// 能力値は4分類のストレスごとの内部パラメータ（画面には出さない）。
// 相談で選んだ出来事を4分類のどれかに振り分けて数え、その多い系統（傾向）が進化の見た目を決める
export type StressStats = Record<StressType, number>

// 親密度（能力値とは別枠）。なでると上がり、レベルが上がるとお部屋が増える。経験値のレベルとは無関係
export type Affection = {
  // これまでになでた回数
  pats: number
  // 今日（端末の日付）になでた回数と、その日付 YYYY-MM-DD
  patsToday: number
  lastPatDate: string
}

export type PetState = {
  level: Level
  // 相談で選んだ出来事の数（1つ選ぶごとに +1）。30ごとにレベルが上がる
  experience: number
  stats: StressStats
  // 系統を数えた順（新しいほど後ろ）。最多が同数のとき、直近のものを選ぶのに使う
  recentTypes: StressType[]
  // 見た目の系統。進化するたび（Lv1→2、Lv2→3）に、そのときの累計で最多の傾向で決め直す。傾向が無ければ未設定
  branch?: StressType
  affection: Affection
  // いま表示しているお部屋
  roomId: string
  // 最後に相談が成立した時刻（ISO）。3時間のクールタイムの起点。未設定ならクールタイム無し
  lastConsultAt?: string
  // プレイヤーがかえた呼び方。未設定なら初期の呼び方（経験値レベルで決まる）
  playerName?: string
}

export type Expression = 'normal' | 'happy' | 'worried' | 'rest'
