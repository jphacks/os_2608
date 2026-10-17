export function SpeechBubble({ lines }: { lines: string[] }) {
  return (
    <div className="bubble" aria-live="polite">
      {lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  )
}
