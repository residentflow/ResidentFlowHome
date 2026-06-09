import type { LoesungLaufzeit } from '@/domain/types';
import { Section } from '@/components/ui/Section';
import { Terminlink } from '@/components/treppe/Terminlink';

interface Stufe3AutomatisierungProps {
  laufzeiten: LoesungLaufzeit[];
  /** Loesung-IDs, für die ein fertiges Video vorliegt (Übergangszustand §10.1). */
  loesungIdsWithVideo: string[];
}

/**
 * Stufe 3 — Vollautomatisierung (§10.1). NUR ab Schwelle sichtbar (Bestandsverantwortliche ≥ 50).
 * EINZIGE Stelle im gesamten Quellcode, an der der Produktname vorkommt (§17).
 * Video pro Loesung; Loesung ohne fertiges Video → direkt Terminlink (Übergangszustand).
 */
export function Stufe3Automatisierung({
  laufzeiten,
  loesungIdsWithVideo,
}: Stufe3AutomatisierungProps) {
  const loesungIdsWithVideoSet = new Set(loesungIdsWithVideo);

  return (
    <Section titel="Stufe 3 — Vollautomatisierung mit ResidentFlowAI">
      <p>
        ResidentFlowAI übernimmt die Automatisierung dieser Loesung vollständig — für Bestände ab 50
        Einheiten, die systematisch und dauerhaft Potenziale heben wollen.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {laufzeiten.map((loesung) => {
          const hatVideo = loesungIdsWithVideoSet.has(loesung.loesungId);
          return (
            <div
              key={loesung.loesungId}
              style={{ borderTop: '1px solid var(--farbe-linie, #e5e7eb)', paddingTop: '1rem' }}
            >
              <h4>{loesung.loesungId}</h4>
              {hatVideo ? (
                <div
                  data-testid={`video-loesung-${loesung.loesungId}`}
                  style={{ marginTop: '0.5rem' }}
                >
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
                    Video: Automatisierung — {loesung.loesungId}
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
