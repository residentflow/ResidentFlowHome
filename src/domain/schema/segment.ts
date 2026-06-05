import { z } from 'zod';
import { TAETIGKEITEN, SEGMENT_TYPEN, END_AUSGAENGE } from '../enums';

/**
 * Segment (§3.3/§14): Tätigkeit → Typ → End-Ausgang. End-Ausgang ist Pflicht
 * (keine Persona ohne definierten Ausgang, §13.4).
 */
export const SegmentSchema = z.object({
  taetigkeit: z.enum(TAETIGKEITEN),
  typ: z.enum(SEGMENT_TYPEN),
  endAusgang: z.enum(END_AUSGAENGE),
});

export type Segment = z.infer<typeof SegmentSchema>;
