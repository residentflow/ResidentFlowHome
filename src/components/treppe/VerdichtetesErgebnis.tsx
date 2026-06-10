import type { RoutingErgebnis, StufenFreigabe, HebelLaufzeit } from '@/domain/types';
import type { Spanne } from '@/domain/schema/spanne';
import { Section } from '@/components/ui/Section';
import { Terminlink } from '@/components/treppe/Terminlink';

interface VerdichtetesErgebnisProps {
  routing: RoutingErgebnis;
  stufen: StufenFreigabe;
  gesamtSpanne: Spanne;
  laufzeiten: HebelLaufzeit[];
}

/**
 * Verdichtetes Ergebnis (§10.2):
 * - EIN empfohlener, persona-basierter Hauptweg
 * - Alternativen darunter
 * - Gesamtpotenzial als Spanne (min–max €)
 * - Multiplikatoren → Partnerprogramm-Link
 * Der Produktname darf hier NICHT erscheinen (§17).
 */
export function VerdichtetesErgebnis({
  routing,
  stufen,
  gesamtSpanne,
  laufzeiten: _laufzeiten,
}: VerdichtetesErgebnisProps) {
  const istMultiplikator = routing.endAusgang === 'partnerprogramm';
  const hatSpanne = gesamtSpanne.min > 0 || gesamtSpanne.max > 0;

  function formatEuro(betrag: number): string {
    return betrag.toLocaleString('de-DE');
  }

  return (
    <Section titel="Ihr verdichtetes Ergebnis">
      {/* Gesamtpotenzial als Spanne */}
      {hatSpanne && (
        <div data-testid="gesamtpotenzial" style={{ marginBottom: '2rem' }}>
          <p>
            Ihr identifiziertes Gesamtpotenzial:{' '}
            <strong>
              {formatEuro(gesamtSpanne.min)} – {formatEuro(gesamtSpanne.max)} € p.a.
            </strong>
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--farbe-text-sekundaer, #6b7280)' }}>
            Indikative Spanne auf Basis Ihrer Angaben (konservativ kalkuliert, Rechenweg sichtbar).
          </p>
        </div>
      )}

      {/* Empfohlener Hauptweg (persona-basiert) */}
      <div data-testid="empfohlener-hauptweg" style={{ marginBottom: '1.5rem' }}>
        <h3>Empfohlener nächster Schritt</h3>
        {istMultiplikator ? (
          <p>
            Als Multiplikator (Steuerberater / Makler) ist das Partnerprogramm Ihr direkter Weg —
            ohne Bestandsgröße als Voraussetzung.
          </p>
        ) : stufen.stufe3 ? (
          <p>
            Mit {routing.relevanteEinheiten} Einheiten lohnt sich die vollständige Automatisierung.
            Vereinbaren Sie einen Termin, um gemeinsam Ihren Bestand zu analysieren.
          </p>
        ) : (
          <p>
            Starten Sie mit dem Playbook und dem ResidentPrivacyFlow — der lokalen Analyse ohne
            Datenübertragung.
          </p>
        )}

        {istMultiplikator ? (
          <a
            href="#partnerprogramm"
            data-testid="partnerprogramm-link"
            style={{ display: 'inline-block', marginTop: '0.75rem' }}
          >
            Zum Partnerprogramm
          </a>
        ) : stufen.stufe3 ? (
          <div style={{ marginTop: '0.75rem' }}>
            <Terminlink />
          </div>
        ) : null}
      </div>

      {/* Alternativen */}
      <div data-testid="alternativen">
        <h4>Weitere Optionen</h4>
        <ul>
          {!istMultiplikator && (
            <>
              <li>Playbook ansehen — vollständige Methodenbibliothek</li>
              <li>ResidentPrivacyFlow herunterladen — lokale Analyse ohne Installation</li>
            </>
          )}
          {istMultiplikator && <li>Kontaktaufnahme für individuelle Partnerkonditionen</li>}
          {stufen.stufe3 && !istMultiplikator && (
            <li>Vollautomatisierung mit Stufe 3 — gemeinsam im Termin besprechen</li>
          )}
        </ul>
      </div>
    </Section>
  );
}
