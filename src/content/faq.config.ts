/**
 * FAQ-Seed — 5 Vertrauensfragen (§12).
 * Reihenfolge ist verbindlich: Datenfrage prominent zuerst.
 */

export interface FaqEintrag {
  frage: string;
  antwort: string;
  prominent?: boolean;
}

export const FAQ_EINTRAEGE: FaqEintrag[] = [
  {
    frage: 'Was genau passiert mit meinen Daten?',
    antwort:
      'Die Bestandspotenzial-Suche läuft vollständig in Ihrem Browser — keine Eingabe verlässt Ihr Gerät. ' +
      'Es werden keine Dokumente hochgeladen, keine Daten übertragen, keine Cookies gesetzt. ' +
      'Erst wenn Sie sich aktiv entscheiden, Ihr Ergebnis-PDF per E-Mail zu erhalten, ' +
      'übermitteln Sie freiwillig Ihre E-Mail-Adresse sowie Rolle und Einheitenanzahl. ' +
      'Diese Daten werden ausschließlich für den PDF-Versand und — sofern Sie dem separat zustimmen — ' +
      'für das monatliche Erkenntnisabo genutzt. Abmeldung jederzeit per Link in jeder E-Mail.',
    prominent: true,
  },
  {
    frage: 'Ersetzen oder ergänzen Sie meine Hausverwaltung?',
    antwort:
      'Weder noch im klassischen Sinne: Das System zeigt Ihnen systematisch, wo Potenziale in Ihrem ' +
      'Bestand liegen — unabhängig davon, ob Sie selbst verwalten oder eine externe Verwaltung beauftragen. ' +
      'Es ersetzt keine laufende Verwaltung, aber es findet, was keine Verwaltung systematisch sucht: ' +
      'ungehobene Ertrags-, Effizienz- und Risiko-Potenziale. Die Zusammenarbeit mit Ihrer bestehenden ' +
      'Hausverwaltung bleibt unberührt.',
    prominent: false,
  },
  {
    frage: 'Was ist der Unterschied zu den bekannten Immobilien-Tools?',
    antwort:
      'Bekannte Tools verwalten Ihren Bestand — sie erfassen Mieter, Dokumente, Buchhaltung. ' +
      'Dieses System analysiert Ihren Bestand: Es sucht aktiv nach Ertragspotenzial, ' +
      'Effizienzreserven und übersehenen Risiken — auf Basis Ihrer konkreten Situation, ' +
      'nicht generischer Benchmarks. Die Berechnungen basieren auf echten Daten aus einem ' +
      'realen Bestand, sind als Spannen ausgewiesen und zeigen den Rechenweg transparent. ' +
      'Es ist kein Verwaltungs-Tool, sondern ein Analyse- und Entscheidungs-Werkzeug.',
    prominent: false,
  },
  {
    frage: 'Was passiert, wenn ich wieder aussteigen will?',
    antwort:
      'Keine versteckten Wechselkosten: Ihre Daten gehören Ihnen. Die Suche läuft lokal, ' +
      'es entsteht kein Lock-in durch gespeicherte Bestandsdaten auf fremden Servern. ' +
      'Wenn Sie das monatliche Abo abonniert haben, können Sie es jederzeit per E-Mail-Link abbestellen — ' +
      'ohne Kündigungsfristen, ohne Gebühren. Eine eventuelle Zusammenarbeit endet mit dem vereinbarten ' +
      'Projektabschluss; es gibt keine automatische Verlängerung und keine Mindestlaufzeit, ' +
      'die Sie bindet.',
    prominent: false,
  },
  {
    frage: 'Läuft das wirklich lokal / wo liegt die KI?',
    antwort:
      'Die Bestandspotenzial-Suche auf dieser Seite läuft vollständig clientseitig in Ihrem Browser — ' +
      'kein Server, keine KI-Anfrage, keine Datenübertragung. Die KI-gestützte Analyse im ' +
      'weiterführenden Schritt (ResidentPrivacyFlow) läuft lokal auf Ihrem Rechner ' +
      'oder auf einem EU-Server, der ausschließlich in Ihrem Auftrag betrieben wird — ' +
      'niemals in einer US-Cloud. Welches Modell wo läuft, wird Ihnen vor jedem Schritt transparent gemacht.',
    prominent: false,
  },
];
