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
  // Schritt 1: Tätigkeitsprofil
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
  it('Eigener Bestand mit ≥ 50 Einheiten → volle Treppe inkl. Stufe 3 und Terminlink', async () => {
    const user = userEvent.setup();
    render(<LandingPage />);

    await durchlaufBisDetail(user, /Eigener Bestand/i, '60', /Ertrag & Rendite/);

    const ergebnis = await screen.findByTestId('abschnitt-7-ergebnis');
    expect(within(ergebnis).getByTestId('stufe3')).toBeInTheDocument();
    expect(within(ergebnis).getAllByText(TERMINLINK_TEXT).length).toBeGreaterThan(0);
  });

  it('Eigener Bestand mit < 50 Einheiten → Selbermacher-Weg ohne Stufe 3', async () => {
    const user = userEvent.setup();
    render(<LandingPage />);

    await durchlaufBisDetail(user, /Eigener Bestand/i, '30', /Ertrag & Rendite/);

    const ergebnis = await screen.findByTestId('abschnitt-7-ergebnis');
    expect(within(ergebnis).getByTestId('stufe1')).toBeInTheDocument();
    expect(within(ergebnis).getByTestId('stufe2')).toBeInTheDocument();
    expect(within(ergebnis).queryByTestId('stufe3')).not.toBeInTheDocument();
  });

  it('Projektentwicklung / Fix & Flip → Nebenstrang ohne Stufe 3', async () => {
    const user = userEvent.setup();
    render(<LandingPage />);

    await durchlaufBisDetail(
      user,
      /Projektentwicklung \/ Fix & Flip/i,
      '40',
      /Vermarktung & Leerstand/,
    );

    const ergebnis = await screen.findByTestId('abschnitt-7-ergebnis');
    expect(within(ergebnis).queryByTestId('stufe3')).not.toBeInTheDocument();
  });

  it('Mandantenbetreuung (Steuerberater/Makler) → Partnerprogramm-Link, keine Treppe (§10.2)', async () => {
    const user = userEvent.setup();
    render(<LandingPage />);

    // Profil „Betreuung von Mandanten" → größenunabhängig → direkt zum Partner-Ergebnis
    await user.click(await screen.findByRole('checkbox', { name: /Betreuung von Mandanten/i }));
    await user.click(screen.getByRole('button', { name: /Weiter/i }));
    // Größe-Schritt ist größenunabhängig (kein Eingabefeld) → direkt weiter
    await user.click(screen.getByRole('button', { name: /Weiter/i }));

    const ergebnis = await screen.findByTestId('abschnitt-7-ergebnis');
    expect(within(ergebnis).getByTestId('partnerprogramm-link')).toBeInTheDocument();
    expect(within(ergebnis).queryByTestId('stufe3')).not.toBeInTheDocument();
    expect(within(ergebnis).queryByTestId('stufe1')).not.toBeInTheDocument();
  });
});
