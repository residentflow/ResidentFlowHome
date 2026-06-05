import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaetigkeitSchritt } from '@/components/schatzsuche/TaetigkeitSchritt';

describe('TaetigkeitSchritt (§3.2 / §8.1)', () => {
  it('zeigt Optionen für Tätigkeit A, B und C', () => {
    render(<TaetigkeitSchritt gewaehlt={[]} onWeiter={vi.fn()} />);
    expect(screen.getByRole('checkbox', { name: /Verwaltung eigener Immobilien/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /Betreuung fremder Bestände/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /Entwicklung/i })).toBeInTheDocument();
  });

  it('erlaubt Mehrfachauswahl (A und B gleichzeitig)', async () => {
    const user = userEvent.setup();
    const onWeiter = vi.fn();
    render(<TaetigkeitSchritt gewaehlt={[]} onWeiter={onWeiter} />);

    await user.click(screen.getByRole('checkbox', { name: /Verwaltung eigener Immobilien/i }));
    await user.click(screen.getByRole('checkbox', { name: /Betreuung fremder Bestände/i }));
    await user.click(screen.getByRole('button', { name: /Weiter/i }));

    expect(onWeiter).toHaveBeenCalledWith(expect.arrayContaining(['A', 'B']));
  });

  it('verhindert Weiter-Klick ohne Auswahl', async () => {
    const user = userEvent.setup();
    const onWeiter = vi.fn();
    render(<TaetigkeitSchritt gewaehlt={[]} onWeiter={onWeiter} />);

    await user.click(screen.getByRole('button', { name: /Weiter/i }));
    expect(onWeiter).not.toHaveBeenCalled();
  });
});
