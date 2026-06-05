import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { WahrnehmungsShift } from '../../src/components/sections/WahrnehmungsShift';

describe('WahrnehmungsShift', () => {
  it('kontrastiert "Was andere sehen" mit "Was wir sehen"', () => {
    render(<WahrnehmungsShift />);
    expect(screen.getByText(/Was andere sehen/i)).toBeInTheDocument();
    expect(screen.getByText(/Was wir sehen/i)).toBeInTheDocument();
  });
});
