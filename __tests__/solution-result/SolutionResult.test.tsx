import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SolutionResult } from '@/components/solution-result/SolutionResult';
import { problemBySlug } from '@/config/checkConfig';

const problem = problemBySlug('mieten-indexmieten-pruefen')!;

describe('SolutionResult (§11.1)', () => {
  it('HighIntent: System-Satz, kompakter CTA, ScaleBreak und Skalierungs-Block (ResidentFlowAI)', () => {
    render(<SolutionResult problem={problem} highIntent />);
    expect(screen.getByTestId('system-satz')).toBeInTheDocument();
    expect(screen.getByTestId('highintent-cta')).toBeInTheDocument();
    // Erste Lösung ist initial geöffnet → ScaleBreak sichtbar
    expect(screen.getByTestId(`scale-break-${problem.solutions[0]!.slug}`)).toBeInTheDocument();
    expect(screen.getByTestId('skalierungs-block')).toBeInTheDocument();
  });

  it('Motor A (kein HighIntent): kein Skalierungs-Block, kein ScaleBreak, Fallback-Zeile', () => {
    render(<SolutionResult problem={problem} highIntent={false} />);
    expect(screen.queryByTestId('skalierungs-block')).toBeNull();
    expect(screen.queryByTestId(`scale-break-${problem.solutions[0]!.slug}`)).toBeNull();
    expect(screen.getByTestId('fallback-zeile')).toBeInTheDocument();
  });

  it('Accordion: erste Lösung offen rendert ihren AssetRenderer (Prompt)', () => {
    render(<SolutionResult problem={problem} highIntent />);
    const erste = problem.solutions[0]!;
    expect(screen.getByTestId(`solution-body-${erste.slug}`)).toBeInTheDocument();
    // Mindestens ein Asset gerendert
    const promptAsset = erste.assets.find((a) => a.assetType === 'prompt');
    if (promptAsset) {
      expect(screen.getByTestId(`asset-prompt-${promptAsset.slug}`)).toBeInTheDocument();
    }
  });

  it('Answer-first nur mit showAnswerFirst', () => {
    const { rerender } = render(<SolutionResult problem={problem} highIntent={false} />);
    expect(screen.queryByTestId('answer-first')).toBeNull();
    rerender(<SolutionResult problem={problem} highIntent={false} showAnswerFirst />);
    expect(screen.getByTestId('answer-first')).toBeInTheDocument();
  });
});
