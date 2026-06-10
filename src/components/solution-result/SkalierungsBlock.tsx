/**
 * Skalierungs-Block (PRD §11.1 Block 7) — nur bei HighIntent. Dies ist die EINZIGE
 * Stelle der Seite, an der der Produktname „ResidentFlowAI" fällt (laufende Überwachung,
 * eigene Instanz je Kunde). Das Sprach-Gate erlaubt den Namen ausschließlich in dieser Datei.
 */
export function SkalierungsBlock() {
  return (
    <section
      data-testid="skalierungs-block"
      style={{
        marginTop: '1.25rem',
        padding: '1rem',
        borderTop: '2px solid var(--farbe-akzent, #b8860b)',
      }}
    >
      <h4 style={{ margin: '0 0 0.5rem' }}>Diese Lösung im Bestand systematisieren</h4>
      <p style={{ margin: 0 }}>
        Als wiederkehrender Prozess übernimmt ResidentFlowAI das Erkennen, Priorisieren und
        Überwachen über alle Gesellschaften — mit einer eigenen Instanz für Ihren Bestand und
        laufender Fristenüberwachung. Was Sie heute manuell prüfen, läuft dann automatisch weiter.
      </p>
    </section>
  );
}
