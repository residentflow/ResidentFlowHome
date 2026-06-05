import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Schatzsuche } from '@/components/schatzsuche/Schatzsuche';
import { schatzsucheConfig } from '@/content/schatzsuche.config';
import { installiereWaechter } from '@/test/guards';

describe('Schatzsuche — Flow & Reihenfolge (§8.1)', () => {
  it('führt die Schritte in der Reihenfolge Tätigkeit → Größe → Probleme → Detail', async () => {
    const user = userEvent.setup();
    render(<Schatzsuche config={schatzsucheConfig} />);

    // Schritt 1: Tätigkeit-Schritt ist sichtbar
    expect(screen.getByTestId('schritt-taetigkeit')).toBeInTheDocument();
    expect(screen.queryByTestId('schritt-groesse')).not.toBeInTheDocument();

    // Tätigkeit A wählen und weiter
    await user.click(screen.getByRole('checkbox', { name: /Verwaltung eigener Immobilien/i }));
    await user.click(screen.getByRole('button', { name: /Weiter/i }));

    // Schritt 2: Größe-Schritt ist sichtbar
    expect(screen.getByTestId('schritt-groesse')).toBeInTheDocument();
    expect(screen.queryByTestId('schritt-taetigkeit')).not.toBeInTheDocument();

    // Größe eingeben und weiter
    const input = screen.getByRole('spinbutton');
    await user.clear(input);
    await user.type(input, '60');
    await user.click(screen.getByRole('button', { name: /Weiter/i }));

    // Schritt 3: Problem-Schritt ist sichtbar
    expect(screen.getByTestId('schritt-probleme')).toBeInTheDocument();
    expect(screen.queryByTestId('schritt-groesse')).not.toBeInTheDocument();
  });

  it('stellt während der Suche keine Netzwerkanfrage', async () => {
    const user = userEvent.setup();
    const wache = installiereWaechter();
    render(<Schatzsuche config={schatzsucheConfig} />);

    await user.click(screen.getByRole('checkbox', { name: /Verwaltung eigener Immobilien/i }));
    await user.click(screen.getByRole('button', { name: /Weiter/i }));

    wache.erwarteKeinNetzwerk();
    wache.aufraeumen();
  });

  it('setzt während der Suche kein Cookie', async () => {
    const user = userEvent.setup();
    const wache = installiereWaechter();
    render(<Schatzsuche config={schatzsucheConfig} />);

    await user.click(screen.getByRole('checkbox', { name: /Verwaltung eigener Immobilien/i }));
    await user.click(screen.getByRole('button', { name: /Weiter/i }));

    wache.erwarteKeinCookie();
    wache.aufraeumen();
  });

  it('schreibt während der Suche nicht in localStorage/sessionStorage', async () => {
    const user = userEvent.setup();
    const wache = installiereWaechter();
    render(<Schatzsuche config={schatzsucheConfig} />);

    await user.click(screen.getByRole('checkbox', { name: /Verwaltung eigener Immobilien/i }));
    await user.click(screen.getByRole('button', { name: /Weiter/i }));

    wache.erwarteKeineSpeicherung();
    wache.aufraeumen();
  });

  it('fragt während der Suche keine E-Mail ab', () => {
    render(<Schatzsuche config={schatzsucheConfig} />);
    expect(document.querySelector('input[type="email"]')).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/E-Mail/i)).not.toBeInTheDocument();
  });
});
