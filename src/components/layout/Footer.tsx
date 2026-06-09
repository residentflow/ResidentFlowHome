import { Link } from 'react-router-dom';

/**
 * Footer im Editorial-Stil (Richtung A): dunkles Band als ruhiger Abschluss, Wortmarke + die
 * rechtlich/inhaltlich relevanten Sekundärseiten.
 */
export function Footer() {
  return (
    <footer className="rf-footer">
      <div className="rf-footer__inner">
        <Link to="/" className="rf-logo">
          Resident<b>Flow</b>
        </Link>
        <nav className="rf-footer__links" aria-label="Fußzeile">
          <Link to="/founder">Founder-Story</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/impressum">Impressum</Link>
          <Link to="/datenschutz">Datenschutz</Link>
        </nav>
        <span style={{ fontSize: '0.82rem', color: 'var(--farbe-auf-dunkel-weich)' }}>
          © 2026 · Bestandsperformance
        </span>
      </div>
    </footer>
  );
}
