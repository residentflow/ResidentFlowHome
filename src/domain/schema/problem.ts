import { z } from 'zod';
import { ROLLEN } from '../enums';

/** Optionale Größenbedingung eines Problems (§5.3). */
export const GroessenBedingungSchema = z.object({
  minEinheiten: z.number().int().nonnegative().optional(),
  maxEinheiten: z.number().int().nonnegative().optional(),
});

/**
 * Problem (Stufe B), lifecycle-übergreifend an Rolle+Größe gebunden (§4/§5.3).
 * Gate: kein Problem ohne mindestens einen verknüpften Hebel.
 */
export const ProblemSchema = z.object({
  id: z.string().min(1),
  schmerzBereich: z.string().min(1),
  text: z.string().min(1),
  rollenFilter: z.array(z.enum(ROLLEN)).min(1),
  groessenBedingung: GroessenBedingungSchema.optional(),
  verknuepfteHebel: z.array(z.string().min(1)).min(1, {
    message: 'Kein Problem ohne mindestens einen verknüpften Hebel (§5.3).',
  }),
  aktiv: z.boolean(),
});

export type Problem = z.infer<typeof ProblemSchema>;
export type GroessenBedingung = z.infer<typeof GroessenBedingungSchema>;
