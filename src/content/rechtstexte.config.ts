/**
 * Rechtstexte — Impressum & Datenschutzerklärung (§12, §16).
 *
 * Anbieterdaten: menosgada Service GmbH (Stand Juni 2026).
 * Die Datenschutzerklärung beschreibt ausschließlich Dienste, die diese Seite
 * tatsächlich nutzt (lokale Analyse, Brevo, Plausible, Server-Logs) — keine
 * Fremdbausteine wie Google Analytics/AdWords, die hier nicht im Einsatz sind
 * und dem Kernversprechen („kein Tracking, nie US-Cloud") widersprächen.
 */

export interface ImpressumDaten {
  ueberschrift: string;
  anbieter: string;
  name: string;
  strasse: string;
  plzOrt: string;
  land: string;
  handelsregister: string;
  registergericht: string;
  vertretenDurch: string;
  telefon: string;
  email: string;
  ustIdNr: string;
  verantwortlicher: string;
  euStreitschlichtung: string;
  verbraucherstreitbeilegung: string;
}

export interface DatenschutzAbschnitt {
  titel: string;
  inhalt: string;
}

export interface DatenschutzDaten {
  ueberschrift: string;
  abschnitte: DatenschutzAbschnitt[];
}

// ——— Impressum ———

export const IMPRESSUM: ImpressumDaten = {
  ueberschrift: 'Impressum',
  anbieter: 'Angaben gemäß § 5 TMG',
  name: 'menosgada Service GmbH',
  strasse: 'Bahnhofstr. 64',
  plzOrt: '96231 Bad Staffelstein',
  land: 'Deutschland',
  handelsregister: 'HRB 6741',
  registergericht: 'Coburg',
  vertretenDurch: 'Stefan Holhut',
  telefon: '0157 – 9238 4213',
  email: 'admin@menosgada.de',
  ustIdNr: 'DE348721113',
  verantwortlicher: 'Stefan Holhut, Bahnhofstr. 64, 96231 Bad Staffelstein',
  euStreitschlichtung:
    'Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: ' +
    'https://ec.europa.eu/consumers/odr/. Unsere E-Mail-Adresse finden Sie oben im Impressum.',
  verbraucherstreitbeilegung:
    'Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer ' +
    'Verbraucherschlichtungsstelle teilzunehmen.',
};

// ——— Datenschutzerklärung ———

export const DATENSCHUTZ: DatenschutzDaten = {
  ueberschrift: 'Datenschutzerklärung',
  abschnitte: [
    {
      titel: 'Überblick',
      inhalt:
        'Diese Datenschutzerklärung informiert Sie darüber, wie auf dieser Website mit Ihren Daten ' +
        'umgegangen wird. Das Grundprinzip: So wenig Daten wie möglich, so transparent wie möglich.',
    },
    {
      titel: 'Verantwortliche Stelle',
      inhalt:
        'Verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist: ' +
        'menosgada Service GmbH, Herr Stefan Holhut, Bahnhofstr. 64, 96231 Bad Staffelstein, ' +
        'E-Mail: datenschutz@menosgada.de. Verantwortliche Stelle ist die natürliche oder ' +
        'juristische Person, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der ' +
        'Verarbeitung von personenbezogenen Daten (z. B. Namen, E-Mail-Adressen o. Ä.) entscheidet.',
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
        'Die Verarbeitung erfolgt auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). ' +
        'Diese Daten werden ausschließlich zum Versand des angeforderten PDFs und — ' +
        'bei gesonderter Einwilligung — zum Abo-Versand genutzt. ' +
        'Eine Abmeldung ist jederzeit möglich: Per Abmeldelink in jeder E-Mail oder ' +
        'per E-Mail an datenschutz@menosgada.de.',
    },
    {
      titel: 'Widerruf Ihrer Einwilligung',
      inhalt:
        'Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Dazu reicht eine ' +
        'formlose Mitteilung per E-Mail an datenschutz@menosgada.de. Die Rechtmäßigkeit der bis ' +
        'zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.',
    },
    {
      titel: 'Brevo als Auftragsverarbeiter (AVV)',
      inhalt:
        "Für den E-Mail-Versand setzen wir Brevo (ehemals Sendinblue, Brevo SAS, 55 rue d'Amsterdam, " +
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
      titel: 'Server-Log-Dateien',
      inhalt:
        'Der Provider der Seiten erhebt und speichert automatisch Informationen in sogenannten ' +
        'Server-Log-Dateien, die Ihr Browser automatisch übermittelt: Browsertyp und -version, ' +
        'verwendetes Betriebssystem, Referrer-URL, Hostname des zugreifenden Rechners, Uhrzeit der ' +
        'Serveranfrage und IP-Adresse. Eine Zusammenführung dieser Daten mit anderen Datenquellen ' +
        'wird nicht vorgenommen. Grundlage ist Art. 6 Abs. 1 lit. f DSGVO — das berechtigte ' +
        'Interesse an der technisch fehlerfreien Bereitstellung der Website.',
    },
    {
      titel: 'SSL- bzw. TLS-Verschlüsselung',
      inhalt:
        'Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher ' +
        'Inhalte eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie ' +
        'daran, dass die Adresszeile des Browsers von "http://" auf "https://" wechselt, und am ' +
        'Schloss-Symbol in Ihrer Browserzeile. Bei aktivierter Verschlüsselung können die Daten, ' +
        'die Sie an uns übermitteln, nicht von Dritten mitgelesen werden.',
    },
    {
      titel: 'Ihre Rechte',
      inhalt:
        'Sie haben das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen ' +
        'Daten, deren Herkunft, Empfänger und den Zweck der Verarbeitung sowie ein Recht auf ' +
        'Berichtigung, Löschung und Einschränkung der Verarbeitung und auf Datenübertragbarkeit ' +
        '(Aushändigung in einem gängigen, maschinenlesbaren Format). ' +
        'Zur Ausübung Ihrer Rechte wenden Sie sich an: datenschutz@menosgada.de. ' +
        'Im Falle datenschutzrechtlicher Verstöße steht Ihnen außerdem ein Beschwerderecht bei der ' +
        'zuständigen Aufsichtsbehörde zu — dem Landesdatenschutzbeauftragten des Bundeslandes, in ' +
        'dem unser Unternehmen seinen Sitz hat.',
    },
    {
      titel: 'Widerspruch gegen Werbe-Mails',
      inhalt:
        'Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten zur ' +
        'Übersendung von nicht ausdrücklich angeforderter Werbung und Informationsmaterialien wird ' +
        'hiermit widersprochen. Die Betreiber der Seiten behalten sich ausdrücklich rechtliche ' +
        'Schritte im Falle der unverlangten Zusendung von Werbeinformationen, etwa durch ' +
        'Spam-E-Mails, vor.',
    },
  ],
};
