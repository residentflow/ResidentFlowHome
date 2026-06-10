import type { ReactNode } from 'react';
import { WahrnehmungsShift } from '@/components/sections/WahrnehmungsShift';
import { DatenschutzBeweis } from '@/components/sections/DatenschutzBeweis';
import { Founder } from '@/components/sections/Founder';
import { BestandsCheck } from '@/components/bestands-check/BestandsCheck';
import { ProofStrip } from '@/components/proof-strip/ProofStrip';
import { BeispielAnalyse } from '@/components/beispiel-analyse/BeispielAnalyse';
import { FAQ } from '@/components/content/FAQ';
import { SiteFooter } from '@/components/ui/SiteFooter';
import { checkConfig, copy } from '@/config/checkConfig';

function Abschnitt({ testid, children }: { testid: string; children: ReactNode }) {
  return <div data-testid={testid}>{children}</div>;
}

/**
 * Landingpage — Sektionsfolge nach PRD §9.2 (vollständig, #1–#10).
 * #1 SiteHeader · #2 HeroCheck (Eyebrow+H1+Trustline+BestandsCheck als eine Einheit,
 * §9.1 above the fold; KEIN „Check starten"-Button — der Check IST der Hero) ·
 * #3 SolutionResult rendert inline im Check · #4 ProofStrip · #5 BeispielAnalyse ·
 * #6 PerceptionShift · #7 PrivacyProof NACH dem Check · #8 FounderShort ·
 * #9 FAQ · #10 SiteFooter.
 */
export function LandingPage() {
  const calUrl = checkConfig.settings.calComUrl || '/termin';

  return (
    <main>
      {/* #1 SiteHeader — Termin-Button funktioniert immer (source=header-direct, §14.6) */}
      <header
        data-testid="site-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--farbe-linie, #eee)',
        }}
      >
        <span style={{ fontFamily: 'Georgia, serif', fontWeight: 700 }}>ResidentFlow</span>
        <a
          data-testid="cta-header"
          href={`${calUrl}?metadata[source]=header-direct`}
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid var(--farbe-akzent, #b8860b)',
            borderRadius: '8px',
            textDecoration: 'none',
          }}
        >
          {copy('cta.header')}
        </a>
      </header>

      {/* #2 HeroCheck — eine visuelle Einheit (§9.1) */}
      <Abschnitt testid="hero-check">
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '1.5rem 1rem 0' }}>
          <p data-testid="eyebrow" style={{ letterSpacing: '0.08em', fontSize: '0.85rem' }}>
            {copy('copy.eyebrow')}
          </p>
          <h1 style={{ fontFamily: 'Georgia, serif', lineHeight: 1.15 }}>{copy('copy.h1.A')}</h1>
          <p data-testid="trustline" style={{ color: 'var(--farbe-tinte-weich, #555)' }}>
            {copy('copy.trustline')}
          </p>
        </div>
        {/* #3 SolutionResult rendert inline innerhalb des Checks nach Problemwahl */}
        <BestandsCheck />
      </Abschnitt>

      {/* #4 ProofStrip — nur mit approved Findings (G1), sonst aus */}
      <Abschnitt testid="proof-strip-slot">
        <ProofStrip />
      </Abschnitt>

      {/* #5 BeispielAnalyse (Stufe 0) — Platzhalter öffentlich gegated (§12) */}
      <Abschnitt testid="beispiel-analyse-slot">
        <BeispielAnalyse />
      </Abschnitt>

      {/* #6 PerceptionShift */}
      <Abschnitt testid="perception-shift">
        <WahrnehmungsShift />
      </Abschnitt>

      {/* #7 PrivacyProof — NACH dem Check (Bestätigung statt Behauptung, §9.2) */}
      <Abschnitt testid="privacy-proof">
        <DatenschutzBeweis />
      </Abschnitt>

      {/* #8 FounderShort */}
      <Abschnitt testid="founder-short">
        <Founder />
      </Abschnitt>

      {/* #9 FAQ — die 5 Vertrauensfragen (§23) */}
      <Abschnitt testid="faq">
        <FAQ />
      </Abschnitt>

      {/* #10 SiteFooter — Impressum, Datenschutz, Kontakt; keine Badges */}
      <SiteFooter />
    </main>
  );
}

export default LandingPage;
