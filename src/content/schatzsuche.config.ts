import type { Config } from '@/domain/schema/config';

/**
 * Seed-Konfiguration der Schatzsuche — Single Source of Truth (§13).
 *
 * ⚠️ PLATZHALTER (§19): Alle Benchmark-Faktoren, Findings, Links und IDs sind konservative
 * Platzhalter „aus unserem eigenen Portfolio"-Logik und müssen vor Live durch echte Werte
 * (Stefans realer Bestand) ersetzt werden. Spannen sind bewusst breit/konservativ gehalten.
 *
 * Diese Datei wird beim Laden über ConfigSchema validiert (siehe __tests__/schema/config.test.ts).
 */
export const schatzsucheConfig: Config = {
  // Stufe-A — grobe Schmerz-Bereiche (§5.1)
  schmerzBereiche: [
    { id: 'ertrag', name: 'Ertrag & Rendite', reihenfolge: 1 },
    { id: 'zeit', name: 'Zeit & Verwaltungsaufwand', reihenfolge: 2 },
    { id: 'vermarktung', name: 'Vermarktung & Leerstand', reihenfolge: 3 },
    { id: 'liquiditaet', name: 'Liquidität & Finanzierung', reihenfolge: 4 },
    { id: 'risiko', name: 'Risiko & Sicherheit', reihenfolge: 5 },
    { id: 'wachstum', name: 'Wachstum & Skalierung', reihenfolge: 6 },
    { id: 'unsicher', name: 'weiß ich nicht genau', reihenfolge: 7 },
  ],

  // Methodenbibliothek: 6 ergebnisorientierte Schwerpunkte entlang des Lebenszyklus (§6).
  // Beschreibungen in Sie-Form; ordnen die Hebel und erscheinen als Karten in Stufe 1.
  phasen: [
    {
      id: 1,
      name: 'Bessere Deals finden',
      reihenfolge: 1,
      beschreibung:
        'Prüfen Sie Immobilien 10x schneller und finden Sie bessere Deals. Lernen Sie, wie Sie KI für die Objektsuche, Standortanalyse und Ankaufprüfung einsetzen. Analysieren Sie Exposés, Mietlisten, Teilungserklärungen, Grundbuchauszüge und Wirtschaftlichkeitsberechnungen in wenigen Minuten. Erkennen Sie Risiken frühzeitig, vergleichen Sie mehrere Objekte gleichzeitig und konzentrieren Sie sich auf Investments mit echtem Potenzial. Sparen Sie Zeit, reduzieren Sie Fehlentscheidungen und treffen Sie fundierte Kaufentscheidungen auf Basis belastbarer Daten.',
    },
    {
      id: 2,
      name: 'Cashflow & Rendite steigern',
      reihenfolge: 2,
      beschreibung:
        'Treffen Sie bessere Finanzentscheidungen und steigern Sie die Performance Ihres Portfolios. Nutzen Sie KI zur Analyse von Finanzierungen, Cashflow, Liquidität, Eigenkapitalrendite und Wirtschaftlichkeit. Erstellen Sie Finanzierungsvergleiche, erkennen Sie Optimierungspotenziale und überwachen Sie die Entwicklung Ihrer Immobilien mit aussagekräftigen Kennzahlen. Lernen Sie, wie Sie datenbasierte Entscheidungen treffen und sowohl laufende Erträge als auch langfristigen Vermögensaufbau gezielt verbessern.',
    },
    {
      id: 3,
      name: 'Leerstand reduzieren',
      reihenfolge: 3,
      beschreibung:
        'Vermieten Sie schneller und präsentieren Sie Immobilien professioneller. Erstellen Sie mit KI hochwertige Exposés, virtuelle Stagings, digitale Grundrisse und überzeugende Vermarktungsunterlagen. Optimieren Sie Inserate für Immobilienportale, steigern Sie die Sichtbarkeit Ihrer Angebote und erhöhen Sie die Anzahl qualifizierter Interessenten. Reduzieren Sie Vermarktungszeiten, senken Sie Leerstandskosten und verbessern Sie die Präsentation Ihrer Immobilien nachhaltig.',
    },
    {
      id: 4,
      name: 'Verwaltung automatisieren',
      reihenfolge: 4,
      beschreibung:
        'Sparen Sie Stunden bei Verwaltung, Kommunikation und Routineaufgaben. Erfahren Sie, wie Sie KI für Mieterkommunikation, Dokumentenmanagement, Fristenüberwachung, Betriebskosten, Aufgabenverwaltung und operative Abläufe einsetzen. Automatisieren Sie wiederkehrende Prozesse, bearbeiten Sie Anfragen effizienter und behalten Sie jederzeit den Überblick über Ihr Immobilienportfolio. So schaffen Sie professionelle Strukturen und reduzieren den Verwaltungsaufwand erheblich.',
    },
    {
      id: 5,
      name: 'Projekte erfolgreich entwickeln',
      reihenfolge: 5,
      beschreibung:
        'Treffen Sie bessere Entscheidungen bei Projektentwicklung, Umbau und Wertsteigerung. Nutzen Sie KI für Machbarkeitsanalysen, Nutzungskonzepte, Standortbewertungen, Projektkalkulationen, Sanierungsstrategien und Wirtschaftlichkeitsberechnungen. Simulieren Sie verschiedene Szenarien, erkennen Sie Risiken frühzeitig und entwickeln Sie fundierte Entscheidungsgrundlagen für Bestandsoptimierungen, Nachverdichtungen, Aufteilungen oder Neubauprojekte. So reduzieren Sie Risiken und maximieren das Entwicklungspotenzial Ihrer Immobilien.',
    },
    {
      id: 6,
      name: 'KI professionell nutzen',
      reihenfolge: 6,
      beschreibung:
        'Nutzen Sie KI sicher, professionell und rechtssicher in Ihrem Immobiliengeschäft. Lernen Sie bewährte Methoden für den produktiven Einsatz von KI im Alltag und verstehen Sie die wichtigsten Anforderungen rund um Datenschutz, Datensicherheit und Compliance. Erfahren Sie, welche Daten verarbeitet werden dürfen, wie Dokumente anonymisiert werden und welche Prozesse sich bedenkenlos automatisieren lassen. So arbeiten Sie effizienter, minimieren Risiken und schaffen eine solide Grundlage für den langfristigen KI-Einsatz.',
    },
  ],

  // Probleme (Stufe B), in Nutzer-Sprache, an Rolle+Größe gebunden (§5.2/§5.3)
  probleme: [
    {
      id: 'mieterhoehung',
      schmerzBereich: 'ertrag',
      text: 'Mieterhöhungen / Indexmieten werden nicht konsequent gezogen',
      rollenFilter: [
        'buyAndHold',
        'bestandshaltung',
        'familyOffice',
        'assetManagementEigen',
        'hausverwaltung',
        'externerAssetManager',
      ],
      verknuepfteHebel: ['mietpotenzial'],
      aktiv: true,
    },
    {
      id: 'vermarktung-lang',
      schmerzBereich: 'vermarktung',
      text: 'Vermarktung/Neuvermietung dauert zu lange',
      rollenFilter: [
        'buyAndHold',
        'bestandshaltung',
        'hausverwaltung',
        'externerAssetManager',
        'makler',
        'projektentwicklung',
        'fixAndFlip',
      ],
      verknuepfteHebel: ['virtuelles-staging', 'expose-optimierung'],
      aktiv: true,
    },
    {
      id: 'hausverwaltung-unzufrieden',
      schmerzBereich: 'zeit',
      text: 'Unzufrieden mit der (eigenen/externen) Hausverwaltung',
      rollenFilter: ['buyAndHold', 'bestandshaltung', 'familyOffice', 'assetManagementEigen'],
      verknuepfteHebel: ['aufgabensteuerung', 'fristenueberwachung'],
      aktiv: true,
    },
    {
      id: 'belegchaos',
      schmerzBereich: 'liquiditaet',
      text: 'Belegchaos vor der Steuer',
      rollenFilter: [
        'buyAndHold',
        'bestandshaltung',
        'familyOffice',
        'assetManagementEigen',
        'hausverwaltung',
        'steuerberater',
      ],
      verknuepfteHebel: ['belegerkennung'],
      aktiv: true,
    },
    {
      id: 'fristen',
      schmerzBereich: 'risiko',
      text: 'Fristen/Termine gehen unter',
      rollenFilter: [
        'buyAndHold',
        'bestandshaltung',
        'familyOffice',
        'assetManagementEigen',
        'hausverwaltung',
        'externerAssetManager',
        'immobilienberatung',
      ],
      verknuepfteHebel: ['fristenueberwachung'],
      aktiv: true,
    },
    {
      id: 'ankaufpruefung',
      schmerzBereich: 'zeit',
      text: 'Ankaufprüfung kostet zu viel Zeit',
      rollenFilter: ['projektentwicklung', 'fixAndFlip', 'familyOffice', 'assetManagementEigen'],
      verknuepfteHebel: ['deal-screening'],
      aktiv: true,
    },
    {
      id: 'manuelle-routine',
      schmerzBereich: 'wachstum',
      text: 'Zu viele manuelle Routinetätigkeiten',
      rollenFilter: [
        'buyAndHold',
        'bestandshaltung',
        'familyOffice',
        'assetManagementEigen',
        'hausverwaltung',
        'externerAssetManager',
        'immobilienberatung',
        'projektentwicklung',
        'fixAndFlip',
      ],
      verknuepfteHebel: ['workflow-automatisierung', 'aufgabensteuerung'],
      aktiv: true,
    },
  ],

  // Hebel (Funde), nach Phase geordnet, mit Wert-Kategorie (§6/§6.1)
  hebel: [
    {
      id: 'mietpotenzial',
      name: 'Mietpotenzial-Erkennung',
      lebenszyklusPhase: 2, // Cashflow & Rendite steigern
      wertKategorie: 'ertrag',
      rahmung: 'chance',
      quantifizierbar: true,
      taetigkeiten: ['A', 'B'],
      detailFragen: ['einheitenMitPotenzial'],
      berechnung: {
        inputs: ['einheitenMitPotenzial'],
        // ⚠️ PLATZHALTER-Benchmarks aus eigenem Portfolio
        faktoren: { mietdifferenzProMonat: { min: 40, max: 90 } },
        ausgabe: { min: 18000, max: 42000 },
        einheit: '€ p.a.',
        rechenwegText: 'betroffene Einheiten × Ø-Mietdifferenz/Monat × 12 (konservative Spanne)',
      },
      playbookLink: '#playbook-mietpotenzial',
      kartenText: 'Nicht gezogene Mieterhöhungen summieren sich über das Jahr.',
    },
    {
      id: 'virtuelles-staging',
      name: 'Virtuelles Staging',
      lebenszyklusPhase: 3,
      wertKategorie: 'ertrag',
      rahmung: 'chance',
      quantifizierbar: true,
      taetigkeiten: ['B', 'C'],
      detailFragen: ['neuvermietungenProJahr'],
      berechnung: {
        inputs: ['neuvermietungenProJahr'],
        // ⚠️ PLATZHALTER: Ø-Miete 600 €, Verkürzung 3–4 Wochen (§7 Rechenbeispiel)
        faktoren: {
          mieteProMonat: { min: 550, max: 650 },
          verkuerzungWochen: { min: 3, max: 4 },
        },
        ausgabe: { min: 2700, max: 3600 },
        einheit: '€ p.a.',
        rechenwegText: 'Neuvermietungen/Jahr × Ø-Miete × Verkürzung in Wochen (konservativ)',
      },
      playbookLink: '#playbook-staging',
      kartenText: 'Leerstand kostet pro Tag — schnellere Vermarktung senkt die Leerstandskosten.',
    },
    {
      id: 'expose-optimierung',
      name: 'Exposé- & Inseratsoptimierung',
      lebenszyklusPhase: 3,
      wertKategorie: 'effizienz',
      rahmung: 'chance',
      quantifizierbar: false,
      taetigkeiten: ['B', 'C'],
      detailFragen: [],
      nutzenAussage:
        'Bessere Exposés ziehen mehr qualifizierte Interessenten an — weniger Streuverlust.',
      playbookLink: '#playbook-expose',
      kartenText: 'Schwache Exposés verlängern die Vermarktung unnötig.',
    },
    {
      id: 'deal-screening',
      name: 'Deal-Screening & Priorisierung',
      lebenszyklusPhase: 1,
      wertKategorie: 'effizienz',
      rahmung: 'chance',
      quantifizierbar: false,
      taetigkeiten: ['A', 'C'],
      detailFragen: [],
      nutzenAussage: 'Schnellere Vorprüfung spart Stunden je Objekt und schärft die Priorisierung.',
      playbookLink: '#playbook-screening',
      kartenText: 'Manuelle Ankaufprüfung bindet viel Zeit pro Objekt.',
    },
    {
      id: 'belegerkennung',
      name: 'Belegerkennung & Buchungsvorschläge',
      lebenszyklusPhase: 4, // Verwaltung automatisieren
      wertKategorie: 'effizienz',
      rahmung: 'chance',
      quantifizierbar: false,
      taetigkeiten: ['A', 'B'],
      detailFragen: [],
      nutzenAussage: 'Automatische Belegerkennung reduziert manuelle Buchungs- und Sortierzeit.',
      playbookLink: '#playbook-belege',
      kartenText: 'Belegchaos kostet Zeit und Nerven vor jeder Steuer.',
    },
    {
      id: 'fristenueberwachung',
      name: 'Fristenüberwachung',
      lebenszyklusPhase: 4, // Verwaltung automatisieren
      wertKategorie: 'risiko',
      rahmung: 'verlust',
      quantifizierbar: false,
      taetigkeiten: ['A', 'B'],
      detailFragen: [],
      nutzenAussage: 'Verhindert übersehene Fristen — und die daraus drohenden Kosten und Risiken.',
      playbookLink: '#playbook-fristen',
      kartenText: 'Übersehene Fristen können teuer werden.',
    },
    {
      id: 'aufgabensteuerung',
      name: 'Aufgabensteuerung',
      lebenszyklusPhase: 4, // Verwaltung automatisieren
      wertKategorie: 'effizienz',
      rahmung: 'chance',
      quantifizierbar: false,
      taetigkeiten: ['A', 'B'],
      detailFragen: [],
      nutzenAussage:
        'Klare Aufgabensteuerung macht Prozesse nachvollziehbar und reduziert Reibung.',
      playbookLink: '#playbook-aufgaben',
      kartenText: 'Ohne System hängt Wissen an einzelnen Köpfen.',
    },
    {
      id: 'workflow-automatisierung',
      name: 'Workflow-Automatisierung',
      lebenszyklusPhase: 4, // Verwaltung automatisieren
      wertKategorie: 'effizienz',
      rahmung: 'chance',
      quantifizierbar: false,
      taetigkeiten: ['A', 'B', 'C'],
      detailFragen: [],
      nutzenAussage:
        'Automatisierte Routinen sparen wiederkehrenden Aufwand und ermöglichen Skalierung.',
      playbookLink: '#playbook-automatisierung',
      kartenText: 'Manuelle Routinen bremsen Wachstum aus.',
    },
  ],

  // Segmente: Tätigkeit → Typ → End-Ausgang (§3.3)
  segmente: [
    { taetigkeit: 'A', typ: 'kern', endAusgang: 'gespraech' },
    { taetigkeit: 'B', typ: 'kern', endAusgang: 'gespraech' },
    { taetigkeit: 'C', typ: 'nebenstrang', endAusgang: 'nur-playbook' },
  ],

  globalConfig: {
    schwellenwertStufe3: 50,
    // ⚠️ PLATZHALTER-Links (§19)
    terminLink: 'https://cal.com/residentflow/bestand-ansehen',
    partnerprogrammLink: '#partnerprogramm',
    brevoListId: 0,
    privacyFlowDownloadUrl: '#residentprivacyflow-download',
  },
};

export default schatzsucheConfig;
