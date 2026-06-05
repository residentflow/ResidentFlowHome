import type { FastifyInstance } from 'fastify';
import { OptInPayloadSchema } from '../../src/services/optin-payload';
import { erzeugePotenzialPdf } from '../../src/services/pdf-export';
import { sendeOptIn } from '../../src/services/brevo-client';

/**
 * POST /api/optin — validiert Payload via OptInPayloadSchema,
 * erzeugt PDF, ruft brevo-client auf; antwortet 200 mit Bestätigung oder 400 bei ungültig (§11).
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
