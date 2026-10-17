import type { Category, PetState, StressRecord } from './types'

// 保存形式を変えたときに古いデータと混ざらないよう、キーにバージョンを付ける
const RECORDS_KEY = 'pet-stress-app/v1/records'
const PET_KEY = 'pet-stress-app/v1/pet'

export const initialPetState: PetState = {
  level: 1,
  experience: 0,
  stats: { physical: 0, chemical: 0, psychological: 0, biological: 0 },
  recentTypes: [],
  affection: { pats: 0, patsToday: 0, lastPatDate: '' },
  roomId: 'room-1',
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // プライベートブラウズ等で保存できない場合は、その場の表示だけ続ける
  }
}

export function loadRecords(): StressRecord[] {
  const records = read<(StressRecord & { category?: Category })[]>(RECORDS_KEY, [])
  if (!Array.isArray(records)) return []
  // 1つだけ選ぶ形式（category）で保存された古い記録を、複数選択の形式（categories）にそろえる
  return records.map(({ category, ...r }) => ({ ...r, categories: r.categories ?? (category ? [category] : []) }))
}

export function addRecord(record: StressRecord): StressRecord[] {
  const records = [...loadRecords(), record]
  write(RECORDS_KEY, records)
  return records
}

export function loadPetState(): PetState {
  const saved = read<Partial<PetState>>(PET_KEY, {})
  return {
    ...initialPetState,
    ...saved,
    stats: { ...initialPetState.stats, ...saved.stats },
    affection: { ...initialPetState.affection, ...saved.affection },
  }
}

export function savePetState(state: PetState) {
  write(PET_KEY, state)
}
