import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { LandingPage } from '@/pages/LandingPage';
import { installiereWaechter } from '@/test/guards';

// Sektionsfolge nach PRD §9.2 — vollständig #1–#10.
const SEKTIONEN_IN_REIHENFOLGE = [
  'site-header',
  'hero-check',
  'proof-strip-slot',
  'beispiel-analyse-slot',
  'perception-shift',
  'privacy-proof',
  'founder-short',
  'faq',
  'site-footer',
];

describe('LandingPage (§9.2 — Sektionsfolge)', () => {
  it('rendert die Sektionen in der §9.2-Reihenfolge', () => {
    render(<LandingPage />);
    for (let i = 0; i < SEKTIONEN_IN_REIHENFOLGE.length - 1; i++) {
      const aktuell = screen.getByTestId(SEKTIONEN_IN_REIHENFOLGE[i]!);
      const naechster = screen.getByTestId(SEKTIONEN_IN_REIHENFOLGE[i + 1]!);
      expect(aktuell.compareDocumentPosition(naechster) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
    }
  });

  it('Above the fold: der Bestands-Check (role-options) sitzt direkt im HeroCheck ohne Interaktion (§9.1)', () => {
    render(<LandingPage />);
    const hero = screen.getByTestId('hero-check');
    expect(within(hero).getByTestId('eyebrow')).toBeInTheDocument();
    expect(within(hero).getByTestId('trustline')).toBeInTheDocument();
    // Rollen-Frage mit allen Optionen sofort sichtbar (kein Start-Button)
    expect(within(hero).getByTestId('role-options')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Check starten|Bestand analysieren/i })).toBeNull();
  });

  it('PrivacyProof steht NACH dem Check (HeroCheck), nicht davor (§9.2)', () => {
    render(<LandingPage />);
    const hero = screen.getByTestId('hero-check');
    const privacy = screen.getByTestId('privacy-proof');
    expect(hero.compareDocumentPosition(privacy) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it('löst beim reinen Rendern keine Netzwerkanfrage aus', () => {
    const wache = installiereWaechter();
    render(<LandingPage />);
    wache.erwarteKeinNetzwerk();
    wache.aufraeumen();
  });
});
