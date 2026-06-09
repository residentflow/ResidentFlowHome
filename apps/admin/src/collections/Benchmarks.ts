import type { CollectionConfig } from 'payload';
import { validateSpanne } from '../gates';

/**
 * Benchmarks (PRD §13/§20): Spannen-Faktoren aus Stefans Bestand.
 * Gate G2: isPlaceholder=true darf in öffentlicher (P1-)Verwendung nicht vorkommen
 * (geprüft im Build-Export scripts/export-config.ts).
 */
export const Benchmarks: CollectionConfig = {
  slug: 'benchmarks',
  labels: { singular: 'Benchmark', plural: 'Benchmarks' },
  admin: { useAsTitle: 'key', group: 'Berechnung' },
  fields: [
    { name: 'key', type: 'text', required: true, unique: true },
    { name: 'min', type: 'number', required: true },
    {
      name: 'max',
      type: 'number',
      required: true,
      validate: (val: unknown, { siblingData }: { siblingData: { min?: unknown } }) =>
        validateSpanne(siblingData?.min, val),
    },
    { name: 'unit', type: 'text', required: true },
    { name: 'source', type: 'text', required: true },
    {
      name: 'isPlaceholder',
      type: 'checkbox',
      label: 'Platzhalter? (sperrt öffentliche Nutzung, G2)',
      defaultValue: true,
    },
    { name: 'lastVerifiedAt', type: 'date' },
  ],
};
