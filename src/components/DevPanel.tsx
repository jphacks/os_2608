import { PATS_PER_LEVEL, affectionLevel } from '../affection'
import { isFull } from '../cooldown'
import { POINTS_PER_LEVEL } from '../growth'
import { resetPet, setExperience, setPats } from '../devmode'
import type { PetState } from '../types'

type Props = {
  pet: PetState
  onChangePet: (pet: PetState) => void
  onClose: () => void
}

// 開発者モード。親密度とレベルを手元で増減して動作を確かめるためのパネル
export function DevPanel({ pet, onChangePet, onClose }: Props) {
  return (
    <section className="dev-panel" aria-label="開発者モード">
      <h2>開発者モード</h2>
      <div className="dev-row">
        <span>
          なかよし Lv {affectionLevel(pet.affection.pats)}（なでた回数 {pet.affection.pats}）
        </span>
        <button onClick={() => onChangePet(setPats(pet, pet.affection.pats - 1))}>－1</button>
        <button onClick={() => onChangePet(setPats(pet, pet.affection.pats + 1))}>＋1</button>
        <button onClick={() => onChangePet(setPats(pet, pet.affection.pats - PATS_PER_LEVEL))}>
          Lv↓
        </button>
        <button onClick={() => onChangePet(setPats(pet, pet.affection.pats + PATS_PER_LEVEL))}>
          Lv↑
        </button>
      </div>
      <div className="dev-row">
        <span>
          Lv {pet.level}（経験値 {pet.experience}）
        </span>
        <button onClick={() => onChangePet(setExperience(pet, pet.experience - 1))}>－1</button>
        <button onClick={() => onChangePet(setExperience(pet, pet.experience + 1))}>＋1</button>
        <button onClick={() => onChangePet(setExperience(pet, pet.experience - POINTS_PER_LEVEL))}>
          Lv↓
        </button>
        <button onClick={() => onChangePet(setExperience(pet, pet.experience + POINTS_PER_LEVEL))}>
          Lv↑
        </button>
      </div>
      <div className="dev-row">
        <span>{isFull(pet) ? 'お腹いっぱい中' : '食べられる'}</span>
        <button onClick={() => onChangePet({ ...pet, lastConsultAt: undefined })}>クールタイム解除</button>
      </div>
      <div className="dev-row">
        <button
          onClick={() => {
            if (window.confirm('ペットの状態を最初に戻します。よろしいですか？')) onChangePet(resetPet())
          }}
        >
          リセット
        </button>
        <button onClick={onClose}>閉じる</button>
      </div>
    </section>
  )
}
