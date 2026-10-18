import { levelRatio } from '../growth'

export function LevelGauge({ experience, level }: { experience: number; level: number }) {
  return (
    <section className="status" aria-label="ペットのようす">
      <div className="status-row">
        <span className="level">Lv {level}</span>
      </div>
      <div
        className="exp-bar"
        role="progressbar"
        aria-valuenow={Math.round(levelRatio(experience) * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="exp-fill" style={{ width: `${levelRatio(experience) * 100}%` }} />
      </div>
    </section>
  )
}
