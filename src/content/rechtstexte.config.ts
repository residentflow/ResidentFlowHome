/**
 * Rechtstexte-Entwurf — Impressum & Datenschutzerklärung (§12, §16).
 *
 * ⚠️ HINWEIS: Dieser Entwurf muss vor Veröffentlichung rechtlich prüfen lassen werden.
 * Alle mit [PLATZHALTER] markierten Felder sind durch echte Angaben zu ersetzen.
 * Nur ein Rechtsexperte kann die abschließende Konformität bestätigen.
 */

export interface ImpressumDaten {
  ueberschrift: string;
  anbieter: string;
  name: string;
  strasse: string;
  plzOrt: string;
  land: string;
  email: string;
  ustIdNr: string;
  verantwortlicher: string;
  hinweis: string;
}

export interface DatenschutzAbschnitt {
  titel: string;
  inhalt: string;
}

export interface DatenschutzDaten {
  ueberschrift: string;
  hinweis: string;
  abschnitte: DatenschutzAbschnitt[];
}

// ——— Impressum ———

export const IMPRESSUM: ImpressumDaten = {
  ueberschrift: 'Impressum',
  anbieter: 'Anbieter (Verantwortlicher gem. § 5 TMG)',
  name: '[PLATZHALTER: Vollständiger Name oder Firmenname]',
  strasse: '[PLATZHALTER: Straße und Hausnummer]',
  plzOrt: '[PLATZHALTER: PLZ und Ort]',
  land: 'Deutschland',
  email: '[PLATZHALTER: kontakt@domain.de]',
  ustIdNr: '[PLATZHALTER: DE000000000 oder „nicht umsatzsteuerpflichtig"]',
  verantwortlicher:
    '[PLATZHALTER: Name der inhaltlich verantwortlichen Person gemäß § 18 Abs. 2 MStV]',
  hinweis:
    'Alle Anbieterangaben sind Platzhalter und müssen vor Veröffentlichung durch echte Daten ersetzt werden. ' +
    'Dieses Impressum muss vor Liveschaltung rechtlich prüfen lassen werden.',
};

// ——— Datenschutzerklärung ———

export const DATENSCHUTZ: DatenschutzDaten = {
  ueberschrift: 'Datenschutzerklärung',
  hinweis:
    'Entwurf — rechtlich prüfen lassen. Alle Angaben sind Platzhalter, ' +
    'die vor Liveschaltung durch einen Rechtsexperten geprüft und ergänzt werden müssen.',
  abschnitte: [
    {
      titel: 'Überblick',
      inhalt:
        'Diese Datenschutzerklärung informiert Sie darüber, wie auf dieser Website mit Ihren Daten ' +
        'umgegangen wird. Das Grundprinzip: So wenig Daten wie möglich, so transparent wie möglich.',
    },
    {
      titel: 'Bestandspotenzial-Suche — keine Datenübertragung',
      inhalt:
        'Die interaktive Bestandspotenzial-Suche ("Schatzsuche") läuft vollständig clientseitig ' +
        'in Ihrem Browser. Alle Eingaben — Tätigkeit, Einheitenanzahl, Probleme, Detailangaben — ' +
        'verlassen Ihr Gerät nicht. Es findet keine Übertragung an Server statt, ' +
        'es werden keine Cookies gesetzt, keine Daten gespeichert. ' +
        'Die Suche überträgt nichts; das technische Versprechen ist durch den Quellcode prüfbar.',
    },
    {
      titel: 'Opt-in — der einzige bewusste Datenkanal',
      inhalt:
        'Wenn Sie sich aktiv entscheiden, Ihr Ergebnis-PDF per E-Mail zu erhalten, ' +
        'übermitteln Sie freiwillig folgende Daten: E-Mail-Adresse, Rolle/Tätigkeit, ' +
        'Anzahl relevanter Einheiten sowie Ihre Einwilligung zum PDF-Versand. ' +
        'Optional können Sie einem monatlichen Erkenntnisabo zustimmen (separates Häkchen, ' +
        'nicht vorausgewählt, Double-Opt-in erforderlich). ' +
        'Diese Daten werden ausschließlich zum Versand des angeforderten PDFs und — ' +
        'bei gesonderter Einwilligung — zum Abo-Versand genutzt. ' +
        'Eine Abmeldung ist jederzeit möglich: Per Abmeldelink in jeder E-Mail oder ' +
        'per E-Mail an [PLATZHALTER: kontakt@domain.de].',
    },
    {
      titel: 'Brevo als Auftragsverarbeiter (AVV)',
      inhalt:
        'Für den E-Mail-Versand setzen wir Brevo (ehemals Sendinblue, Brevo SAS, 55 rue d\'Amsterdam, ' +
        '75008 Paris, Frankreich) ein. Brevo verarbeitet Ihre E-Mail-Adresse sowie die übermittelten ' +
        'Kontaktattribute (Rolle, Einheitenanzahl) als Auftragsverarbeiter in unserem Auftrag. ' +
        'Mit Brevo besteht ein Auftragsverarbeitungsvertrag (AVV) gemäß Art. 28 DSGVO. ' +
        'Die Datenverarbeitung erfolgt auf EU-Servern. ' +
        'Weitere Informationen: https://www.brevo.com/de/legal/privacypolicy/',
    },
    {
      titel: 'Webanalyse — Plausible (cookieless)',
      inhalt:
        'Diese Website verwendet Plausible Analytics zur Analyse von Besucherströmen. ' +
        'Plausible ist cookieless: Es werden keine Cookies gesetzt, keine personenbezogenen Daten ' +
        'erhoben und kein Nutzer-Tracking durchgeführt. Es ist kein Cookie-Banner erforderlich. ' +
        'Plausible ist DSGVO-konform und selbst-gehostet auf EU-Infrastruktur. ' +
        'Die erhobenen Statistiken (Seitenaufrufe, Herkunftsland auf Länderebene, Gerätekategorie) ' +
        'sind vollständig anonymisiert. Weitere Informationen: https://plausible.io/data-policy',
    },
    {
      titel: 'Ihre Rechte',
      inhalt:
        'Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung ' +
        'Ihrer personenbezogenen Daten sowie das Recht auf Datenübertragbarkeit. ' +
        'Zur Ausübung Ihrer Rechte wenden Sie sich an: [PLATZHALTER: kontakt@domain.de]. ' +
        'Sie haben außerdem das Recht, bei der zuständigen Aufsichtsbehörde Beschwerde einzureichen.',
    },
    {
      titel: 'Verantwortlicher',
      inhalt:
        'Verantwortlicher im Sinne der DSGVO: [PLATZHALTER: Name und Adresse — siehe Impressum].',
    },
    {
      titel: 'Hinweis zur Rechtsprüfung',
      inhalt:
        'Dieser Datenschutztext ist ein Entwurf. Er muss vor Liveschaltung der Website ' +
        'rechtlich prüfen lassen werden. Alle Platzhalter sind durch echte Angaben zu ersetzen. ' +
        'Nur eine Person mit Rechtskenntnis kann die abschließende Konformität mit DSGVO und TMG bestätigen.',
    },
  ],
};
