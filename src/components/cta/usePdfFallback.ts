import { useEffect, useState } from 'react';

/**
 * PDF-Fallback-Einblendung (§14.4): bei HighIntent ist der PDF-Hinweis initial
 * unsichtbar und erscheint erst bei Exit-Intent oder Scroll-Ende — nie im selben
 * Sichtfeld wie der Termin-CTA. Ohne HighIntent ist er ein normaler Sekundär-CTA.
 * Die im PRD optionale Zweitbesuch-Erkennung entfällt bewusst: sie bräuchte
 * Cookie/Storage und widerspräche dem Datenschutz-Versprechen (§G6, PrivacyProof).
 */
export function usePdfFallbackSichtbar(highIntent: boolean): boolean {
  const [sichtbar, setSichtbar] = useState(!highIntent);

  useEffect(() => {
    if (!highIntent || sichtbar) return;

    function exitIntent(e: MouseEvent) {
      // Maus verlässt das Dokument nach oben (Tab-/URL-Leiste) → Exit-Intent
      if (e.clientY <= 0 && !e.relatedTarget) setSichtbar(true);
    }
    function scrollEnde() {
      const rest = document.documentElement.scrollHeight - window.scrollY - window.innerHeight;
      if (rest < 80) setSichtbar(true);
    }

    document.addEventListener('mouseout', exitIntent);
    window.addEventListener('scroll', scrollEnde, { passive: true });
    return () => {
      document.removeEventListener('mouseout', exitIntent);
      window.removeEventListener('scroll', scrollEnde);
    };
  }, [highIntent, sichtbar]);

  return sichtbar;
}
