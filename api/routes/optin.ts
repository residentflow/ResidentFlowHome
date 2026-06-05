import type { FastifyInstance } from 'fastify';
import { OptInPayloadSchema } from '@/services/optin-payload';

/**
 * POST /api/optin — validiert Payload via OptInPayloadSchema,
 * erzeugt PDF, ruft brevo-client auf; antwortet 200 mit Bestätigung oder 400 bei ungültig (§11).
 *
 * pdf-export und brevo-client werden per dynamischem Import geladen, damit vi.mock()
 * in Tests die Module korrekt ersetzen kann, ohne TDZ-Probleme bei der Hoistierung.
 */
export async function optinRoute(app: FastifyInstance): Promise<void> {
  app.post('/api/optin', async (request, reply) => {
    const parseResult = OptInPayloadSchema.safeParse(request.body);

    if (!parseResult.success) {
      return reply.code(400).send({
        fehler: 'Ungültige Anfrage',
        details: parseResult.error.flatten(),
      });
    }

    const payload = parseResult.data;

    // Dynamische Imports ermöglichen vi.mock() in Tests
    const { erzeugePotenzialPdf } = await import('@/services/pdf-export');
    const { sendeOptIn } = await import('@/services/brevo-client');

    // PDF erzeugen und transaktional senden
    const pdfBytes = await erzeugePotenzialPdf({
      rolle: payload.rolle,
      relevanteEinheiten: payload.relevanteEinheiten,
      ergebnisSpanne: payload.ergebnisSpanne,
    });

    await sendeOptIn(payload, pdfBytes);

    return reply.code(200).send({
      status: 'ok',
      nachricht: 'Ihr Potenzialprofil wurde per E-Mail versandt.',
    });
  });
}
