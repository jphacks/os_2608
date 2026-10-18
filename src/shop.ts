import type { PetState, StressType } from './types'
import { giveAffection } from './affection'

export type ShopItem = {
  id: string
  name: string
  price: number
  // 与えたときに上がる親密度（なでる回数に換算）
  pats: number
}

// 仮のアイテム。名前・値段・量は後で差し替える
export const shopItems: ShopItem[] = [{ id: 'snack', name: 'おやつ', price: 10, pats: 0.5 }]

const types: StressType[] = ['physical', 'chemical', 'psychological', 'biological']

// 受けたストレスの点数の合計（これまでの記録ぶんを含む）
export function earnedPoints(pet: Pick<PetState, 'stats'>): number {
  return types.reduce((sum, t) => sum + pet.stats[t], 0)
}

// 所持ポイント = 獲得した合計 − 使った合計
export function ownedPoints(pet: Pick<PetState, 'stats' | 'spentPoints'>): number {
  return earnedPoints(pet) - (pet.spentPoints ?? 0)
}

export type BuyResult = { pet: PetState; leveledUp: boolean } | undefined

// 買ってそのままペットに与える。ポイントが足りなければ undefined
export function buy(pet: PetState, item: ShopItem): BuyResult {
  if (ownedPoints(pet) < item.price) return undefined
  const bond = giveAffection(pet.affection, item.pats)
  return {
    pet: { ...pet, spentPoints: (pet.spentPoints ?? 0) + item.price, affection: bond.affection },
    leveledUp: bond.leveledUp,
  }
}
