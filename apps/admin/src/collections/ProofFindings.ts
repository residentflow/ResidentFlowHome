import type { CollectionConfig } from 'payload';
import { validateSpanne } from '../gates';

/**
 * ProofFindings (PRD §20): dokumentierte echte Befunde aus Stefans Bestand.
 * Gate G1 (Build-Export): ≥3 publicApproved, davon ≥1 'umsetzung-gestartet'.
 * Spanne valueMin<valueMax erzwungen. Findings nur echt (§3.4).
 */
export const ProofFindings: CollectionConfig = {
  slug: 'proof-findings',
  labels: { singular: 'ProofFinding', plural: 'ProofFindings' },
  admin: { useAsTitle: 'title', group: 'Beweis' },
  fields: [
    { name: 'date', type: 'date', required: true },
    { name: 'source', type: 'text', required: true },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Ertrag', value: 'ertrag' },
        { label: 'Fristen-Radar (Risiko)', value: 'risiko' },
        { label: 'Datenlücken (Struktur)', value: 'struktur' },
        { label: 'Effizienz', value: 'effizienz' },
      ],
    },
    { name: 'title', type: 'text', required: true },
    { name: 'affectedCount', type: 'number' },
    { name: 'baseCount', type: 'number' },
    { name: 'valueMin', type: 'number' },
    {
      name: 'valueMax',
      type: 'number',
      validate: (val: unknown, { siblingData }: { siblingData: { valueMin?: unknown } }) => {
        // Spanne nur prüfen, wenn beide Werte gesetzt sind (Risiko/Struktur dürfen ohne € sein)
        if (siblingData?.valueMin == null && val == null) return true;
        return validateSpanne(siblingData?.valueMin, val);
      },
    },
    { name: 'calculationNote', type: 'textarea' },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'identifiziert',
      options: [
        { label: 'identifiziert', value: 'identifiziert' },
        { label: 'umsetzung-gestartet', value: 'umsetzung-gestartet' },
        { label: 'realisiert', value: 'realisiert' },
      ],
    },
    { name: 'realizedValue', type: 'number' },
    { name: 'evidenceRef', type: 'text' },
    {
      name: 'publicApproved',
      type: 'checkbox',
      label: 'Öffentlich freigegeben (Stefan)? (G1)',
      defaultValue: false,
    },
  ],
};
