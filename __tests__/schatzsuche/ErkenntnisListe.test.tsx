import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErkenntnisListe } from '@/components/schatzsuche/ErkenntnisListe';
import { ERKENNTNIS_HEADER } from '@/content/texte';
import type { LoesungLaufzeit } from '@/domain/types';

const loesungOhneSpanne: LoesungLaufzeit = {
  loesungId: 'mietpotenzial',
  zustand: 'relevant',
  rahmung: 'chance',
};

const loesungMitSpanne: LoesungLaufzeit = {
  loesungId: 'mietpotenzial',
  zustand: 'quantifiziert',
  rahmung: 'chance',
  spanne: { min: 18000, max: 42000 },
};

const loesungQualitativ: LoesungLaufzeit = {
  loesungId: 'belegerkennung',
  zustand: 'relevant',
  rahmung: 'chance',
  nutzenAussage: 'Automatische Belegerkennung reduziert manuelle Buchungszeit.',
};

const loesungNamen: Record<string, string> = {
  mietpotenzial: 'Mietpotenzial-Erkennung',
  belegerkennung: 'Belegerkennung & Buchungsvorschläge',
};

describe('ErkenntnisListe (§8.2)', () => {
  it('zeigt die Erkenntnis-Liste mit "Bereits identifizierte Lösungen: N"', () => {
    render(
      <ErkenntnisListe
        laufzeiten={[loesungOhneSpanne, loesungQualitativ]}
        loesungNamen={loesungNamen}
      />,
    );
    expect(screen.getByText(new RegExp(`${ERKENNTNIS_HEADER}\\s*2`))).toBeInTheDocument();
  });

  it('zeigt einen Loesung zunächst als relevant ohne Euro-Spanne', () => {
    render(<ErkenntnisListe laufzeiten={[loesungOhneSpanne]} loesungNamen={loesungNamen} />);
    expect(screen.queryByText(/€/)).not.toBeInTheDocument();
    expect(screen.getByText(/Mietpotenzial-Erkennung/)).toBeInTheDocument();
  });

  it('zeigt die Euro-Spanne erst nach Selbstauskunft', () => {
    render(<ErkenntnisListe laufzeiten={[loesungMitSpanne]} loesungNamen={loesungNamen} />);
    // Spanne soll sichtbar sein
    expect(screen.getByText(/18[\.,]?000/)).toBeInTheDocument();
    expect(screen.getByText(/42[\.,]?000/)).toBeInTheDocument();
    expect(screen.getByText(/€/)).toBeInTheDocument();
  });

  it('stellt Euro-Spanne und qualitativen Nutzen gleich stark dar', () => {
    // Beide Loesung erscheinen in der Liste — qualitativer Nutzen und Euro-Spanne sind gleichrangig
    const { container } = render(
      <ErkenntnisListe
        laufzeiten={[loesungMitSpanne, loesungQualitativ]}
        loesungNamen={loesungNamen}
      />,
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
