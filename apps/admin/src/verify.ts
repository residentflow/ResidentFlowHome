/**
 * Headless Verifikation aller Schema-Gates (PRD §20/§25) über die Local API.
 * Bestätigt Schema-Push aller Collections und dass jedes Gate auslöst.
 * Lauf: `tsx src/verify.ts` in apps/admin (DATABASE_URI gesetzt).
 */
import { getPayload } from 'payload';
import config from '../payload.config';

async function mussFehlschlagen(name: string, fn: () => Promise<unknown>): Promise<void> {
  try {
    await fn();
  } catch {
    console.log(`OK  Gate greift: ${name}`);
    return;
  }
  throw new Error(`FEHLER: Gate "${name}" hat NICHT ausgelöst`);
}

async function main() {
  const payload = await getPayload({ config });
  console.log('OK  Schema-Push aller Collections erfolgreich');

  // Hilfsdaten
  const sm = await payload.create({
    collection: 'size-metrics',
    data: {
      name: 'Eigene Einheiten',
      slug: 'eigene-einheiten',
      frageWortlaut: 'Wie viele Einheiten umfasst Ihr eigener Bestand ungefähr?',
      buckets: [{ label: '1–10', rank: 1, unitsMid: 5 }],
    },
  });

  // Gate: Benchmark min<max
  await mussFehlschlagen('Benchmark min<max', () =>
    payload.create({
      collection: 'benchmarks',
      data: { key: 'g-bad', min: 5, max: 5, unit: 'x', source: 's' },
    }),
  );

  // Gate: Rolle ohne End-Ausgang
  await mussFehlschlagen('Rolle ohne endAusgang', () =>
    payload.create({
      collection: 'roles',
      // @ts-expect-error: endAusgang absichtlich weggelassen
      data: { slug: 'r1', label: 'Buy & Hold', sizeMetric: sm.id },
    }),
  );

  // Gate: Problem ohne Lösung
  await mussFehlschlagen('Problem ohne ≥1 Lösung', () =>
    payload.create({
      collection: 'problems',
      data: {
        title: 'Leeres Problem',
        slug: 'leer',
        userFacingDescription: 'x',
        priority: 'P1',
      },
    }),
  );

  // Gate: Lösung ohne scaleBreakNote (Pflichtfeld)
  await mussFehlschlagen('Lösung ohne scaleBreakNote', () =>
    payload.create({
      collection: 'solutions',
      // @ts-expect-error: scaleBreakNote absichtlich weggelassen
      data: { title: 'L', slug: 'l1', shortDescription: 'x', valueCategory: 'ertrag' },
    }),
  );

  // Gate: qualitative Lösung (ohne calculationModel) ohne nutzenAussage
  await mussFehlschlagen('Qualitative Lösung ohne nutzenAussage', () =>
    payload.create({
      collection: 'solutions',
      data: {
        title: 'Qual',
        slug: 'qual',
        shortDescription: 'x',
        valueCategory: 'effizienz',
        scaleBreakNote: 'note',
      },
    }),
  );

  // Gate: ProofFinding Spanne (valueMin<valueMax wenn gesetzt)
  await mussFehlschlagen('ProofFinding Spanne valueMin<valueMax', () =>
    payload.create({
      collection: 'proof-findings',
      data: {
        date: new Date().toISOString(),
        source: 's',
        category: 'ertrag',
        title: 'p',
        valueMin: 9000,
        valueMax: 9000,
        status: 'identifiziert',
      },
    }),
  );

  // Positiv: gültige Lösung mit allen Pflichtfeldern
  const sol = await payload.create({
    collection: 'solutions',
    data: {
      title: 'Indexmieten prüfen',
      slug: 'indexmieten-pruefen',
      shortDescription: 'Index- und Staffelmieten systematisch prüfen.',
      valueCategory: 'ertrag',
      nutzenAussage: 'Findet nicht gezogene Anpassungen.',
      scaleBreakNote: 'Für eine Handvoll Verträge manuell, im Bestand ein Prozess.',
    },
  });
  console.log('OK  gültige Lösung angelegt id=', sol.id);

  console.log('VERIFY PASS — alle Gates aktiv, alle Collections gepusht');
  process.exit(0);
}

main().catch((e) => {
  console.error('VERIFY FAIL', e);
  process.exit(1);
});
