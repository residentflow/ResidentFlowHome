import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { Terminlink } from '@/components/treppe/Terminlink';
import { schatzsucheConfig } from '@/content/schatzsuche.config';

interface Stufe2ZweiWegeProps {
  privacyFlowDownloadUrl?: string;
}

/**
 * Stufe 2 — Für eigenen Bestand umsetzen (§10.1). Für ALLE sichtbar.
 * Bietet genau zwei Wege:
 *   (a) ResidentPrivacyFlow-Download — lokale Desktop-App, kein Server-Upload
 *   (b) Geführte Analyse ohne Installation im Termin
 * Der Produktname darf hier NICHT erscheinen (§17).
 */
export function Stufe2ZweiWege({
  privacyFlowDownloadUrl = schatzsucheConfig.globalConfig.privacyFlowDownloadUrl,
}: Stufe2ZweiWegeProps) {
  // '#'-Präfix = noch keine echte Download-Quelle → ehrlicher „folgt in Kürze"-Zustand statt totem Link.
  const downloadVerfuegbar = !privacyFlowDownloadUrl.startsWith('#');

  return (
    <Section titel="Stufe 2 — Für Ihren Bestand umsetzen">
      <div className="zwei-spalten" style={{ gap: '2rem' }}>
        {/* Weg A: ResidentPrivacyFlow-Download */}
        <div>
          <h3>Weg A — Download</h3>
          <p>
            Laden Sie <strong>ResidentPrivacyFlow</strong> herunter und analysieren Sie Ihren
            Bestand lokal — ohne Installation auf einem Server, ohne Datenübertragung.
          </p>
          {downloadVerfuegbar ? (
            <a href={privacyFlowDownloadUrl} style={{ textDecoration: 'none' }}>
              <Button variante="primär">Jetzt herunterladen</Button>
            </a>
          ) : (
            <>
              <Button variante="sekundär" disabled style={{ cursor: 'default', opacity: 0.6 }}>
                Download folgt in Kürze
              </Button>
              <p
                style={{
                  marginTop: '0.5rem',
                  fontSize: '0.875rem',
                  color: 'var(--farbe-text-sekundaer, #6b7280)',
                }}
              >
                Bis dahin: Wir gehen Ihren Bestand gern gemeinsam im Termin durch (Weg B).
              </p>
            </>
          )}
        </div>

        {/* Weg B: Geführte Analyse ohne Installation im Termin */}
        <div>
          <h3>Weg B — Gemeinsam im Termin</h3>
          <p>
            Bevorzugen Sie eine geführte Analyse ohne Installation? Wir gehen Ihren Bestand in einem
            gemeinsamen Termin durch — direkt und ohne technischen Aufwand Ihrerseits.
          </p>
          <Terminlink />
        </div>
      </div>
    </Section>
  );
}
