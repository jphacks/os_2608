import { useState } from 'react'
import { Consult } from './screens/Consult'
import { Home } from './screens/Home'
import { Rooms } from './screens/Rooms'
import { addRecord, loadPetState, savePetState } from './storage'
import type { PetState } from './types'

type Screen = 'home' | 'consult' | 'rooms'

// GitHub Pages では直接URLを開くと404になりやすいため、ルーターは使わず状態で画面を切り替える
export function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [pet, setPet] = useState(loadPetState)

  const updatePet = (next: PetState) => {
    savePetState(next)
    setPet(next)
  }

  if (screen === 'consult') {
    return <Consult level={pet.level} onSave={addRecord} onDone={() => setScreen('home')} />
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
