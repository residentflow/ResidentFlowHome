import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HighIntentCTA } from '@/components/cta/HighIntentCTA';
import { StickyBar } from '@/components/cta/StickyBar';

describe('HighIntentCTA (§14.2)', () => {
  it('zeigt give.short, klappt give.long aus und rendert KEINE Scarcity ohne Flag', () => {
    render(<HighIntentCTA calContext={{ source: 'direct' }} />);
    expect(screen.getByTestId('cta-give-short')).toBeInTheDocument();
    expect(screen.queryByTestId('cta-give-long')).toBeNull();
    fireEvent.click(screen.getByTestId('cta-give-toggle'));
    expect(screen.getByTestId('cta-give-long')).toBeInTheDocument();
    // Seed: scarcityTrue=false → keine Scarcity-Zeile (Test-Gate §14.2)
    expect(screen.queryByTestId('cta-scarcity')).toBeNull();
  });
});

describe('StickyBar (§9.2)', () => {
  it('rendert den Termin-CTA und ist dismissbar', () => {
    render(<StickyBar calContext={{ source: 'direct' }} />);
    expect(screen.getByTestId('sticky-cta')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('sticky-dismiss'));
    expect(screen.queryByTestId('sticky-bar')).toBeNull();
  });
});
