/**
 * Classroom-Content-Import (PRD §20 Datenmodell · §24.2 „kuratierter Asset-Import", Phase 2).
 *
 * Liest die sanitisierte Extraktion (`seed-data/skool-content.json`, erzeugt von
 * `scripts/skool-extract.ts`) und legt sie als **Assets · CompositeAssets · Solutions**
 * im Payload-Datenmodell an. Bewusst konservativ gemäß Qualitäts-Gates (§25):
 *
 *   • Assets  → qualityStatus='draft', riskLevel NICHT gesetzt ⇒ NIE live/öffentlich
 *               (Export-Gate filtert sie heraus). Prompts: requiresPrivacyNote=true
 *               (Pflicht-Datenschutzhinweis), copyable=true.
 *   • Solutions → active=false ⇒ nie exportiert; nutzenAussage + scaleBreakNote gesetzt
 *               (Schema-Gates erfüllt), damit der Datensatz speicherbar bleibt.
 *   • Kein skool.com-Link in den Inhalten (G7 — bereits im Extrakt entfernt; hier zusätzlich
 *               als Assertion geprüft). Videos liegen als separate (YouTube-)URL vor.
 *
 * Idempotent: löscht ausschließlich frühere Import-Datensätze (slug-Präfix `ci-`),
 * der handgepflegte Seed (§8) bleibt unberührt. Deaktivieren-ohne-Löschen-Prinzip (§20).
 *
 * Lauf:  tsx src/import-skool.ts   (in apps/admin, benötigt Postgres-Verbindung)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPayload } from 'payload';
import config from '../payload.config';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.resolve(dirname, 'seed-data/skool-content.json');
const PREFIX = 'ci-'; // classroom-import — Namensraum, trennt Import von Seed

type Lesson = {
  title: string;
  section: string | null;
  markdown: string;
  videoUrl: string | null;
  resources: unknown[];
  assetTypeGuess: 'prompt' | 'video' | 'guide';
  looksLikePrompt: boolean;
};
type Course = {
  id: string;
  name: string;
  title: string;
  desc: string;
  numModules: number;
  lessons: Lesson[];
};
type Extract = { courses: Course[]; group: string };

/** Wertkategorie je Kurs (Startwert für das Review; Solutions sind inaktiv). */
const VALUE_CATEGORY: Record<string, 'ertrag' | 'effizienz' | 'risiko'> = {
  'Immobilien finden und schneller prüfen': 'ertrag',
  'Cashflow & Rendite steigern': 'ertrag',
  'Leerstand reduzieren und schneller vermieten': 'ertrag',
  'Weniger Aufwand, bessere Verwaltung': 'effizienz',
  'Immobilienprojekte erfolgreich entwickeln': 'ertrag',
  'KI professionell und Datenschutzkonform nutzen': 'risiko',
  'ResidentPrivacyFlow - KI aber sicher': 'risiko',
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60);
}

