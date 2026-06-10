import type { CollectionConfig } from 'payload';

/**
 * Pages (PRD §20): Inhaltsseiten-Konfiguration (Meta/OG je Seite, §22 Qualität).
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Seite', plural: 'Seiten' },
  admin: { useAsTitle: 'title', group: 'Inhalte' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'metaDescription', type: 'textarea' },
    { name: 'ogTitle', type: 'text' },
    { name: 'ogImage', type: 'text' },
    { name: 'body', type: 'richText' },
    { name: 'active', type: 'checkbox', defaultValue: false },
  ],
};
