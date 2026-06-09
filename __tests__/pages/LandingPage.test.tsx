import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LandingPage } from '@/pages/LandingPage';
import { installiereWaechter } from '@/test/guards';

const ABSCHNITTE_IN_REIHENFOLGE = [
  'abschnitt-1-hero',
  'abschnitt-2-wahrnehmung',
  'abschnitt-3-problem',
  'abschnitt-4-beweis',
  'abschnitt-5-bruecke',
  'abschnitt-6-schatzsuche',
  'abschnitt-7-ergebnis',
  'abschnitt-8-datenschutz',
  'abschnitt-9-founder',
];

describe('LandingPage (§9 — feste Abschnitts-Reihenfolge)', () => {
  it('rendert genau die 9 Abschnitte', () => {
    render(<LandingPage />);
    for (const testid of ABSCHNITTE_IN_REIHENFOLGE) {
      expect(screen.getByTestId(testid)).toBeInTheDocument();
    }
  });

  it('rendert die Abschnitte in der fixen Reihenfolge 1–9', () => {
    render(<LandingPage />);
    const positionen = ABSCHNITTE_IN_REIHENFOLGE.map((testid) =>
      screen.getByTestId(testid).compareDocumentPosition(screen.getByTestId(testid)),
    );
    // DOM-Reihenfolge prüfen: jeder Abschnitt steht vor dem nächsten
    for (let i = 0; i < ABSCHNITTE_IN_REIHENFOLGE.length - 1; i++) {
      const aktuell = screen.getByTestId(ABSCHNITTE_IN_REIHENFOLGE[i]!);
      const naechster = screen.getByTestId(ABSCHNITTE_IN_REIHENFOLGE[i + 1]!);
      // Node.DOCUMENT_POSITION_FOLLOWING (4): naechster folgt auf aktuell
      expect(aktuell.compareDocumentPosition(naechster) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
    }
    expect(positionen).toHaveLength(9);
  });

  it('löst beim reinen Rendern keine Netzwerkanfrage aus', () => {
    const wache = installiereWaechter();
    render(<LandingPage />);
    wache.erwarteKeinNetzwerk();
    wache.aufraeumen();
  });
});
