import type { CollectionConfig } from 'payload';

/**
 * CalculationModels (PRD §13): M1–M4. Outputs als Spannen {min,max}, konservativ.
 * Risiko (M4) ohne €-Rechnung. benchmarkFactors referenzieren Benchmarks.
 */
export const CalculationModels: CollectionConfig = {
  slug: 'calculation-models',
  labels: { singular: 'Rechenmodell', plural: 'Rechenmodelle' },
  admin: { useAsTitle: 'name', group: 'Berechnung' },
  fields: [
    {
      name: 'modelId',
      type: 'text',
      required: true,
      unique: true,
      label: 'z. B. indexmieten-check',
    },
    { name: 'name', type: 'text', required: true },
    {
      name: 'valueCategory',
      type: 'select',
      required: true,
      options: [
        { label: 'Ertrag', value: 'ertrag' },
        { label: 'Effizienz', value: 'effizienz' },
        { label: 'Risiko (keine €-Rechnung)', value: 'risiko' },
      ],
    },
    {
      name: 'requiredInputs',
      type: 'array',
      fields: [{ name: 'key', type: 'text', required: true }],
    },
    {
      name: 'optionalInputs',
      type: 'array',
      fields: [{ name: 'key', type: 'text', required: true }],
    },
    { name: 'benchmarkFactors', type: 'relationship', relationTo: 'benchmarks', hasMany: true },
    {
      name: 'formula',
      type: 'select',
      required: true,
      label: 'Formel-Implementierung (Engine-Key)',
      options: [
        { label: 'M1 Indexmieten (Ertrag)', value: 'M1' },
        { label: 'M2 Verwaltungsaufwand (Effizienz)', value: 'M2' },
        { label: 'M3 Leerstand (Ertrag)', value: 'M3' },
        { label: 'M4 Fristen-Risiko (qualitativ)', value: 'M4' },
      ],
    },
    {
      name: 'explanationText',
      type: 'textarea',
      label: 'Rechenwegtext (sichtbar)',
      required: true,
    },
    { name: 'sourceNote', type: 'text', defaultValue: 'Benchmark aus unserem eigenen Portfolio' },
  ],
};
