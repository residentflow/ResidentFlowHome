import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErkenntnisListe } from '@/components/schatzsuche/ErkenntnisListe';
import { ERKENNTNIS_HEADER } from '@/content/texte';
import type { HebelLaufzeit } from '@/domain/types';

const hebelOhneSpanne: HebelLaufzeit = {
  hebelId: 'mietpotenzial',
  zustand: 'relevant',
  rahmung: 'chance',
};

const hebelMitSpanne: HebelLaufzeit = {
  hebelId: 'mietpotenzial',
  zustand: 'quantifiziert',
  rahmung: 'chance',
  spanne: { min: 18000, max: 42000 },
};

const hebelQualitativ: HebelLaufzeit = {
  hebelId: 'belegerkennung',
  zustand: 'relevant',
  rahmung: 'chance',
  nutzenAussage: 'Automatische Belegerkennung reduziert manuelle Buchungszeit.',
};

const hebelNamen: Record<string, string> = {
  mietpotenzial: 'Mietpotenzial-Erkennung',
  belegerkennung: 'Belegerkennung & Buchungsvorschläge',
};

describe('ErkenntnisListe (§8.2)', () => {
  it('zeigt die Erkenntnis-Liste mit "Bereits identifizierte Hebel: N"', () => {
    render(
      <ErkenntnisListe laufzeiten={[hebelOhneSpanne, hebelQualitativ]} hebelNamen={hebelNamen} />,
    );
    expect(screen.getByText(new RegExp(`${ERKENNTNIS_HEADER}\\s*2`))).toBeInTheDocument();
  });

  it('zeigt einen Hebel zunächst als relevant ohne Euro-Spanne', () => {
    render(<ErkenntnisListe laufzeiten={[hebelOhneSpanne]} hebelNamen={hebelNamen} />);
    expect(screen.queryByText(/€/)).not.toBeInTheDocument();
    expect(screen.getByText(/Mietpotenzial-Erkennung/)).toBeInTheDocument();
  });

  it('zeigt die Euro-Spanne erst nach Selbstauskunft', () => {
    render(<ErkenntnisListe laufzeiten={[hebelMitSpanne]} hebelNamen={hebelNamen} />);
    // Spanne soll sichtbar sein
    expect(screen.getByText(/18[\.,]?000/)).toBeInTheDocument();
    expect(screen.getByText(/42[\.,]?000/)).toBeInTheDocument();
    expect(screen.getByText(/€/)).toBeInTheDocument();
  });

  it('stellt Euro-Spanne und qualitativen Nutzen gleich stark dar', () => {
    // Beide Hebel erscheinen in der Liste — qualitativer Nutzen und Euro-Spanne sind gleichrangig
    const { container } = render(
      <ErkenntnisListe laufzeiten={[hebelMitSpanne, hebelQualitativ]} hebelNamen={hebelNamen} />,
    );
    // Beide Einträge in der Liste vorhanden
    expect(screen.getByText(/Mietpotenzial-Erkennung/)).toBeInTheDocument();
    expect(screen.getByText(/Belegerkennung/)).toBeInTheDocument();
    // Qualitative Aussage erscheint
    expect(screen.getByText(/Automatische Belegerkennung/)).toBeInTheDocument();
    // Beide sind List-Items oder gleichartige Elemente
    const listItems = container.querySelectorAll('li');
    expect(listItems.length).toBe(2);
  });
});
