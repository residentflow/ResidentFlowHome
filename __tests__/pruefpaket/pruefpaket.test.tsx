import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { PruefpaketSeite } from '@/pages/PruefpaketSeite';

const paketDir = path.resolve(__dirname, '../../packages/pruefpaket-mietanpassung');

function ladeAlleMd(dir: string): Array<{ pfad: string; inhalt: string }> {
  const out: Array<{ pfad: string; inhalt: string }> = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...ladeAlleMd(p));
    else if (e.name.endsWith('.md')) out.push({ pfad: p, inhalt: fs.readFileSync(p, 'utf-8') });
  }
  return out;
}

describe('Mietanpassungs-Prüfpaket — G4-Gate (§15)', () => {
  const dateien = ladeAlleMd(paketDir);
  const report = dateien.find((d) => d.pfad.endsWith('report-template.md'))!.inhalt;

  it('Report-Template enthält Decke, Brücke und Disclaimer', () => {
    expect(report).toMatch(/Was dieses Prüfpaket nicht kann/);
    expect(report).toMatch(/residentflow\.de\/termin\?src=pruefpaket/);
    expect(report).toMatch(/Keine Rechtsberatung/);
  });

  it('extern nie „Skill" (in keinem Paket-Markdown)', () => {
    const treffer = dateien.filter((d) => /skill/i.test(d.inhalt)).map((d) => d.pfad);
    expect(treffer).toEqual([]);
  });

  it('Attribution: Links tragen ?src=pruefpaket', () => {
    expect(report).toMatch(/\?src=pruefpaket/);
  });
});

describe('PruefpaketSeite (§7)', () => {
  it('zeigt Name, Funde, Decke und Termin-Brücke mit ?src=pruefpaket', () => {
    render(<PruefpaketSeite />);
    expect(screen.getByTestId('pruefpaket-seite')).toBeInTheDocument();
    expect(screen.getByTestId('pruefpaket-funde')).toBeInTheDocument();
    expect(screen.getByTestId('pruefpaket-decke')).toBeInTheDocument();
    expect(screen.getByTestId('pruefpaket-termin')).toHaveAttribute(
      'href',
      '/termin?src=pruefpaket',
    );
  });
});
