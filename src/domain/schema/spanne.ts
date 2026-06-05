import { z } from 'zod';

/**
 * Der kanonische Spannen-Typ {min, max}. Eine einzige Stelle erzwingt den „Spannen-Zwang"
 * (§7/§14/§17): min < max (nie Punktwert), keine negativen Potenziale.
 * Jeder Euro-Wert, Benchmark-Faktor, jede Formel-Ausgabe und Aggregation reused dieses Schema.
 */
export const SpanneSchema = z
  .object({
    min: z.number().nonnegative(),
    max: z.number().nonnegative(),
  })
  .refine((s) => s.min < s.max, {
    message: 'Spanne muss min < max sein (kein Punktwert, kein invertierter Bereich).',
  });

export type Spanne = z.infer<typeof SpanneSchema>;
