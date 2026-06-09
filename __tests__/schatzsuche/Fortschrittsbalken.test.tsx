import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Fortschrittsbalken } from '@/components/schatzsuche/Fortschrittsbalken';

describe('Fortschrittsbalken (§8.4)', () => {
  it('zeigt "x von y relevanten Bereichen analysiert"', () => {
    render(<Fortschrittsbalken analysiert={2} gesamt={5} />);
    expect(screen.getByText(/2 von 5 relevanten Bereichen analysiert/)).toBeInTheDocument();
  });

  it('zeigt korrekte Werte bei 0 von 3 analysierten Bereichen', () => {
    render(<Fortschrittsbalken analysiert={0} gesamt={3} />);
    expect(screen.getByText(/0 von 3 relevanten Bereichen analysiert/)).toBeInTheDocument();
  });

  it('zeigt korrekte Werte wenn alle Bereiche analysiert wurden', () => {
    render(<Fortschrittsbalken analysiert={4} gesamt={4} />);
    expect(screen.getByText(/4 von 4 relevanten Bereichen analysiert/)).toBeInTheDocument();
  });
});
