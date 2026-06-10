/**
 * Seed (PRD §8 + §21 Copy + §2.3 Rollen). Idempotent: löscht vorhandene Datensätze der
 * betroffenen Collections und legt P1 (Leithebel, echte Benchmarks n=31) sowie den
 * AP6.5-Vermarktungs-Content (P2: Neuvermietung + Verkauf) neu an.
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
  [
    'copy.founderMicro',
    '„Eigener Bestandshalter, eigenes Geld im Spiel. Diese Zahlen sind aus meinem eigenen Portfolio — genau so finde ich, was bei Ihnen liegen bleibt."',
  ],
  [
    'cta.exampleBridge',
    'Dieselbe Analyse machen wir mit Ihrer Liste — im Gespräch, vor Ihren Augen. Ihre Liste bleibt bei Ihnen.',
  ],
  [
    'cta.give.long',
    'Ihre Liste bleibt bei Ihnen. Sie sehen live, was ResidentFlow erkennt. Am Ende haben Sie eine konkrete Prioritätenliste — auch wenn wir nicht zusammenarbeiten.',
  ],
  ['cta.scarcity', 'Aktuell {n} Diagnose-Gespräche pro Monat.'],
  [
    'copy.uploadObjection',
    'Ich würde meine Mieterliste auch auf keiner Website hochladen. Deshalb verlangt ResidentFlow das nicht — Sie sehen die Analyse an meinem Bestand, und Ihre Liste schauen wir uns dort an, wo Sie jeden Schritt sehen können.',
  ],
  [
    'copy.consentTransfer',
    'Wenn Sie fortfahren, übermitteln wir Ihre Angaben aus dem Bestands-Check zusammen mit Ihrer E-Mail, um das Gespräch vorzubereiten / Ihr Ergebnis zu senden.',
  ],
  [
    'copy.pruefpaketName',
    'Mietanpassungs-Prüfpaket — funktioniert mit Claude, ChatGPT und anderen KI-Assistenten',
  ],
];

// 5 PRD-Rollen (§2.3): slug, label, sizeMetric-slug, endAusgang, allowMandatsCTA, sizeIndependent, frage, buckets
const ROLLEN: Array<{
  slug: string;
  label: string;
  metricSlug: string;
  frage: string;
  buckets: Array<[string, number, number]>; // [label, rank, unitsMid]
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
      ['1–10', 0, 5],
      ['11–29', 1, 20],
      ['30–49', 2, 40],
      ['50–99', 3, 75],
      ['100–249', 4, 175],
      ['250–600', 5, 425],
      ['600+', 5, 800],
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
      ['1–49', 0, 25],
      ['50–199', 2, 125],
      ['200–499', 3, 350],
      ['500–999', 4, 750],
      ['1000+', 5, 1500],
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
      ['1–5', 0, 3],
      ['6–15', 2, 10],
      ['16–30', 3, 23],
      ['31–75', 4, 53],
      ['75+', 5, 100],
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
      ['1–2', 0, 2],
      ['3–5', 2, 4],
      ['6–10', 3, 8],
      ['11–25', 4, 18],
      ['25+', 5, 35],
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
      ['1–5', 0, 3],
      ['6–20', 2, 13],
      ['21–50', 3, 35],
      ['51–100', 4, 75],
      ['100+', 5, 150],
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
    'assets',
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
        buckets: r.buckets.map(([label, rank, unitsMid]) => ({ label, rank, unitsMid })),
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

  // Benchmarks (ECHT, §13) aus eigenem Bestand n=31 — voller Beobachtungsbereich inkl. Staffel.
  const quelle = 'eigenes Portfolio (4 von 31 Verträgen mit fälliger Anpassung, Stand 2026-06)';
  const bShare = await payload.create({
    collection: 'benchmarks',
    data: {
      key: 'shareContractsUnreviewed24m',
      min: 0.1,
      max: 0.13,
      unit: 'anteil',
      source: quelle,
      isPlaceholder: false,
      lastVerifiedAt: new Date('2026-06-01').toISOString(),
    },
  });
  const bUplift = await payload.create({
    collection: 'benchmarks',
    data: {
      key: 'avgUpliftPerAffectedContract',
      min: 25,
      max: 95,
      unit: 'eur_pro_monat',
      source: quelle,
      isPlaceholder: false,
      lastVerifiedAt: new Date('2026-06-01').toISOString(),
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

  // Assets (Bausteine) für die P1-Lösung — approved, riskLevel gesetzt (live-fähig, §25)
  const promptAsset = await payload.create({
    collection: 'assets',
    data: {
      title: 'Mietvertragsauswertung — Prompt',
      slug: 'mietvertragsauswertung-prompt',
      assetType: 'prompt',
      summary: 'Strukturiert Vertragsdaten und findet Index-/Staffelmieten ohne jüngste Anpassung.',
      copyable: true,
      promptText:
        'Du bist ein Analyst für Wohnungsbestände. Analysiere die folgende Mietaufstellung (ohne Namen/Anschriften) und liste Verträge mit Index- oder Staffelmiete ohne Anpassung in den letzten 24 Monaten. Weise je Vertrag den Rechenweg als Spanne aus, niemals als Punktwert.',
      requiredInputs: 'Mietaufstellung als Tabelle: Einheit, Kaltmiete, Mietart, letzte Anpassung.',
      requiresPrivacyNote: true,
      riskLevel: 'niedrig',
      qualityStatus: 'approved',
    },
  });
  const guideAsset = await payload.create({
    collection: 'assets',
    data: {
      title: 'Indexmieten-Check — Anleitung',
      slug: 'indexmieten-check-anleitung',
      assetType: 'guide',
      summary: 'Schritt-für-Schritt: VPI-Delta seit letzter Anpassung sauber ermitteln.',
      bodyText:
        'Schritt 1: Spalten zuordnen (Mietart, letzte Anpassung). Schritt 2: VPI-Delta seit letzter Anpassung bestimmen. Schritt 3: Kappung und Sperrfrist prüfen. Schritt 4: Anpassung konservativ als Spanne ausweisen.',
      riskLevel: 'niedrig',
      qualityStatus: 'approved',
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
      assets: [promptAsset.id, guideAsset.id],
      primaryAsset: promptAsset.id,
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
      assets: [guideAsset.id],
      primaryAsset: guideAsset.id,
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
      answerFirst:
        'Ja — KI kann Index- und Staffelmieten in Ihrem Bestand zuverlässig erkennen und nicht gezogene Anpassungen sichtbar machen. Sie ersetzt keine Rechtsberatung: Der sichere Einsatz liegt in Erkennung, Priorisierung und Vorbereitung — die rechtssichere Umsetzung erfolgt geprüft.',
      roleFilters: [roleIdBySlug['buyAndHold'], roleIdBySlug['hausverwaltung']],
      valueCategory: ['ertrag'],
      solutions: [sol.id, sol2.id],
      defaultSolutionOrder: [sol.id, sol2.id],
      calculationModel: m1.id,
      priority: 'P1',
      active: true,
    },
  });

  // ── AP6.5 Vermarktungs-Content (P2, Motor A) → schaltet Neuvermietung + Verkauf gemeinsam
  //    live (n:m: geteilte Lösungen). Qualitativ (kein CalculationModel → nutzenAussage Pflicht).
  const exposeAsset = await payload.create({
    collection: 'assets',
    data: {
      title: 'Exposé optimieren — Prompt',
      slug: 'expose-optimieren-prompt',
      assetType: 'prompt',
      summary: 'Macht aus Eckdaten ein hochwertiges, ehrliches Exposé mit klarer Zielgruppe.',
      copyable: true,
      promptText:
        'Erstelle aus den folgenden Objektdaten ein hochwertiges Exposé. Keine erfundenen Eigenschaften, keine irreführenden Formulierungen. Struktur: Headline, Lage, Objekt, Zielgruppe, Highlights.',
      requiredInputs: 'Objektdaten: Lage, Fläche, Zustand, Besonderheiten.',
      requiresPrivacyNote: false,
      riskLevel: 'niedrig',
      qualityStatus: 'approved',
    },
  });
  const stagingWarnung = await payload.create({
    collection: 'assets',
    data: {
      title: 'Virtuelles Staging — Transparenz-Checkliste',
      slug: 'staging-transparenz-checkliste',
      assetType: 'checklist',
      summary: 'Stellt sicher, dass virtuelles Staging nicht täuscht (Kennzeichnungspflicht).',
      bodyText:
        'Virtuell möblierte Bilder immer als solche kennzeichnen. Keine baulichen Mängel kaschieren. Grundriss und Maße unverändert lassen. Im Exposé klar ausweisen: „digital möbliert".',
      riskLevel: 'mittel',
      qualityStatus: 'approved',
    },
  });
  const exposeSol = await payload.create({
    collection: 'solutions',
    data: {
      title: 'Exposé optimieren',
      slug: 'expose-optimieren',
      shortDescription: 'Hochwertige, ehrliche Exposés, die die richtige Zielgruppe ansprechen.',
      valueCategory: 'ertrag',
      nutzenAussage: 'Mehr passende Anfragen, weniger Streuverlust.',
      assets: [exposeAsset.id],
      primaryAsset: exposeAsset.id,
      scaleBreakNote:
        'Einzeln machbar; über viele Objekte lohnt ein wiederholbarer Exposé-Prozess.',
      active: true,
    },
  });
  const stagingSol = await payload.create({
    collection: 'solutions',
    data: {
      title: 'Virtuelles Staging',
      slug: 'virtuelles-staging',
      shortDescription: 'Leere Räume ansprechend und ehrlich digital möblieren.',
      valueCategory: 'ertrag',
      nutzenAussage: 'Leere Wohnungen wirken bezugsfertig — fair gekennzeichnet.',
      assets: [stagingWarnung.id],
      primaryAsset: stagingWarnung.id,
      legalWarning: 'Virtuelles Staging muss als solches gekennzeichnet werden (nicht täuschen).',
      scaleBreakNote: 'Pro Objekt machbar; im Bestand lohnt ein standardisierter Staging-Workflow.',
      active: true,
    },
  });
  const grundrissSol = await payload.create({
    collection: 'solutions',
    data: {
      title: 'Grundriss visualisieren',
      slug: 'grundriss-visualisieren',
      shortDescription: 'Aus Skizzen klare, ansprechende Grundrisse erstellen.',
      valueCategory: 'ertrag',
      nutzenAussage: 'Bessere Vorstellbarkeit senkt Rückfragen und Besichtigungsabbrüche.',
      assets: [exposeAsset.id],
      primaryAsset: exposeAsset.id,
      scaleBreakNote: 'Einzeln machbar; standardisiert über viele Objekte deutlich schneller.',
      active: true,
    },
  });
  const vermarktung = [exposeSol.id, stagingSol.id, grundrissSol.id];

  await payload.create({
    collection: 'problems',
    data: {
      title: 'Neuvermietung dauert zu lange',
      slug: 'neuvermietung-dauert-zu-lange',
      userFacingDescription: 'Wohnungen stehen länger leer als nötig.',
      roleFilters: [roleIdBySlug['buyAndHold'], roleIdBySlug['hausverwaltung']],
      valueCategory: ['ertrag'],
      solutions: vermarktung,
      defaultSolutionOrder: vermarktung,
      priority: 'P2',
      active: true,
    },
  });
  await payload.create({
    collection: 'problems',
    data: {
      title: 'Verkauf dauert zu lange',
      slug: 'verkauf-dauert-zu-lange',
      userFacingDescription: 'Objekte vermarkten sich online nicht hochwertig genug.',
      roleFilters: [roleIdBySlug['makler']],
      valueCategory: ['ertrag'],
      solutions: vermarktung,
      defaultSolutionOrder: vermarktung,
      priority: 'P2',
      active: true,
    },
  });

  // ProofFindings (ECHT, eigenes Portfolio n=31, alle Maßnahmen umgesetzt → realisiert).
  // Freigegeben (publicApproved). Mit dem 3. Finding ist G1 erfüllt → ProofStrip an.
  await payload.create({
    collection: 'proof-findings',
    data: {
      date: new Date('2026-06-01').toISOString(),
      source: 'eigenes Portfolio (n=31)',
      category: 'ertrag',
      title: 'Indexmieten nicht angepasst — 3 Verträge nachgezogen',
      affectedCount: 3,
      baseCount: 31,
      realizedValue: 1104, // (35+32+25) €/Monat × 12
      calculationNote: '3 Verträge × 25–35 €/Monat × 12 = 1.104 €/Jahr, umgesetzt.',
      status: 'realisiert',
      publicApproved: true,
    },
  });
  await payload.create({
    collection: 'proof-findings',
    data: {
      date: new Date('2026-06-01').toISOString(),
      source: 'eigenes Portfolio (n=31)',
      category: 'risiko',
      title: 'Ausgelaufene Mietstaffel — Erhöhung umgesetzt',
      affectedCount: 1,
      baseCount: 31,
      realizedValue: 1140, // 95 €/Monat × 12
      calculationNote: '1 Vertrag × 95 €/Monat × 12 = 1.140 €/Jahr, umgesetzt.',
      status: 'realisiert',
      publicApproved: true,
    },
  });
  await payload.create({
    collection: 'proof-findings',
    data: {
      date: new Date('2026-06-01').toISOString(),
      source: 'eigenes Portfolio (n=31)',
      category: 'effizienz',
      title: 'Verwaltungszeit um 23,5 Std/Monat reduziert',
      affectedCount: 31,
      baseCount: 31,
      calculationNote:
        'Manueller Verwaltungsaufwand strukturiert/automatisiert: −23,5 Std/Monat, umgesetzt.',
      status: 'realisiert',
      publicApproved: true,
    },
  });

  // CTARule (§14.3): HighIntent-Gesprächs-CTA ab sizeScore 3, alle Rollen
  await payload.create({
    collection: 'cta-rules',
    data: {
      name: 'highintent-gespraech',
      minSizeScore: 3,
      allowRisiko: false,
      primaryLabel: 'Ihren Bestand gemeinsam ansehen',
      sublineKey: 'cta.give.short',
      destination: 'gespraech',
      priority: 10,
      active: true,
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
      proofBandEnabled: true, // G1 erfüllt (3 freigegebene Findings, ≥1 realisiert)
    },
  });

  console.log(
    'SEED OK — echte Benchmarks (n=31), 3 realisierte Findings (ProofStrip an), Vermarktungs-Content.',
  );
  process.exit(0);
}

main().catch((e) => {
  console.error('SEED FAIL', e);
  process.exit(1);
});
