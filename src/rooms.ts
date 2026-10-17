// お部屋の一覧。絵ができたら CSS の背景を画像に差し替える（docs/room-assets.md）。
// unlockLevel は、そのお部屋が開く親密度レベル
export type Room = { id: string; name: string; unlockLevel: number }

export const rooms: Room[] = [
  { id: 'room-1', name: 'はじめのおへや', unlockLevel: 1 },
  { id: 'room-2', name: 'ひなたのおへや', unlockLevel: 2 },
  { id: 'room-3', name: 'ほしぞらのおへや', unlockLevel: 3 },
]

export function findRoom(id: string): Room {
  return rooms.find((r) => r.id === id) ?? rooms[0]
}
