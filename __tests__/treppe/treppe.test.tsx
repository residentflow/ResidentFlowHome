import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';

import { routing } from '@/domain/engine/routing';
import { bestimmeStufen } from '@/domain/engine/bestimmeStufen';
import { aggregiere } from '@/domain/engine/aggregiere';
import type { HebelLaufzeit, RoutingErgebnis, StufenFreigabe } from '@/domain/types';
import type { Spanne } from '@/domain/schema/spanne';
import { TERMINLINK_TEXT } from '@/content/texte';

import { Treppe } from '@/components/treppe/Treppe';
import { Stufe1Playbook } from '@/components/treppe/Stufe1Playbook';
import { Stufe2ZweiWege } from '@/components/treppe/Stufe2ZweiWege';
import { Stufe3Automatisierung } from '@/components/treppe/Stufe3Automatisierung';
import { VerdichtetesErgebnis } from '@/components/treppe/VerdichtetesErgebnis';
import { Terminlink } from '@/components/treppe/Terminlink';

// ── Hilfsfunktionen ──────────────────────────────────────────────────────────

function routingMitStufen(
  rollen: Parameters<typeof routing>[0],
  groessen: Parameters<typeof routing>[1],
): { routing: RoutingErgebnis; stufen: StufenFreigabe } {
  const r = routing(rollen, groessen);
  return { routing: r, stufen: bestimmeStufen(r) };
}

const HEBEL_MIT_VIDEO: HebelLaufzeit[] = [
  {
    hebelId: 'mietpotenzial',
    zustand: 'quantifiziert',
    rahmung: 'chance',
    spanne: { min: 5000, max: 12000 },
  },
  {
    hebelId: 'leerstand',
    zustand: 'quantifiziert',
    rahmung: 'chance',
    spanne: { min: 3000, max: 8000 },
  },
];

const HEBEL_OHNE_VIDEO: HebelLaufzeit[] = [
  { hebelId: 'ohne-video-hebel', zustand: 'relevant', rahmung: 'chance' },
];

const HEBELIDS_MIT_VIDEO = ['mietpotenzial', 'leerstand'];
const HEBELIDS_OHNE_VIDEO: string[] = [];

// ── Tests ────────────────────────────────────────────────────────────────────

