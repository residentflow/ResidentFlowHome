import { createHmac, timingSafeEqual } from 'node:crypto';
import type { Payload } from 'payload';

/**
 * cal.com-Webhook-Signatur prüfen (HMAC-SHA256 des Roh-Bodys mit CALCOM_WEBHOOK_SECRET,
 * Header X-Cal-Signature-256). Ohne gesetztes Secret wird in DEV durchgelassen (Warnung).
 */
export function verifyCalSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.CALCOM_WEBHOOK_SECRET;
  if (!secret) {
    console.warn('CALCOM_WEBHOOK_SECRET nicht gesetzt — Webhook-Signatur NICHT geprüft (DEV).');
    return true;
  }
  if (!signature) return false;
  const erwartet = createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex');
  const a = Buffer.from(erwartet);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Lead-Pipeline (PRD §17) — Schreibpfad ausschließlich über Payload (Hooks/Zod-Gates/Consent).
 * erstelleLead() wird von den Custom-Endpoints /api/lead und /api/calcom-webhook genutzt und ist
 * headless testbar. ConsentRecords werden mit Textversion dokumentiert (§17.3).
 */
export interface LeadEingabe {
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  source: string;
  role?: string;
  sizeBucket?: string;
  selectedProblem?: string;
  displayedSolutions?: string[];
  shownValueRanges?: unknown;
  relevanceScore?: number;
  consents?: Array<{ type: string; accepted: boolean; textVersion: string }>;
}

/** Automatischer Gesprächseinstieg (§17.5). Header-Direct ohne Check-Kontext → Erstbefund-Hinweis. */
export function generiereGespraechseinstieg(d: LeadEingabe): string {
  if (d.source === 'header-direct' || !d.selectedProblem) {
    return 'Kein Check-Kontext — Erstbefund (Outreach) verwenden.';
  }
  const sols = d.displayedSolutions ?? [];
  const erste = sols[0] ? `Einstieg: ${sols[0]} prüfen` : 'Einstieg im Gespräch festlegen';
  const danach = sols[1] ? `, danach ${sols[1]}` : '';
  const bucket = d.sizeBucket ? `Bei ${d.sizeBucket}` : 'In Ihrer Größenordnung';
  return `Angegeben: ${d.selectedProblem}. ${bucket} ist das ein möglicher Ansatzpunkt. ${erste}${danach}.`;
}

export async function erstelleLead(payload: Payload, eingabe: LeadEingabe) {
  const consentIds: number[] = [];
  for (const c of eingabe.consents ?? []) {
    const rec = await payload.create({
      collection: 'consent-records',
      data: {
        type: c.type as 'pdf' | 'newsletter' | 'contact' | 'calendar',
        accepted: c.accepted,
        timestamp: new Date().toISOString(),
        textVersion: c.textVersion,
        source: eingabe.source,
      },
    });
    consentIds.push(rec.id as number);
  }

  const lead = await payload.create({
    collection: 'leads',
    data: {
      email: eingabe.email,
      firstName: eingabe.firstName,
      lastName: eingabe.lastName,
      company: eingabe.company,
      phone: eingabe.phone,
      source: eingabe.source,
      role: eingabe.role,
      sizeBucket: eingabe.sizeBucket,
      selectedProblem: eingabe.selectedProblem,
      displayedSolutions: eingabe.displayedSolutions,
      shownValueRanges: eingabe.shownValueRanges as never,
      relevanceScore: eingabe.relevanceScore,
      consentRecords: consentIds,
      leadStatus: 'neu',
      gespraechseinstieg: generiereGespraechseinstieg(eingabe),
    },
  });
  return lead;
}

/** cal.com-Booking-Webhook → Lead. metadata trägt den Diagnosekontext (§17.2), Hash-Fallback extern. */
export async function erstelleLeadAusWebhook(
  payload: Payload,
  booking: { email: string; metadata?: Record<string, string>; bookingId?: string },
) {
  const m = booking.metadata ?? {};
  return erstelleLead(payload, {
    email: booking.email,
    source: m.source || 'calendar',
    role: m.role,
    sizeBucket: m.size,
    selectedProblem: m.problem,
    displayedSolutions: m.solutions ? m.solutions.split(',') : undefined,
    consents: [{ type: 'calendar', accepted: true, textVersion: 'cal.com-Buchung' }],
  });
}
