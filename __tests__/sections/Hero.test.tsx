import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Hero } from '../../src/components/sections/Hero';
import { HERO_TOPLINE } from '../../src/content/texte';

describe('Hero', () => {
  it('zeigt die zentrale Topline (Quelle: texte.ts)', () => {
    render(<Hero />);
    expect(screen.getByText(HERO_TOPLINE)).toBeInTheDocument();
  });

  it('die Topline adressiert die Suchmotive KI, Mietpotenzial und Leerstand', () => {
    expect(HERO_TOPLINE).toMatch(/KI/);
    expect(HERO_TOPLINE).toMatch(/Mietpotenzial/i);
    expect(HERO_TOPLINE).toMatch(/Leerstand/i);
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
