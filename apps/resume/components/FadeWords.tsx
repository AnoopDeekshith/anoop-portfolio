/**
 * Splits text into words that softly rise into view one after another
 * (CSS-only — see `.rise-in` in globals.css; disabled for reduced motion).
 */
export default function FadeWords({
  text,
  delay = 0,
  step = 90,
}: {
  text: string;
  /** ms before the first word starts */
  delay?: number;
  /** ms between words */
  step?: number;
}) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          <span className="rise-in inline-block" style={{ "--d": `${delay + i * step}ms` } as React.CSSProperties}>
            {word}
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}
