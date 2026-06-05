import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LandingPage } from '@/pages/LandingPage';
import { TERMINLINK_TEXT } from '@/content/texte';

type UE = ReturnType<typeof userEvent.setup>;

async function durchlaufBisDetail(
  user: UE,
  taetigkeitLabel: RegExp,
  groesse: string,
  bereich: RegExp,
) {
  // Schritt 1: Tätigkeit
  await user.click(await screen.findByRole('checkbox', { name: taetigkeitLabel }));
  await user.click(screen.getByRole('button', { name: /Weiter/i }));
  // Schritt 2: Größe
  const input = screen.getByRole('spinbutton');
  await user.clear(input);
  await user.type(input, groesse);
  await user.click(screen.getByRole('button', { name: /Weiter/i }));
  // Schritt 3: Probleme — Bereich wählen, erstes Problem ankreuzen, weiter
  await user.click(screen.getByText(bereich));
  await user.click(screen.getAllByRole('checkbox')[0]!);
  await user.click(screen.getByRole('button', { name: /Weiter/i }));
}

describe('E2E — Durchlauf je Segment (§3.3/§10)', () => {
  it('Bestandshalter (A) mit ≥ 50 Einheiten → volle Treppe inkl. Stufe 3 und Terminlink', async () => {
    const user = userEvent.setup();
    render(<LandingPage />);

    await durchlaufBisDetail(user, /Verwaltung eigener Immobilien/i, '60', /Ertrag & Rendite/);

    const ergebnis = await screen.findByTestId('abschnitt-7-ergebnis');
    expect(within(ergebnis).getByTestId('stufe3')).toBeInTheDocument();
    expect(within(ergebnis).getAllByText(TERMINLINK_TEXT).length).toBeGreaterThan(0);
  });

  it('Bestandshalter (A) mit < 50 Einheiten → Selbermacher-Weg ohne Stufe 3', async () => {
    const user = userEvent.setup();
    render(<LandingPage />);

    await durchlaufBisDetail(user, /Verwaltung eigener Immobilien/i, '30', /Ertrag & Rendite/);

    const ergebnis = await screen.findByTestId('abschnitt-7-ergebnis');
    expect(within(ergebnis).getByTestId('stufe1')).toBeInTheDocument();
    expect(within(ergebnis).getByTestId('stufe2')).toBeInTheDocument();
    expect(within(ergebnis).queryByTestId('stufe3')).not.toBeInTheDocument();
  });

  it('Entwicklung / Fix & Flip (C) → Nebenstrang ohne Stufe 3', async () => {
    const user = userEvent.setup();
    render(<LandingPage />);

    await durchlaufBisDetail(user, /Entwicklung \/ Fix & Flip/i, '40', /Vermarktung & Leerstand/);

    const ergebnis = await screen.findByTestId('abschnitt-7-ergebnis');
    expect(within(ergebnis).queryByTestId('stufe3')).not.toBeInTheDocument();
  });
});
