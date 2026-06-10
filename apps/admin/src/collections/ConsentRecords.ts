import type { CollectionConfig } from 'payload';

/**
 * ConsentRecords (PRD §17.3): dokumentierte Einwilligungen mit Textversion.
 */
export const ConsentRecords: CollectionConfig = {
  slug: 'consent-records',
  labels: { singular: 'Consent', plural: 'Consents' },
  admin: { useAsTitle: 'type', group: 'Leads' },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: ['pdf', 'newsletter', 'contact', 'calendar'].map((v) => ({ label: v, value: v })),
    },
    { name: 'accepted', type: 'checkbox', required: true, defaultValue: false },
    { name: 'timestamp', type: 'date', required: true },
    { name: 'textVersion', type: 'text', required: true },
    { name: 'source', type: 'text' },
    { name: 'lead', type: 'relationship', relationTo: 'leads' },
  ],
};
