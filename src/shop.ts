import type { PetState, StressType } from './types'
import { giveAffection, todayString } from './affection'

// 色アイテムを同じ色で続けて使うと、この日数で色が確定する
export const LOCK_DAYS = 3

export type ShopItem = {
  id: string
  name: string
  price: number
  effect:
    // 与えると親密度が上がる（なでる回数に換算）
    | { kind: 'affection'; pats: number }
    // 次の色くじ引きで、その色が当たりやすくなる。同じ色を続けて使うと確定する
    | { kind: 'color'; type: StressType }
    // 確定した色を解除する
    | { kind: 'release' }
}

// 仮のアイテム。名前・値段・量は後で差し替える
export const shopItems: ShopItem[] = [
  { id: 'snack', name: 'おやつ', price: 10, effect: { kind: 'affection', pats: 0.5 } },
  { id: 'color-physical', name: 'あかいおやつ', price: 30, effect: { kind: 'color', type: 'physical' } },
  { id: 'color-psychological', name: 'むらさきのおやつ', price: 30, effect: { kind: 'color', type: 'psychological' } },
  { id: 'color-biological', name: 'あおいおやつ', price: 30, effect: { kind: 'color', type: 'biological' } },
  { id: 'color-chemical', name: 'みどりのおやつ', price: 30, effect: { kind: 'color', type: 'chemical' } },
  { id: 'release', name: 'リセットおやつ', price: 30, effect: { kind: 'release' } },
]

const types: StressType[] = ['physical', 'chemical', 'psychological', 'biological']

// 受けたストレスの点数の合計（これまでの記録ぶんを含む）
export function earnedPoints(pet: Pick<PetState, 'stats'>): number {
  return types.reduce((sum, t) => sum + pet.stats[t], 0)
}

// 所持ポイント = 獲得した合計 − 使った合計
export function ownedPoints(pet: Pick<PetState, 'stats' | 'spentPoints'>): number {
  return earnedPoints(pet) - (pet.spentPoints ?? 0)
}

function yesterdayString(today: string): string {
  const [y, m, d] = today.split('-').map(Number)
  return todayString(new Date(y, m - 1, d - 1))
}

// いま買えない理由。買えるなら undefined
export function unavailableReason(pet: PetState, item: ShopItem, now = new Date()): string | undefined {
  if (ownedPoints(pet) < item.price) return 'ポイントがたりないよ'
  const { effect } = item
  if (effect.kind === 'color') {
    if (pet.colorItemDate === todayString(now)) return 'きょうはもうあげたよ'
    if (pet.branchLock === effect.type) return 'もうこの色にきまっているよ'
  }
  if (effect.kind === 'release' && !pet.branchLock) return 'いろがきまっていないよ'
  return undefined
}

export type BuyResult = { pet: PetState; message: string } | undefined

// 買ってそのままペットに与える。買えなければ undefined
export function buy(pet: PetState, item: ShopItem, now = new Date()): BuyResult {
  if (unavailableReason(pet, item, now)) return undefined
  const paid: PetState = { ...pet, spentPoints: (pet.spentPoints ?? 0) + item.price }
  if (item.effect.kind === 'color') paid.colorItemDate = todayString(now)
  const { effect } = item
  if (effect.kind === 'affection') {
    const bond = giveAffection(pet.affection, effect.pats)
    return {
      pet: { ...paid, affection: bond.affection },
      message: bond.leveledUp ? `${item.name}をあげた！ 新しいお部屋が開いたよ！` : `${item.name}をあげた！ なかよしがふえたよ`,
    }
  }
  if (effect.kind === 'release') {
    const next = { ...paid }
    delete next.branchLock
    delete next.colorStreak
    return { pet: next, message: `${item.name}をあげた！ いろのかくていが とけたよ` }
  }
  // 色アイテム: 昨日も同じ色を使っていれば連続日数を1日足す。日が空く・別の色なら1日目から
  const today = todayString(now)
  const prev = pet.colorStreak
  const days = prev && prev.type === effect.type && prev.lastDate === yesterdayString(today) ? prev.days + 1 : 1
  if (days >= LOCK_DAYS) {
    const next: PetState = { ...paid, branchLock: effect.type, branch: effect.type }
    delete next.colorStreak
    delete next.branchBoost
    return { pet: next, message: `${item.name}をあげた！ いろがきまったよ！` }
  }
  return {
    pet: { ...paid, branchBoost: effect.type, colorStreak: { type: effect.type, days, lastDate: today } },
    message: `${item.name}をあげた！ つぎのいろえらびで その色が出やすくなるよ（${days}日め）`,
  }
}
