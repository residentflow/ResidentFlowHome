/**
 * Seed (PRD §8 Priorität 1 + §21 Copy + §2.3 Rollen). Idempotent: löscht vorhandene
 * Datensätze der betroffenen Collections und legt den P1-Grundbestand neu an.
 * Benchmarks bewusst isPlaceholder=true → Build-Export sperrt L2 bis echte Werte da sind.
 * Lauf: `tsx src/seed.ts` in apps/admin.
 */
import { getPayload } from 'payload';
import config from '../payload.config';

const COPY: Array<[string, string]> = [
  ['copy.eyebrow', 'ANONYME BESTANDSDIAGNOSE'],
  ['copy.h1.A', 'Wo bleiben in Ihrem Bestand Ertrag, Zeit und Kontrolle liegen?'],
  ['copy.h1.B', 'Wo verliert Ihr Bestand Geld, ohne dass Sie es sehen?'],
  ['copy.h1.C', 'Finden Sie die Lösungen, die in Ihrem Bestand wirklich Wirkung haben.'],
  ['copy.trustline', '3 Minuten · keine Registrierung · keine Datenübertragung · kein Upload'],
  ['copy.checkIntro', 'Was trifft auf Sie zu? Ergebnis sofort — ohne Registrierung, ohne Upload.'],
  [
    'copy.systemSatz',
    'Gefunden ist nicht realisiert. ResidentFlow zeigt nicht nur Potenziale, sondern priorisiert den nächsten umsetzbaren Schritt.',
  ],
  ['cta.header', 'Ihren Bestand gemeinsam ansehen'],
  ['cta.highIntent', 'Ihren Bestand gemeinsam ansehen'],
  [
    'cta.give.short',
    '30 Minuten. Wir prüfen Ihre Liste vor Ihren Augen und priorisieren die 3 größten Bestandspotenziale. Kein Upload. Kein Pitch.',
  ],
  ['copy.chipsMicro', 'Für eine konservative €-Einschätzung — bleibt in Ihrem Browser.'],
];

// 5 PRD-Rollen (§2.3): slug, label, sizeMetric-slug, endAusgang, allowMandatsCTA, sizeIndependent, frage, buckets
const ROLLEN: Array<{
  slug: string;
  label: string;
  metricSlug: string;
  frage: string;
  buckets: Array<[string, number]>;
  endAusgang: string;
  allowMandatsCTA: boolean;
  sizeIndependent: boolean;
}> = [
  {
    slug: 'buyAndHold',
    label: 'Buy & Hold / eigener Bestand',
    metricSlug: 'eigene-einheiten',
    frage: 'Wie viele Einheiten umfasst Ihr eigener Bestand ungefähr?',
    buckets: [
      ['1–10', 0],
      ['11–29', 1],
      ['30–49', 2],
      ['50–99', 3],
      ['100–249', 4],
      ['250–600', 5],
      ['600+', 5],
    ],
    endAusgang: 'gespraech',
    allowMandatsCTA: true,
    sizeIndependent: false,
  },
  {
    slug: 'hausverwaltung',
    label: 'Hausverwaltung',
    metricSlug: 'betreute-einheiten',
    frage: 'Wie viele Einheiten verwalten oder betreuen Sie ungefähr?',
    buckets: [
      ['1–49', 0],
      ['50–199', 2],
      ['200–499', 3],
      ['500–999', 4],
      ['1000+', 5],
    ],
    endAusgang: 'gespraech',
    allowMandatsCTA: true,
    sizeIndependent: false,
  },
  {
    slug: 'makler',
    label: 'Makler',
    metricSlug: 'vermarktungen-pro-jahr',
    frage: 'Wie viele Verkäufe oder Vermarktungen begleiten Sie ungefähr pro Jahr?',
    buckets: [
      ['1–5', 0],
      ['6–15', 2],
      ['16–30', 3],
      ['31–75', 4],
      ['75+', 5],
    ],
    endAusgang: 'vermarktungsprozess',
    allowMandatsCTA: false,
    sizeIndependent: false,
  },
  {
    slug: 'projektentwickler',
    label: 'Projektentwickler / Fix & Flip',
    metricSlug: 'projekte-pro-jahr',
    frage: 'Wie viele Projekte oder Vermarktungen bearbeiten Sie ungefähr pro Jahr?',
    buckets: [
      ['1–2', 0],
      ['3–5', 2],
      ['6–10', 3],
      ['11–25', 4],
      ['25+', 5],
    ],
    endAusgang: 'projektprozess',
    allowMandatsCTA: true,
    sizeIndependent: false,
  },
  {
    slug: 'steuerberater',
    label: 'Steuerberater',
    metricSlug: 'mandanten-immobilien',
    frage: 'Wie viele Mandanten mit relevantem Immobilienbestand betreuen Sie?',
    buckets: [
      ['1–5', 0],
      ['6–20', 2],
      ['21–50', 3],
      ['51–100', 4],
      ['100+', 5],
    ],
    endAusgang: 'partnerprogramm',
    allowMandatsCTA: false,
    sizeIndependent: true,
  },
];

