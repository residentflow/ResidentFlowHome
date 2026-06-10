import { FOUNDER_SCHLUSSSATZ } from '@/content/texte';
import { Section } from '@/components/ui/Section';

/**
 * Founder-Abschnitt (§9 #9):
 * - Lange Story-Kurzfassung: eigener Bestandshalter, eigenes Geld, aus eigenem Bedarf gebaut
 * - Endet mit FOUNDER_SCHLUSSSATZ
 */
export function Founder() {
  return (
    <Section id="founder" ariaLabel="Über den Gründer">
      <div className="founder-grid" style={{ maxWidth: '820px' }}>
        {/* Foto-Platzhalter */}
        <div style={{ flexShrink: 0 }}>
          <div
            aria-label="Foto des Gründers"
            style={{
              width: '160px',
              height: '200px',
              background: 'var(--farbe-flaeche)',
              border: 'var(--linie)',
              borderRadius: 'var(--radius)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
            }}
          ></div>
          <p
            style={{
              margin: '0.75rem 0 0',
              fontWeight: 700,
              fontSize: '0.9rem',
              textAlign: 'center',
            }}
          >
            Stefan
          </p>
          <p
            style={{
              margin: '0.25rem 0 0',
              fontSize: '0.8rem',
              color: 'var(--farbe-text-sekundaer)',
              textAlign: 'center',
            }}
          >
            Gründer &amp; Bestandshalter
          </p>
        </div>

        {/* Story */}
        <div>
          <h2 style={{ margin: '0 0 1.5rem', fontSize: 'clamp(1.35rem, 2.5vw, 2rem)' }}>
            Warum ich das gebaut habe
          </h2>

          <p style={{ lineHeight: 1.7, marginBottom: '1rem' }}>
            Ich bin kein Berater, der Immobilienoptimierung von außen beschreibt. Ich bin
            Bestandshalter — mit eigenem Geld, eigenen Einheiten, eigenen Fehlern. Jahrelang habe
            ich erlebt, wie Potenziale im Alltag liegen bleiben: nicht wegen Faulheit, sondern weil
            kein System sie verlässlich ans Licht bringt.
          </p>

          <p style={{ lineHeight: 1.7, marginBottom: '1rem' }}>
            Die Mieterhöhung, die vergessen wurde. Die Betriebskosten, die hätten zurückgefordert
            werden können. Der Leerstand, der durch ein besseres Exposé zwei Wochen früher geendet
            hätte. Ich habe all das zuerst in meinem eigenen Bestand gefunden — mit eigenem Geld auf
            dem Spiel.
          </p>

          <p style={{ lineHeight: 1.7, marginBottom: '1rem' }}>
            Dann habe ich angefangen, ein System zu bauen. Nicht für einen Kunden, nicht auf
            Bestellung — aus eigenem Bedarf. Ich wollte wissen: Wie viel liegt wirklich da? Und wie
            sorge ich dafür, dass es nicht weiter liegen bleibt?
          </p>

          <p style={{ lineHeight: 1.7, marginBottom: '1rem' }}>
            Das Ergebnis habe ich zuerst an meinem eigenen Bestand erprobt. Die Zahlen, die Sie
            heute auf dieser Seite sehen, kommen aus echten Funden — nicht aus konstruierten
            Beispielen.
          </p>

          <p
            style={{
              lineHeight: 1.7,
              fontStyle: 'italic',
              fontWeight: 500,
              fontSize: '1.05rem',
              borderLeft: '3px solid var(--farbe-akzent)',
              paddingLeft: '1.25rem',
              marginTop: '1.5rem',
            }}
          >
            {FOUNDER_SCHLUSSSATZ}
          </p>
        </div>
      </div>
    </Section>
  );
}
