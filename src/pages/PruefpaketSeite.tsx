import { copy } from '@/config/checkConfig';

/**
 * /mietanpassungs-pruefpaket (PRD §7/§15): was es ist, was es findet, was es nicht kann,
 * Download, Termin-Brücke. Extern immer „Prüfpaket". Attribution: Links tragen ?src=pruefpaket.
 */
export function PruefpaketSeite() {
  return (
    <main
      data-testid="pruefpaket-seite"
      style={{ maxWidth: 760, margin: '0 auto', padding: '2rem 1rem' }}
    >
      <h1>{copy('copy.pruefpaketName')}</h1>
      <p>
        Das Werkzeug, mit dem ich meinen eigenen Bestand prüfe — frei nutzbar in der KI-Umgebung,
        mit der Sie ohnehin arbeiten. Ihre Liste bleibt bei Ihnen.
      </p>

      <h2>Was es findet</h2>
      <ul data-testid="pruefpaket-funde">
        <li>Ertrag: Index-/Staffelmieten ohne Anpassung (Spanne, Rechenweg)</li>
        <li>Fristen-Radar: fällig in 30/60/90 Tagen</li>
        <li>Datenlücken: nicht bewertbare Verträge</li>
      </ul>

      <h2>Was es nicht kann</h2>
      <p data-testid="pruefpaket-decke">
        Keine rechtssicheren Anschreiben je Lage und Bundesland, keine laufende Fristenüberwachung
        über mehrere Gesellschaften, kein Abgleich mit Belegen und Buchhaltung. Gefunden ist nicht
        realisiert.
      </p>

      <p>
        <a
          data-testid="pruefpaket-download"
          href="/downloads/mietanpassungs-pruefpaket.zip?src=pruefpaket"
        >
          Prüfpaket herunterladen
        </a>
      </p>

      <h2>Bringen Sie den Report mit</h2>
      <p>
        <a data-testid="pruefpaket-termin" href="/termin?src=pruefpaket">
          Ihren Bestand gemeinsam ansehen
        </a>{' '}
        — 30 Minuten, wir priorisieren die Umsetzung. Kein Pitch.
      </p>

      <p style={{ color: '#777', fontSize: '0.85rem' }}>
        Keine Rechtsberatung. Spannen sind indikativ.
      </p>
    </main>
  );
}

export default PruefpaketSeite;
