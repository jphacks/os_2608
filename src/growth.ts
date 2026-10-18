import { consultAffection, todayString } from './affection'
import type { Answer, Category, Level, PetState, StressType } from './types'

// 出来事を1つ選ぶごとに +1。この数たまるとレベルが1つ上がる
export const POINTS_PER_LEVEL = 30

// 出来事 → 4系統の仮の対応。ヒカゲさんの対応表ができたら差し替える。
// 化学に当たる選択肢は、いまは無い
const categoryTypes: Record<Category, StressType> = {
  commute: 'physical',
  task: 'psychological',
  relationships: 'psychological',
  tired: 'biological',
}

export function levelFor(points: number): Level {
  return 1 + Math.floor(points / POINTS_PER_LEVEL)
}

// いまのレベルのゲージの進み具合（0〜1）
export function levelRatio(points: number): number {
  return (points % POINTS_PER_LEVEL) / POINTS_PER_LEVEL
}

// 次のレベルまでのゲージの値（例: 4 / 30）
export function levelProgress(points: number): number {
  return points % POINTS_PER_LEVEL
}

// 見た目の色（系統）をくじ引きで決める。4系統の累計点数の割合がそのまま当たる確率で、点数が0の系統は選ばれない。
// 1つも数えていなければ undefined。rng は 0以上1未満の乱数（テストで差し替える）
export function pickBranch(stats: PetState['stats'], rng: () => number = Math.random): StressType | undefined {
  const types = (Object.keys(stats) as StressType[]).filter((t) => stats[t] > 0)
  const total = types.reduce((sum, t) => sum + stats[t], 0)
  if (total <= 0) return undefined
  let pick = rng() * total
  for (const t of types) {
    pick -= stats[t]
    if (pick < 0) return t
  }
  return types[types.length - 1]
}

// 色を決め直して、その日（端末の日付）を記録する。点数が無ければ、いまの色のまま
export function rollBranch(pet: PetState, rng?: () => number, now = new Date()): PetState {
  return { ...pet, branch: pickBranch(pet.stats, rng) ?? pet.branch, branchDate: todayString(now) }
}

// アプリを開いたとき、Lv2以降で今日まだ決め直していなければ、色を1回くじ引きする
export function refreshDailyBranch(pet: PetState, rng?: () => number, now = new Date()): PetState {
  if (pet.level < 2 || pet.branchDate === todayString(now)) return pet
  return rollBranch(pet, rng, now)
}

export type ConsultResult = {
  pet: PetState
  gained: number
  leveledUp: boolean
  // 親密度が上がって、新しいお部屋が開いたか
  roomUnlocked: boolean
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
  const bond = consultAffection(pet.affection)
  let next: PetState = { ...pet, experience, stats, recentTypes, level, affection: bond.affection }
  // 見た目の色は、レベルが上がるたび（Lv1→2、Lv2→3、Lv4以降も）に、累計点数の割合でくじ引きする
  if (level > pet.level && level >= 2) next = rollBranch(next)
  return { pet: next, gained: answers.length, leveledUp: level > pet.level, roomUnlocked: bond.leveledUp }
}
