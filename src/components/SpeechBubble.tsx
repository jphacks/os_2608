export function SpeechBubble({ lines }: { lines: string[] }) {
  return (
    <div className="bubble-wrap">
      <div className="bubble" aria-live="polite">
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      {/* ペットの方を向くしっぽ（枠の clip-path に切られないよう外に置く） */}
      <div className="bubble-tail" aria-hidden="true" />
    </div>
  )
}
