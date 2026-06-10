/**
 * /partnerprogramm (PRD §2.3/§14.5) — erklärt den Partneransatz für Steuerberater
 * (und Multiplikatoren) und führt zum Diagnose-Gespräch. Kein externes Programm:
 * der nächste Schritt ist immer das Gespräch (/termin).
 */
export function PartnerprogrammSeite() {
  return (
    <main
      data-testid="partnerprogramm-seite"
      style={{ maxWidth: 760, margin: '0 auto', padding: '2rem 1rem' }}
    >
      <h1 style={{ fontFamily: 'Georgia, serif' }}>Partneransatz für Steuerberater</h1>
      <p>
        Sie betreuen Mandanten mit Immobilienbestand? Viele davon lassen wiederkehrende Potenziale
        liegen — nicht gezogene Index- und Staffelmieten, unstrukturierte Unterlagen, vermeidbarer
        Verwaltungsaufwand. ResidentFlow findet diese Potenziale systematisch und priorisiert den
        nächsten umsetzbaren Schritt.
      </p>

      <h2>So funktioniert die Zusammenarbeit</h2>
      <ul data-testid="partner-ablauf">
        <li>Sie bringen Mandanten mit relevantem Bestand ein — datensparsam, ohne Vorleistung.</li>
        <li>Wir analysieren gemeinsam, transparent und vor den Augen Ihres Mandanten.</li>
        <li>Sie bleiben der steuerliche Ankerpunkt; wir liefern die Bestandsperformance.</li>
      </ul>

      <h2>Was Sie davon haben</h2>
      <p data-testid="partner-nutzen">
        Ein zusätzlicher, konkreter Mehrwert für Ihre Mandanten — ohne dass Sie selbst Software
        einführen oder Prozesse umbauen müssen. Die Konditionen besprechen wir individuell im
        Gespräch.
      </p>

      <p style={{ marginTop: '1.5rem' }}>
        <a
          data-testid="partner-termin"
          href="/termin?src=partner"
          style={{
            display: 'inline-block',
            padding: '0.7rem 1.2rem',
            border: '1px solid var(--farbe-akzent, #b8860b)',
            borderRadius: 8,
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          Partneransatz im Gespräch besprechen
        </a>
      </p>
      <p style={{ color: '#777', fontSize: '0.9rem' }}>
        30 Minuten, unverbindlich. Kein Pitch — wir schauen, ob es zu Ihren Mandanten passt.
      </p>
    </main>
  );
}

export default PartnerprogrammSeite;
