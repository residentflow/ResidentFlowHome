import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InlineKontextChips } from '@/components/inline-context-chips/InlineKontextChips';

describe('InlineKontextChips (§11.3)', () => {
  it('zeigt die 5 Rollen-Chips und erst nach Rollenwahl die Bucket-Chips', () => {
    render(<InlineKontextChips onContext={() => {}} />);
    expect(screen.getByTestId('chip-roles')).toBeInTheDocument();
    expect(screen.queryByTestId('chip-buckets')).toBeNull();
    fireEvent.click(screen.getByTestId('chip-role-buyAndHold'));
    expect(screen.getByTestId('chip-buckets')).toBeInTheDocument();
  });

  it('zwei Klicks liefern Rolle und Bucket-Rang an den Aufrufer', () => {
    const onContext = vi.fn();
    render(<InlineKontextChips onContext={onContext} />);
    fireEvent.click(screen.getByTestId('chip-role-buyAndHold'));
    expect(onContext).toHaveBeenLastCalledWith(
      expect.objectContaining({ slug: 'buyAndHold' }),
      null,
    );
    fireEvent.click(screen.getByTestId('chip-bucket-3'));
    expect(onContext).toHaveBeenLastCalledWith(expect.objectContaining({ slug: 'buyAndHold' }), 3);
  });
});
