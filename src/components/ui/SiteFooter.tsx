/**
 * SiteFooter (§9.2 #10): Impressum, Datenschutz, Kontakt — keine Badges.
 * Bewusst <a> statt Router-Link: funktioniert auch in Standalone-Renderings
 * (Tests, Prerender) ohne Router-Kontext.
 */
export function SiteFooter() {
  return (
    <footer
      data-testid="site-footer"
      style={{
        borderTop: '1px solid var(--farbe-linie, #eee)',
        padding: '2rem 1.5rem',
        marginTop: '3rem',
      }}
    >
      <nav aria-label="Rechtliches und Kontakt">
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem 1.5rem',
            justifyContent: 'center',
            fontSize: '0.9rem',
          }}
        >
          <li>
            <a href="/impressum">Impressum</a>
          </li>
          <li>
            <a href="/datenschutz">Datenschutz</a>
          </li>
          <li>
            <a href="mailto:admin@menosgada.de">Kontakt</a>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
