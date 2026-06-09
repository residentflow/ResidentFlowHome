import type { CollectionConfig } from 'payload';

/**
 * CopyKeys (PRD §21): versionierte Copy-Bibliothek. Alle lasttragenden Strings als Keys,
 * solo-pflegbar (§3.9). Frontend bündelt sie in check.config.json.
 */
export const CopyKeys: CollectionConfig = {
  slug: 'copy-keys',
  labels: { singular: 'Copy-Key', plural: 'Copy-Keys' },
  admin: { useAsTitle: 'key', group: 'Inhalte' },
  fields: [
    { name: 'key', type: 'text', required: true, unique: true, label: 'z. B. copy.h1.A' },
    { name: 'value', type: 'textarea', required: true },
    { name: 'version', type: 'number', defaultValue: 1 },
    { name: 'note', type: 'text' },
  ],
};
