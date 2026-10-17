import { levelProgress, levelRatio, POINTS_PER_LEVEL } from '../growth'

export function LevelGauge({ experience, level }: { experience: number; level: number }) {
  const progress = levelProgress(experience)
  return (
    <section className="status" aria-label="ペットのようす">
      <div className="status-row">
        <span className="level">Lv {level}</span>
        <span className="exp-label">{progress === undefined ? 'MAX' : `${progress} / ${POINTS_PER_LEVEL}`}</span>
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
