import type { PetState } from './types'

// 相談が成立してから、次に食べてもらえるまでの時間
export const CONSULT_COOLDOWN_MS = 3 * 60 * 60 * 1000

export function isFull(pet: PetState, now = Date.now()): boolean {
  if (!pet.lastConsultAt) return false
  const last = Date.parse(pet.lastConsultAt)
  return !Number.isNaN(last) && now - last < CONSULT_COOLDOWN_MS
}
