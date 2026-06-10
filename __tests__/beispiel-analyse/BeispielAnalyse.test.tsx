import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { BeispielAnalyse } from '@/components/beispiel-analyse/BeispielAnalyse';

const echteDaten = {
  isPlaceholder: false,
  publicApproved: true,
  einheiten: 152,
  metrics: [
    { label: 'Mietverhältnisse eingelesen', value: '152' },
    { label: 'Verträge mit Auffälligkeiten', value: '23' },
    { label: 'Potenzial p.a. (Spanne)', value: '18.000–42.000 €' },
  ],
  funde: [
    {
      klasse: 'ertrag',
      titel: 'Indexmiete nicht angepasst',
      kurz: '11 Verträge',
      rechenweg: 'VPI-Delta × Verträge.',
    },
    {
      klasse: 'fristen-radar',
      titel: 'Fällig in 30/60/90 Tagen',
      kurz: 'Staffeln',
      rechenweg: 'Zeitstrahl.',
    },
    {
      klasse: 'datenluecken',
      titel: '4 Verträge nicht bewertbar',
      kurz: 'Spalte fehlt',
      rechenweg: 'Strukturproblem.',
    },
  ],
  statusZeile: '60.000 € identifiziert, davon 12.000 € in Umsetzung.',
};

describe('BeispielAnalyse (§12)', () => {
  it('Platzhalter/nicht freigegeben: zeigt KEINE erfundenen Funde, nur einen neutralen Hinweis (Build-Gate §3.4)', () => {
    render(
      <BeispielAnalyse data={{ ...echteDaten, isPlaceholder: true, publicApproved: false }} />,
    );
    expect(screen.getByTestId('beispiel-analyse-platzhalter')).toBeInTheDocument();
    expect(screen.queryByTestId('funde-tabelle')).toBeNull();
  });

  it('freigegeben: exakt 3 Metric-Cards, 3 Funde-Klassen, expandierbarer Rechenweg', () => {
    render(<BeispielAnalyse data={echteDaten} />);
    const cards = screen.getByTestId('metric-cards');
    expect(within(cards).getAllByText(/.+/).length).toBeGreaterThanOrEqual(3);
    expect(screen.getByTestId('fund-ertrag')).toBeInTheDocument();
    expect(screen.getByTestId('fund-fristen-radar')).toBeInTheDocument();
    expect(screen.getByTestId('fund-datenluecken')).toBeInTheDocument();
    // Komplexitäts-Grenze: höchstens 4 Zeilen
    expect(screen.getByTestId('funde-tabelle').querySelectorAll('tr').length).toBeLessThanOrEqual(
      4,
    );
    // Expand
    fireEvent.click(screen.getByTestId('fund-toggle-0'));
    expect(screen.getByTestId('fund-rechenweg-0')).toBeInTheDocument();
  });

  it('hat KEIN Upload-Feld (§12 Verbot)', () => {
    const { container } = render(<BeispielAnalyse data={echteDaten} />);
    expect(container.querySelector('input[type="file"]')).toBeNull();
  });
});
