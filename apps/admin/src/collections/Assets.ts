import type { CollectionConfig } from 'payload';
import { validateAssetLiveGate } from '../gates';

/**
 * Assets/Bausteine (PRD §20). Gate: Asset live nur mit qualityStatus∈{reviewed,approved}
 * UND gesetztem riskLevel — hier als CMS-Validierung erzwungen (validateAssetLiveGate),
 * nicht erst im Build-Export. Prompt-Assets brauchen einen Datenschutzhinweis.
 * "Skill" ist extern verboten — intern heißt es Asset/Baustein.
 *
 * Kuratierungs-Workflow (alles im CMS): Importe kommen als `draft` ohne riskLevel an.
 * Der Kurator setzt je Asset riskLevel + (bei Prompts) Datenschutzhinweis, prüft den Typ
 * und hebt qualityStatus auf `reviewed`/`approved`. Erst dann exportiert der Build (§25).
 */
const TEXT_TYPES = ['guide', 'checklist', 'example', 'warning', 'template'];

export const Assets: CollectionConfig = {
  slug: 'assets',
  labels: { singular: 'Asset', plural: 'Assets' },
  admin: {
    useAsTitle: 'title',
    group: 'Inhalte',
    defaultColumns: ['title', 'assetType', 'qualityStatus', 'riskLevel', 'source'],
    listSearchableFields: ['title', 'slug', 'source', 'summary'],
  },
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
    // Einfache Textfelder für den Export ins check.config.json (AssetRenderer §11.1).
    // Bedingt sichtbar je assetType, damit die Kuratierung im CMS fokussiert bleibt.
    {
      name: 'promptText',
      type: 'textarea',
      label: 'Prompt-Text (kopierbar)',
      admin: {
        condition: (_, sib) => sib?.assetType === 'prompt',
        description: 'Nur der eigentliche Prompt — erklärendes Beiwerk gehört in „summary".',
      },
    },
    {
      name: 'requiredInputs',
      type: 'textarea',
      label: 'Benötigte Eingaben (Prompt)',
      admin: { condition: (_, sib) => sib?.assetType === 'prompt' },
    },
    {
      name: 'bodyText',
      type: 'textarea',
      label: 'Inhalt (guide/checklist/example/warning/template)',
      admin: { condition: (_, sib) => TEXT_TYPES.includes(sib?.assetType) },
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: 'Video-URL (separat gehostet, nie Skool)',
      admin: { condition: (_, sib) => sib?.assetType === 'video' },
    },
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
    // ── Review-/Freigabe-Felder (Sidebar): hier kuratiert der Mensch im CMS ──
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
      admin: {
        position: 'sidebar',
        description:
          'reviewed/approved schaltet öffentlich frei — nur möglich mit gesetztem riskLevel.',
      },
      // Live-Gate direkt im CMS (§25): kein reviewed/approved ohne riskLevel.
      validate: (val: unknown, { siblingData }: { siblingData: { riskLevel?: unknown } }) =>
        validateAssetLiveGate(val, siblingData?.riskLevel),
    },
    {
      name: 'riskLevel',
      type: 'select',
      // Pflicht für Live (vom qualityStatus-Gate erzwungen). Im Entwurf optional.
      options: [
        { label: 'niedrig', value: 'niedrig' },
        { label: 'mittel', value: 'mittel' },
        { label: 'hoch', value: 'hoch' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Pflicht vor Live-Schaltung. Risiko ⇒ Verlust-Rahmung, qualitativ (§20).',
      },
    },
    {
      name: 'requiresPrivacyNote',
      type: 'checkbox',
      defaultValue: false,
      label: 'Datenschutzhinweis nötig (Pflicht bei Prompts mit Nutzerdaten)',
      admin: {
        position: 'sidebar',
        description:
          'Prompts, die Bestands-/Mieterdaten verarbeiten, brauchen den Hinweis (§11.1).',
      },
    },
    {
      name: 'requiresLegalReview',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'lastReviewedAt',
      type: 'date',
      admin: { position: 'sidebar', description: 'Wird beim Heben auf reviewed/approved gesetzt.' },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (!data) return data;
        // Review-Datum automatisch stempeln, sobald live geschaltet wird (CMS-Komfort).
        const istLive = data.qualityStatus === 'reviewed' || data.qualityStatus === 'approved';
        if (istLive && !data.lastReviewedAt) data.lastReviewedAt = new Date().toISOString();
        return data;
      },
    ],
  },
};
