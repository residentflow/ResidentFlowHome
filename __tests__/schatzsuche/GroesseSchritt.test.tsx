import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GroesseSchritt } from '@/components/schatzsuche/GroesseSchritt';
import type { Taetigkeit } from '@/domain/enums';

describe('GroesseSchritt (§3.3 / §8.1)', () => {
  it('fragt bei Tätigkeit A nach Anzahl Einheiten im eigenen Bestand', () => {
    render(
      <GroesseSchritt
        taetigkeiten={['A'] as Taetigkeit[]}
        groessen={{}}
        onGroesseAendern={vi.fn()}
        onWeiter={vi.fn()}
      />,
    );
    // Label-Element mit dem exakten Text
    expect(screen.getByLabelText(/eigene.*Einheiten|Einheiten.*eigene/i)).toBeInTheDocument();
  });

  it('fragt bei Tätigkeit B nach Anzahl betreuter Einheiten', () => {
    render(
      <GroesseSchritt
        taetigkeiten={['B'] as Taetigkeit[]}
        groessen={{}}
        onGroesseAendern={vi.fn()}
        onWeiter={vi.fn()}
      />,
    );
    expect(screen.getByLabelText(/betreute.*Einheiten|Einheiten.*betreut/i)).toBeInTheDocument();
  });

  it('fragt bei Tätigkeit C nach Vermarktungen/Verkäufen pro Jahr', () => {
    render(
      <GroesseSchritt
        taetigkeiten={['C'] as Taetigkeit[]}
        groessen={{}}
        onGroesseAendern={vi.fn()}
        onWeiter={vi.fn()}
      />,
    );
    expect(screen.getByLabelText(/Vermarktungen?.*Jahr|Verkäufe.*Jahr/i)).toBeInTheDocument();
  });

  it('zeigt bei Mehrfachauswahl A+B beide Felder', () => {
    render(
      <GroesseSchritt
        taetigkeiten={['A', 'B'] as Taetigkeit[]}
        groessen={{}}
        onGroesseAendern={vi.fn()}
        onWeiter={vi.fn()}
      />,
    );
    expect(screen.getByLabelText(/eigene.*Einheiten|Einheiten.*eigene/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/betreute.*Einheiten|Einheiten.*betreut/i)).toBeInTheDocument();
  });

  it('ist bei größenunabhängiger Tätigkeit (kein Bucket) direkt fortsetzbar', () => {
    render(
      <GroesseSchritt
        taetigkeiten={[] as Taetigkeit[]}
        groessen={{}}
        onGroesseAendern={vi.fn()}
        onWeiter={vi.fn()}
      />,
    );
    // Kein Eingabefeld, aber ein aktiver Weiter-Button (größenunabhängig, z.B. Mandantenbetreuung)
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Weiter/i })).toBeEnabled();
  });
});
