import { rooms } from './rooms'
import type { Affection } from './types'

// 何回なでると親密度レベルが1つ上がるか
export const PATS_PER_LEVEL = 7
// 1日になでられる回数
export const MAX_PATS_PER_DAY = 3

// 相談を1回すると、なでる1回の1/4ぶん上がる（1日の上限なし）
export const CONSULT_PATS = 0.25

// 呼び方をかえられるようになる親密度レベル。お部屋はレベル3までで、ここが親密度レベルの上限
export const NAME_UNLOCK_LEVEL = 4
export const maxAffectionLevel = Math.max(rooms.length, NAME_UNLOCK_LEVEL)

export function affectionLevel(pats: number): number {
  return Math.min(1 + Math.floor(pats / PATS_PER_LEVEL), maxAffectionLevel)
}

// いまのレベルのゲージの進み具合（0〜1）。最大レベルでは満タン
export function gaugeRatio(pats: number): number {
  if (affectionLevel(pats) >= maxAffectionLevel) return 1
  return (pats % PATS_PER_LEVEL) / PATS_PER_LEVEL
}

export function todayString(now = new Date()): string {
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${m}-${d}`
}

export type PatResult =
  | { kind: 'limit'; affection: Affection }
  | { kind: 'ok'; affection: Affection; leveledUp: boolean }

export function pat(current: Affection, now = new Date()): PatResult {
  const today = todayString(now)
  const patsToday = current.lastPatDate === today ? current.patsToday : 0
  if (patsToday >= MAX_PATS_PER_DAY) {
    return { kind: 'limit', affection: { ...current, patsToday, lastPatDate: today } }
  }
  const pats = current.pats + 1
  return {
    kind: 'ok',
    affection: { pats, patsToday: patsToday + 1, lastPatDate: today },
    leveledUp: affectionLevel(pats) > affectionLevel(current.pats),
  }
}

// 相談を終えたときの親密度。なでる回数の上限や日付には影響しない
export function consultAffection(current: Affection): { affection: Affection; leveledUp: boolean } {
  const pats = current.pats + CONSULT_PATS
  return {
    affection: { ...current, pats },
    leveledUp: affectionLevel(pats) > affectionLevel(current.pats),
  }
}
