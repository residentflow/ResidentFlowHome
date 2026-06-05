import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { Hero } from '@/components/sections/Hero';
import { WahrnehmungsShift } from '@/components/sections/WahrnehmungsShift';
import { ProblemAbschnitt } from '@/components/sections/ProblemAbschnitt';
import { Beweis } from '@/components/sections/Beweis';
import { Bruecke } from '@/components/sections/Bruecke';
import { DatenschutzBeweis } from '@/components/sections/DatenschutzBeweis';
import { Founder } from '@/components/sections/Founder';
import { Schatzsuche, type SchatzsucheErgebnis } from '@/components/schatzsuche/Schatzsuche';
import { Treppe } from '@/components/treppe/Treppe';
import { VerdichtetesErgebnis } from '@/components/treppe/VerdichtetesErgebnis';
import { OptInFormular } from '@/components/treppe/OptInFormular';
import { routing } from '@/domain/engine/routing';
import { bestimmeStufen } from '@/domain/engine/bestimmeStufen';
import { schatzsucheConfig } from '@/content/schatzsuche.config';

function Abschnitt({ testid, children }: { testid: string; children: ReactNode }) {
  return <div data-testid={testid}>{children}</div>;
}

/**
 * Landingpage — Komposition der 9 Abschnitte in fixer Reihenfolge (§9).
 * Abschnitt 6 (Schatzsuche) liefert über onErgebnis das Live-Ergebnis an Abschnitt 7
 * (Treppe + verdichtetes Ergebnis + Opt-in, §10). Der Datenschutz-Beweis steht NACH der Suche (§9 #8).
 */
export function LandingPage() {
  const [ergebnis, setErgebnis] = useState<SchatzsucheErgebnis | null>(null);

  const handleErgebnis = useCallback((e: SchatzsucheErgebnis) => {
    setErgebnis(e);
  }, []);

  const hebelIdsMitVideo = useMemo(
    () => schatzsucheConfig.hebel.filter((h) => h.videoLink).map((h) => h.id),
    [],
  );

  const auswertung = useMemo(() => {
    if (!ergebnis || ergebnis.rollen.length === 0) return null;
    const routingErgebnis = routing(ergebnis.rollen, ergebnis.groessen);
    return {
      routingErgebnis,
      stufen: bestimmeStufen(routingErgebnis),
    };
  }, [ergebnis]);

  async function handleOptIn(daten: {
    email: string;
    consentPdf: true;
    consentAbo: boolean;
  }): Promise<void> {
    // Datenkanal NUR auf bewusste Nutzeraktion NACH dem Ergebnis (kein Gate, §10.4).
    if (!ergebnis || !auswertung) return;
    await fetch('/api/optin', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: daten.email,
        consentPdf: true,
        consentAbo: daten.consentAbo,
        rolle: ergebnis.rollen[0],
        relevanteEinheiten: auswertung.routingErgebnis.relevanteEinheiten,
        ergebnisSpanne: ergebnis.aggregat,
      }),
    });
  }

  return (
    <main>
      <Abschnitt testid="abschnitt-1-hero">
        <Hero />
      </Abschnitt>
      <Abschnitt testid="abschnitt-2-wahrnehmung">
        <WahrnehmungsShift />
      </Abschnitt>
      <Abschnitt testid="abschnitt-3-problem">
        <ProblemAbschnitt />
      </Abschnitt>
      <Abschnitt testid="abschnitt-4-beweis">
        <Beweis />
      </Abschnitt>
      <Abschnitt testid="abschnitt-5-bruecke">
        <Bruecke />
      </Abschnitt>
      <Abschnitt testid="abschnitt-6-schatzsuche">
        <Schatzsuche config={schatzsucheConfig} onErgebnis={handleErgebnis} />
      </Abschnitt>
      <Abschnitt testid="abschnitt-7-ergebnis">
        {ergebnis && ergebnis.imErgebnis && auswertung ? (
          <div>
            {/* Verdichtetes Ergebnis: zeigt den persona-basierten Hauptweg (auch Partnerprogramm).
                Die Euro-Spanne blendet die Komponente selbst erst bei Quantifizierung ein (§7). */}
            <VerdichtetesErgebnis
              routing={auswertung.routingErgebnis}
              stufen={auswertung.stufen}
              gesamtSpanne={ergebnis.aggregat}
              laufzeiten={ergebnis.relevanteHebel}
            />
            {/* Treppe nur für Bestands-/Entwicklungs-Pfade; Multiplikatoren → Partnerprogramm (§10.2). */}
            {auswertung.routingErgebnis.endAusgang !== 'partnerprogramm' && (
              <Treppe
                routing={auswertung.routingErgebnis}
                stufen={auswertung.stufen}
                laufzeiten={ergebnis.relevanteHebel}
                hebelIdsWithVideo={hebelIdsMitVideo}
                gesamtSpanne={ergebnis.aggregat}
              />
            )}
            {ergebnis.rollen[0] && (
              <OptInFormular
                rolle={ergebnis.rollen[0]}
                relevanteEinheiten={auswertung.routingErgebnis.relevanteEinheiten}
                ergebnisSpanne={ergebnis.aggregat}
                onSubmit={handleOptIn}
              />
            )}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--farbe-tinte-weich)' }}>
            Ihr verdichtetes Ergebnis erscheint hier, sobald Sie die Schatzsuche durchlaufen haben.
          </p>
        )}
      </Abschnitt>
      <Abschnitt testid="abschnitt-8-datenschutz">
        <DatenschutzBeweis />
      </Abschnitt>
      <Abschnitt testid="abschnitt-9-founder">
        <Founder />
      </Abschnitt>
    </main>
  );
}

export default LandingPage;
