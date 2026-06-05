import { z } from 'zod';
import { ROLLEN } from '@/domain/enums';
import { SpanneSchema } from '@/domain/schema/spanne';

/**
 * Validiertes Schema für den Opt-in-Request (§11).
 * Lehnt Payloads ohne consentPdf ab.
 * Strippe unbekannte Felder (z.B. Bestandsinhalte wie Mieterlisten, Adressen).
 */
export const OptInPayloadSchema = z
  .object({
    email: z.string().email(),
    consentPdf: z.literal(true),
    consentAbo: z.boolean(),
    rolle: z.enum(ROLLEN),
    relevanteEinheiten: z.number().int().nonnegative(),
    ergebnisSpanne: SpanneSchema,
  })
  .strip();

export type OptInPayload = z.infer<typeof OptInPayloadSchema>;
