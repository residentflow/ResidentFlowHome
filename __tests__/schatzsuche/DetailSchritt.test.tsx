import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DetailSchritt } from '@/components/schatzsuche/DetailSchritt';
import { schatzsucheConfig } from '@/content/schatzsuche.config';
import type { HebelLaufzeit } from '@/domain/types';

const config = schatzsucheConfig;

// Mietpotenzial-Hebel (quantifizierbar, Tätigkeit A/B)
const mietpotenzialHebel = config.hebel.find((h) => h.id === 'mietpotenzial')!;

const hebelRelevant: HebelLaufzeit = {
  hebelId: 'mietpotenzial',
  zustand: 'relevant',
  rahmung: 'chance',
};

describe('DetailSchritt (§7 / §8.4)', () => {
  it('zeigt einen Hebel zunächst als relevant ohne Euro-Spanne', () => {
    render(
      <DetailSchritt
        hebel={[mietpotenzialHebel]}
        laufzeiten={[hebelRelevant]}
        detailAngaben={{}}
        onDetailAngabe={vi.fn()}
      />,
    );
    // Hebel-Name sichtbar
    expect(screen.getByText(/Mietpotenzial-Erkennung/)).toBeInTheDocument();
    // Noch keine Euro-Zahl
    expect(screen.queryByText(/€/)).not.toBeInTheDocument();
    expect(screen.queryByText(/18[\.,]?000/)).not.toBeInTheDocument();
  });

  it('zeigt die Euro-Spanne erst nach Selbstauskunft', () => {
    const hebelQuantifiziert: HebelLaufzeit = {
      hebelId: 'mietpotenzial',
      zustand: 'quantifiziert',
      rahmung: 'chance',
      spanne: { min: 18000, max: 42000 },
    };

    render(
      <DetailSchritt
        hebel={[mietpotenzialHebel]}
        laufzeiten={[hebelQuantifiziert]}
        detailAngaben={{ mietpotenzial: { einheitenMitPotenzial: 10 } }}
        onDetailAngabe={vi.fn()}
      />,
    );
    // Spanne erscheint
    expect(screen.getByText(/18[\.,]?000/)).toBeInTheDocument();
    expect(screen.getByText(/42[\.,]?000/)).toBeInTheDocument();
    expect(screen.getByText(/€/)).toBeInTheDocument();
  });

  it('ruft onDetailAngabe mit Hebel-ID, Frage-Key und Wert auf', async () => {
    const user = userEvent.setup();
    const onDetailAngabe = vi.fn();

    render(
      <DetailSchritt
        hebel={[mietpotenzialHebel]}
        laufzeiten={[hebelRelevant]}
        detailAngaben={{}}
        onDetailAngabe={onDetailAngabe}
      />,
    );

    const input = screen.getByRole('spinbutton');
    await user.clear(input);
    await user.type(input, '10');

    expect(onDetailAngabe).toHaveBeenCalledWith('mietpotenzial', 'einheitenMitPotenzial', 10);
  });
});