async function clear(payload: any, slug: string) {
  const all = await payload.find({ collection: slug, limit: 1000, depth: 0 });
  for (const d of all.docs) await payload.delete({ collection: slug, id: d.id });
}

async function main() {
  const payload = await getPayload({ config });

  for (const s of [
    'copy-keys',
    'cta-rules',
    'problems',
    'solutions',
    'calculation-models',
    'benchmarks',
    'proof-findings',
    'roles',
    'size-metrics',
    'settings',
  ]) {
    await clear(payload, s);
  }

  // Copy-Keys
  for (const [key, value] of COPY) {
    await payload.create({ collection: 'copy-keys', data: { key, value } });
  }

  // Rollen + zugehörige SizeMetrics
  const roleIdBySlug: Record<string, number> = {};
  let order = 0;
  for (const r of ROLLEN) {
    const sm = await payload.create({
      collection: 'size-metrics',
      data: {
        name: r.label,
        slug: r.metricSlug,
        frageWortlaut: r.frage,
        buckets: r.buckets.map(([label, rank]) => ({ label, rank })),
      },
    });
    const role = await payload.create({
      collection: 'roles',
      data: {
        slug: r.slug,
        label: r.label,
        sizeMetric: sm.id,
        endAusgang: r.endAusgang,
        allowMandatsCTA: r.allowMandatsCTA,
        sizeIndependent: r.sizeIndependent,
        order: order++,
      },
    });
    roleIdBySlug[r.slug] = role.id;
  }

  // Benchmarks (PLATZHALTER, §13) — sperren L2 bis echte Werte geliefert sind
  const bShare = await payload.create({
    collection: 'benchmarks',
    data: {
      key: 'shareContractsUnreviewed24m',
      min: 0.2,
      max: 0.4,
      unit: 'anteil',
      source: 'PLATZHALTER eigenes Portfolio',
      isPlaceholder: true,
    },
  });
  const bUplift = await payload.create({
    collection: 'benchmarks',
    data: {
      key: 'avgUpliftPerAffectedContract',
      min: 40,
      max: 90,
      unit: 'eur_pro_monat',
      source: 'PLATZHALTER eigenes Portfolio',
      isPlaceholder: true,
    },
  });

  // CalculationModel M1
  const m1 = await payload.create({
    collection: 'calculation-models',
    data: {
      modelId: 'indexmieten-check',
      name: 'Index-/Staffelmieten (Ertrag)',
      valueCategory: 'ertrag',
      requiredInputs: [{ key: 'sizeBucket' }],
      optionalInputs: [{ key: 'contractCount' }, { key: 'lastReviewBucket' }],
      benchmarkFactors: [bShare.id, bUplift.id],
      formula: 'M1',
      explanationText:
        '{units} Einheiten × {share} % typischer Anteil ohne Anpassung × {uplift} €/Monat konservative Anpassung × 12 — Benchmark aus unserem eigenen Portfolio.',
    },
  });

  // P1-Lösung
  const sol = await payload.create({
    collection: 'solutions',
    data: {
      title: 'Index-/Staffelmieten & Vertragslogik prüfen',
      slug: 'indexmieten-staffelmieten-pruefen',
      shortDescription:
        'Index- und Staffelmieten systematisch prüfen, nicht gezogene Anpassungen finden.',
      helpsWhen: 'Wenn Mieten/Verträge nicht systematisch geprüft sind.',
      valueCategory: 'ertrag',
      calculationModel: m1.id,
      scaleBreakNote:
        'Diese Prüfung funktioniert für eine Handvoll Verträge. Bei größeren Beständen ist der Wert ein wiederholbarer Prozess: Erkennen, rechtssicher anschreiben, Fristen überwachen — über alle Gesellschaften.',
      active: true,
    },
  });

  // Zweite P1-Lösung (Objekt-Gate verlangt ≥2 aktive Lösungen je Live-Problem, §25)
  const sol2 = await payload.create({
    collection: 'solutions',
    data: {
      title: 'Mietspiegel-Begründung vorbereiten',
      slug: 'mietspiegel-begruendung',
      shortDescription:
        'Begründungen für Mietanpassungen nach Mietspiegel strukturiert vorbereiten.',
      helpsWhen: 'Wenn Anpassungen rechtssicher begründet werden müssen.',
      valueCategory: 'ertrag',
      nutzenAussage: 'Liefert nachvollziehbare, prüfbare Anpassungsbegründungen.',
      scaleBreakNote:
        'Einzeln machbar; über viele Verträge lohnt der wiederholbare Prozess mit Fristenüberwachung.',
      active: true,
    },
  });

  // P1-Problem (Leithebel) — mit zwei Lösungen verknüpft
  await payload.create({
    collection: 'problems',
    data: {
      title: 'Mieten/Indexmieten/Staffeln nicht systematisch geprüft',
      slug: 'mieten-indexmieten-pruefen',
      userFacingDescription:
        'Ihre Mieten wirken nicht ausgeschöpft und Vertragsdaten liegen verstreut.',
      roleFilters: [roleIdBySlug['buyAndHold'], roleIdBySlug['hausverwaltung']],
      valueCategory: ['ertrag'],
      solutions: [sol.id, sol2.id],
      defaultSolutionOrder: [sol.id, sol2.id],
      calculationModel: m1.id,
      priority: 'P1',
      active: true,
    },
  });

  // ProofFinding (Platzhalter, nicht freigegeben → ProofStrip bleibt aus, G1 blockiert L2)
  await payload.create({
    collection: 'proof-findings',
    data: {
      date: new Date().toISOString(),
      source: 'PLATZHALTER eigenes Portfolio',
      category: 'ertrag',
      title: 'Indexmiete nicht angepasst (> 24 Monate)',
      affectedCount: 0,
      baseCount: 0,
      status: 'identifiziert',
      publicApproved: false,
    },
  });

  // Settings (Singleton)
  await payload.create({
    collection: 'settings',
    data: {
      label: 'Globale Einstellungen',
      thresholdHigh: { buyAndHold: 3, hausverwaltung: 2, makler: 2, projektentwickler: 2 },
      scoreWeights: { w1Size: 1, w2Value: 1, w3RoleFit: 1 },
      monthlySlots: 0,
      scarcityTrue: false,
      proofBandEnabled: false,
    },
  });

  console.log('SEED OK — P1-Grundbestand angelegt (Benchmarks als Platzhalter, L2 gesperrt).');
  process.exit(0);
}

main().catch((e) => {
  console.error('SEED FAIL', e);
  process.exit(1);
});
