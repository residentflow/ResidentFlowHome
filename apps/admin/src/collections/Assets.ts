import type { CollectionConfig } from 'payload';

/**
 * Assets/Bausteine (PRD §20). Gate: Asset live nur mit qualityStatus∈{reviewed,approved}
 * UND gesetztem riskLevel (im Export geprüft). Prompt-Assets brauchen Datenschutzhinweis.
 * "Skill" ist extern verboten — intern heißt es Asset/Baustein.
 */
export const Assets: CollectionConfig = {
  slug: 'assets',
  labels: { singular: 'Asset', plural: 'Assets' },
  admin: { useAsTitle: 'title', group: 'Inhalte' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    {
      name: 'assetType',
      type: 'select',
      required: true,
      options: [
        'prompt',
        'video',
        'guide',
        'checklist',
        'image',
        'example',
        'warning',
        'template',
        'composite',
      ].map((v) => ({ label: v, value: v })),
    },
    { name: 'summary', type: 'textarea', required: true },
    { name: 'contentBlocks', type: 'richText' },
    // Einfache Textfelder für den Export ins check.config.json (AssetRenderer §11.1):
    { name: 'promptText', type: 'textarea', label: 'Prompt-Text (assetType=prompt)' },
    { name: 'requiredInputs', type: 'textarea', label: 'Benötigte Eingaben (Prompt)' },
    { name: 'bodyText', type: 'textarea', label: 'Inhalt (guide/checklist/example/warning)' },
    { name: 'videoUrl', type: 'text', label: 'Video-URL (assetType=video)' },
    { name: 'childAssets', type: 'relationship', relationTo: 'assets', hasMany: true },
    { name: 'copyable', type: 'checkbox', defaultValue: false },
    { name: 'source', type: 'text', label: 'Quelle/Provenienz' },
    {
      name: 'accessLevel',
      type: 'select',
      defaultValue: 'public',
      options: [
        { label: 'öffentlich', value: 'public' },
        { label: 'gated', value: 'gated' },
      ],
    },
    {
      name: 'riskLevel',
      type: 'select',
      // Pflicht für Live (Export-Gate). Im CMS zunächst optional, damit Entwürfe möglich sind.
      options: [
        { label: 'niedrig', value: 'niedrig' },
        { label: 'mittel', value: 'mittel' },
        { label: 'hoch', value: 'hoch' },
      ],
    },
    {
      name: 'qualityStatus',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'draft', value: 'draft' },
        { label: 'reviewed', value: 'reviewed' },
        { label: 'approved', value: 'approved' },
      ],
    },
    { name: 'requiresLegalReview', type: 'checkbox', defaultValue: false },
    { name: 'requiresPrivacyNote', type: 'checkbox', defaultValue: false },
    { name: 'lastReviewedAt', type: 'date' },
  ],
};
