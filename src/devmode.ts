import { PATS_PER_LEVEL, maxAffectionLevel } from './affection'
import { MAX_LEVEL, POINTS_PER_LEVEL, levelFor, trendOf } from './growth'
import { initialPetState } from './storage'
import type { PetState } from './types'

const maxPats = (maxAffectionLevel - 1) * PATS_PER_LEVEL
const maxExperience = (MAX_LEVEL - 1) * POINTS_PER_LEVEL

// 経験値を変える。レベルは経験値から決まり、進化（Lv1→2、Lv2→3）するたびに傾向を決め直す
export function setExperience(pet: PetState, value: number): PetState {
  const experience = Math.max(0, Math.min(maxExperience, value))
  const level = levelFor(experience)
  const next: PetState = { ...pet, experience, level }
  if (level === 1) delete next.branch
  else if (level > pet.level) next.branch = trendOf(next) ?? pet.branch
  return next
}

// なでた回数を変える（1日の回数制限は受けない）
export function setPats(pet: PetState, value: number): PetState {
  const pats = Math.max(0, Math.min(maxPats, value))
  return { ...pet, affection: { ...pet.affection, pats } }
}

export function resetPet(): PetState {
  return initialPetState
}
