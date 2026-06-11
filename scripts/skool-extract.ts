/**
 * Skool-Classroom-Extraktor (PRD §20 / §24.2 Phase-2-Import, §G7).
 *
 * Liest den öffentlichen Classroom (alle Kurse → Sektionen → Lektionen) über den
 * Next.js-Datenendpunkt von Skool aus, wandelt die TipTap-Inhalte in Markdown/Plaintext,
 * trennt Videos (separates Hosting) und ENTFERNT jeden skool.com-Link (G7 Domain-Gate:
 * kein Skool-/Lovable-Link im öffentlichen Pfad). Ergebnis ist eine sanitisierte
 * Zwischenrepräsentation, die der Import (`apps/admin/src/import-skool.ts`) als
 * Draft-Assets/CompositeAssets/Solutions ins Payload-Datenmodell überführt.
 *
 * Es werden KEINE Anmeldedaten verwendet — nur öffentlich (public:true) freigegebene Kurse.
 *
 * Lauf:  tsx scripts/skool-extract.ts
 * Quelle: https://www.skool.com/residentcashflow-6876/classroom
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const GROUP = process.env.SKOOL_GROUP || 'residentcashflow-6876';
const BASE = 'https://www.skool.com';
const UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
const OUT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../apps/admin/src/seed-data/skool-content.json',
);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Jeder Treffer wird protokolliert, damit der G7-Nachweis prüfbar ist. */
const strippedSkoolLinks: string[] = [];
const SKOOL_HOST_RE = /https?:\/\/(www\.)?skool\.com[^\s)\]"']*/gi;

async function getHtmlNextData(urlPath: string): Promise<any> {
  const res = await fetch(`${BASE}${urlPath}`, { headers: { 'User-Agent': UA } });
  const html = await res.text();
  const m = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  if (!m) throw new Error(`Kein __NEXT_DATA__ unter ${urlPath}`);
  return JSON.parse(m[1]);
}

async function getLessonData(buildId: string, courseName: string, leafId: string): Promise<any> {
  const url =
    `${BASE}/_next/data/${buildId}/${GROUP}/classroom/${courseName}.json` +
    `?md=${leafId}&group=${GROUP}&course=${courseName}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA, 'x-nextjs-data': '1' } });
  if (!res.ok) throw new Error(`Lektion ${leafId}: HTTP ${res.status}`);
  return res.json();
}

/** TipTap/ProseMirror-`desc` ("[v2]...") → Markdown. Skool-Links werden entfernt (G7). */
function tiptapToMarkdown(raw: string | undefined | null): string {
  if (!raw) return '';
  const json = raw.startsWith('[v2]') ? raw.slice(4) : raw;
  let doc: any;
  try {
    doc = JSON.parse(json);
  } catch {
    return sanitizeText(raw);
  }
  const nodes = Array.isArray(doc) ? doc : doc.content || [doc];
  return nodes
    .map(renderNode)
    .join('\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function renderInline(node: any): string {
  if (!node) return '';
  if (node.type === 'text') {
    let t: string = node.text || '';
    const marks: any[] = node.marks || [];
    const isLink = marks.find((m) => m.type === 'link');
    if (isLink) {
      const href: string = isLink.attrs?.href || '';
      if (/skool\.com/i.test(href)) {
        // G7: Skool-Link entfernen, nur Linktext behalten.
        strippedSkoolLinks.push(href);
      } else if (href) {
        t = `[${t}](${href})`;
      }
    }
    if (marks.find((m) => m.type === 'bold')) t = `**${t}**`;
    if (marks.find((m) => m.type === 'italic')) t = `*${t}*`;
    if (marks.find((m) => m.type === 'code')) t = `\`${t}\``;
    return t;
  }
  if (node.type === 'hardBreak') return '\n';
  return (node.content || []).map(renderInline).join('');
}

function renderNode(node: any): string {
  switch (node.type) {
    case 'heading': {
      const lvl = node.attrs?.level || 2;
      return '#'.repeat(Math.min(lvl, 6)) + ' ' + (node.content || []).map(renderInline).join('');
    }
    case 'paragraph':
      return (node.content || []).map(renderInline).join('');
    case 'bulletList':
    case 'unorderedList':
      return (node.content || [])
        .map((li: any) => '- ' + (li.content || []).map(renderNode).join(' ').trim())
        .join('\n');
    case 'orderedList':
      return (node.content || [])
        .map(
          (li: any, i: number) =>
            `${i + 1}. ` + (li.content || []).map(renderNode).join(' ').trim(),
        )
        .join('\n');
    case 'listItem':
      return (node.content || []).map(renderNode).join(' ');
    case 'codeBlock':
      return '```\n' + (node.content || []).map(renderInline).join('') + '\n```';
    case 'blockquote':
      return (node.content || []).map((c: any) => '> ' + renderNode(c)).join('\n');
    case 'horizontalRule':
      return '---';
    default:
      return (node.content || []).map(renderNode).join('');
  }
}

/** Letzte Sicherung: jeden noch verbliebenen rohen skool.com-Link aus Freitext tilgen. */
function sanitizeText(s: string): string {
  return s.replace(SKOOL_HOST_RE, (hit) => {
    strippedSkoolLinks.push(hit);
    return '[entfernt]';
  });
}

