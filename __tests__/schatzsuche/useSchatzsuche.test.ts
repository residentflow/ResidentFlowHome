import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSchatzsuche } from '@/components/schatzsuche/useSchatzsuche';
import { schatzsucheConfig } from '@/content/schatzsuche.config';

const config = schatzsucheConfig;

describe('useSchatzsuche — Hook-Logik (§8)', () => {
  it('liefert zu gewählten Problemen die relevanten Hebel', () => {
    const { result } = renderHook(() => useSchatzsuche(config));

    act(() => {
      result.current.waehleRollen(['buyAndHold']);
      result.current.setzeGroesse('A', 60);
    });

    // Problem wählen, das Mietpotenzial-Hebel verknüpft
    const mietproblem = config.probleme.find((p) => p.id === 'mieterhoehung')!;
    act(() => {
      result.current.waehleProbleme([mietproblem.id]);
    });

    const hebel = result.current.relevanteHebel;
    expect(hebel.length).toBeGreaterThan(0);
    expect(hebel.some((h) => h.hebelId === 'mietpotenzial')).toBe(true);
  });

  it('erzeugt keine Euro-Zahl, solange keine Selbstauskunft vorliegt', () => {
    const { result } = renderHook(() => useSchatzsuche(config));

    act(() => {
      result.current.waehleRollen(['buyAndHold']);
      result.current.setzeGroesse('A', 60);
      result.current.waehleProbleme(['mieterhoehung']);
    });

    // Noch keine Detailangabe → alle Hebel im Zustand 'relevant', keine Spanne
    result.current.relevanteHebel.forEach((h) => {
      expect(h.spanne).toBeUndefined();
      expect(h.zustand).toBe('relevant');
    });
  });

  it('aktualisiert das Gesamtpotenzial als Spanne nach Detailangabe', () => {
    const { result } = renderHook(() => useSchatzsuche(config));

    act(() => {
      result.current.waehleRollen(['buyAndHold']);
      result.current.setzeGroesse('A', 60);
      result.current.waehleProbleme(['mieterhoehung']);
    });

    // Vor Detailangabe: kein Gesamtpotenzial
    expect(result.current.aggregat.min).toBe(0);
    expect(result.current.aggregat.max).toBe(0);

    // Detailangabe für Mietpotenzial-Hebel
    act(() => {
      result.current.setzeDetailAngabe('mietpotenzial', 'einheitenMitPotenzial', 10);
    });

    // Nach Detailangabe: Spanne erscheint
    const nachher = result.current.aggregat;
    expect(nachher.min).toBeGreaterThan(0);
    expect(nachher.max).toBeGreaterThan(nachher.min);
  });
});
