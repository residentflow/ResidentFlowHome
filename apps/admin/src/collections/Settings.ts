import type { CollectionConfig } from 'payload';

/**
 * Settings (PRD §20): globale CRO-/Routing-Konfiguration. Solo-pflegbar (§3.9).
 * thresholdHigh je Rolle, scoreWeights, Knappheit (scarcityTrue), Feature-Flags.
 * Als Singleton geführt (max. ein Datensatz, in der UI nicht löschbar).
 */
export const Settings: CollectionConfig = {
  slug: 'settings',
  labels: { singular: 'Einstellungen', plural: 'Einstellungen' },
  admin: { useAsTitle: 'label', group: 'Konfiguration' },
  fields: [
    { name: 'label', type: 'text', defaultValue: 'Globale Einstellungen', required: true },
    {
      name: 'thresholdHigh',
      type: 'group',
      label: 'HighIntent-Schwellen je Rolle (sizeScore ≥)',
      fields: [
        { name: 'buyAndHold', type: 'number', defaultValue: 3, required: true },
        { name: 'hausverwaltung', type: 'number', defaultValue: 3, required: true },
        { name: 'makler', type: 'number', defaultValue: 3, required: true },
        { name: 'projektentwickler', type: 'number', defaultValue: 3, required: true },
        // Steuerberater: größenunabhängig → immer Partnerprogramm (§2.3)
      ],
    },
    {
      name: 'scoreWeights',
      type: 'group',
      label: 'Score-Gewichte (§10.3)',
      fields: [
        { name: 'w1Size', type: 'number', defaultValue: 1, required: true },
        { name: 'w2Value', type: 'number', defaultValue: 1, required: true },
        { name: 'w3RoleFit', type: 'number', defaultValue: 1, required: true },
      ],
    },
    {
      name: 'monthlySlots',
      type: 'number',
      label: 'Diagnose-Gespräche pro Monat',
      defaultValue: 0,
    },
    {
      name: 'scarcityTrue',
      type: 'checkbox',
      label: 'Knappheit echt? (cta.scarcity nur dann gerendert, §14.2)',
      defaultValue: false,
    },
    { name: 'privacyflowReady', type: 'checkbox', defaultValue: false },
    {
      name: 'proofBandEnabled',
      type: 'checkbox',
      label: 'ProofStrip aktiv (G1)',
      defaultValue: false,
    },
    { name: 'calComUrl', type: 'text' },
    { name: 'partnerprogrammLink', type: 'text' },
    {
      name: 'stundensatzDefault',
      type: 'group',
      label: 'Stundensatz-Default (€) für M2 (§13)',
      fields: [
        { name: 'min', type: 'number', defaultValue: 60 },
        { name: 'max', type: 'number', defaultValue: 90 },
      ],
    },
    { name: 'brevoListId', type: 'number' },
  ],
};
