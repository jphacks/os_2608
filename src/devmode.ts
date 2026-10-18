import { PATS_PER_LEVEL, maxAffectionLevel } from './affection'
import { levelFor, rollBranch } from './growth'
import { initialPetState } from './storage'
import type { PetState } from './types'

const maxPats = (maxAffectionLevel - 1) * PATS_PER_LEVEL

// 経験値を変える。レベルは経験値から決まり、レベルが上がるたび（Lv4以降も）に色をくじ引きし直す
export function setExperience(pet: PetState, value: number): PetState {
  const experience = Math.max(0, value)
  const level = levelFor(experience)
  let next: PetState = { ...pet, experience, level }
  if (level === 1) {
    delete next.branch
    delete next.branchDate
  } else if (level > pet.level) next = rollBranch(next)
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
