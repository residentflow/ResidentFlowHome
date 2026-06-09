import type { CollectionConfig } from 'payload';

/**
 * Experiments (PRD §19.3): clientseitig hash-stabil zugeteilt, ins check.config.json
 * gebündelt (ohne Deploy testbar). Erfolgsmetrik immer booking_confirmed.
 */
export const Experiments: CollectionConfig = {
  slug: 'experiments',
  labels: { singular: 'Experiment', plural: 'Experimente' },
  admin: { useAsTitle: 'name', group: 'Conversion' },
  fields: [
    { name: 'name', type: 'text', required: true, unique: true },
    { name: 'hypothesis', type: 'textarea' },
    {
      name: 'variants',
      type: 'array',
      required: true,
      fields: [
        { name: 'id', type: 'text', required: true },
        { name: 'weight', type: 'number', defaultValue: 1 },
      ],
    },
    { name: 'trafficAllocation', type: 'number', defaultValue: 1, label: 'Anteil 0..1' },
    { name: 'targetAudience', type: 'text' },
    {
      name: 'successMetric',
      type: 'select',
      defaultValue: 'booking_confirmed',
      options: [{ label: 'booking_confirmed', value: 'booking_confirmed' }],
    },
    { name: 'startDate', type: 'date' },
    { name: 'endDate', type: 'date' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: ['draft', 'running', 'paused', 'done'].map((v) => ({ label: v, value: v })),
    },
  ],
};
