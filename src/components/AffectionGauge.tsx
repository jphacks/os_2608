import { affectionLevel, gaugeRatio } from '../affection'

export function AffectionGauge({ pats }: { pats: number }) {
  return (
    <section className="status affection" aria-label="なかよしゲージ">
      <div className="status-row">
        <span className="level">なかよし Lv {affectionLevel(pats)}</span>
        <span className="exp-label">♥</span>
      </div>
      <div
        className="exp-bar"
        role="progressbar"
        aria-valuenow={Math.round(gaugeRatio(pats) * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="exp-fill heart" style={{ width: `${gaugeRatio(pats) * 100}%` }} />
      </div>
    </section>
  )
}
