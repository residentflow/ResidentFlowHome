/**
 * Repo-weite Sprach-Gates (§17): prüft alle .ts/.tsx-Dateien unter src/ auf verbotene Begriffe.
 * Die verbotenen Literale dürfen NUR in dieser Testdatei stehen — niemals in src/.
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

function ladeAlleSrcDateien(dir: string): string[] {
  const ergebnis: string[] = [];
  for (const eintrag of fs.readdirSync(dir, { withFileTypes: true })) {
    const vollerPfad = path.join(dir, eintrag.name);
    if (eintrag.isDirectory()) {
      ergebnis.push(...ladeAlleSrcDateien(vollerPfad));
    } else if (eintrag.isFile() && /\.(ts|tsx)$/.test(eintrag.name)) {
      ergebnis.push(vollerPfad);
    }
  }
  return ergebnis;
}

const srcVerzeichnis = path.resolve(__dirname, '../../src');
const alleDateien = ladeAlleSrcDateien(srcVerzeichnis);

function inhaltMitPfaden(): Array<{ pfad: string; inhalt: string }> {
  return alleDateien.map((f) => ({ pfad: f, inhalt: fs.readFileSync(f, 'utf-8') }));
}

describe('Sprach-Gates §17', () => {
  it('das Wort "Skool" kommt nirgends in src/ vor', () => {
    const treffer = inhaltMitPfaden().filter((d) => d.inhalt.includes('Skool'));
    expect(treffer.map((d) => d.pfad)).toEqual([]);
  });

  it('das Wort "Community" kommt nirgends in src/ vor', () => {
    const treffer = inhaltMitPfaden().filter((d) => d.inhalt.includes('Community'));
    expect(treffer.map((d) => d.pfad)).toEqual([]);
  });

  it('das Fund-Label "Skill" kommt nicht als sichtbares Label vor', () => {
    // "Skill" darf nicht in src/ vorkommen (weder als sichtbares Label noch überhaupt)
    const treffer = inhaltMitPfaden().filter((d) => d.inhalt.includes('Skill'));
    expect(treffer.map((d) => d.pfad)).toEqual([]);
  });

  it('"Potenzial validieren" erscheint nirgends in src/', () => {
    const treffer = inhaltMitPfaden().filter((d) => d.inhalt.includes('Potenzial validieren'));
    expect(treffer.map((d) => d.pfad)).toEqual([]);
  });

  it('es gibt keinen "Demo buchen"-Haupt-CTA (Begriff kommt in src/ nicht vor)', () => {
    const treffer = inhaltMitPfaden().filter((d) => d.inhalt.includes('Demo buchen'));
    expect(treffer.map((d) => d.pfad)).toEqual([]);
  });

  it('"ResidentFlowAI" kommt in src/ ausschließlich im Skalierungs-Block (Stufe3Automatisierung.tsx) vor (§11 Block 7)', () => {
    const erlaubterPfad = path.resolve(
      srcVerzeichnis,
      'components/treppe/Stufe3Automatisierung.tsx',
    );
    const treffer = inhaltMitPfaden()
      .filter((d) => d.inhalt.includes('ResidentFlowAI'))
      .map((d) => d.pfad);

    // Erlaubt: leer (Datei existiert noch nicht) oder ausschließlich der erlaubte Pfad
    const unerlaubte = treffer.filter((p) => p !== erlaubterPfad);
    expect(unerlaubte).toEqual([]);
  });

  // — Neue Verbote PRD v6 §3.10 / §4 —

  it('das Wort "Hebel" kommt nirgends in src/ vor (PRD: extern "Lösung")', () => {
    const treffer = inhaltMitPfaden().filter((d) => /hebel/i.test(d.inhalt));
    expect(treffer.map((d) => d.pfad)).toEqual([]);
  });

  it('die verbotene Frage "Für welchen Kontext suchen Sie Hebel?" erscheint nirgends', () => {
    const treffer = inhaltMitPfaden().filter((d) =>
      d.inhalt.includes('Für welchen Kontext suchen Sie'),
    );
    expect(treffer.map((d) => d.pfad)).toEqual([]);
  });

  it('keine Du-Form: Anreden "du/dich/dir/dein…" kommen als Ganzwort nicht vor (durchgehend Sie-Form)', () => {
    const duForm = /\b(du|dich|dir|dein|deine|deinen|deinem|deiner|deines)\b/i;
    const treffer = inhaltMitPfaden()
      .filter((d) => duForm.test(d.inhalt))
      .map((d) => d.pfad);
    expect(treffer).toEqual([]);
  });

  it('keine Emojis im UI (§3.10)', () => {
    // Emoji-Blöcke (Symbole, Piktogramme, Transport, Ergänzungen, Dingbats, Variationsselektor)
    const emoji =
      /[\u{1F300}-\u{1FAFF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE0F}\u{1F1E6}-\u{1F1FF}]/u;
    const treffer = inhaltMitPfaden()
      .filter((d) => emoji.test(d.inhalt))
      .map((d) => d.pfad);
    expect(treffer).toEqual([]);
  });
});
