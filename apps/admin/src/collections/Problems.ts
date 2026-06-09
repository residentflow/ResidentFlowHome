import type { CollectionConfig } from 'payload';

/**
 * Problems (PRD §20). Gate: Problem ohne ≥1 Lösung abgelehnt (Schema-Gate).
 * Live-Objekt-Gate (≥2 Lösungen) wird im Export gefiltert. priority steuert P1/P2/P3.
 */
export const Problems: CollectionConfig = {
  slug: 'problems',
  labels: { singular: 'Problem', plural: 'Probleme' },
  admin: { useAsTitle: 'title', group: 'Inhalte' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    {
      name: 'userFacingDescription',
      type: 'textarea',
      required: true,
      label: 'Alltagssprache (§11.1)',
    },
    { name: 'roleFilters', type: 'relationship', relationTo: 'roles', hasMany: true },
    { name: 'sizeMetricFilters', type: 'relationship', relationTo: 'size-metrics', hasMany: true },
    {
      name: 'valueCategory',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Ertrag', value: 'ertrag' },
        { label: 'Effizienz', value: 'effizienz' },
        { label: 'Risiko', value: 'risiko' },
      ],
    },
    {
      name: 'solutions',
      type: 'relationship',
      relationTo: 'solutions',
      hasMany: true,
      required: true, // Gate: Problem ohne ≥1 Lösung abgelehnt
    },
    { name: 'defaultSolutionOrder', type: 'relationship', relationTo: 'solutions', hasMany: true },
    { name: 'calculationModel', type: 'relationship', relationTo: 'calculation-models' },
    {
      name: 'priority',
      type: 'select',
      required: true,
      defaultValue: 'P2',
      options: [
        { label: 'P1 (HighIntent-Pfad, Launch-Gate G3)', value: 'P1' },
        { label: 'P2 (Vermarktung/Self-Service)', value: 'P2' },
        { label: 'P3 (Ankauf/Projekt)', value: 'P3' },
      ],
    },
    { name: 'active', type: 'checkbox', defaultValue: false },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data;
        const sols = (data.solutions as unknown[]) || [];
        if (sols.length < 1) {
          throw new Error('Kein Problem ohne mindestens eine Lösung (§20/§25).');
        }
        return data;
      },
    ],
  },
};
