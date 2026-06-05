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

function inhaltAller(): string {
  return alleDateien.map((f) => fs.readFileSync(f, 'utf-8')).join('\n');
}

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

  it('"ResidentFlowAI" kommt in src/ ausschließlich in components/treppe/Stufe3Automatisierung.tsx vor', () => {
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
});
