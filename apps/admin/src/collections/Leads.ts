import type { CollectionConfig } from 'payload';

/**
 * Leads (PRD §17.3): Lead-Kontext-Speicher. Entsteht NUR bei bewusster Übertragung
 * (Termin/PDF/Opt-in) mit Consent. header-direct erzeugt Lead ohne Check-Kontext (§14.6).
 * Schreibpfad: Payload-Custom-Endpoints (AP5), nie Direkt-DB-Write.
 */
export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'Lead', plural: 'Leads' },
  admin: {
    useAsTitle: 'email',
    group: 'Leads',
    defaultColumns: ['email', 'role', 'sizeBucket', 'selectedProblem', 'source', 'leadStatus'],
  },
  fields: [
    { name: 'email', type: 'email', required: true },
    { name: 'firstName', type: 'text' },
    { name: 'lastName', type: 'text' },
    { name: 'company', type: 'text' },
    { name: 'phone', type: 'text' },
    { name: 'source', type: 'text', required: true },
    { name: 'utmSource', type: 'text' },
    { name: 'utmCampaign', type: 'text' },
    { name: 'landingPage', type: 'text' },
    { name: 'role', type: 'text' },
    { name: 'sizeBucket', type: 'text' },
    { name: 'relevantUnits', type: 'number' },
    { name: 'salesPerYear', type: 'number' },
    { name: 'projectsPerYear', type: 'number' },
    { name: 'mandateCount', type: 'number' },
    { name: 'selectedProblem', type: 'text' },
    { name: 'displayedSolutions', type: 'json' },
    { name: 'openedSolutions', type: 'json' },
    { name: 'copiedAssets', type: 'json' },
    { name: 'shownValueRanges', type: 'json' },
    { name: 'relevanceScore', type: 'number' },
    { name: 'leadScore', type: 'number' },
    { name: 'diySignal', type: 'checkbox', defaultValue: false },
    { name: 'ctaClicked', type: 'text' },
    { name: 'calendarBookingId', type: 'text' },
    { name: 'consentRecords', type: 'relationship', relationTo: 'consent-records', hasMany: true },
    {
      name: 'leadStatus',
      type: 'select',
      defaultValue: 'neu',
      options: ['neu', 'kontaktiert', 'gespraech', 'assessment', 'partnerschaft', 'kalt'].map(
        (v) => ({
          label: v,
          value: v,
        }),
      ),
    },
    { name: 'notes', type: 'textarea' },
    {
      name: 'gespraechseinstieg',
      type: 'textarea',
      label: 'Automatischer Gesprächseinstieg (§17.5, generiert)',
      admin: { readOnly: true },
    },
  ],
};
