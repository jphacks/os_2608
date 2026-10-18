import type { Answer, Intensity, StressType } from './types'

// 文章の判定は、APIキーを隠した中継サーバー（worker/）を通して Gemini に頼む
export const consultApiUrl = import.meta.env.VITE_CONSULT_API_URL

export type TextResult = { kind: 'answers'; answers: Answer[] } | { kind: 'not_stress' }

type ApiResponse = {
  result: 'stress' | 'good_day' | 'not_stress'
  items?: { type: StressType; intensity: Intensity }[]
}

// 文章を判定する。通信や判定に失敗したときは例外を投げる
export async function analyzeText(text: string): Promise<TextResult> {
  if (!consultApiUrl) throw new Error('consult api url is not set')
  const res = await fetch(consultApiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
  if (!res.ok) throw new Error(`consult api failed: ${res.status}`)
  const data = (await res.json()) as ApiResponse
  // 「今日は大丈夫だった」のような、つらいことが無かった内容は、ストレスの話ではないものとして扱う
  if (data.result === 'not_stress' || data.result === 'good_day') return { kind: 'not_stress' }
  if (!data.items?.length) throw new Error('consult api returned no items')
  return { kind: 'answers', answers: data.items.map(({ type, intensity }) => ({ type, intensity })) }
}
