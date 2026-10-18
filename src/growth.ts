import { consultAffection, todayString } from './affection'
import type { Answer, Category, Level, PetState, StressType } from './types'

// 出来事を1つ選ぶごとに +1。この数たまるとレベルが1つ上がる
export const POINTS_PER_LEVEL = 30

// 出来事 → 4系統の仮の対応。ヒカゲさんの対応表ができたら差し替える。
// 化学に当たる選択肢は、いまは無い
export const categoryTypes: Record<Category, StressType> = {
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

// 色アイテムで、その色が当たる確率に足す割合（0.5 = +50%）
export const BOOST_RATE = 0.5

// 見た目の色（系統）をくじ引きで決める。4系統の累計点数の割合がそのまま当たる確率で、点数が0の系統は選ばれない。
// boost の色は確率に +50%（上限100%）し、ほかの色は残りを元の割合で分ける。点数が0の色でも当たるようになる。
// 1つも数えていなくて boost も無ければ undefined。rng は 0以上1未満の乱数（テストで差し替える）
export function pickBranch(
  stats: PetState['stats'],
  rng: () => number = Math.random,
  boost?: StressType,
): StressType | undefined {
  const total = Object.values(stats).reduce((sum, v) => sum + v, 0)
  const types = (Object.keys(stats) as StressType[]).filter((t) => stats[t] > 0 || t === boost)
  if (total <= 0 && !boost) return undefined
  const base = (t: StressType) => (total > 0 ? stats[t] / total : 0)
  const boosted = boost ? Math.min(1, base(boost) + BOOST_RATE) : 0
  const chance = (t: StressType) => {
    if (!boost) return base(t)
    if (t === boost) return boosted
    return base(boost) >= 1 ? 0 : (base(t) * (1 - boosted)) / (1 - base(boost))
  }
  let pick = rng()
  for (const t of types) {
    pick -= chance(t)
    if (pick < 0) return t
  }
  return types[types.length - 1]
}

// 色を決め直して、その日（端末の日付）を記録する。確定中ならその色のまま。点数が無ければ、いまの色のまま。
// 色アイテムの効果（branchBoost）は、この1回で使い切る
export function rollBranch(pet: PetState, rng?: () => number, now = new Date()): PetState {
  const next = { ...pet, branchDate: todayString(now) }
  delete next.branchBoost
  if (pet.branchLock) return { ...next, branch: pet.branchLock }
  return { ...next, branch: pickBranch(pet.stats, rng, pet.branchBoost) ?? pet.branch }
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
  // 見た目の色は、進化した瞬間（Lv1→2、Lv2→3）に1回くじ引きする。Lv4以降は、1日1回のくじ引きだけ
  if (pet.level < 3 && level >= 2 && level > pet.level) next = rollBranch(next)
  return { pet: next, gained: answers.length, leveledUp: level > pet.level, roomUnlocked: bond.leveledUp }
}
