import type { CollectionConfig } from 'payload';

/**
 * Roles (PRD §2.3): die 5 PRD-Rollen. Gate: Rolle ohne End-Ausgang abgelehnt
 * (endAusgang ist Pflichtfeld). Makler nie Mandats-CTA; Steuerberater immer Partnerprogramm.
 */
export const Roles: CollectionConfig = {
  slug: 'roles',
  labels: { singular: 'Rolle', plural: 'Rollen' },
  admin: { useAsTitle: 'label', group: 'Routing' },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'label', type: 'text', label: 'UI-Auswahl (§10.2)', required: true },
    { name: 'sizeMetric', type: 'relationship', relationTo: 'size-metrics', required: true },
    {
      name: 'endAusgang',
      type: 'select',
      required: true, // Gate: Rolle ohne End-Ausgang abgelehnt (§20)
      options: [
        { label: 'Gesprächsweg', value: 'gespraech' },
        { label: 'Partnerprogramm', value: 'partnerprogramm' },
        { label: 'Selbermacher (Motor A)', value: 'nur-loesungen' },
        { label: 'Vermarktungsprozess/Partner', value: 'vermarktungsprozess' },
        { label: 'Projektprozess', value: 'projektprozess' },
      ],
    },
    {
      name: 'allowMandatsCTA',
      type: 'checkbox',
      label: 'Mandats-CTA erlaubt? (Makler: nein, §2.3)',
      defaultValue: true,
    },
    {
      name: 'sizeIndependent',
      type: 'checkbox',
      label: 'Größenunabhängig? (Steuerberater immer Partnerprogramm)',
      defaultValue: false,
    },
    { name: 'order', type: 'number', label: 'Reihenfolge in der Rollen-Frage', defaultValue: 0 },
  ],
};
