import type { CollectionConfig } from 'payload';

/**
 * SizeMetrics (PRD §2.3): adaptives Größenmaß je Rolle mit Buckets und Rang (sizeScore 0..5).
 */
export const SizeMetrics: CollectionConfig = {
  slug: 'size-metrics',
  labels: { singular: 'Größenmaß', plural: 'Größenmaße' },
  admin: { useAsTitle: 'name', group: 'Routing' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'frageWortlaut', type: 'text', label: 'Adaptive Größenfrage (§10.2)', required: true },
    {
      name: 'buckets',
      type: 'array',
      required: true,
      labels: { singular: 'Bucket', plural: 'Buckets' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'rank', type: 'number', label: 'Rang (sizeScore 0..5)', required: true },
        { name: 'unitsMid', type: 'number', label: 'Repräsentativer Mittelwert (Einheiten)' },
      ],
    },
  ],
};
