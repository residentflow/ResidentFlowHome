import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Founder } from '../../src/components/sections/Founder';

describe('Founder', () => {
  it('endet mit dem Schlusssatz …deshalb verstehe ich Ihr Problem von innen.', () => {
    render(<Founder />);
    expect(screen.getByText(/…deshalb verstehe ich Ihr Problem von innen\./)).toBeInTheDocument();
  });
});
