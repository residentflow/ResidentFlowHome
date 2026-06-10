import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LoesungsSeite } from '@/pages/LoesungsSeite';

function renderAt(pfad: string) {
  return render(
    <MemoryRouter initialEntries={[pfad]}>
      <Routes>
        <Route path="/loesungen/:slug" element={<LoesungsSeite />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('LoesungsSeite /loesungen/:slug (§7/§11)', () => {
  it('rendert Answer-first und SolutionResult für ein bekanntes Problem', () => {
    renderAt('/loesungen/mieten-indexmieten-pruefen');
    expect(screen.getByTestId('loesungs-seite')).toBeInTheDocument();
    expect(screen.getByTestId('answer-first')).toBeInTheDocument();
    expect(screen.getByTestId('solution-result')).toBeInTheDocument();
  });

  it('Motor A ohne Kontext: kein Skalierungs-Block; nach zwei Chip-Klicks (HighIntent) erscheint er', () => {
    renderAt('/loesungen/mieten-indexmieten-pruefen');
    expect(screen.queryByTestId('skalierungs-block')).toBeNull();
    fireEvent.click(screen.getByTestId('chip-role-buyAndHold'));
    fireEvent.click(screen.getByTestId('chip-bucket-3')); // rank 3 ≥ Schwelle
    expect(screen.getByTestId('skalierungs-block')).toBeInTheDocument();
  });

  it('unbekannter Slug zeigt einen Fallback', () => {
    renderAt('/loesungen/gibt-es-nicht');
    expect(screen.getByText(/nicht gefunden/i)).toBeInTheDocument();
  });

  it('AP6.5: Vermarktungs-Routen Neuvermietung + Verkauf sind live (≥2 Lösungen)', () => {
    for (const slug of ['neuvermietung-dauert-zu-lange', 'verkauf-dauert-zu-lange']) {
      const { unmount } = renderAt(`/loesungen/${slug}`);
      expect(screen.getByTestId('solution-result')).toBeInTheDocument();
      expect(screen.getAllByTestId(/^solution-card-/).length).toBeGreaterThanOrEqual(2);
      unmount();
    }
  });
});
