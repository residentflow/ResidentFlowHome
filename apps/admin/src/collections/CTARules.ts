import type { CollectionConfig } from 'payload';

/**
 * CTARules (PRD §14.3/§20): deklarative CTA-Trigger-Engine. CTA-Rendering ohne CTARule
 * ist verboten (§20) — die Engine im Frontend rendert nur, was hier definiert ist.
 */
export const CTARules: CollectionConfig = {
  slug: 'cta-rules',
  labels: { singular: 'CTA-Regel', plural: 'CTA-Regeln' },
  admin: { useAsTitle: 'name', group: 'Conversion' },
  fields: [
    { name: 'name', type: 'text', required: true, unique: true },
    { name: 'roleFilters', type: 'relationship', relationTo: 'roles', hasMany: true },
    { name: 'problemFilters', type: 'relationship', relationTo: 'problems', hasMany: true },
    { name: 'solutionFilters', type: 'relationship', relationTo: 'solutions', hasMany: true },
    { name: 'minSizeScore', type: 'number' },
    { name: 'maxSizeScore', type: 'number' },
    { name: 'minRelevanceScore', type: 'number' },
    { name: 'allowRisiko', type: 'checkbox', defaultValue: false },
    { name: 'primaryLabel', type: 'text', required: true },
    { name: 'sublineKey', type: 'text' },
    { name: 'secondaryLabel', type: 'text' },
    {
      name: 'destination',
      type: 'select',
      required: true,
      options: [
        { label: 'Gespräch (cal.com)', value: 'gespraech' },
        { label: 'Partnerprogramm', value: 'partnerprogramm' },
        { label: 'PDF', value: 'pdf' },
        { label: 'Lösung/Asset', value: 'loesung' },
      ],
    },
    { name: 'priority', type: 'number', defaultValue: 0 },
    { name: 'active', type: 'checkbox', defaultValue: true },
  ],
};
