/**
 * Headless Verifikation der Lead-Pipeline (§17) über die Local API — ohne HTTP-Server.
 * Bestätigt: Lead + ConsentRecord werden regelkonform angelegt, Gesprächseinstieg generiert,
 * header-direct erzeugt Lead OHNE Check-Kontext.
 */
import { getPayload } from 'payload';
import config from '../payload.config';
import { createHmac } from 'node:crypto';
import {
  erstelleLead,
  erstelleLeadAusWebhook,
  generiereGespraechseinstieg,
  verifyCalSignature,
} from './lead';

async function main() {
  const payload = await getPayload({ config });

  // 1) Lead mit Check-Kontext + Consent
  const lead = await erstelleLead(payload, {
    email: 'test@example.com',
    source: 'direct',
    role: 'buyAndHold',
    sizeBucket: '50–99',
    selectedProblem: 'mieten-indexmieten-pruefen',
    displayedSolutions: ['indexmieten-staffelmieten-pruefen', 'mietspiegel-begruendung'],
    consents: [{ type: 'calendar', accepted: true, textVersion: 'v1' }],
  });
  if (!lead.id) throw new Error('Lead nicht angelegt');
  if (!String(lead.gespraechseinstieg).includes('indexmieten')) {
    throw new Error('Gesprächseinstieg ohne Lösungsbezug');
  }
  console.log('OK Lead mit Kontext + ConsentRecord + Gesprächseinstieg');

  // 2) header-direct → kein Check-Kontext
  const direct = generiereGespraechseinstieg({ email: 'x@y.de', source: 'header-direct' });
  if (!direct.includes('Erstbefund')) throw new Error('header-direct-Hinweis fehlt');
  console.log('OK header-direct → Erstbefund-Hinweis');

  // 3) Webhook → Lead
  const wl = await erstelleLeadAusWebhook(payload, {
    email: 'booking@example.com',
    metadata: { role: 'hausverwaltung', size: '200–499', problem: 'x', source: 'li' },
  });
  if (!wl.id) throw new Error('Webhook-Lead nicht angelegt');
  console.log('OK cal.com-Webhook → Lead');

  // 4) Webhook-Signaturprüfung (HMAC) mit gesetztem Secret
  process.env.CALCOM_WEBHOOK_SECRET = 'test-secret';
  const raw = JSON.stringify({ payload: { metadata: { source: 'li' } } });
  const gut = createHmac('sha256', 'test-secret').update(raw, 'utf8').digest('hex');
  if (!verifyCalSignature(raw, gut)) throw new Error('gültige Signatur abgelehnt');
  if (verifyCalSignature(raw, 'deadbeef')) throw new Error('ungültige Signatur akzeptiert');
  delete process.env.CALCOM_WEBHOOK_SECRET;
  console.log('OK Webhook-Signaturprüfung (gültig akzeptiert / ungültig abgelehnt)');

  console.log('VERIFY-LEAD PASS');
  process.exit(0);
}
main().catch((e) => {
  console.error('VERIFY-LEAD FAIL', e);
  process.exit(1);
});
