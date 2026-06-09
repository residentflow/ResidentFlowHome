import type { HebelLaufzeit } from '@/domain/types';
import { Section } from '@/components/ui/Section';
import { Terminlink } from '@/components/treppe/Terminlink';

interface Stufe3AutomatisierungProps {
  laufzeiten: HebelLaufzeit[];
  /** Hebel-IDs, für die ein fertiges Video vorliegt (Übergangszustand §10.1). */
  hebelIdsWithVideo: string[];
}

/**
 * Stufe 3 — Vollautomatisierung (§10.1). NUR ab Schwelle sichtbar (Bestandsverantwortliche ≥ 50).
 * EINZIGE Stelle im gesamten Quellcode, an der der Produktname vorkommt (§17).
 * Video pro Hebel; Hebel ohne fertiges Video → direkt Terminlink (Übergangszustand).
 */
export function Stufe3Automatisierung({
  laufzeiten,
  hebelIdsWithVideo,
}: Stufe3AutomatisierungProps) {
  const hebelIdsWithVideoSet = new Set(hebelIdsWithVideo);

  return (
    <Section titel="Stufe 3 — Vollautomatisierung mit ResidentFlowAI">
      <p>
        ResidentFlowAI übernimmt die Automatisierung dieser Hebel vollständig — für Bestände ab 50
        Einheiten, die systematisch und dauerhaft Potenziale heben wollen.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {laufzeiten.map((hebel) => {
          const hatVideo = hebelIdsWithVideoSet.has(hebel.hebelId);
          return (
            <div
              key={hebel.hebelId}
              style={{ borderTop: '1px solid var(--farbe-linie, #e5e7eb)', paddingTop: '1rem' }}
            >
              <h4>{hebel.hebelId}</h4>
              {hatVideo ? (
                <div data-testid={`video-hebel-${hebel.hebelId}`} style={{ marginTop: '0.5rem' }}>
                  {/* Video wird nachgeliefert — Platzhalter */}
                  <div
                    style={{
                      background: 'var(--farbe-flaeche, #f9fafb)',
                      border: '1px solid var(--farbe-linie, #e5e7eb)',
                      borderRadius: 'var(--radius, 4px)',
                      padding: '2rem',
                      textAlign: 'center',
                      color: 'var(--farbe-text-sekundaer, #6b7280)',
                    }}
                  >
                    Video: Automatisierung — {hebel.hebelId}
                  </div>
                </div>
              ) : (
                /* Übergangszustand: kein Video → direkt Terminlink */
                <div style={{ marginTop: '0.5rem' }}>
                  <Terminlink />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}
