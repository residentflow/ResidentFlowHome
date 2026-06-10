/**
 * Footer mit Seiten-Navigation — auf jeder Seite sichtbar, damit Impressum und
 * Datenschutzerklärung von überall erreichbar sind (Pflicht) und FAQ/Gründer-Story
 * auffindbar werden. Bewusst <a> statt Router-Link: funktioniert auch in
 * Standalone-Renderings (Tests, Prerender) ohne Router-Kontext.
 */
export function Footer() {
  const links: Array<{ href: string; label: string }> = [
    { href: '/', label: 'Start' },
    { href: '/faq', label: 'Häufige Fragen' },
    { href: '/founder', label: 'Über den Gründer' },
    { href: '/impressum', label: 'Impressum' },
    { href: '/datenschutz', label: 'Datenschutz' },
  ];

  return (
    <footer
      style={{
        borderTop: 'var(--linie, 1px solid #e0e0e0)',
        padding: 'var(--raum-4, 3rem) var(--raum-3, 1.5rem)',
        background: 'var(--farbe-flaeche, #fafaf5)',
      }}
    >
      <div style={{ maxWidth: 'var(--breite-inhalt)', margin: '0 auto' }}>
        <nav aria-label="Seiten-Navigation">
          <ul
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem 1.5rem',
            }}
          >
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} style={{ fontSize: '0.9rem' }}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p
          style={{
            margin: '1.25rem 0 0',
            fontSize: '0.8rem',
            color: 'var(--farbe-text-sekundaer, #6b7280)',
          }}
        >
          Die Bestandsanalyse läuft vollständig in Ihrem Browser — keine Datenübertragung, kein
          Tracking, keine Cookies.
        </p>
      </div>
    </footer>
  );
}
