/**
 * SEO-Meta-Daten für alle statischen Routen der Landingpage.
 * Liefert Title, Description, Open-Graph- und Twitter-Card-Tags.
 * §15.4: vorgerendert für den googelnden Besucher.
 */

export interface OgMeta {
  title: string;
  description: string;
  type: string;
  url: string;
  image: string;
}

export interface TwitterMeta {
  card: string;
  title: string;
  description: string;
}

export interface RouteMeta {
  title: string;
  description: string;
  og: OgMeta;
  twitter: TwitterMeta;
}

const BASIS_URL = 'https://residentflow.de';
const OG_IMAGE = `${BASIS_URL}/og-image.png`;

const META_DATEN: Record<string, RouteMeta> = {
  '/': {
    title: 'ResidentFlow — Bestandspotenziale systematisch heben',
    description:
      'Entdecken Sie in 3 Minuten, wo in Ihrem Immobilienbestand Ertrag liegen bleibt. Kostenlose Bestandspotenzial-Analyse — keine Registrierung, keine Datenübertragung.',
    og: {
      title: 'ResidentFlow — Bestandspotenziale systematisch heben',
      description:
        'Entdecken Sie in 3 Minuten, wo in Ihrem Immobilienbestand Ertrag liegen bleibt. Kostenlose Analyse ohne Registrierung.',
      type: 'website',
      url: BASIS_URL,
      image: OG_IMAGE,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'ResidentFlow — Bestandspotenziale systematisch heben',
      description:
        'In 3 Minuten herausfinden, wo im Immobilienbestand Ertrag liegen bleibt. Keine Registrierung, keine Datenübertragung.',
    },
  },

  '/founder': {
    title: 'Founder — ResidentFlow',
    description:
      'Aus dem eigenen Bestand entwickelt: Wie ein Bestandshalter systematisch Potenziale hebt — und warum er das Problem von innen kennt.',
    og: {
      title: 'Founder — ResidentFlow',
      description:
        'Aus dem eigenen Bestand entwickelt: Wie ein Bestandshalter systematisch Potenziale hebt.',
      type: 'profile',
      url: `${BASIS_URL}/founder`,
      image: OG_IMAGE,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Founder — ResidentFlow',
      description: 'Eigener Bestandshalter, eigenes Geld im Spiel — das Problem aus erster Hand.',
    },
  },

  '/faq': {
    title: 'Häufige Fragen — ResidentFlow',
    description:
      'Was passiert mit Ihren Daten? Ersetzen wir Ihre Hausverwaltung? Alle wichtigen Fragen zu ResidentFlow transparent beantwortet.',
    og: {
      title: 'Häufige Fragen — ResidentFlow',
      description:
        'Datenschutz, Funktionsweise und alles Wichtige zu ResidentFlow transparent beantwortet.',
      type: 'website',
      url: `${BASIS_URL}/faq`,
      image: OG_IMAGE,
    },
    twitter: {
      card: 'summary',
      title: 'Häufige Fragen — ResidentFlow',
      description:
        'Was passiert mit Ihren Daten? Wie funktioniert die Analyse? Alle Antworten auf einen Blick.',
    },
  },

  '/impressum': {
    title: 'Impressum — ResidentFlow',
    description: 'Impressum und rechtliche Angaben zu ResidentFlow.',
    og: {
      title: 'Impressum — ResidentFlow',
      description: 'Impressum und rechtliche Angaben zu ResidentFlow.',
      type: 'website',
      url: `${BASIS_URL}/impressum`,
      image: OG_IMAGE,
    },
    twitter: {
      card: 'summary',
      title: 'Impressum — ResidentFlow',
      description: 'Impressum und rechtliche Angaben zu ResidentFlow.',
    },
  },

  '/datenschutz': {
    title: 'Datenschutzerklärung — ResidentFlow',
    description:
      'Datenschutzerklärung: Wie ResidentFlow Ihre Daten schützt — cookielose Analyse, clientseitige Suche ohne Datenübertragung.',
    og: {
      title: 'Datenschutzerklärung — ResidentFlow',
      description:
        'Cookielose Analyse, clientseitige Suche ohne Datenübertragung — Datenschutz technisch eingelöst.',
      type: 'website',
      url: `${BASIS_URL}/datenschutz`,
      image: OG_IMAGE,
    },
    twitter: {
      card: 'summary',
      title: 'Datenschutzerklärung — ResidentFlow',
      description:
        'Ihre Daten bleiben auf Ihrem Gerät. Cookielose Analyse, keine Weitergabe an US-Cloud.',
    },
  },
};

/**
 * Gibt die SEO-Meta-Daten für eine gegebene Route zurück.
 * Unbekannte Routen erhalten einen sinnvollen Fallback.
 */
export function metaFuerRoute(pfad: string): RouteMeta {
  const meta = META_DATEN[pfad];
  if (meta) return meta;

  // Fallback für unbekannte Routen
  return {
    title: 'ResidentFlow — Bestandspotenziale systematisch heben',
    description:
      'ResidentFlow hilft Bestandshaltern und Verwaltern, systematisch Ertragspotenziale zu identifizieren.',
    og: {
      title: 'ResidentFlow — Bestandspotenziale systematisch heben',
      description: 'Systematische Bestandspotenzial-Analyse für Immobilienprofis.',
      type: 'website',
      url: `${BASIS_URL}${pfad}`,
      image: OG_IMAGE,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'ResidentFlow — Bestandspotenziale systematisch heben',
      description: 'Systematische Bestandspotenzial-Analyse für Immobilienprofis.',
    },
  };
}
