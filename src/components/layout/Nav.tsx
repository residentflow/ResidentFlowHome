import { Link } from 'react-router-dom';
import { CTA_ANALYSE } from '@/content/texte';

/**
 * Kopf-Navigation im Editorial-Stil (Richtung A): Wortmarke + schlanke Links + eine ruhige
 * Sekundär-CTA. Bewusst zurückhaltend — der Hauptsog liegt im Inhalt, nicht in der Leiste.
 */
export function Nav() {
  return (
    <nav className="rf-nav" aria-label="Hauptnavigation">
      <div className="rf-nav__inner">
        <Link to="/" className="rf-logo">
          Resident<b>Flow</b>
        </Link>
        <div className="rf-nav__links">
          <a href="/#beweis">Findings</a>
          <a href="/#datenschutz-beweis">Datenschutz</a>
          <Link to="/founder">Gründer</Link>
          <Link to="/faq">FAQ</Link>
        </div>
        <a href="/#schatzsuche" className="rf-btn rf-btn--ghost">
          {CTA_ANALYSE}
        </a>
      </div>
    </nav>
  );
}
