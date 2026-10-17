import type { PetState, StressRecord } from './types'

// 保存形式を変えたときに古いデータと混ざらないよう、キーにバージョンを付ける
const RECORDS_KEY = 'pet-stress-app/v1/records'
const PET_KEY = 'pet-stress-app/v1/pet'

export const initialPetState: PetState = {
  level: 1,
  experience: 0,
  acceptance: 0,
  recovery: 0,
  connection: 0,
  affection: 0,
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
  const records = read<StressRecord[]>(RECORDS_KEY, [])
  return Array.isArray(records) ? records : []
}

export function addRecord(record: StressRecord): StressRecord[] {
  const records = [...loadRecords(), record]
  write(RECORDS_KEY, records)
  return records
}

export function loadPetState(): PetState {
  return { ...initialPetState, ...read<Partial<PetState>>(PET_KEY, {}) }
}

export function savePetState(state: PetState) {
  write(PET_KEY, state)
}