type Lesson = {
  title: string;
  section: string | null;
  markdown: string;
  videoUrl: string | null;
  resources: unknown[];
  /** Heuristische Typisierung für den Import; im CMS final per Review. */
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

function collectLeaves(
  node: any,
  section: string | null,
  acc: Array<{ id: string; title: string; section: string | null; videoLink: string | null }>,
) {
  const co = node.course;
  const kids: any[] = node.children || [];
  const md = co.metadata || {};
  if (kids.length === 0 && co.unitType === 'module') {
    acc.push({ id: co.id, title: md.title || '', section, videoLink: md.videoLink || null });
    return;
  }
  // 'set'-Knoten sind Sektionen; ihr Titel wird zum Sektionsnamen der Kinder.
  const childSection = co.unitType === 'set' ? md.title || section : section;
  for (const k of kids) collectLeaves(k, childSection, acc);
}

function guessType(
  title: string,
  section: string | null,
  markdown: string,
  hasVideo: boolean,
): {
  t: 'prompt' | 'video' | 'guide';
  looksLikePrompt: boolean;
} {
  const promptMarkers =
    /(Einsatzzweck|Anwendungsfall|\bPrompt\b|\[\s*(THEMA|ROLLE|KONTEXT|EINGABE|AUFGABE)\b|Du bist ein|Agiere als)/i;
  const looksLikePrompt =
    /prompt/i.test(section || '') || promptMarkers.test(markdown.slice(0, 1200));
  if (looksLikePrompt) return { t: 'prompt', looksLikePrompt: true };
  if (hasVideo) return { t: 'video', looksLikePrompt: false };
  return { t: 'guide', looksLikePrompt: false };
}

async function main() {
  console.log(`Lese Classroom der Gruppe "${GROUP}" …`);
  const classroom = await getHtmlNextData(`/${GROUP}/classroom`);
  const buildId: string = classroom.buildId;
  const courseStubs: any[] = classroom.props.pageProps.allCourses || [];
  console.log(`buildId=${buildId} · ${courseStubs.length} Kurse gefunden.`);

  const courses: Course[] = [];

  for (const stub of courseStubs) {
    if (stub.public !== true) {
      console.log(`  ⏭  Kurs "${stub.metadata?.title}" ist nicht öffentlich — übersprungen.`);
      continue;
    }
    const cmeta = stub.metadata || {};
    console.log(`\n▶ Kurs: ${cmeta.title} (${stub.name})`);
    // Kursbaum über die HTML-Seite (enthält die volle Sektion/Lektion-Hierarchie).
    const coursePage = await getHtmlNextData(`/${GROUP}/classroom/${stub.name}`);
    const tree = coursePage.props.pageProps.course;
    const leaves: Array<{
      id: string;
      title: string;
      section: string | null;
      videoLink: string | null;
    }> = [];
    if (tree) for (const ch of tree.children || []) collectLeaves(ch, null, leaves);
    console.log(`  ${leaves.length} Lektionen …`);

    const lessons: Lesson[] = [];
    for (const leaf of leaves) {
      await sleep(150);
      let lessonMeta: any = {};
      try {
        const data = await getLessonData(buildId, stub.name, leaf.id);
        const pp = data.pageProps;
        const found: any[] = [];
        const walk = (n: any) => {
          if (n?.course?.id === leaf.id) found.push(n.course.metadata);
          for (const k of n?.children || []) walk(k);
        };
        if (pp?.course) walk(pp.course);
        lessonMeta = found[0] || {};
      } catch (e) {
        console.warn(`    ⚠ ${leaf.title}: ${(e as Error).message}`);
      }
      const markdown = tiptapToMarkdown(lessonMeta.desc);
      const videoUrl: string | null = lessonMeta.videoLink || leaf.videoLink || null;
      const { t, looksLikePrompt } = guessType(
        leaf.title,
        leaf.section,
        markdown,
        Boolean(videoUrl),
      );
      lessons.push({
        title: leaf.title,
        section: leaf.section,
        markdown: sanitizeText(markdown),
        videoUrl: videoUrl && /skool\.com/i.test(videoUrl) ? null : videoUrl,
        resources: Array.isArray(lessonMeta.resources) ? lessonMeta.resources : [],
        assetTypeGuess: t,
        looksLikePrompt,
      });
      process.stdout.write('.');
    }
    process.stdout.write('\n');

    courses.push({
      id: stub.id,
      name: stub.name,
      title: cmeta.title || '',
      desc: sanitizeText(cmeta.desc || ''),
      numModules: cmeta.numModules || leaves.length,
      lessons,
    });
  }

  const result = {
    source: 'classroom-import',
    group: GROUP,
    extractedAt: new Date().toISOString(),
    courseCount: courses.length,
    lessonCount: courses.reduce((n, c) => n + c.lessons.length, 0),
    strippedSkoolLinkCount: strippedSkoolLinks.length,
    courses,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(result, null, 2) + '\n');
  console.log(
    `\nEXTRAKT OK → ${path.relative(process.cwd(), OUT)} · ` +
      `${result.courseCount} Kurse · ${result.lessonCount} Lektionen · ` +
      `${result.strippedSkoolLinkCount} Skool-Link(s) entfernt (G7).`,
  );
}

main().catch((e) => {
  console.error('EXTRAKT FAIL', e);
  process.exit(1);
});
