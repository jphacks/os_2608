import type { Category, Intensity, PetState, StressRecord } from './types'

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

// 古い形式（category / categories と、1つだけのつらさ intensity）の記録を、answers にそろえる
type LegacyRecord = Partial<StressRecord> & { category?: Category; categories?: Category[]; intensity?: Intensity }

export function loadRecords(): StressRecord[] {
  const records = read<LegacyRecord[]>(RECORDS_KEY, [])
  if (!Array.isArray(records)) return []
  return records.map((r) => {
    if (r.answers) return r as StressRecord
    const categories = r.categories ?? (r.category ? [r.category] : [])
    const answers = categories.map((category) => ({
      category,
      intensity: category === 'good_day' ? undefined : r.intensity,
    }))
    return { id: r.id ?? '', createdAt: r.createdAt ?? '', answers }
  })
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
