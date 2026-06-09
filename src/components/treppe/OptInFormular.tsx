import { useState } from 'react';
import type { Rolle } from '@/domain/enums';
import type { Spanne } from '@/domain/schema/spanne';

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
  }) => void;
}

/**
 * Opt-in-Formular (§10.4/§11): Hauptkanal „Ihr Potenzialprofil als PDF erhalten".
 * - E-Mail-Feld (steht NACH dem Ergebnis, kein Gate davor)
 * - consentPdf: Pflicht-Einwilligung (Submit blockiert ohne)
 * - consentAbo: Zusatz-Häkchen für monatliches Abo, NICHT vorausgewählt, Double-Opt-in-Hinweis
 * - Fallback-Staffel sichtbar: ① PDF → ② Abo → ③ auf die Ergebnis-Mail antworten
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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!consentPdf || !email) {
      return;
    }

    onSubmit({
      email,
      consentPdf: true,
      consentAbo,
      rolle,
      relevanteEinheiten,
      ergebnisSpanne,
    });
    setGesendet(true);
  }

  if (gesendet) {
    return (
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
    );
  }

  return (
    <div>
      {/* Fallback-Staffel (§10.4): ① Ergebnis-PDF → ② Abo → ③ Ergebnis-Mail */}
      <ol>
        {/* ① Potenzialprofil als PDF — enthält "Potenzialprofil" + "PDF" */}
        <li>Ihr Potenzialprofil als PDF — direkt in Ihr Postfach.</li>
        {/* ② Abo — kein "monatlich" hier, das steht im Checkbox-Label */}
        <li>Erkenntnis-Abo für kontinuierliche Impulse (optional).</li>
        {/* ③ Ergebnis-Mail antworten */}
        <li>Oder einfach auf die Ergebnis-Mail antworten — wir melden uns.</li>
      </ol>

      <form onSubmit={handleSubmit} noValidate>
        {/* E-Mail — steht nach dem Ergebnis, kein Gate (§10.4: kein E-Mail-Gate VOR dem Ergebnis) */}
        <div>
          <label htmlFor="optin-email">E-Mail-Adresse</label>
          <input
            id="optin-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ihre@email.de"
            required
            aria-label="E-Mail-Adresse"
          />
        </div>

        {/* consentPdf: Pflicht — Submit blockiert ohne (§10.4) */}
        <div>
          <label>
            <input
              type="checkbox"
              checked={consentPdf}
              onChange={(e) => setConsentPdf(e.target.checked)}
              aria-label="Einwilligung zur Verarbeitung und Zusendung des Potenzialprofils"
            />
            Ich bin einverstanden mit der Verarbeitung meiner E-Mail-Adresse zur Zusendung des
            Potenzialprofils (Pflicht).
          </label>
        </div>

        {/* consentAbo: NICHT vorausgewählt (§10.4), enthält "monatlich" für Auffindbarkeit */}
        <div>
          <label>
            <input
              type="checkbox"
              checked={consentAbo}
              onChange={(e) => setConsentAbo(e.target.checked)}
              aria-label="monatliches Erkenntnis-Abo (optional)"
            />
            Ja, ich möchte monatlich neue Erkenntnisse erhalten (optional, Double-Opt-in, jederzeit
            abbestellbar).
          </label>
        </div>

        <button type="submit" disabled={!consentPdf || !email}>
          Potenzialprofil jetzt anfordern
        </button>
      </form>
    </div>
  );
}
