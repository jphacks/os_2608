import { useState } from 'react'
import { Consult } from './screens/Consult'
import { Home } from './screens/Home'
import { Review } from './screens/Review'
import { Rooms } from './screens/Rooms'
import { applyConsult } from './growth'
import { addRecord, loadPetState, savePetState } from './storage'
import type { Answer, PetState } from './types'

type Screen = 'home' | 'consult' | 'rooms' | 'review'

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

  const onFinishConsult = (answers: Answer[]) => {
    addRecord({ id: newId(), createdAt: new Date().toISOString(), answers })
    const result = applyConsult(pet, answers)
    updatePet(result.pet)
    return result
  }

  if (screen === 'consult') {
    return <Consult pet={pet} onFinish={onFinishConsult} onDone={() => setScreen('home')} />
  }
  if (screen === 'review') {
    return <Review pet={pet} onDone={() => setScreen('home')} />
  }
  if (screen === 'rooms') {
    return (
      <Rooms
        pet={pet}
        onSelect={(roomId) => {
          updatePet({ ...pet, roomId })
          setScreen('home')
        }}
        onRename={(playerName) => updatePet({ ...pet, playerName: playerName || undefined })}
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
      onReview={() => setScreen('review')}
    />
  )
}
