import type { Answer, Category } from './types'

// 相談画面の選択肢。最初の4つは出来事（category）で系統が決まり、つらさを聞く。
// 追加・編集した選択肢は、確定したときに Gemini が一度だけ判定した結果（answers）を持ち、つらさは聞かない
export type Choice = { id: string; label: string; category?: Category; answers?: Answer[] }

export const CHOICE_MAX = 15

export const defaultChoices: Choice[] = [
  { id: 'commute', label: '通学・移動がつらかった', category: 'commute' },
  { id: 'task', label: '課題や仕事が大変だった', category: 'task' },
  { id: 'relationships', label: '人とのことで疲れた', category: 'relationships' },
  { id: 'tired', label: 'なんとなく疲れた', category: 'tired' },
]

const KEY = 'pet-stress-app/v1/choices'

export function loadChoices(): Choice[] {
  try {
    const raw = localStorage.getItem(KEY)
    const saved = raw ? (JSON.parse(raw) as Choice[]) : undefined
    if (Array.isArray(saved) && saved.every((c) => typeof c?.id === 'string' && typeof c?.label === 'string')) {
      return saved
    }
  } catch {
    // 読めないときは初期の選択肢に戻す
  }
  return defaultChoices
}

export function saveChoices(choices: Choice[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(choices))
  } catch {
    // 保存できない場合は、その場の表示だけ続ける
  }
}
