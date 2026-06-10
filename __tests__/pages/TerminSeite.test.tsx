import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TerminSeite } from '@/pages/TerminSeite';

describe('TerminSeite /termin (§7/§14.2)', () => {
  it('bettet cal.com ein, nennt die Telefon-/Video-Option und einen externen Link', () => {
    render(<TerminSeite />);
    expect(screen.getByTestId('termin-seite')).toBeInTheDocument();
    const embed = screen.getByTestId('cal-embed');
    expect(embed.getAttribute('src')).toContain('cal.com/stefan-holhut/bestand-ansehen');
    expect(screen.getByTestId('termin-telefon').textContent).toMatch(/Telefon/i);
    expect(screen.getByTestId('termin-extern')).toHaveAttribute(
      'href',
      'https://cal.com/stefan-holhut/bestand-ansehen',
    );
  });
});
