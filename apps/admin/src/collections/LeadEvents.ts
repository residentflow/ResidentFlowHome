import type { CollectionConfig } from 'payload';

/**
 * LeadEvents (PRD §20): Timeline-Ereignisse je Lead (NICHT anonyme Besucherdaten —
 * die bleiben in Plausible). Nur nach erfolgter Übertragung (Termin/Opt-in).
 */
export const LeadEvents: CollectionConfig = {
  slug: 'lead-events',
  labels: { singular: 'Lead-Event', plural: 'Lead-Events' },
  admin: { useAsTitle: 'type', group: 'Leads' },
  fields: [
    { name: 'lead', type: 'relationship', relationTo: 'leads', required: true },
    { name: 'type', type: 'text', required: true },
    { name: 'timestamp', type: 'date', required: true },
    { name: 'data', type: 'json' },
  ],
};
