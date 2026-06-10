import { useState } from 'react';
import type { Rolle } from '@/domain/enums';
import type { Spanne } from '@/domain/schema/spanne';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';

interface OptInFormularProps {
  rolle: Rolle;
  relevanteEinheiten: number;
  ergebnisSpanne: Spanne;
  onSubmit: (daten: {
    email: string;
    consentPdf: true;
    consentAbo: boolean;
    rolle: Rolle;
    relevanteEinheiten: number;
    ergebnisSpanne: Spanne;
  }) => void | Promise<void>;
}

const feldStil: React.CSSProperties = {
  font: 'inherit',
  fontSize: '1rem',
  padding: '0.6rem 0.9rem',
  border: '1px solid var(--farbe-linie, #e0e0e0)',
  borderRadius: 'var(--radius, 4px)',
  width: '100%',
  maxWidth: '380px',
  display: 'block',
};

const checkboxZeileStil: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.6rem',
  fontSize: '0.95rem',
  lineHeight: 1.5,
  cursor: 'pointer',
};

/**
 * Opt-in-Formular (§10.4/§11): Hauptkanal „Ihr Potenzialprofil als PDF erhalten".
 * - E-Mail-Feld (steht NACH dem Ergebnis, kein Gate davor)
 * - consentPdf: Pflicht-Einwilligung (Submit blockiert ohne)
 * - consentAbo: Zusatz-Häkchen für monatliches Abo, NICHT vorausgewählt, Double-Opt-in-Hinweis
 * - Fallback-Staffel sichtbar: ① PDF → ② Abo → ③ auf die Ergebnis-Mail antworten
 * - Erfolg wird erst NACH erfolgreichem onSubmit gemeldet; Fehler werden sichtbar gemacht.
 */
export function OptInFormular({
  rolle,
  relevanteEinheiten,
  ergebnisSpanne,
  onSubmit,
}: OptInFormularProps) {
  const [email, setEmail] = useState('');
  const [consentPdf, setConsentPdf] = useState(false);
  const [consentAbo, setConsentAbo] = useState(false);
  const [gesendet, setGesendet] = useState(false);
  const [sendet, setSendet] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!consentPdf || !email || sendet) {
      return;
    }

    setSendet(true);
    setFehler(null);
    try {
      await onSubmit({
        email,
        consentPdf: true,
        consentAbo,
        rolle,
        relevanteEinheiten,
        ergebnisSpanne,
      });
      setGesendet(true);
    } catch {
      setFehler(
        'Das hat leider nicht geklappt — Ihr Potenzialprofil konnte nicht angefordert werden. ' +
          'Bitte versuchen Sie es in ein paar Minuten erneut.',
      );
    } finally {
      setSendet(false);
    }
  }

  if (gesendet) {
    return (
      <Section flaeche>
        <div data-testid="optin-bestaetigung" role="status">
          <p>
            <strong>Vielen Dank — Ihr Potenzialprofil ist unterwegs.</strong>
          </p>
          <p>
            Wir senden es an <strong>{email}</strong>.
            {consentAbo
              ? ' Für das Erkenntnis-Abo bestätigen Sie bitte die separate Double-Opt-in-Mail.'
              : ' Sie können jederzeit auf die Ergebnis-Mail antworten — wir melden uns.'}
          </p>
        </div>
      </Section>
    );
  }

  return (
    <Section titel="Ihr Potenzialprofil" flaeche>
      {/* Fallback-Staffel (§10.4): ① Ergebnis-PDF → ② Abo → ③ Ergebnis-Mail */}
      <ol style={{ margin: '0 0 1.5rem', paddingLeft: '1.25rem', lineHeight: 1.8 }}>
        {/* ① Potenzialprofil als PDF — enthält "Potenzialprofil" + "PDF" */}
        <li>Ihr Potenzialprofil als PDF — direkt in Ihr Postfach.</li>
        {/* ② Abo — kein "monatlich" hier, das steht im Checkbox-Label */}
        <li>Erkenntnis-Abo für kontinuierliche Impulse (optional).</li>
        {/* ③ Ergebnis-Mail antworten */}
        <li>Oder einfach auf die Ergebnis-Mail antworten — wir melden uns.</li>
      </ol>

      <form
        onSubmit={handleSubmit}
        noValidate
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '1.5rem',
          background: '#fff',
          border: '1px solid var(--farbe-linie, #e0e0e0)',
          borderRadius: 'var(--radius, 4px)',
          maxWidth: '560px',
        }}
      >
        {/* E-Mail — steht nach dem Ergebnis, kein Gate (§10.4: kein E-Mail-Gate VOR dem Ergebnis) */}
        <div>
          <label
            htmlFor="optin-email"
            style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}
          >
            E-Mail-Adresse
          </label>
          <input
            id="optin-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ihre@email.de"
            required
            aria-label="E-Mail-Adresse"
            style={feldStil}
          />
        </div>

        {/* consentPdf: Pflicht — Submit blockiert ohne (§10.4) */}
        <div>
          <label style={checkboxZeileStil}>
            <input
              type="checkbox"
              checked={consentPdf}
              onChange={(e) => setConsentPdf(e.target.checked)}
              aria-label="Einwilligung zur Verarbeitung und Zusendung des Potenzialprofils"
              style={{ marginTop: '0.2rem', flexShrink: 0 }}
            />
            <span>
              Ich bin einverstanden mit der Verarbeitung meiner E-Mail-Adresse zur Zusendung des
              Potenzialprofils (Pflicht).
            </span>
          </label>
        </div>

        {/* consentAbo: NICHT vorausgewählt (§10.4), enthält "monatlich" für Auffindbarkeit */}
        <div>
          <label style={checkboxZeileStil}>
            <input
              type="checkbox"
              checked={consentAbo}
              onChange={(e) => setConsentAbo(e.target.checked)}
              aria-label="monatliches Erkenntnis-Abo (optional)"
              style={{ marginTop: '0.2rem', flexShrink: 0 }}
            />
            <span>
              Ja, ich möchte monatlich neue Erkenntnisse erhalten (optional, Double-Opt-in,
              jederzeit abbestellbar).
            </span>
          </label>
        </div>

        {fehler && (
          <p role="alert" style={{ margin: 0, color: '#b91c1c', fontSize: '0.95rem' }}>
            {fehler}
          </p>
        )}

        <div>
          <Button type="submit" disabled={!consentPdf || !email || sendet}>
            {sendet ? 'Wird gesendet …' : 'Potenzialprofil jetzt anfordern'}
          </Button>
        </div>
      </form>
    </Section>
  );
}