/** Erster aussagekräftiger Satz als Pflicht-`summary`. */
function deriveSummary(md: string, fallback: string): string {
  const line = md
    .split('\n')
    .map((l) =>
      l
        .replace(/^[-*#>\s]+/, '')
        .replace(/\*\*/g, '')
        .trim(),
    )
    .find((l) => l.length > 0);
  const text = (line || fallback || 'Aus Classroom-Import — im Review prüfen').trim();
  return text.length > 240 ? text.slice(0, 237) + '…' : text;
}

function assertNoSkool(s: string, where: string) {
  if (/skool\.com/i.test(s)) throw new Error(`G7-Verstoß: skool.com-Link in ${where}`);
}

async function clearPrefixed(payload: any, slug: string) {
  const all = await payload.find({ collection: slug, limit: 2000, depth: 0 });
  for (const d of all.docs) {
    if (typeof d.slug === 'string' && d.slug.startsWith(PREFIX)) {
      await payload.delete({ collection: slug, id: d.id });
    }
  }
}

async function main() {
  const extract: Extract = JSON.parse(fs.readFileSync(DATA, 'utf-8'));
  const payload = await getPayload({ config });

  // Idempotenz: nur frühere Import-Datensätze entfernen (Seed bleibt).
  for (const s of ['solutions', 'composite-assets', 'assets']) await clearPrefixed(payload, s);

  let nAssets = 0;
  let nComposites = 0;
  let nSolutions = 0;
  const usedSlugs = new Set<string>();

  for (const course of extract.courses) {
    const courseAssetIds: number[] = [];
    // Sektion → Asset-IDs (für CompositeAssets je Sektion)
    const sections = new Map<string, number[]>();

    for (const lesson of course.lessons) {
      assertNoSkool(lesson.markdown, `Asset "${lesson.title}"`);
      if (lesson.videoUrl) assertNoSkool(lesson.videoUrl, `Video "${lesson.title}"`);

      let slug = `${PREFIX}${slugify(course.name)}-${slugify(lesson.title)}`;
      while (usedSlugs.has(slug)) slug += '-x';
      usedSlugs.add(slug);

      const isPrompt = lesson.assetTypeGuess === 'prompt';
      const summary = deriveSummary(lesson.markdown, course.desc);

      const asset = await payload.create({
        collection: 'assets',
        data: {
          title: lesson.title || '(ohne Titel)',
          slug,
          assetType: lesson.assetTypeGuess,
          summary,
          // Prompt: kopierbarer Text + Pflicht-Datenschutzhinweis (§11.1/§25).
          ...(isPrompt
            ? { promptText: lesson.markdown, copyable: true, requiresPrivacyNote: true }
            : { bodyText: lesson.markdown }),
          ...(lesson.videoUrl ? { videoUrl: lesson.videoUrl } : {}),
          source: `Classroom-Import: ${course.title}${lesson.section ? ' / ' + lesson.section : ''}`,
          accessLevel: 'gated',
          // riskLevel bewusst NICHT gesetzt + qualityStatus 'draft' ⇒ nicht live (§25).
          qualityStatus: 'draft',
        },
      });
      nAssets++;
      courseAssetIds.push(asset.id);
      const secKey = lesson.section || '__root';
      if (!sections.has(secKey)) sections.set(secKey, []);
      sections.get(secKey)!.push(asset.id);
    }

    // CompositeAssets je benannter Sektion (z. B. „Prompts Ankaufsprüfung").
    for (const [secKey, ids] of sections) {
      if (secKey === '__root' || ids.length === 0) continue;
      await payload.create({
        collection: 'composite-assets',
        data: {
          title: `${course.title} — ${secKey}`,
          slug: `${PREFIX}${slugify(course.name)}-${slugify(secKey)}`,
          summary: `Gebündelte Bausteine der Sektion „${secKey}" (Classroom-Import).`,
          parts: ids,
        },
      });
      nComposites++;
    }

    // Eine (inaktive) Solution je Kurs als Sammel-/Review-Einstieg.
    if (courseAssetIds.length > 0) {
      const valueCategory = VALUE_CATEGORY[course.title] || 'ertrag';
      await payload.create({
        collection: 'solutions',
        data: {
          title: course.title,
          slug: `${PREFIX}${slugify(course.name)}`,
          shortDescription: deriveSummary(course.desc, course.title),
          helpsWhen: `Themencluster aus dem Classroom: ${course.title}.`,
          valueCategory,
          // Qualitativ (kein CalculationModel) ⇒ nutzenAussage Pflicht (§6.1-Gate).
          nutzenAussage: course.desc || course.title,
          // scaleBreakNote ist Pflichtfeld jeder Lösung (§11/§20).
          scaleBreakNote:
            'Einzelne Bausteine sind sofort nutzbar; über den ganzen Bestand entsteht der ' +
            'Wert aus einem wiederholbaren Prozess — genau dort setzen wir im Gespräch an.',
          assets: courseAssetIds,
          primaryAsset: courseAssetIds[0],
          active: false, // nie live, bis kuratiert (§24.2 Phase 2)
        },
      });
      nSolutions++;
    }
  }

  console.log(
    `IMPORT OK — ${nAssets} Assets (draft), ${nComposites} CompositeAssets, ` +
      `${nSolutions} Solutions (inaktiv). Keine Skool-Links (G7), keine Live-Schaltung (§25).`,
  );
  process.exit(0);
}

main().catch((e) => {
  console.error('IMPORT FAIL', e);
  process.exit(1);
});
