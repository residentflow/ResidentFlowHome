/**
 * /methodik (PRD §7/§23): Wie Zahlen entstehen — Selbstauskunft × Benchmark-Spannen aus
 * eigenem Portfolio, konservativ, Rechenweg offen, „kein Gutachten".
 */
export function MethodikSeite() {
  return (
    <main
      data-testid="methodik-seite"
      style={{ maxWidth: 760, margin: '0 auto', padding: '2rem 1rem' }}
    >
      <h1>Wie diese Zahlen entstehen</h1>
      <p>
        Jede Einschätzung entsteht aus Ihrer Selbstauskunft, multipliziert mit Benchmark-Spannen aus
        unserem eigenen Portfolio. Wir rechnen konservativ und legen den Rechenweg offen.
      </p>
      <h2>Spannen statt Punktwerte</h2>
      <p>
        Potenziale erscheinen immer als Spanne (min–max), nie als einzelne Zahl. So bleibt die
        Unsicherheit sichtbar — und die Aussage ehrlich.
      </p>
      <h2>Quelle: eigener Bestand</h2>
      <p>
        Die Benchmarks stammen aus realen Beständen, nicht aus pauschalen Annahmen. Die Quelle wird
        immer benannt. Mit jedem Assessment wächst die Datenbasis.
      </p>
      <h2>Kein Gutachten</h2>
      <p>
        Das Ergebnis ist ein indikatives Potenzialprofil, keine rechtsverbindliche Bewertung. Die
        konkrete Umsetzung erfolgt geprüft.
      </p>
    </main>
  );
}

export default MethodikSeite;
