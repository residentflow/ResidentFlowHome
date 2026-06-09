import { z } from 'zod';

/** Stufe-A-Auswahl: grobe Schmerz-Bereiche (§5.1). */
export const SchmerzBereichSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  reihenfolge: z.number().int().nonnegative(),
});

export type SchmerzBereich = z.infer<typeof SchmerzBereichSchema>;
