import type { CollectionConfig } from 'payload';

/**
 * DesignVariants (PRD §22): Theme als CSS-Token-Sets
 * (Emerald-Premium / Trust-Blue / Neutral-Editorial). Entscheidung per Funnel-Daten.
 */
export const DesignVariants: CollectionConfig = {
  slug: 'design-variants',
  labels: { singular: 'Design-Variante', plural: 'Design-Varianten' },
  admin: { useAsTitle: 'name', group: 'Conversion' },
  fields: [
    { name: 'name', type: 'text', required: true, unique: true },
    {
      name: 'slug',
      type: 'select',
      required: true,
      options: [
        { label: 'Emerald-Premium', value: 'emerald-premium' },
        { label: 'Trust-Blue', value: 'trust-blue' },
        { label: 'Neutral-Editorial', value: 'neutral-editorial' },
      ],
    },
    {
      name: 'tokens',
      type: 'array',
      fields: [
        { name: 'key', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
  ],
};