describe('Treppe M4 (§10)', () => {
  it('Stufe 1 Methodik ist für alle sichtbar', () => {
    render(<Stufe1Playbook />);
    expect(screen.getByText(/Stufe 1 — Methodik/i)).toBeInTheDocument();
    expect(screen.getByTestId('playbook-schwerpunkte')).toBeInTheDocument();
  });

  it('Stufe 2 bietet zwei Wege: PrivacyFlow-Download oder geführte Analyse im Termin', () => {
    render(<Stufe2ZweiWege />);
    // Weg A: ResidentPrivacyFlow Download
    expect(screen.getByText(/ResidentPrivacyFlow/i)).toBeInTheDocument();
    // Weg B: geführte Analyse ohne Installation im Termin
    expect(screen.getByText(/geführte Analyse/i)).toBeInTheDocument();
  });

  it('Stufe 3 ist nur ab Schwelle sichtbar — stufe3=false → nicht im DOM', () => {
    const { stufen } = routingMitStufen(['buyAndHold'], { A: 10 });
    expect(stufen.stufe3).toBe(false);
    render(
      <Treppe
        routing={routingMitStufen(['buyAndHold'], { A: 10 }).routing}
        stufen={stufen}
        laufzeiten={HEBEL_MIT_VIDEO}
        hebelIdsWithVideo={HEBELIDS_MIT_VIDEO}
        gesamtSpanne={aggregiere(HEBEL_MIT_VIDEO)}
      />,
    );
    expect(screen.queryByTestId('stufe3')).not.toBeInTheDocument();
  });

  it('Stufe 3 ist nur ab Schwelle sichtbar — stufe3=true → sichtbar', () => {
    const { routing: r, stufen } = routingMitStufen(['buyAndHold'], { A: 60 });
    expect(stufen.stufe3).toBe(true);
    render(
      <Treppe
        routing={r}
        stufen={stufen}
        laufzeiten={HEBEL_MIT_VIDEO}
        hebelIdsWithVideo={HEBELIDS_MIT_VIDEO}
        gesamtSpanne={aggregiere(HEBEL_MIT_VIDEO)}
      />,
    );
    expect(screen.getByTestId('stufe3')).toBeInTheDocument();
  });

  it('"ResidentFlowAI" erscheint ausschließlich in der Stufe-3-Komponente', () => {
    // Stufe3Automatisierung enthält den Begriff
    const { unmount } = render(
      <Stufe3Automatisierung laufzeiten={HEBEL_MIT_VIDEO} hebelIdsWithVideo={HEBELIDS_MIT_VIDEO} />,
    );
    expect(document.body.textContent).toContain('ResidentFlowAI');
    unmount();

    // Stufe1, Stufe2, VerdichtetesErgebnis, Terminlink enthalten ihn NICHT
    const spanne: Spanne = { min: 8000, max: 20000 };
    const { routing: r, stufen } = routingMitStufen(['buyAndHold'], { A: 10 });

    render(<Stufe1Playbook />);
    expect(document.body.textContent).not.toContain('ResidentFlowAI');
    cleanup();

    render(<Stufe2ZweiWege />);
    expect(document.body.textContent).not.toContain('ResidentFlowAI');
    cleanup();

    render(
      <VerdichtetesErgebnis
        routing={r}
        stufen={stufen}
        gesamtSpanne={spanne}
        laufzeiten={HEBEL_MIT_VIDEO}
      />,
    );
    expect(document.body.textContent).not.toContain('ResidentFlowAI');
    cleanup();

    render(<Terminlink />);
    expect(document.body.textContent).not.toContain('ResidentFlowAI');
  });

  it('Stufe 3 zeigt ein Video pro Hebel', () => {
    render(
      <Stufe3Automatisierung laufzeiten={HEBEL_MIT_VIDEO} hebelIdsWithVideo={HEBELIDS_MIT_VIDEO} />,
    );
    // Jeder Hebel mit Video bekommt einen Video-Container
    const videos = screen.getAllByTestId(/video-hebel-/);
    expect(videos).toHaveLength(HEBEL_MIT_VIDEO.length);
  });

  it('ein Hebel ohne Video zeigt ab Schwelle direkt den Terminlink (Übergangszustand)', () => {
    render(
      <Stufe3Automatisierung
        laufzeiten={HEBEL_OHNE_VIDEO}
        hebelIdsWithVideo={HEBELIDS_OHNE_VIDEO}
      />,
    );
    // kein Video
    expect(screen.queryByTestId(/video-hebel-/)).not.toBeInTheDocument();
    // stattdessen Terminlink
    expect(screen.getByText(TERMINLINK_TEXT)).toBeInTheDocument();
  });

  it('der Terminlink-Text lautet exakt "Ihren Bestand gemeinsam ansehen"', () => {
    render(<Terminlink />);
    expect(screen.getByText('Ihren Bestand gemeinsam ansehen')).toBeInTheDocument();
  });

  it('der Terminlink lautet NICHT "Gespräch buchen" und NICHT "Potenzial validieren"', () => {
    render(<Terminlink />);
    expect(screen.queryByText(/Gespräch buchen/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Potenzial validieren/i)).not.toBeInTheDocument();
  });

  it('das verdichtete Ergebnis zeigt EINEN empfohlenen Hauptweg plus Alternativen', () => {
    const spanne: Spanne = { min: 8000, max: 20000 };
    const { routing: r, stufen } = routingMitStufen(['buyAndHold'], { A: 60 });
    render(
      <VerdichtetesErgebnis
        routing={r}
        stufen={stufen}
        gesamtSpanne={spanne}
        laufzeiten={HEBEL_MIT_VIDEO}
      />,
    );
    expect(screen.getByTestId('empfohlener-hauptweg')).toBeInTheDocument();
    expect(screen.getByTestId('alternativen')).toBeInTheDocument();
  });

  it('das Gesamtpotenzial wird als Spanne dargestellt (min–max €)', () => {
    const spanne: Spanne = { min: 8000, max: 20000 };
    const { routing: r, stufen } = routingMitStufen(['buyAndHold'], { A: 60 });
    render(
      <VerdichtetesErgebnis
        routing={r}
        stufen={stufen}
        gesamtSpanne={spanne}
        laufzeiten={HEBEL_MIT_VIDEO}
      />,
    );
    const ergebnisContainer = screen.getByTestId('gesamtpotenzial');
    expect(within(ergebnisContainer).getByText(/8\.000/)).toBeInTheDocument();
    expect(within(ergebnisContainer).getByText(/20\.000/)).toBeInTheDocument();
  });

  it('Multiplikatoren erhalten einen Partnerprogramm-Link (endAusgang=partnerprogramm)', () => {
    const spanne: Spanne = { min: 1000, max: 5000 };
    const { routing: r, stufen } = routingMitStufen(['steuerberater'], {});
    expect(r.endAusgang).toBe('partnerprogramm');
    render(
      <VerdichtetesErgebnis routing={r} stufen={stufen} gesamtSpanne={spanne} laufzeiten={[]} />,
    );
    expect(screen.getByTestId('partnerprogramm-link')).toBeInTheDocument();
  });

  it('die Treppe ist additiv (höhere Stufen ersetzen niedrigere nicht) — bei stufe3=true sind Stufe 1 und 2 weiterhin sichtbar', () => {
    const { routing: r, stufen } = routingMitStufen(['buyAndHold'], { A: 60 });
    expect(stufen.stufe3).toBe(true);
    render(
      <Treppe
        routing={r}
        stufen={stufen}
        laufzeiten={HEBEL_MIT_VIDEO}
        hebelIdsWithVideo={HEBELIDS_MIT_VIDEO}
        gesamtSpanne={aggregiere(HEBEL_MIT_VIDEO)}
      />,
    );
    expect(screen.getByTestId('stufe1')).toBeInTheDocument();
    expect(screen.getByTestId('stufe2')).toBeInTheDocument();
    expect(screen.getByTestId('stufe3')).toBeInTheDocument();
  });
});

// cleanup helper for inline cleanup
function cleanup() {
  document.body.innerHTML = '';
}
