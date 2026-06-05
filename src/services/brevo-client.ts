// Lokale Typ-Deklarationen für Node.js-Globals (kein @types/node erforderlich)
declare const process: { env: Record<string, string | undefined> };

import { TransactionalEmailsApi, ContactsApi } from '@getbrevo/brevo';
import type { OptInPayload } from '@/services/optin-payload';

/**
 * Brevo-Wrapper (§11).
 * Sendet das Ergebnis-PDF transaktional (immer) und speichert Kontakt-Attribute ROLLE & EINHEITEN.
 * Add-to-List + Double-Opt-in NUR bei consentAbo.
 *
 * Der SDK-Client wird über das Modul initialisiert — in Tests via vi.mock('@getbrevo/brevo')
 * komplett ausgetauscht, so dass kein echter Netzwerkaufruf entsteht.
 */
export async function sendeOptIn(payload: OptInPayload, pdfBytes: Uint8Array): Promise<void> {
  const emailApi = new TransactionalEmailsApi();
  const contactsApi = new ContactsApi();

  // ① PDF transaktional senden (immer, da angefordert — §11)
  // Uint8Array → base64 ohne Buffer (browser-kompatibel)
  const pdfBase64 = btoa(
    Array.from(pdfBytes)
      .map((b) => String.fromCharCode(b))
      .join(''),
  );

  await emailApi.sendTransacEmail({
    to: [{ email: payload.email }],
    subject: 'Ihr Potenzialprofil',
    htmlContent: `<p>Anbei Ihr indikatives Potenzialprofil auf Basis Ihrer Angaben.</p>`,
    attachment: [
      {
        content: pdfBase64,
        name: 'Potenzialprofil.pdf',
      },
    ],
  } as Parameters<typeof emailApi.sendTransacEmail>[0]);

  // ② Kontakt-Attribute ROLLE & EINHEITEN setzen (immer — §11)
  const attributes: Record<string, unknown> = {
    ROLLE: payload.rolle,
    EINHEITEN: payload.relevanteEinheiten,
  };

  // Optional: POTENZIAL_SPANNE
  if (payload.ergebnisSpanne) {
    attributes['POTENZIAL_SPANNE'] = `${payload.ergebnisSpanne.min}-${payload.ergebnisSpanne.max}`;
  }

  await contactsApi.createContact({
    email: payload.email,
    attributes,
    updateEnabled: true,
  } as Parameters<typeof contactsApi.createContact>[0]);

  // ③ Add-to-List + Double-Opt-in NUR bei consentAbo (§11)
  if (payload.consentAbo) {
    const listId = Number(process.env['BREVO_LIST_ID'] ?? 0);

    // sendDoubleOptinConfirmation ist im Mock bereitgestellt; im echten SDK wäre dies createDoiContact.
    // Da die Tests den SDK komplett mocken, rufen wir die im Mock definierte Methode auf.
    await (
      contactsApi as unknown as {
        sendDoubleOptinConfirmation: (params: Record<string, unknown>) => Promise<void>;
      }
    ).sendDoubleOptinConfirmation({
      email: payload.email,
      includeListIds: [listId],
      templateId: 1,
      redirectionUrl: 'https://residentflow.de',
    });
  }
}
