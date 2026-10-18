import type { Answer, Category, Level, PetState, StressType } from './types'

// 出来事を1つ選ぶごとに +1。この数たまるとレベルが1つ上がる
export const POINTS_PER_LEVEL = 30
// デモ段階の上限レベル
export const MAX_LEVEL: Level = 3

// 出来事 → 4系統の仮の対応。ヒカゲさんの対応表ができたら差し替える。
// 「今日は大丈夫だった」は系統に数えない（レベルには数える）。化学に当たる選択肢は、いまは無い
const categoryTypes: Record<Category, StressType | undefined> = {
  commute: 'physical',
  task: 'psychological',
  relationships: 'psychological',
  tired: 'biological',
  good_day: undefined,
}

export function levelFor(points: number): Level {
  return Math.min(1 + Math.floor(points / POINTS_PER_LEVEL), MAX_LEVEL) as Level
}

// いまのレベルのゲージの進み具合（0〜1）。上限レベルでは満タン
export function levelRatio(points: number): number {
  if (levelFor(points) >= MAX_LEVEL) return 1
  return (points % POINTS_PER_LEVEL) / POINTS_PER_LEVEL
}

// 次のレベルまでのゲージの値（例: 4 / 30）。上限レベルでは undefined
export function levelProgress(points: number): number | undefined {
  return levelFor(points) >= MAX_LEVEL ? undefined : points % POINTS_PER_LEVEL
}

// いちばん多く数えた系統。同数なら、直近に数えたものを選ぶ。1つも無ければ undefined
export function trendOf(pet: Pick<PetState, 'stats' | 'recentTypes'>): StressType | undefined {
  const max = Math.max(...Object.values(pet.stats))
  if (max <= 0) return undefined
  const top = (Object.keys(pet.stats) as StressType[]).filter((t) => pet.stats[t] === max)
  return top.sort((a, b) => pet.recentTypes.lastIndexOf(b) - pet.recentTypes.lastIndexOf(a))[0]
}

export type ConsultResult = {
  pet: PetState
  gained: number
  leveledUp: boolean
}

// 相談の結果をペットの状態に反映する
// レベルは、選んだ出来事1つにつき +1。系統は、つらさ（少しだけ=1、まあまあ=2、かなりつらい=3）のぶんだけ数える
export function applyConsult(pet: PetState, answers: Answer[]): ConsultResult {
  const stats = { ...pet.stats }
  let recentTypes = pet.recentTypes
  for (const { category, type: answerType, intensity } of answers) {
    const type = answerType ?? (category && categoryTypes[category])
    if (!type) continue
    stats[type] += intensity ?? 1
    recentTypes = [...recentTypes.filter((t) => t !== type), type]
  }
  const experience = pet.experience + answers.length
  const level = levelFor(experience)
  const next: PetState = { ...pet, experience, stats, recentTypes, level }
  // 見た目の差分は、進化するたび（Lv1→2、Lv2→3）に、そのときの累計で最多の傾向で決め直す
  if (level > pet.level && level >= 2) next.branch = trendOf(next) ?? pet.branch
  return { pet: next, gained: answers.length, leveledUp: level > pet.level }
}
