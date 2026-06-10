import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { BestandsCheck } from '@/components/bestands-check/BestandsCheck';
import { checkConfig } from '@/config/checkConfig';

describe('BestandsCheck — Zustandsmaschine S0→S3 (§10)', () => {
  afterEach(() => vi.restoreAllMocks());

  it('S0: zeigt die Rollen-Frage mit allen Rollen above the fold (role-options)', () => {
    render(<BestandsCheck />);
    const optionen = screen.getByTestId('role-options');
    expect(optionen).toBeInTheDocument();
    for (const r of checkConfig.roles) {
      expect(within(optionen).getByTestId(`role-${r.slug}`)).toBeInTheDocument();
    }
    // Noch keine Größen- oder Problemebene
    expect(screen.queryByTestId('size-options')).toBeNull();
    expect(screen.queryByTestId('solution-result')).toBeNull();
  });

  it('Rolle → Größe → Problem rendert ohne Navigation jeweils die Folgeebene', () => {
    render(<BestandsCheck />);
    fireEvent.click(screen.getByTestId('role-buyAndHold'));
    expect(screen.getByTestId('size-options')).toBeInTheDocument();

    // Hoher Bucket (rank 3 = "50–99") → HighIntent
    fireEvent.click(screen.getByTestId('size-3'));
    expect(screen.getByTestId('problem-options')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('problem-mieten-indexmieten-pruefen'));
    expect(screen.getByTestId('solution-result')).toBeInTheDocument();
    // HighIntent → kompakter CTA + System-Satz
    expect(screen.getByTestId('highintent-cta')).toBeInTheDocument();
    expect(screen.getByTestId('system-satz')).toBeInTheDocument();
  });

  it('niedriger Bucket (rank 0) ist Motor A: kein HighIntent-CTA, Fallback-Zeile sichtbar', () => {
    render(<BestandsCheck />);
    fireEvent.click(screen.getByTestId('role-buyAndHold'));
    fireEvent.click(screen.getByTestId('size-0'));
    fireEvent.click(screen.getByTestId('problem-mieten-indexmieten-pruefen'));
    expect(screen.queryByTestId('highintent-cta')).toBeNull();
    expect(screen.getByTestId('fallback-zeile')).toBeInTheDocument();
  });

  it('Chips: frühere Auswahl ist änderbar und re-rendert die Folgeebene (kein Reset)', () => {
    render(<BestandsCheck />);
    fireEvent.click(screen.getByTestId('role-buyAndHold'));
    fireEvent.click(screen.getByTestId('size-3'));
    // Größen-Chip klicken → zurück zur Größenfrage, Rolle bleibt
    const chips = screen.getByTestId('aktive-chips');
    const groessenChip = within(chips).getAllByTestId('chip')[1];
    fireEvent.click(groessenChip);
    expect(screen.getByTestId('size-options')).toBeInTheDocument();
    expect(screen.queryByTestId('problem-options')).toBeNull();
  });

  it('HARTES GATE: kein fetch / kein Storage / kein Cookie während des Checks (§10)', () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    const lsSet = vi.spyOn(Storage.prototype, 'setItem');

    render(<BestandsCheck />);
    fireEvent.click(screen.getByTestId('role-buyAndHold'));
    fireEvent.click(screen.getByTestId('size-3'));
    fireEvent.click(screen.getByTestId('problem-mieten-indexmieten-pruefen'));

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(lsSet).not.toHaveBeenCalled();
    expect(document.cookie).toBe('');
  });
});
