import { todayString } from './affection'
import type { PetState } from './types'

// アプリを開いた日（端末の日付）を1日として数える。同じ日に何度開いても増えない
export function recordLogin(pet: PetState, now = new Date()): PetState {
  const today = todayString(now)
  if (pet.lastLoginDate === today) return pet
  return { ...pet, loginDays: pet.loginDays + 1, lastLoginDate: today }
}
