import { z } from 'zod';
import { SpanneSchema } from './spanne';

/**
 * Formel (§7/§14): Eingaben × Benchmark-Spannen → Ausgabe-Spanne.
 * Gates: Ausgabe immer Spanne (min<max), alle Faktoren immer Spannen, rechenwegText Pflicht.
 */
export const FormelSchema = z.object({
  inputs: z.array(z.string().min(1)).min(1),
  faktoren: z.record(z.string(), SpanneSchema),
  ausgabe: SpanneSchema,
  einheit: z.string().min(1),
  rechenwegText: z.string().min(1),
});

export type Formel = z.infer<typeof FormelSchema>;
