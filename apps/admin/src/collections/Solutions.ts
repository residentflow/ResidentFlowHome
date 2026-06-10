import type { CollectionConfig } from 'payload';

/**
 * Solutions/Lösungen (PRD §20). Gates: scaleBreakNote ist PFLICHT (Lösung ohne abgelehnt);
 * qualitative Lösung ⇒ nutzenAussage Pflicht; Verlust-Rahmung nur bei Risiko.
 * P1-Lösung ohne CalculationModel wird im Export/Verifikation abgelehnt.
 */
export const Solutions: CollectionConfig = {
  slug: 'solutions',
  labels: { singular: 'Lösung', plural: 'Lösungen' },
  admin: { useAsTitle: 'title', group: 'Inhalte' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'shortDescription', type: 'textarea', required: true },
    { name: 'helpsWhen', type: 'textarea', label: 'helpsWhen (wann diese Lösung hilft)' },
    { name: 'relatedProblems', type: 'relationship', relationTo: 'problems', hasMany: true },
    { name: 'assets', type: 'relationship', relationTo: 'assets', hasMany: true },
    { name: 'primaryAsset', type: 'relationship', relationTo: 'assets' },
    { name: 'calculationModel', type: 'relationship', relationTo: 'calculation-models' },
    {
      name: 'valueCategory',
      type: 'select',
      required: true,
      options: [
        { label: 'Ertrag', value: 'ertrag' },
        { label: 'Effizienz', value: 'effizienz' },
        { label: 'Risiko', value: 'risiko' },
      ],
    },
    {
      name: 'nutzenAussage',
      type: 'textarea',
      label: 'Qualitative Nutzenaussage (Pflicht bei qualitativer Lösung)',
    },
    { name: 'scalabilityLevel', type: 'number', defaultValue: 1 },
    {
      name: 'scaleBreakNote',
      type: 'textarea',
      required: true, // Gate: Lösung ohne scaleBreakNote abgelehnt (§20/§25)
      label: 'ScaleBreak-Hinweis (PFLICHT, §11 Block 6/7)',
    },
    { name: 'urgencyTextKey', type: 'text' },
    { name: 'ctaRules', type: 'relationship', relationTo: 'cta-rules', hasMany: true },
    { name: 'privacyWarning', type: 'textarea' },
    { name: 'legalWarning', type: 'textarea' },
    { name: 'active', type: 'checkbox', defaultValue: false },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data;
        // Verlust-Rahmung nur bei Risiko: legalWarning-Verlustsprache hier nicht erzwungen,
        // aber qualitative Lösung (ohne calculationModel) verlangt nutzenAussage.
        const istQualitativ = !data.calculationModel;
        if (istQualitativ && !data.nutzenAussage) {
          throw new Error(
            'Qualitative Lösung (ohne Rechenmodell) verlangt eine nutzenAussage (§6.1).',
          );
        }
        return data;
      },
    ],
  },
};
