import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { Terminlink } from '@/components/treppe/Terminlink';

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
export function Stufe2ZweiWege({ privacyFlowDownloadUrl = '#download' }: Stufe2ZweiWegeProps) {
  return (
    <Section titel="Stufe 2 — Für Ihren Bestand umsetzen">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Weg A: ResidentPrivacyFlow-Download */}
        <div>
          <h3>Weg A — Download</h3>
          <p>
            Laden Sie <strong>ResidentPrivacyFlow</strong> herunter und analysieren Sie Ihren
            Bestand lokal — ohne Installation auf einem Server, ohne Datenübertragung.
          </p>
          <a href={privacyFlowDownloadUrl} style={{ textDecoration: 'none' }}>
            <Button variante="primär">Jetzt herunterladen</Button>
          </a>
        </div>

        {/* Weg B: Geführte Analyse ohne Installation im Termin */}
        <div>
          <h3>Weg B — Gemeinsam im Termin</h3>
          <p>
            Bevorzugen Sie eine geführte Analyse ohne Installation? Wir gehen Ihren Bestand in
            einem gemeinsamen Termin durch — direkt und ohne technischen Aufwand Ihrerseits.
          </p>
          <Terminlink />
        </div>
      </div>
    </Section>
  );
}
