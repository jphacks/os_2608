import { useState } from 'react'
import { Consult } from './screens/Consult'
import { Home } from './screens/Home'
import { addRecord, loadPetState } from './storage'

type Screen = 'home' | 'consult'

// GitHub Pages では直接URLを開くと404になりやすいため、ルーターは使わず状態で画面を切り替える
export function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [pet] = useState(loadPetState)

  if (screen === 'consult') {
    return <Consult level={pet.level} onSave={addRecord} onDone={() => setScreen('home')} />
  }
  return <Home pet={pet} onConsult={() => setScreen('consult')} />
}
