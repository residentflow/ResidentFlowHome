import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { berechneRange } from '@/domain/calc/fromConfig';
import { SolutionResult } from '@/components/solution-result/SolutionResult';
import { problemBySlug } from '@/config/checkConfig';

const problem = problemBySlug('mieten-indexmieten-pruefen')!;

describe('Config-gebundene Relevanzrechnung M1 (§13)', () => {
  it('liefert mit Einheiten + echten Benchmarks eine €-Spanne (min<max) und Rechenweg', () => {
    const r = berechneRange(problem, 75);
    expect(r).not.toBeNull();
    expect(r!.spanne.min).toBeLessThan(r!.spanne.max);
    expect(r!.rechenweg).toMatch(/75/);
  });

  it('ohne Einheiten → null (qualitativ)', () => {
    expect(berechneRange(problem, null)).toBeNull();
  });
});

describe('SolutionResult Relevanzblock-Zustandsmaschine (§11.2)', () => {
  it('mit Einheiten: quantifiziert (€-Spanne + ausklappbarer Rechenweg)', () => {
    render(<SolutionResult problem={problem} highIntent units={75} />);
    expect(screen.getByTestId('relevanz-quantifiziert')).toBeInTheDocument();
    expect(screen.getByTestId('euro-spanne')).toBeInTheDocument();
    expect(screen.queryByTestId('rechenweg')).toBeNull();
    fireEvent.click(screen.getByTestId('rechenweg-toggle'));
    expect(screen.getByTestId('rechenweg')).toBeInTheDocument();
  });

  it('ohne Einheiten: qualitativ (keine €-Zahl)', () => {
    render(<SolutionResult problem={problem} highIntent units={null} />);
    expect(screen.getByTestId('relevanz-qualitativ')).toBeInTheDocument();
    expect(screen.queryByTestId('euro-spanne')).toBeNull();
  });
});
