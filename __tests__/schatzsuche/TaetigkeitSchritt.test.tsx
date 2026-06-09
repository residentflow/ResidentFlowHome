import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaetigkeitSchritt } from '@/components/schatzsuche/TaetigkeitSchritt';

describe('TaetigkeitSchritt (§3.2 / §3.3 / §8.1)', () => {
  it('zeigt vier getrennte Profile (eigener/fremder Bestand, Mandantenbetreuung, Entwicklung)', () => {
    render(<TaetigkeitSchritt gewaehlt={[]} onWeiter={vi.fn()} />);
    expect(screen.getByRole('checkbox', { name: /Eigener Bestand/i })).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: /Fremder Bestand \(Verwaltung\)/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /Betreuung von Mandanten/i })).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: /Projektentwicklung \/ Fix & Flip/i }),
    ).toBeInTheDocument();
  });

  it('trennt Verwaltung fremder Bestände (Treppe) von Mandantenbetreuung (Partnerprogramm)', () => {
    render(<TaetigkeitSchritt gewaehlt={[]} onWeiter={vi.fn()} />);
    const fremd = screen.getByRole('checkbox', { name: /Fremder Bestand \(Verwaltung\)/i });
    const mandant = screen.getByRole('checkbox', { name: /Betreuung von Mandanten/i });
    expect(fremd).not.toBe(mandant);
  });

  it('erlaubt Mehrfachauswahl und liefert die Profil-IDs', async () => {
    const user = userEvent.setup();
    const onWeiter = vi.fn();
    render(<TaetigkeitSchritt gewaehlt={[]} onWeiter={onWeiter} />);

    await user.click(screen.getByRole('checkbox', { name: /Eigener Bestand/i }));
    await user.click(screen.getByRole('checkbox', { name: /Betreuung von Mandanten/i }));
    await user.click(screen.getByRole('button', { name: /Weiter/i }));

    expect(onWeiter).toHaveBeenCalledWith(
      expect.arrayContaining(['eigenerBestand', 'mandantenbetreuung']),
    );
  });

  it('verhindert Weiter-Klick ohne Auswahl', async () => {
    const user = userEvent.setup();
    const onWeiter = vi.fn();
    render(<TaetigkeitSchritt gewaehlt={[]} onWeiter={onWeiter} />);

    await user.click(screen.getByRole('button', { name: /Weiter/i }));
    expect(onWeiter).not.toHaveBeenCalled();
  });
});
