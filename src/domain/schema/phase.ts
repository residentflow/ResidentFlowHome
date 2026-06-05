import { z } from 'zod';

/** Lebenszyklus-Phase (1–8), ordnet die Hebel/Lösungen (§6). */
export const PhaseSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  reihenfolge: z.number().int().nonnegative(),
});

export type Phase = z.infer<typeof PhaseSchema>;
