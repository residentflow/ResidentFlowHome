import type { RoutingErgebnis, StufenFreigabe, HebelLaufzeit } from '@/domain/types';
import type { Spanne } from '@/domain/schema/spanne';
import { Stufe1Playbook } from '@/components/treppe/Stufe1Playbook';
import { Stufe2ZweiWege } from '@/components/treppe/Stufe2ZweiWege';
import { Stufe3Automatisierung } from '@/components/treppe/Stufe3Automatisierung';
import { VerdichtetesErgebnis } from '@/components/treppe/VerdichtetesErgebnis';

interface TreppeProps {
  routing: RoutingErgebnis;
  stufen: StufenFreigabe;
  laufzeiten: HebelLaufzeit[];
  /** Hebel-IDs, für die ein fertiges Video vorliegt (Übergangszustand §10.1). */
  hebelIdsWithVideo: string[];
  gesamtSpanne: Spanne;
}

/**
 * Treppe (§10.1) — orchestriert die 3 Stufen additiv, nie ersetzend:
 *   Stufe 1 (IMMER) + Stufe 2 (IMMER) + Stufe 3 (NUR ab Schwelle).
 * Höhere Stufen ersetzen keine niedrigeren — der wertvollste Besucher bekommt die meiste Wertschöpfung.
 */
export function Treppe({ routing, stufen, laufzeiten, hebelIdsWithVideo, gesamtSpanne }: TreppeProps) {
  return (
    <div>
      <VerdichtetesErgebnis
        routing={routing}
        stufen={stufen}
        gesamtSpanne={gesamtSpanne}
        laufzeiten={laufzeiten}
      />

      {/* Stufe 1 — IMMER sichtbar */}
      <div data-testid="stufe1">
        <Stufe1Playbook />
      </div>

      {/* Stufe 2 — IMMER sichtbar */}
      <div data-testid="stufe2">
        <Stufe2ZweiWege />
      </div>

      {/* Stufe 3 — NUR ab Schwelle (vollerTreppe=true) */}
      {stufen.stufe3 && (
        <div data-testid="stufe3">
          <Stufe3Automatisierung
            laufzeiten={laufzeiten}
            hebelIdsWithVideo={hebelIdsWithVideo}
          />
        </div>
      )}
    </div>
  );
}
