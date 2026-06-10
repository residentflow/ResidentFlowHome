import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { SolutionResult } from '@/components/solution-result/SolutionResult';
import { BeispielAnalyse } from '@/components/beispiel-analyse/BeispielAnalyse';
import { FAQ } from '@/components/content/FAQ';
import { problemBySlug } from '@/config/checkConfig';

const KERN = 'Gefunden ist nicht realisiert';
const problem = problemBySlug('mieten-indexmieten-pruefen')!;

const echteAnalyse = {
  isPlaceholder: false,
  publicApproved: true,
  einheiten: 150,
  metrics: [
    { label: 'a', value: '1' },
    { label: 'b', value: '2' },
    { label: 'c', value: '3' },
  ],
  funde: [{ klasse: 'ertrag', titel: 't', kurz: 'k', rechenweg: 'r' }],
  statusZeile: 's',
};

describe('System-Satz-Platzierungen (§21)', () => {
  it('1) SolutionResult bei HighIntent', () => {
    render(<SolutionResult problem={problem} highIntent />);
    expect(screen.getByTestId('system-satz').textContent).toContain(KERN);
  });

  it('2) BeispielAnalyse-Fuß (freigegeben)', () => {
    render(<BeispielAnalyse data={echteAnalyse} />);
    expect(screen.getByTestId('system-satz').textContent).toContain(KERN);
  });

  it('3) FAQ-Seite', () => {
    render(
      <MemoryRouter>
        <FAQ />
      </MemoryRouter>,
    );
    expect(screen.getByTestId('system-satz').textContent).toContain(KERN);
  });

  it('4) Prüfpaket-Report-Template', () => {
    const report = fs.readFileSync(
      path.resolve(
        __dirname,
        '../../packages/pruefpaket-mietanpassung/referenzen/report-template.md',
      ),
      'utf-8',
    );
    // Markdown kann den Satz umbrechen → Whitespace normalisieren
    expect(report.replace(/\s+/g, ' ')).toContain(KERN);
  });
});
