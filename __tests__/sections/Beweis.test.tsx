import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Beweis } from '../../src/components/sections/Beweis';

describe('Beweis', () => {
  it('zeigt Findings aus unserem eigenen Portfolio mit Founder-Micro-Zitat (Name)', () => {
    render(<Beweis />);
    expect(screen.getByText(/aus unserem eigenen Portfolio/i)).toBeInTheDocument();
    // Founder name should appear alongside the micro-quote
    const { container } = render(<Beweis />);
    const text = container.textContent ?? '';
    // There must be a name — check for "Stefan" as the founder name
    expect(text).toMatch(/Stefan/);
  });
});
