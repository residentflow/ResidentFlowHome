import type { CollectionConfig } from 'payload';

/**
 * CompositeAssets (PRD §8/§20): bündeln mehrere Assets (z. B. "Exposé-GEM anlegen"
 * = Guide + Prompt + Testfall). Assets werden referenziert, nie kopiert (n:m:x).
 */
export const CompositeAssets: CollectionConfig = {
  slug: 'composite-assets',
  labels: { singular: 'Composite-Asset', plural: 'Composite-Assets' },
  admin: { useAsTitle: 'title', group: 'Inhalte' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'summary', type: 'textarea' },
    {
      name: 'parts',
      type: 'relationship',
      relationTo: 'assets',
      hasMany: true,
      required: true,
    },
  ],
};
