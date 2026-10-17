import { useState } from 'react'
import { Consult } from './screens/Consult'
import { Home } from './screens/Home'
import { Rooms } from './screens/Rooms'
import { applyConsult } from './growth'
import { addRecord, loadPetState, savePetState } from './storage'
import type { Category, Intensity, PetState } from './types'

type Screen = 'home' | 'consult' | 'rooms'

function newId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

// GitHub Pages では直接URLを開くと404になりやすいため、ルーターは使わず状態で画面を切り替える
export function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [pet, setPet] = useState(loadPetState)

  const updatePet = (next: PetState) => {
    savePetState(next)
    setPet(next)
  }

  const onFinishConsult = (categories: Category[], intensity: Intensity | undefined) => {
    addRecord({ id: newId(), createdAt: new Date().toISOString(), categories, intensity })
    const result = applyConsult(pet, categories)
    updatePet(result.pet)
    return result
  }

  if (screen === 'consult') {
    return <Consult pet={pet} onFinish={onFinishConsult} onDone={() => setScreen('home')} />
  }
  if (screen === 'rooms') {
    return (
      <Rooms
        pet={pet}
        onSelect={(roomId) => {
          updatePet({ ...pet, roomId })
          setScreen('home')
        }}
        onDone={() => setScreen('home')}
      />
    )
  }
  return (
    <Home
      pet={pet}
      onChangePet={updatePet}
      onConsult={() => setScreen('consult')}
      onRooms={() => setScreen('rooms')}
    />
  )
}
