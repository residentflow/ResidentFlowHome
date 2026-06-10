import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Hero } from '../../src/components/sections/Hero';

describe('Hero', () => {
  it('zeigt die Topline Bestand optimieren · Rendite steigern · Verwaltungsaufwand reduzieren', () => {
    render(<Hero />);
    expect(
      screen.getByText('Bestand optimieren · Rendite steigern · Verwaltungsaufwand reduzieren'),
    ).toBeInTheDocument();
  });

  it('enthält in der Hero keinen Produktnamen und nicht das Wort Software', () => {
    const { container } = render(<Hero />);
    const text = container.textContent ?? '';
    expect(text).not.toMatch(/ResidentFlowAI/);
    expect(text).not.toMatch(/Software/i);
  });

  it('die Subline schließt niemanden aus (kein "ab 200 WE")', () => {
    const { container } = render(<Hero />);
    const text = container.textContent ?? '';
    expect(text).not.toMatch(/ab \d+ WE/i);
    expect(text).not.toMatch(/ab 200/);
  });

  it('zeigt den CTA Bestand analysieren', () => {
    render(<Hero />);
    expect(screen.getByRole('button', { name: /Bestand analysieren/i })).toBeInTheDocument();
  });
});
