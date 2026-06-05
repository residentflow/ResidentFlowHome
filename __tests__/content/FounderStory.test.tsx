import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FounderStory } from '../../src/components/content/FounderStory';
import { FOUNDER_SCHLUSSSATZ } from '../../src/content/texte';

describe('FounderStory', () => {
  it('erzählt die Gründer-Geschichte und endet mit …deshalb verstehe ich Ihr Problem von innen.', () => {
    render(<FounderStory />);
    expect(screen.getByText(FOUNDER_SCHLUSSSATZ)).toBeInTheDocument();
  });
});
