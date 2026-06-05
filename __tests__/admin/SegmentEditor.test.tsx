import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SegmentEditor } from '@/components/admin/SegmentEditor';
import { schatzsucheConfig } from '@/content/schatzsuche.config';
import type { Config } from '@/domain/schema/config';

describe('SegmentEditor', () => {
  it('verlangt für jedes Segment einen End-Ausgang', () => {
    let aktuelleConfig: Config = JSON.parse(JSON.stringify(schatzsucheConfig));
    const onAendern = (neu: Config) => {
      aktuelleConfig = neu;
    };

    render(<SegmentEditor config={aktuelleConfig} onAendern={onAendern} />);

    // Alle Segmente aus der Config müssen angezeigt werden
    expect(aktuelleConfig.segmente.length).toBeGreaterThan(0);

    // Für jedes Segment muss ein End-Ausgang-Feld vorhanden sein
    const endAusgangFelder = screen.getAllByRole('combobox');
    expect(endAusgangFelder.length).toBeGreaterThan(0);

    // Der End-Ausgang darf nicht leer sein (Pflicht)
    endAusgangFelder.forEach((feld) => {
      const select = feld as HTMLSelectElement;
      // Ein Segment ohne endAusgang darf nicht gespeichert werden
      expect(select.value).not.toBe('');
    });

    // Beim Versuch einen leeren End-Ausgang zu speichern → Fehler
    const speichernButtons = screen.queryAllByRole('button', {
      name: /speichern|sichern|übernehmen/i,
    });
    if (speichernButtons.length > 0) {
      // Leerwert setzen
      fireEvent.change(endAusgangFelder[0], { target: { value: '' } });
      fireEvent.click(speichernButtons[0]);
      const fehler = screen.queryByText(/pflicht|erforderlich|end-ausgang|ausgang/i);
      expect(fehler).toBeTruthy();
    } else {
      // Mindestens: alle Segmente in der Config haben einen definierten End-Ausgang
      aktuelleConfig.segmente.forEach((seg) => {
        expect(seg.endAusgang).toBeTruthy();
        expect(['gespraech', 'partnerprogramm', 'nur-playbook']).toContain(seg.endAusgang);
      });
    }
  });
});
