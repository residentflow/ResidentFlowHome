import { z } from 'zod';

/**
 * Schwerpunkt der Methodenbibliothek (Playbook) — ordnet die Loesung/Lösungen (§6).
 * Sechs ergebnisorientierte Schwerpunkte entlang des Immobilien-Lebenszyklus.
 * `beschreibung` liefert den Einleitungstext der jeweiligen Schwerpunkt-Karte (Stufe 1).
 */
export const PhaseSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  reihenfolge: z.number().int().nonnegative(),
  beschreibung: z.string().min(1).optional(),
});

export type Phase = z.infer<typeof PhaseSchema>;
