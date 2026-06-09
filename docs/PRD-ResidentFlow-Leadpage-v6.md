# PRD — ResidentFlow Leadpage (Finale Fassung v6.0)

> **Product Requirements Document — vollständig, in sich geschlossen, umsetzungsreif für Claude Code.**
> Dieses Dokument ersetzt alle früheren Stände (BRD-Auszüge zur Seite, PRD-landingpage v1.0, Aufbau-Doku v2.0, PRD v4.x, v5.x) und enthält den gesamten relevanten Inhalt. Keine externe Referenz nötig.
> **Verantwortung dieses Dokuments: maximale Konversion qualifizierter Bestandshalter zu gebuchten Diagnose-Gesprächen.**
> Umsetzung nach TDD (Vitest, deutsche `it(...)`-Beschreibungen, Tests in `__tests__/`). Keine Conversion-Annahme hardcoded — alles konfigurierbar und testbar.

---

## 1. Produkt & Positionierung

**Dachpositionierung:** ResidentFlow liefert **Bestandsperformance durch KI-gestützte Analyse und Umsetzung wiederkehrender Bestandspotenziale** — über alle Felder: Mieten/Verträge · Leerstand/Vermarktung · Verwaltung/Kontrolle · Buchhaltung/Reporting · Dokumente/Fristen · Datenschutz/KI-Einsatz. ResidentFlow verkauft keine Software, keine Prompt-Sammlung, keine Community. Die Technologie ist die Maschine; die Außenbotschaft ist der wirtschaftliche Effekt im Bestand.

**MVP-Leithebel (Speer, nicht Schwert):** Index-/Staffelmieten und Vertragslogik. Er trägt den HighIntent-Pfad des MVP, weil er drei Dinge verbindet: bewiesene RFAI-Fähigkeit (die Plattform findet heute schon Indexmieten), unmittelbare €-Relevanz in bestehenden Verträgen und kein DIY-Substitut per Einzelprompt. Er ist NICHT die Gesamtpositionierung: Hero, Bestands-Check und Problemauswahl bleiben breit; nur Beweis- und Quantifizierungstiefe konzentrieren sich im MVP auf den Leithebel. Weitere Lösungen folgen nach demselben Proof- und Relevanzmodell.

**System-Satz (wiederkehrend auf allen Conversion-Flächen):**
> „Gefunden ist nicht realisiert. ResidentFlow zeigt nicht nur Potenziale, sondern priorisiert den nächsten umsetzbaren Schritt."

**Drei Produktebenen (Geschäftsmodell-Kontext, nicht Seiteninhalt):** (1) Methoden/Lösungsbausteine — Einstieg und Aha-Moment; (2) ResidentPrivacyFlow — lokale Desktop-App, Vertrauens-/Beweis-Moment; (3) ResidentFlowAI — Plattform mit eigener Instanz je Kunde, das eigentliche Mandat. Geschäftsmodell-Sequenz: Diagnose-Gespräch → Performance Assessment (bezahlt) → Bestandsperformance-Partnerschaft (wiederkehrend).

**Naming-Logik (drei Ebenen, dürfen sich nie überlappen):** Der Terminlink führt zu einem **Gespräch** („Ihren Bestand gemeinsam ansehen"). Das Gespräch kann zum **Assessment** führen. **„Potenzial validieren" = Assessment** und erscheint deshalb NIE auf der Seite. **Keine Preise** auf der Seite. **„ResidentFlowAI"** fällt als Name an genau EINER Stelle: im Skalierungs-Block der Lösungsseite bei HighIntent (§11, Block 7).

---

## 2. Zielgruppen, Rollen, Routing

### 2.1 Zwei Besuchertypen, ein Bedarf
- **Der Angesprochene:** wurde direkt kontaktiert (Outreach/Erstbefund), googelt „residentflow", prüft in Sekunden, ob das echt ist. Braucht: Substanz, Founder, direkten Termin-Zugang ohne Pflicht-Check.
- **Der Neugierige:** kommt kalt/warm über LinkedIn, SEO oder KI-Suche. Braucht: sofortige Relevanz-Erkennung und Interaktion ohne Vorleistung.
Beide entscheiden in Sekunden. Beide überzeugt Substanz, kein Versprechen.

### 2.2 Universelle Kennzahl
`relevanteEinheiten = eigene Einheiten + verwaltete Einheiten` (Summe). Bei Mehrfachrollen gewinnt der höchstwertige Weg.

### 2.3 Rollen → Größenmaß → End-Ausgang (verbindlich)
| Rolle (UI-Auswahl) | Größenmaß | HighIntent-Schwelle (Startwert, konfigurierbar) | End-Ausgang |
|---|---|---|---|
| Buy & Hold / eigener Bestand | eigene Einheiten (Buckets: 1–10 · 11–29 · 30–49 · 50–99 · 100–249 · 250–600 · 600+) | ≥ 50 | ≥ Schwelle → Gesprächsweg · darunter → Selbermacher (Motor A) |
| Hausverwaltung | betreute Einheiten (1–49 · 50–199 · 200–499 · 500–999 · 1000+) | ≥ 100 | wie oben |
| Makler | Vermarktungen/Jahr (1–5 · 6–15 · 16–30 · 31–75 · 75+) | ≥ 15 | hoch → Partneransatz/Vermarktungsprozess · sonst Motor A. **Nie Mandats-CTA** |
| Projektentwickler / Fix & Flip | Projekte/Vermarktungen p.a. (1–2 · 3–5 · 6–10 · 11–25 · 25+) | ≥ 5 | kürzerer Weg (Nebenstrang), Projekt-/Vermarktungslösungen |
| Steuerberater | Mandanten mit Immobilienbestand (1–5 · 6–20 · 21–50 · 51–100 · 100+) | — | **immer Partnerprogramm**, größenunabhängig |

Adaptive Größenfrage je Rolle (exakter Wortlaut §10.2). Schwellen global und pro Lösung übersteuerbar (`Settings.thresholdHigh{role}`); 30/50/100 als Experiment.

### 2.4 Erkennungssignal der Kern-Zielgruppe (fließt in Problemtexte ein)
Mehrere Gesellschaften · verstreute Dokumente · externe Verwaltung, die Marge frisst · kein System, das Potenziale systematisch hebt.

---

## 3. Nicht verhandelbare Prinzipien

1. **Erst Nutzen, dann Vertrauen, dann Kontakt — nie umgekehrt.** Kein E-Mail-Gate vor oder während des Checks, kein Lead-Magnet als Eintrittshürde, sofortiges Ergebnis im selben Viewport.
2. **Above the fold passiert die Aktion.** Der Bestands-Check ist der Hero, nicht ein Versprechen darüber (§9.1 mit Abnahmetest).
3. **Keine €-Zahl ohne Selbstauskunft.** Zustandsmaschine relevant → quantifiziert → präzisiert, technisch erzwungen. Potenziale immer als Spannen (min < max, Zod-Gate), nie Punktwerte. Rechenweg sichtbar, konservativ.
4. **Findings nur echt.** Solange nur eigener Bestand: „aus unserem eigenen Portfolio". Keine erfundenen Zahlen, keine erfundenen Testimonials. Platzhalter sind im CMS erlaubt, öffentlich nie (Build-Gate).
5. **Verlust-Rahmung nur bei Risiko-Lösungen.** Ertrag/Effizienz = Chance.
6. **Kein Skool-Abfluss.** Skool ist internes Archiv/Quelle. „Skool"/„Community" kommen auf der Seite nirgends vor; kein CTA dorthin.
7. **Kein Upload auf der Homepage.** Vertrauensleiter §5.
8. **Datenschutzversprechen technisch gedeckt:** Check überträgt nichts (kein fetch/Cookie/Storage während des Checks — Test-Gate); Aussagen erst öffentlich, wenn Code sie deckt.
9. **Solo-betreibbar:** alle Inhalte, Schwellen, Texte, Reihenfolgen, Themes im Payload-Admin pflegbar; Änderung ohne Entwickler.
10. **Sprachregeln (Test-Gates):** durchgehend Sie-Form · keine Emojis · verboten im UI: „Hebel", „Skill", „Skool", „Community", „Demo buchen", „Potenzial validieren", Preise, „Für welchen Kontext suchen Sie Hebel?" · stattdessen: „Lösungen", „passende Lösungen", „direkt nutzbare Bausteine", „Bestands-Check", „wirtschaftliche Relevanz", „Im Bestand skalieren", „Ihren Bestand gemeinsam ansehen".

---

## 4. Anti-Patterns (empirisch — die Alt-Homepage hat mit exakt diesen Mustern 0 Termine erzeugt)

Automatisierte Gates in `__tests__/gates/`:

| ❌ Verboten | ✅ Ersatz |
|---|---|
| Datei-Upload als Erstkontakt („Mietvertrag hochladen") | Vertrauensleiter §5 |
| Registrierung/Login vor Wert; „Analyse kommt per E-Mail"; „Property wird im System angelegt" | Sofortiges Ergebnis, kein Account |
| Zwei gleichwertige Haupt-CTAs („Wähle deinen Weg") | Ein primärer CTA je Segment, Hierarchie |
| „Live-Demo anfordern" / „Demo jetzt testen" | „Ihren Bestand gemeinsam ansehen" + Give |
| Fake-Fortschritt („60 % geschafft!" vor erster Aktion) | Fortschritt nur für echte Schritte |
| Kleine Zahlen als Social Proof („47 geprüft", „73 Members") | Echte €-Findings oder nichts |
| SaaS-Trial-Badges („Keine Kreditkarte", „Jederzeit löschbar") | Datenschutz-Beweis durch Verhalten |
| Du-Form, Emojis, Kleinvermieter-Mathematik („114 €/Monat") | Sie-Form, Bestandsmathematik (Spannen p.a.) |
| Exit-Popup Richtung Demo | Exit zeigt PDF-Fallback (nur Low/Mid) |
| Skool-/Lovable-URLs im öffentlichen Pfad | eigene Domain überall |
| Feature-Vergleichstabellen („Single Source of Truth") | wirtschaftlicher Effekt |
| Cookie-Banner | Plausible cookieless |

---

## 5. Vertrauensleiter & Zwei-Motoren-Architektur

### 5.1 Vertrauensleiter — jede Stufe verlangt nur so viel Vertrauen, wie die vorherige aufgebaut hat
| Stufe | Was | Nutzerdaten | Ort |
|---|---|---|---|
| **0** | BeispielAnalyse an Stefans eigener, anonymisierter Mieterliste — interaktiv | keine | Homepage §12 |
| **1** | Bestands-Check per Selbstauskunft → konservative €-Spannen | 3 Klicks, clientseitig | Homepage §10 |
| **1b** | „Mietanpassungs-Prüfpaket" zum Mitnehmen — Analyse der echten Liste in der KI-Umgebung des Nutzers (Claude, ChatGPT u. a.) | bleiben beim Nutzer | §15 |
| **2** | Termin: Analyse der echten Mieterliste **vor den Augen des Nutzers**; die Liste bleibt bei ihm | erst im Gespräch | Call |
| 2b | PrivacyFlow: lokale Pseudonymisierung — angeboten exakt am Datenschutz-Einwand | lokal | Desktop, Phase 2 |

Founder-Einwand-Zitat dazu auf der Seite (§21 `copy.uploadObjection`): „Ich würde meine Mieterliste auch auf keiner Website hochladen. Deshalb verlangt ResidentFlow das nicht — Sie sehen die Analyse an meinem Bestand, und Ihre Liste schauen wir uns dort an, wo Sie jeden Schritt sehen können."

### 5.2 Zwei Motoren, eine Architektur
- **Motor A (Sofortwert):** kleine Bestände, Self-Service, SEO/KI-Traffic, Makler-Einzelproblem. Assets prominent (Prompt kopieren, Checkliste, Guide, Video), Termin nur als stille Zeile, PDF als normaler Sekundär-CTA.
- **Motor B (quantifizierte Diagnose):** HighIntent-Segmente. €-Spannen + Rechenweg + Proof + früher Termin-CTA; Assets bleiben sichtbar, aber gerahmt als **Beweisstücke** („dass die Methode existiert"), unterhalb des CTA.
- **Umschaltung:** unsichtbar, über Rolle + Größe + Problem-Wertkategorie + Score (§10.3). Kein sichtbarer Cut; gleiche Seite, andere Gewichtung.
- **Pipeline-Mapping (intern):** „Ihren Bestand gemeinsam ansehen" → S2 Diagnose-Gespräch · PrivacyFlow → S3 Beweis-Moment · Bausteine/Prüfpaket → außerhalb der Mandats-Pipeline (wärmt) · Steuerberater/Makler → Partnerprogramm.

---

## 6. User Journeys je Kanal (verbindliche Anforderungen)

### J1 — Direkt auf der Homepage (unklarer Intent, gemischte Segmente)
Sekunde 0: Header + kompakter Hero + **Bestands-Check Schritt 1 sichtbar ohne Scrollen**. Direkt unter dem Check: Proof-Strip (echte Findings + Founder-Micro). Rolle → Größe → Problem (3 Klicks) → Lösungsseite inline. HighIntent: Spanne + Proof + Termin-CTA im selben Viewport. Klein: Assets prominent. Hypothese Terminquote HighIntent: 6–10 %.

### J2 — LinkedIn-Post (warm, konkreter Impuls)
**Regel: Posts verlinken NIE auf die Homepage**, sondern auf `/loesungen/{slug}?loesung={beworbene}&src=li` — die beworbene Lösung ist initial geöffnet. Rolle/Größe unbekannt → Relevanz „qualitativ" + **InlineKontextChips** (§11.3) schalten mit zwei Klicks die Spanne frei (bewusst NACH dem ersten Wert). Danach identisch J1. Am Seitenende: Prüfpaket als Mitnahme. Hypothese: 6–10 % bei qualifiziertem Klick.

### J3 — KI-Suche (z. B. ChatGPT: „Kann ich meine Buchhaltung im Immokontext mit KI optimieren?")
Ziel-URL `/loesungen/buchhaltung-immobilien-ki` mit **Answer-first-Block** (sofortige, ehrliche Antwort in 3–4 Sätzen — §11.4). Selbermacher-Modus per Definition → Motor A; InlineKontextChips können in Motor B kippen. Realistische Conversion über Zeitachse: Asset → Prüfpaket → Rückkehr via `?src=pruefpaket`. Hypothese Termin: 1–3 %; Primärwert: Reichweite + Artefakt-Distribution.

### J4 — Google Non-Brand (z. B. „Mietvertrag mit KI erstellen")
`/loesungen/mietvertrag-mit-ki-erstellen`. H1: „Mietvertrag mit KI erstellen? Was sinnvoll ist — und wo Sie aufpassen müssen." Kein blindes Bedienen des Suchversprechens: Umlenkung auf Vertragsdaten strukturieren, Entwürfe vorbereiten, wirtschaftliche Auswertung. Pflichthinweis: „Keine Rechtsberatung. Keine ungeprüfte Verwendung. Prüfung durch qualifizierte Stelle erforderlich." Brücke zum echten Hebel: „Sie haben bereits laufende Verträge? Dort verschenken Bestandshalter meist mehr als im neuen Vertrag." Hypothese: < 1–3 %; Kanalziel ist Autorität.

### J5 — Google Brand „residentflow" (der Angesprochene — wertvollster Besucher, kürzeste Geduld)
Scannt auf Seriosität: Hero (versteht das Geschäft in 3 Sek) → Proof-Strip → Founder. **Bucht oft direkt über den Header-CTA, ohne Check:** Buchung ohne Diagnosekontext ist gültig (`metadata[source]=header-direct`); Gesprächsvorbereitung fällt dann auf den Outreach-Erstbefund zurück. Der Check ist für ihn optional. Hypothese: 8–15 %. Dieser Kanal existiert ab dem ersten Outreach-Brief — deshalb Launch-Stufe L0 am Tag 1 (§24).

---

## 7. Informationsarchitektur & Routen

| Route | Inhalt | Rendering |
|---|---|---|
| `/` | Homepage (§9): Hero+Check above the fold, alles Weitere darunter | SSG + Client-Check |
| `/loesungen/{problem-slug}` | Lösungsseiten-Renderer (§11), Answer-first, InlineKontextChips, Deep-Link `?loesung=` | SSG, OG/Meta je Seite |
| `/mietanpassungs-pruefpaket` | Prüfpaket-Seite: was es ist, was es findet, was es nicht kann, Download, Termin-Brücke | SSG |
| `/ueber-stefan-holhut` | lange Founder-Story | SSG |
| `/methodik` | Wie Zahlen entstehen: Spannen, Benchmarks, eigener Bestand, Rechenwege | SSG |
| `/faq` | 5 Vertrauensfragen (§23) | SSG |
| `/privacyflow` | reserviert, Phase 2 (nach Gates) | — |
| `/impressum`, `/datenschutz` | rechtlich geprüft | SSG |
| `/termin` | Redirect auf cal.com (Kurz-URL für Prüfpaket-Report und Outreach) | Redirect |

MVP-Problem-Slugs: `mieten-indexmieten-pruefen` · `neuvermietung-dauert-zu-lange` · `verkauf-dauert-zu-lange` · `verwaltung-kostet-kontrolle` · `buchhaltung-immobilien-ki` · `mietvertrag-mit-ki-erstellen` · `objektunterlagen-pruefen-ki`.

---

## 8. MVP-Lösungen (Priorität bindend)

**Priorität 1 — HighIntent-Pfad (Launch-Gate G3: ohne diese drei kein L2):**
1. **Index-/Staffelmieten & Vertragslogik prüfen** (Leithebel). Probleme: Mieten/Verträge nicht systematisch geprüft · Mieten wirken nicht ausgeschöpft · Vertragsdaten verstreut. Assets: Mietvertragsauswertung, Indexmieten-Check, Staffelmieten-Check, Mietspiegel-Begründung, Mietanpassungs-Prüfpaket (primär), PrivacyFlow-Hinweis, ProofFinding. CalculationModel M1. CTA-Subline: „mit Fokus auf Index- und Staffelmieten".
2. **Verwaltungskontrolle & Prozessanalyse.** Probleme: externe Verwaltung kostet Kontrolle · Probleme zu spät sichtbar · Verwaltung frisst Zeit/Marge. Assets: Mieterkommunikation analysieren, Telefonnotizen strukturieren, FAQ aus Rückfragen, Eigentümer-Reporting-Vorlage. CalculationModel M2.
3. **Buchhaltung/Belege/Reporting strukturieren.** Assets: Belege strukturieren, Steuerberater-Rückfragen vorbereiten, Monatsreporting, Datenschutz-Check. CalculationModel M2-Variante.

**Priorität 2 — Vermarktung/Self-Service (Motor A):** Exposé optimieren · Virtuelles Staging (inkl. Transparenz-/„nicht täuschen"-Checkliste) · Grundriss visualisieren · Bilder professionalisieren · Bewerber vorqualifizieren. CalculationModel M3 (Leerstand) wo passend.
**Priorität 3 — Ankauf/Projekt:** Objektunterlagen prüfen (NotebookLM-Anleitung, Due-Diligence-Checkliste, SWOT, Investment-Memo).

Datenmodell-Logik: N Probleme → M Lösungen → X Assets (n:m:x). Eine Lösung dient mehreren Problemen mit kontextabhängigem Ziel (Exposé: Neuvermietung = Leerstandstage senken; Verkauf = Vermarktungsdauer senken). Assets werden referenziert, nie kopiert; Composite Assets bündeln (z. B. „Exposé-GEM anlegen" = Guide „GEM anlegen" + Exposé-Prompt + Testfall).

---

## 9. Homepage-Spezifikation

### 9.1 Above-the-fold-Regel (hart, mit Abnahmetest)
**Die Aktion passiert im ersten Viewport — kein Scrollen vor der ersten Interaktion.**
- Desktop 1440×900: Header (≤ 64 px) + Hero-Kopf (Eyebrow + H1 + Trustline, zusammen ≤ 220 px) + **Bestands-Check Schritt 1 (Rollen-Frage mit allen 5 Optionen) vollständig sichtbar und klickbar.**
- Mobil 390×844: Header + H1 (max. 2 Zeilen) + Trustline + Rollen-Frage mit mind. 3 sichtbaren Optionen, Rest ohne Scroll-Falle direkt darunter.
- Kein Hero-Bild, kein Video, kein Karussell. LCP-Element = H1. Es gibt KEINEN „Bestands-Check starten"-Button — der Check selbst ist der Hero; der erste Klick ist `role_selected` (KPI „Erste-Klick-Rate").
- Die alte „Brücke"-Sektion („Was Sie in 3 Minuten herausfinden") entfällt als eigene Sektion; ihre Entlastungen leben komprimiert in der Trustline und einer Microcopy-Zeile direkt über den Rollen-Chips: `copy.checkIntro` „Was trifft auf Sie zu? Ergebnis sofort — ohne Registrierung, ohne Upload."
- **Abnahmetest (CI, Playwright):** In beiden Viewports ist `[data-testid=role-options]` ohne Scroll vollständig im Viewport; ein Klick auf eine Rolle rendert die Größenfrage ohne Navigation.

### 9.2 Sektionsfolge (Route `/`)
| # | Sektion | Inhalt & Verhalten |
|---|---|---|
| 1 | `SiteHeader` | Wortmarke serif · Nav: Methodik · Über Stefan · FAQ · **Termin-Button `cta.header`** („Ihren Bestand gemeinsam ansehen") → öffnet cal.com IMMER, auch ohne Check-Kontext (`source=header-direct`) |
| 2 | `HeroCheck` | Eyebrow `copy.eyebrow` · H1 (Experiment-Variante) · Trustline `copy.trustline` · direkt darunter `BestandsCheck` (§10). Eine visuelle Einheit |
| 3 | `SolutionResult` | rendert inline nach Problemwahl (§11), initial nicht vorhanden |
| 4 | `ProofStrip` | kompakt, 1 Reihe: 3 Mini-Findings (Wert + 1 Zeile) + Founder-Micro (Foto 40 px + `copy.founderMicro`). Nur `publicApproved`; Feature-Flag `proofBand.enabled`; ohne approved Findings bleibt der Strip aus und L2 ist blockiert. Position über/unter Check als Experiment (`proofPosition`) |
| 5 | `BeispielAnalyse` | §12 — „So sieht eine echte Analyse aus — an unserem eigenen Bestand" |
| 6 | `PerceptionShift` | „Was andere sehen / Was wir sehen": Leerstände→nicht gezogene Mieterhöhungen · Mietverträge→versteckte Ertragspotenziale · Dokumente→unnötiger Verwaltungsaufwand · → aus eigenem Bestand identifiziert |
| 7 | `PrivacyProof` | NACH dem Check (Bestätigung statt Behauptung): „Der Bestands-Check läuft vollständig in Ihrem Browser. Keine Datenübertragung, kein Cookie, keine E-Mail-Abfrage." + Signale *lokal · EU/self-hosted · Kontakt nur auf Ihren Wunsch* + `copy.uploadObjection` |
| 8 | `FounderShort` | 4 Absätze (Quelle: bestehende Story von der Alt-Seite, gekürzt, Sie-Form), neues Ende: „…deshalb finde ich, was in Beständen liegen bleibt." Link auf Langfassung |
| 9 | `FAQ` | die 5 Fragen (§23) |
| 10 | `SiteFooter` | Impressum, Datenschutz, Kontakt — keine Badges |

**Optionale Merk-Zahl** in `PerceptionShift` („typisches Jahrespotenzial bei ~150 Einheiten: X–Y €"): nur erlaubt, wenn aus approved Benchmarks ableitbar (`benchmarks` ohne `isPlaceholder`), sonst weglassen.

**StickyBar:** ab `highIntent==true` erscheint `HighIntentStickyBar` (unten, 56 px): `cta.highIntent` + `cta.give.short`. Dismissbar; Wiedereinblendung nur nach Lösungswechsel.

---

## 10. BestandsCheck — Komponente

**Pfad:** `apps/web/src/components/bestands-check/`. **Hartes Gate: kein fetch, kein Cookie, kein local/sessionStorage während des Checks.** Konfiguration als statisches `check.config.json` (Build-Export aus Payload) im Bundle.

### 10.1 State Machine
```
S0 idle (Rollen-Frage sichtbar, above the fold)
 → roleSelected(role)    → S1: Größenfrage erscheint (adaptiv)
 → sizeSelected(bucket)  → S2: Problemkarten erscheinen (gefiltert role+size, max 7)
 → problemSelected(slug) → S3: SolutionResult rendert direkt darunter
Frühere Auswahlen bleiben als aktive, jederzeit änderbare Chips stehen
(Änderung re-rendert Folgeebenen, kein Reset). Kein „Weiter"-Button.
Übergänge < 150 ms. scrollIntoView({block:'nearest'}) je neuer Ebene.
```

### 10.2 Fragen (exakter Wortlaut)
- Rolle: „Was beschreibt Sie am besten?"
- Größe: Buy & Hold → „Wie viele Einheiten umfasst Ihr eigener Bestand ungefähr?" · Hausverwaltung → „Wie viele Einheiten verwalten oder betreuen Sie ungefähr?" · Makler → „Wie viele Verkäufe oder Vermarktungen begleiten Sie ungefähr pro Jahr?" · Projektentwickler → „Wie viele Projekte oder Vermarktungen bearbeiten Sie ungefähr pro Jahr?" · Steuerberater → „Wie viele Mandanten mit relevantem Immobilienbestand betreuen Sie?"
- Problem: „Was bremst Ihren Bestand aktuell am meisten?" (Karten in Nutzersprache aus §8-Problemlisten je Rolle)

Probleme je Rolle (Seed, CMS-pflegbar) — Buy & Hold: Mieten/Indexmieten/Staffeln nicht systematisch geprüft · Neuvermietung dauert zu lange · externe Verwaltung kostet Kontrolle · Nebenkosten schwer prüfbar · Dokumente/Fristen/Verträge verstreut · Buchhaltung/Reporting unübersichtlich · Objektunterlagen prüfen dauert zu lange. Hausverwaltung: Mieterkommunikation kostet Zeit · Eigentümer fragen ständig Auswertungen · Nebenkostenabrechnungen aufwendig/fehleranfällig · Tickets/Notizen gehen verloren · Übergaben nicht standardisiert. Makler: Verkauf dauert zu lange · Exposés erzeugen zu wenige passende Anfragen · Objekte wirken online nicht hochwertig · Interessenten nicht vorqualifiziert · Follow-up unstrukturiert. Projektentwickler: Exit dauert zu lange · Banken-/Investorenunterlagen kosten Zeit · Unterlagen professionell aufbereiten · Risiken/Chancen nicht verdichtet. Steuerberater: Mandanten haben unerkannte Potenziale · Belege unsortiert · KI ja, aber Datenschutz/Haftung kritisch.

### 10.3 Score & Umschaltung (Gewichte in `Settings.scoreWeights`)
```
sizeScore  = bucketRank(role, sizeBucket)            // 0..5 (CMS-Tabelle)
valueScore = problem.valueCategory ∈ {ertrag,effizienz} ? 1 : 0.5
relevance  = sizeScore*w1 + valueScore*w2 + roleFit*w3
highIntent = sizeScore ≥ thresholdHigh(role)
DIY-Dämpfung: assetCopied → leadScore: 1. Kopie +1, weitere +0;
≥ 4 Kopien ohne CTA-Klick ⇒ Flag diySignal (nur Admin/Analytics)
```

### 10.4 DiagnosticSession (nur im Speicher)
`{ role, sizeBucket, sizeScore, problemSlug, displayedSolutions[], openedSolutions[], copiedAssets[], valueRangesShown[], relevance, highIntent, diySignal, source, utm, variantIds }` — Übertragung ausschließlich bei Termin-Klick (cal.com-Prefill §17) oder PDF/Opt-in (`POST /api/optin`), jeweils mit sichtbarem Consent-Satz.

---

## 11. Lösungsseiten-Renderer (`SolutionResult`)

Eine Komponente für beide Kontexte: inline unter dem Check (`/`) und als direkte Seite (`/loesungen/{slug}`).

### 11.1 Block-Reihenfolge (fix)
1. **Problem-Header** (Titel + `userFacingDescription` in Alltagssprache).
2. **Relevanzblock** (Zustandsmaschine): `relevant` → qualitativer Text, KEINE €-Zahl · `quantifiziert` (sizeBucket vorhanden) → Spanne + ausklappbarer Rechenweg + Quelle „Benchmark aus unserem eigenen Portfolio" · `präzisiert` → optionale Inline-Inputs verengen die Spanne live. Bei HighIntent direkt darunter: System-Satz `copy.systemSatz`.
3. **Proof-Micro** (passendes approved ProofFinding; Fallback Founder-Micro).
4. **HighIntentCTA kompakt** (nur highIntent — VOR den Lösungen/Assets: Rolle+Größe+erster Wert genügen als Trigger, Asset-Konsum ist keine Voraussetzung).
5. **Lösungs-Karten** (Titel · Kurz-Nutzen · bei highIntent 1-Zeilen-Skalierungshinweis · Primäraktion). Klick öffnet inline (Accordion), `history.replaceState` aktualisiert URL.
6. **Geöffnete Lösung:** `helpsWhen` → **AssetRenderer** (PromptBlock mit Copy-Button + Pflicht-Datenschutzhinweis + benötigte Eingaben, GuideBlock, ChecklistBlock, VideoBlock, ExampleBlock, WarningBlock, CompositeAssetBlock) → **ScaleBreakBlock** (nur highIntent; `scaleBreakNote` ist Pflichtfeld jeder Lösung) → Lösungs-CTA per CTARule.
7. **Skalierungs-Block** (nur highIntent): „Diese Lösung im Bestand systematisieren" — die EINZIGE Stelle, an der „ResidentFlowAI" als Name fällt (laufende Überwachung, eigene Instanz). Danach Voll-CTA.
8. **Fallback-Zeile** (nicht-highIntent / nach CTA-Dismiss): „Ergebnis als PDF sichern · Weitere Lösungen prüfen".

### 11.2 Renderregeln (Tests)
€-Spanne nur ab `quantifiziert` · `min<max` erzwungen · Verlust-Rahmung nur `risiko` · ScaleBreak nie bei Low-Score · PDF bei highIntent erst nach CTA-Ignore/Exit-Intent/Zweitbesuch (Flag erst NACH Check-Abschluss in sessionStorage erlaubt) · Risiko wird nie künstlich in € gerechnet.

### 11.3 InlineKontextChips (Pflicht-Komponente für J2–J4)
Direkte `/loesungen/*`-Besucher haben keine Rolle/Größe. Über dem Relevanzblock erscheinen zwei Chip-Reihen: „Was beschreibt Sie?" (5 Rollen) und nach Auswahl „Wie groß ungefähr?" (Buckets der Rolle). Zwei Klicks schalten `quantifiziert` frei und setzen denselben Score wie der Homepage-Check. Microcopy: „Für eine konservative €-Einschätzung — bleibt in Ihrem Browser." Ohne Auswahl bleibt die Seite voll nutzbar (Motor A).

### 11.4 Answer-first-Block (nur direkte SEO-/KI-Seiten)
Erster Inhaltsblock: 3–4 Sätze ehrliche Direktantwort auf den Suchintent (Beispiel Buchhaltung: „Ja — KI kann Belege strukturieren, Objektzuordnungen vorbereiten, Rückfragen an Steuerberater formulieren und Reporting zusammenfassen. Sie sollte Buchhaltung nicht ungeprüft finalisieren. Der sichere Einsatz liegt in Vorstrukturierung, Prüfung und Übergabe an Fachpersonen."). Rechtlich sensible Intents (Mietvertrag): Umlenkung + Pflichthinweis gemäß J4.

---

## 12. BeispielAnalyse — Beweis zum Anfassen (Stufe 0)

**Zweck:** Der Besucher erlebt eine echte Analyse ohne eigene Daten. Ersetzt jeden Upload auf der Homepage.
**Datenquelle:** `content/example-analysis.json`, generiert aus Stefans realer Mieterliste (RFAI-Output), anonymisiert: Einheiten-IDs randomisiert („WE 04"), keine Namen/Adressen, Beträge auf 50-€-Schritte gerundet, durch Stefan `publicApproved`. Badge: `copy.exampleBadge` „Unsere eigene Mieterliste · {n} Einheiten · anonymisiert · echt".

**Aufbau (`ExampleAnalysis`):**
1. 3 Metric-Cards: Mietverhältnisse eingelesen · Verträge mit Auffälligkeiten · Potenzial p.a. (Spanne).
2. **Funde-Tabelle — exakt 3 Funde-Klassen, je Zeile expandierbar:**
   - *Ertrag:* „Indexmiete nicht angepasst (> 24 Monate)" — n Verträge, Spanne; Expand: Rechenweg (VPI-Delta × betroffene Verträge, konservativ).
   - *Fristen-Radar (Risiko):* fällig in 30/60/90 Tagen — Staffeln, Kappungsfenster, Sperrfrist-Enden; Expand: Zeitstrahl. Kernsatz: „Das passiert nächsten Monat wieder — deshalb ist das ein Prozess, kein Projekt."
   - *Datenlücken (Struktur):* „n Verträge nicht bewertbar — Spalte ‚letzte Anpassung' fehlt." (Selbstdiagnose des Strukturproblems.)
3. Fußzeile: System-Satz `copy.systemSatz` + Status-Zeile (x € identifiziert, davon y € in Umsetzung — nur echte Werte) + Brücke `cta.exampleBridge`: „Dieselbe Analyse machen wir mit Ihrer Liste — im Gespräch, vor Ihren Augen. Ihre Liste bleibt bei Ihnen." → HighIntentCTA.
4. Sekundär-Link: „Sie arbeiten bereits mit Claude, ChatGPT oder einem anderen KI-Assistenten? Holen Sie sich das Mietanpassungs-Prüfpaket." → `/mietanpassungs-pruefpaket`.

**Komplexitäts-Grenze (hart):** exakt 3 Funde-Klassen, 3 Metric-Cards, 1 Tabelle (max. 4 Zeilen), 1 Fußzeile. Keine Tabs, Filter, Charts, Dashboard-Optik. **Abnahmetest:** 3 Zielpersonen verstehen ohne Erklärung in ≤ 30 Sekunden: was gefunden wurde, was es wert ist, was der nächste Schritt ist.
**Verbot:** kein Upload-Feld, kein „Probieren Sie es mit Ihrer Liste"-Input. (Phase 3 optional: lokaler Browser-Analyzer als stille Power-User-Option.)

---

## 13. Relevanzberechnung — CalculationModels

Alle Faktoren aus der `Benchmarks`-Collection (Spannen, Quelle dokumentiert, `isPlaceholder=false` für öffentliche Nutzung — Build-Gate). Outputs `{min,max}` €, auf 100 € gerundet, konservativ. Zod: `min<max`, kein Output ohne `requiredInputs`.

**Benchmark-Erhebungsliste (Sprint 0b, aus Stefans Bestand):** `shareContractsUnreviewed24m` (Anteil Verträge ohne Anpassung > 24 Mon.) · `avgUpliftPerAffectedContract` (€/Monat je betroffenem Vertrag) · `shareIndexStaffel` · `avgGapToMarketRent` (% vs. Mietspiegel) · `avgVacancyDaysPerReletting` · `avgMonthlyRent` · `adminMinutesPerUnitMonth` (2 Wochen Zeiterfassung) · `taxPrepHoursPerMonth` · `vpiSeries` (destatis, statisch) · `kappungsgrenzenRules` (§558 BGB, Kappung 20/15 %, Sperrfrist 15 Monate — juristisch gegengeprüft).

**M1 `indexmieten-check` (Ertrag, Leithebel):** required: sizeBucket (→ unitsMid). optional: contractCount, lastReviewBucket, shareIndexKnown. Formel: `affected = units × shareContractsUnreviewed24m[min,max]`; `output = affected × avgUpliftPerAffectedContract[min,max] × 12`. Rechenwegtext: „{units} Einheiten × {share} % typischer Anteil ohne Anpassung × {uplift} €/Monat konservative Anpassung × 12 — Benchmark aus unserem eigenen Portfolio." Präzisiert: contractCount ersetzt unitsMid; lastReview '>2J' hebt share ins obere Drittel.
**M2 `verwaltungsaufwand` (Effizienz):** `units × adminMinutesPerUnitMonth[min,max] / 60` → primär Std./Monat, sekundär € (Stundensatz-Default 60–90 €, konfigurierbar). Zeit zuerst anzeigen.
**M3 `leerstand` (Ertrag):** ohne Detail qualitativ; mit `relettingsPerYear`: `relettings × avgMonthlyRent × Verkürzung[0,5–1,0 Monat]`.
**M4 `fristen-risiko` (Risiko):** keine €-Rechnung. Qualitativ + Wahrscheinlichkeit: „Bei {units} Einheiten statistisch {n}–{m} Anpassungsfenster pro Jahr — ungesichert, wenn niemand sie überwacht."

**Dringlichkeits-Zeile (nur M1, nur quantifiziert+, nur highIntent):** „Mietanpassungen wirken nicht rückwirkend. Jeder Monat Aufschub kostet in dieser Spanne ca. {min/12}–{max/12} € — endgültig." (Faktische §558-Mechanik; Wortlaut vor Live juristisch prüfen.)

---

## 14. CTA-System

### 14.1 CTA-Klassen
Sofort nutzen (Prompt kopieren · Checkliste öffnen · Vorlage nutzen) · Sicher anwenden (PrivacyFlow, nur Phase 2 nach Gates) · Im Bestand skalieren (§11 Block 7) · Gespräch vereinbaren · Partneransatz besprechen.

### 14.2 HighIntentCTA
Label `cta.highIntent` „Ihren Bestand gemeinsam ansehen", Subline problembezogen.
- `cta.give.short` (immer sichtbar, auch StickyBar): „30 Minuten. Wir prüfen Ihre Liste vor Ihren Augen und priorisieren die 3 größten Bestandspotenziale. Kein Upload. Kein Pitch."
- `cta.give.long` (ausklappbar, „Wie läuft das ab?"): „Ihre Liste bleibt bei Ihnen. Sie sehen live, was ResidentFlow erkennt. Am Ende haben Sie eine konkrete Prioritätenliste — auch wenn wir nicht zusammenarbeiten."
- Knappheit `cta.scarcity`: „Aktuell {n} Diagnose-Gespräche pro Monat." — nur gerendert, wenn `Settings.scarcityTrue==true` (Test-Gate: nie ohne Flag).

### 14.3 Trigger (deklarative CTARule-Engine)
```
SHOW highIntentCTA WHEN role ∈ rule.roleFilters
  AND sizeScore ≥ rule.minSizeScore
  AND (problem.valueCategory ∈ {ertrag,effizienz} OR rule.allowRisiko)
  AND firstValueShown == true       // Relevanzblock gerendert — nicht Asset-Konsum
PLACEMENT: nach Relevanzblock (kompakt) + Sektionsende (voll) + StickyBar
```

### 14.4 PDF-/Fallback-Regel
highIntent: PDF initial unsichtbar; Einblendung nur bei Exit-Intent, Scroll-Ende ohne CTA-Klick oder Zweitbesuch; nie im selben Sichtfeld wie der Termin-CTA. Sonst: „Ergebnis als PDF sichern" als normaler Sekundär-CTA. PDF = „Indikatives Potenzialprofil auf Basis Ihrer Angaben" (Spannen + Rechenweg, kein Gutachten; gedacht zur internen Weitergabe an Asset Manager/Steuerberater). Versand Brevo transaktional; Abo-Häkchen nicht vorausgewählt, Double-Opt-in; Fallback-Staffel: PDF → Abo → „auf die Ergebnis-Mail antworten".

### 14.5 CTA nach Rolle (End-Ausgänge)
Buy & Hold/HV unter Schwelle: Baustein nutzen · Weitere Lösungen prüfen. Ab Schwelle: Gesprächs-CTA. Makler: Vermarktungslösung nutzen; hohes Volumen → „Vermarktungsprozess besprechen / Partneransatz". Projektentwickler: Projektlösung; hohes Volumen → „Projektprozess gemeinsam strukturieren". Steuerberater: immer „Partneransatz besprechen" (sekundär: Mandantenlösung ansehen).

### 14.6 Header-Direct (J5)
Der Header-Termin-Button funktioniert IMMER, auch ohne Check: cal.com öffnet mit `metadata[source]=header-direct`, ohne Diagnosekontext. Lead wird mit leerem Kontext + Quelle angelegt; Gesprächsvorbereitung = Outreach-Erstbefund.

---

## 15. Mietanpassungs-Prüfpaket (Distribution, Stufe 1b; intern: Skill)

**Naming-Regel (Test-Gate):** Extern überall **„Mietanpassungs-Prüfpaket"**, Untertitel „funktioniert mit Claude, ChatGPT und anderen KI-Assistenten". Das Wort „Skill" erscheint nie öffentlich (nur Repo/Code/Doku). Keine Kopplung an einen einzelnen Anbieter im Namen. Testbare Namensvarianten: „Mietanpassungs-Check für Ihren KI-Assistenten", „Index- und Staffelmieten-Prüfpaket".

**Was:** Markdown-Paket (kein Code), frei verteilbar ohne Gate — Homepage (§12 Punkt 4), `/mietanpassungs-pruefpaket`, LinkedIn, Outreach-Beilage („das Werkzeug, mit dem ich meinen eigenen Bestand prüfe").
**Repo:** `packages/pruefpaket-mietanpassung/` → Release als ZIP + Web-Ansicht.

**Struktur:**
```
ANLEITUNG.md           // Einsatz in Claude/ChatGPT/anderen; Rolle, Vorgehen, Grenzen
referenzen/
  spalten-mapping.md   // erkennt: Einheit, Kaltmiete, Fläche, Vertragsbeginn,
                       // letzte Anpassung, Mietart; Synonyme; fehlende Spalten
                       // ⇒ Datenlücken-Fund, nie raten
  rechenregeln.md      // VPI-Delta seit letzter Anpassung; Staffel-Fälligkeiten;
                       // §558-Mechanik, Kappung 20/15 %, Sperrfrist 15 Monate;
                       // SPANNEN-ZWANG, konservativ, Rechenweg ausweisen
  report-template.md   // Output: exakt die 3 Funde-Klassen der BeispielAnalyse
                       // (Ertrag / Fristen-Radar / Datenlücken) — Wiedererkennung
```
**Pflichtblöcke im Report (wörtlich):**
1. *Datenschutz vorab:* „Entfernen Sie vor der Analyse die Spalten mit Namen und Anschriften — für die Rechnung sind sie unnötig. (Für PDF-Dokumente: ResidentPrivacyFlow pseudonymisiert lokal auf Ihrem Rechner.)"
2. *Decke:* „Was dieses Prüfpaket nicht kann: rechtssichere Anschreiben je Lage und Bundesland, laufende Fristenüberwachung über mehrere Gesellschaften, Abgleich mit Belegen und Buchhaltung. Gefunden ist nicht realisiert."
3. *Brücke:* „Bringen Sie diesen Report mit: residentflow.de/termin — 30 Minuten, wir priorisieren die Umsetzung. Kein Pitch."
4. *Disclaimer:* „Keine Rechtsberatung. Spannen sind indikativ."
**Attribution:** Links im Report tragen `?src=pruefpaket`.

---

## 16. ResidentPrivacyFlow — Integration (Phase 2)

**Rolle:** Einwand-Killer am Datenschutz-Moment, nie Erst-Freebie (Install-Hürde gehört an den Moment höchster Motivation).
**Moment A:** Datenschutz-Block im Prüfpaket-Report (§15). **Moment B:** CTA-Klasse „Sicher anwenden" auf Lösungsseiten bei `requiresPrivacyNote`-Assets — Feature-Flag `privacyflowReady`, nur sichtbar wenn alle Gates grün.
**Launch-Gates (G8):** Code-Signing (sonst SmartScreen-Warnung = Anti-Marketing für eine Datenschutz-App) · NER-Modell verifiziert (keine stille Regex-Degradierung) · US-Provider gesperrt / KI-Chat nur EU + self-hosted · lokale Klartext-Dateien at rest verschlüsselt · Doku = Code · Vorschau deckungsgleich mit gesendetem Text · Umzug von lovable.app auf `residentflow.de/privacyflow` · Sie-Form. Bis dahin erscheint PrivacyFlow nur als neutraler Text-Hinweis.

---

## 17. Lead-Kontext, cal.com, Brevo, Admin

### 17.1 Datenfluss
Vor Lead: alles clientseitig; nur anonyme Bucket-Events (§19). Bei Termin/PDF/Opt-in: explizite Übertragung mit Consent-Satz `copy.consentTransfer`: „Wenn Sie fortfahren, übermitteln wir Ihre Angaben aus dem Bestands-Check zusammen mit Ihrer E-Mail, um das Gespräch vorzubereiten / Ihr Ergebnis zu senden."

### 17.2 cal.com-Prefill
```
{Settings.calComUrl}?metadata[role]={role}&metadata[size]={sizeBucket}
 &metadata[problem]={problemSlug}&metadata[solutions]={top3Slugs}
 &metadata[range]={min}-{max}&metadata[source]={utmSource|li|pruefpaket|header-direct|direct}
```
Booking-Webhook → `POST /api/lead`. Fallback bei Parameter-Limits: komprimierter Kontext-Hash + Server-Lookup.

### 17.3 Lead-Datenmodell
`Lead { id, email, firstName?, lastName?, company?, phone?, source, utmSource, utmCampaign, landingPage, role, sizeBucket, relevantUnits?, salesPerYear?, projectsPerYear?, mandateCount?, selectedProblem, displayedSolutions[], openedSolutions[], copiedAssets[], shownValueRanges[], relevanceScore, leadScore, diySignal, ctaClicked, calendarBookingId?, consentRecords[], leadStatus, notes }` — ConsentRecord: `{type: pdf|newsletter|contact|calendar, accepted, timestamp, textVersion, source}`.

### 17.4 Brevo
Transaktions-PDF immer bei Anforderung; Abo nur bei Häkchen, Double-Opt-in, Add-to-List. Kontaktattribute: `ROLLE`, `GROESSE_BUCKET`, `PROBLEM`, optional `POTENZIAL_SPANNE`. Brevo = Auftragsverarbeiter (AVV, EU). Env: `BREVO_API_KEY`, `BREVO_LIST_ID`.

### 17.5 Lead-Admin (Akzeptanzkriterium)
Eine Ansicht pro Lead: Rolle · Bucket · Problem · angezeigte/geöffnete Lösungen · kopierte Assets · gezeigte Spanne · CTA · Quelle · diySignal · Timeline + **automatischer Gesprächseinstieg**: „Sie haben {problem} angegeben. Bei {bucket} ist das ein möglicher {valueCategory}-Hebel in Spanne {range}. Einstieg: {solutions[0]} prüfen, danach {solutions[1]}." Bei `header-direct`: Hinweis „kein Check-Kontext — Erstbefund verwenden".

---

## 18. Datenschutz & Recht

Check überträgt nichts (clientseitig; so in der Datenschutzerklärung). Einziger bewusster Datenkanal: Opt-in/Termin (E-Mail + Check-Angaben + Consent, Abmeldung beschrieben). Plausible self-hosted, cookieless → kein Cookie-Banner. Brevo AVV. Keine Telemetrie über den Check, kein zentrales Scoring anonymer Besucher. Impressum/Datenschutz vor Live rechtlich prüfen lassen (Pflicht). No-JS-Fallback: statischer Hinweis + Inhalte der Sektionen 4–10 bleiben lesbar; der Check zeigt eine No-JS-Notiz mit Termin-Link.

---

## 19. Events, KPIs, Experimente

### 19.1 Plausible Custom Events (anonym — nur Buckets/Slugs, nie Rohwerte oder Personenbezug)
`role_selected{role} · size_selected{bucket} · problem_selected{slug} · solution_result_rendered{slug} · value_range_shown{solution} · solution_opened{slug} · asset_copied{slug} · scale_break_seen · example_analysis_opened · example_finding_expanded{class} · pruefpaket_downloaded · inline_chips_completed · cta_shown{rule} · cta_clicked{rule} · calendar_clicked{source} · booking_confirmed · pdf_requested · pdf_fallback_shown`
Jedes Event trägt `variantIds`. **Funnel-Pflichtbericht:** role_selected → problem_selected → value_range_shown → cta_shown → calendar_clicked → booking_confirmed.

### 19.2 KPIs
**Primär:** qualifizierte `booking_confirmed` (HighIntent). Hypothesen, am echten Traffic zu validieren: Brand/Direktansprache 8–15 % · LinkedIn-Lösungsseite 6–10 % · SEO/KI 1–3 %.
**Sekundär:** Erste-Klick-Rate (`role_selected`/Visits — kritischster Engpass; durch Above-the-fold-Check maximiert) · Check-Abschlussrate · Funnel-Stufenraten · Lead-mit-Kontext-Quote (Ziel 100 % der Check-Buchungen) · Prüfpaket-Downloads → spätere Buchung (`?src=pruefpaket`) · Segment-Verteilung der Opt-ins (Brevo-Attribute).
**Tertiär (nie Erfolgs-KPI, nie berichten als Erfolg):** Prompt-Kopien, PDF-Anforderungen, Scrolltiefe. `diySignal`-Quote als Gesundheitsmetrik des Routings.

### 19.3 Experimente (Payload `Experiments`, clientseitig hash-stabil zugeteilt)
Ohne Deploy testbar: H1 (A/B/C, §21) · `thresholdHigh` (30/50/100) · CTA-Label/Give-Variante · Problem-Reihenfolge · Proof-Position (über/unter Check) · Design-Theme (Emerald-Premium / Trust-Blue / Neutral-Editorial als CSS-Token-Sets) · StickyBar an/aus · Prüfpaket-Name. **Erfolgsmetrik immer `booking_confirmed`, nie Klicks.** Schema: `{name, hypothesis, variants[], trafficAllocation, targetAudience, successMetric, startDate, endDate?, status}`.

---

## 20. Payload-Datenmodell (vollständig)

Payload (self-hosted, Postgres) ist Admin- und Datenmodell: Problem-Lösungs-Asset-Graph, Lead-Kontext-Speicher, CRO-Konfiguration, Proof-Datenbank, CTA-Regelwerk. Verwaltet Konfiguration und Leads — nie anonyme Besucherdaten.

**Collections:** Roles · SizeMetrics · Problems · Solutions · Assets · CompositeAssets · CalculationModels · Benchmarks · ProofFindings · CTARules · Experiments · DesignVariants · CopyKeys · Leads · LeadEvents · ConsentRecords · Pages · Settings.

```
Problem   { title, slug, roleFilters[], sizeMetricFilters[], userFacingDescription,
            valueCategory[], solutions[], defaultSolutionOrder[], calculationModel?, active }
Solution  { title, slug, shortDescription, helpsWhen, relatedProblems[], assets[],
            primaryAsset, calculationModel?, valueCategory, scalabilityLevel,
            scaleBreakNote (PFLICHT), urgencyTextKey?, ctaRules[], privacyWarning?,
            legalWarning?, active }
Asset     { title, slug, assetType(prompt|video|guide|checklist|image|example|warning|
            template|composite), summary, contentBlocks, childAssets[], copyable, source,
            accessLevel, riskLevel, qualityStatus(draft|reviewed|approved),
            requiresLegalReview, requiresPrivacyNote, lastReviewedAt }
CalculationModel { id, name, valueCategory, requiredInputs, optionalInputs,
            benchmarkFactors[→Benchmarks], formula, minMaxOutput, explanationText, sourceNote }
Benchmark { key, min, max, unit, source, isPlaceholder, lastVerifiedAt }
ProofFinding { date, source, category, title, affectedCount, baseCount, valueMin, valueMax,
            calculationNote, status(identifiziert|umsetzung-gestartet|realisiert),
            realizedValue?, evidenceRef, publicApproved }
CTARule   { name, roleFilters[], problemFilters[], solutionFilters[], minSizeScore?,
            maxSizeScore?, minRelevanceScore?, primaryLabel, sublineKey?, secondaryLabel?,
            destination, priority, active }
Settings  { thresholdHigh{role}, scoreWeights, monthlySlots, scarcityTrue,
            privacyflowReady, proofBandEnabled, calComUrl, partnerprogrammLink,
            stundensatzDefault[min,max], brevoListId }
```
**Zod-/Schema-Gates (Build bricht):** Spanne `min<max`, nie Punktwert · Risiko ⇒ Verlust-Rahmung, qualitativ · qualitative Lösung ⇒ nutzenAussage Pflicht · Problem ohne ≥ 1 Lösung abgelehnt · Lösung ohne `scaleBreakNote` abgelehnt · P1-Lösung ohne CalculationModel abgelehnt · CTA-Rendering ohne CTARule abgelehnt · Rolle ohne End-Ausgang abgelehnt · `Benchmark.isPlaceholder==true` in öffentlicher Verwendung abgelehnt · Asset nur live mit `qualityStatus ∈ {reviewed, approved}` und gesetztem riskLevel · Deaktivieren ohne Löschen überall möglich.

---

## 21. Copy-Bibliothek (verbindliche Startwerte, alle als CopyKeys versioniert)

| Key | Text |
|---|---|
| `copy.eyebrow` | ANONYME BESTANDSDIAGNOSE |
| `copy.h1.A` | Wo bleiben in Ihrem Bestand Ertrag, Zeit und Kontrolle liegen? |
| `copy.h1.B` | Wo verliert Ihr Bestand Geld, ohne dass Sie es sehen? |
| `copy.h1.C` | Finden Sie die Lösungen, die in Ihrem Bestand wirklich Wirkung haben. |
| `copy.trustline` | 3 Minuten · keine Registrierung · keine Datenübertragung · kein Upload |
| `copy.checkIntro` | Was trifft auf Sie zu? Ergebnis sofort — ohne Registrierung, ohne Upload. |
| `copy.founderMicro` | „Eigener Bestandshalter, eigenes Geld im Spiel. Diese Zahlen sind aus meinem eigenen Portfolio — genau so finde ich, was bei Ihnen liegen bleibt." |
| `copy.systemSatz` | Gefunden ist nicht realisiert. ResidentFlow zeigt nicht nur Potenziale, sondern priorisiert den nächsten umsetzbaren Schritt. |
| `copy.uploadObjection` | Wortlaut §5.1 |
| `copy.exampleBadge` | Unsere eigene Mieterliste · {n} Einheiten · anonymisiert · echt |
| `cta.header` / `cta.highIntent` | Ihren Bestand gemeinsam ansehen |
| `cta.give.short` | 30 Minuten. Wir prüfen Ihre Liste vor Ihren Augen und priorisieren die 3 größten Bestandspotenziale. Kein Upload. Kein Pitch. |
| `cta.give.long` | Ihre Liste bleibt bei Ihnen. Sie sehen live, was ResidentFlow erkennt. Am Ende haben Sie eine konkrete Prioritätenliste — auch wenn wir nicht zusammenarbeiten. |
| `cta.scarcity` | Aktuell {n} Diagnose-Gespräche pro Monat. |
| `cta.exampleBridge` | Dieselbe Analyse machen wir mit Ihrer Liste — im Gespräch, vor Ihren Augen. Ihre Liste bleibt bei Ihnen. |
| `copy.scaleBreak.indexmieten` | Diese Prüfung funktioniert für eine Handvoll Verträge. Bei {bucket} ist der eigentliche Wert ein wiederholbarer Prozess: Erkennen, rechtssicher anschreiben, Fristen überwachen — über alle Gesellschaften. Genau dort setzen wir im Gespräch an. |
| `copy.consentTransfer` | Wortlaut §17.1 |
| `copy.pruefpaketName` | Mietanpassungs-Prüfpaket — funktioniert mit Claude, ChatGPT und anderen KI-Assistenten |
| `copy.chipsMicro` | Für eine konservative €-Einschätzung — bleibt in Ihrem Browser. |

---

## 22. Design & Technik

**Design „Light Editorial" (modern, professionell, luxuriös):** edle Serifen-Headlines + ruhige Sans für Fließtext · großzügiger Weißraum · helle, wertige Palette mit EINEM edlen Akzent · präzise Typo-Hierarchie · dezente Linien statt Effekte · ruhig statt „Marketing-laut". Drei Theme-Varianten als CSS-Token-Sets (Emerald-Premium / Trust-Blue / Neutral-Editorial), Entscheidung per Funnel-Daten, nicht Geschmack. Founder-Foto/Logo als Platzhalter bis Lieferung.
**Stack:** Monorepo — `apps/web` (Next.js, SSG/Prerender) · `apps/admin` (Payload, Postgres) · `packages/domain` (framework-freie Engine: Routing, Score, Zustandsmaschine, Spannenrechnung — TDD-Kern) · `packages/ui` · `packages/pruefpaket-mietanpassung` · `api` (Fastify: `/api/optin`, `/api/lead`; Brevo; Server-PDF via pdf-lib). TypeScript strict, Vitest + Testing-Library, deutsche Testbeschreibungen, Prettier (semi, singleQuote, 2, 100).
**Hosting:** Netcup, Docker-Compose: `web` (nginx, statisches Build; Admin nicht im Prod-Build öffentlich), `api`, `analytics` (Plausible self-hosted). cal.com extern. `.env.example` gepflegt.
**Qualität:** SSG für alle öffentlichen Routen · Meta/OG/Twitter-Cards je Seite · semantische Überschriften · robots/sitemap · mobile-first · Lighthouse ≥ 90 mobil · A11y (Tastatur, Kontraste, ARIA an Chips/Accordions) · No-JS-Fallback (§18).

---

## 23. Inhaltsseiten

**Founder-Story (lang, Verkaufselement):** vorhandenes Material der Alt-Seite wiederverwenden (Excel-Anfang · 20 Einheiten: System kollabiert · externe Verwaltung scheitert · 12 VAs scheitern · „Im Hauptjob automatisierte ich täglich mit KI, privat kopierte ich Mieterdaten von WhatsApp in Notion" · Geburt von ResidentFlow). Kürzen, Sie-Form, neues Ende: nicht die Tool-Geburt, sondern „…deshalb verstehe ich Ihr Problem von innen — und finde, was in Beständen liegen bleibt."
**FAQ (genau diese 5, Reihenfolge fix):** 1. Was genau passiert mit meinen Daten? (die eigentliche Kaufhürde — prominent) · 2. Ersetzen oder ergänzen Sie meine Hausverwaltung? · 3. Was ist der Unterschied zu den bekannten Immobilien-Tools? · 4. Was passiert, wenn ich wieder aussteigen will? (Wechselkosten ehrlich) · 5. Läuft das wirklich lokal / wo liegt die KI?
**Methodik:** wie Zahlen entstehen — Selbstauskunft × Benchmark-Spannen aus eigenem Portfolio, konservativ, Rechenweg offen, „kein Gutachten".

---

## 24. Sprints, Launch-Stufen, Definition of Done

### 24.1 Launch-Stufen — residentflow.de bleibt nie ungenutzt
| Stufe | Inhalt | Gates |
|---|---|---|
| **L0 Interim** (Tag 1) | Positionierung (3 Sätze), Founder-Kurzinfo + Foto, Kontakt, Impressum/Datenschutz — keine Zahlen, keine CTAs | G7 + Sprachregeln |
| **L1 Trust-Seite** | + gekürzte Founder-Story, Methodik, FAQ, cal.com-Link — keine Zahlen-Claims, kein Check | G5, G6-light, G7 |
| **L2 Voll-Leadpage** | + ProofStrip, Bestands-Check above the fold, Lösungsseiten, BeispielAnalyse, Prüfpaket | alle Gates G1–G7 |

### 24.2 Sprint-Plan
| Sprint | Inhalt | DoD |
|---|---|---|
| **0a (Tag 1)** | Skool-Redirect kappen · Interim-Seite (L0) · lovable.app noindex · optional L1-Ausbau | G7 grün; **L0 live**; Google-Check eines Entscheiders landet seriös |
| **0b (Woche 1–3, parallel zu 1–2)** | Beweis-Dossier (RFAI über eigenen Bestand; ≥ 3 Findings dokumentiert, ≥ 1 Umsetzung gestartet, z. B. 3 Mietanpassungs-Anschreiben real versendet) · Benchmark-Erhebung (§13) · PrivacyFlow-Gates anstoßen (Signing beauftragen, NER-Test) · Repo-Analyse | Findings reviewed; benchmarks ohne Platzhalter für M1/M2 |
| **0c (Termin)** | Proof-Gate-Entscheidung: je Finding publicApproved ja/nein. Ausgänge: (a) ≥ 3 approved → L2 frei · (b) < 3 → L1 bleibt live, Sprint 3/6 schieben, Outreach läuft trotzdem · (c) Zahlen schwächer als erhofft → ehrlich kleiner, nie auffüllen | Entscheid dokumentiert |
| **1** | Payload: alle Collections (§20), Zod-Gates, Seeds P1, Build-Export `check.config.json` | Schema-Gates rot→grün; Seed rendert in Admin-Vorschau |
| **2** | Frontend: HeroCheck above the fold (Playwright-Abnahmetest §9.1), BestandsCheck-State-Machine, SolutionResult, InlineKontextChips, AssetRenderer, StickyBar | kein Netzwerk im Check; €-Spanne nur quantifiziert; Chips änderbar; Above-the-fold-Test grün; Lighthouse ≥ 90 mobil |
| **3** | P1-Content live (3 Lösungen + M1–M4 + ScaleBreaks + Proof-Verknüpfung) · BeispielAnalyse aus `example-analysis.json` | G2+G3 grün; BeispielAnalyse besteht 30-Sek-Test |
| **4** | Conversion: CTARule-Engine, HighIntentCTA (give.short/long, Scarcity-Flag), PDF-Fallback, cal.com-Prefill inkl. header-direct, `/api/lead`+Brevo, Lead-Admin mit Gesprächseinstieg | E2E Check→CTA→cal.com trägt Kontext; header-direct erzeugt Lead ohne Kontext; G5 grün |
| **5** | Prüfpaket v1 + `/mietanpassungs-pruefpaket` + Einbindung (Lösung, BeispielAnalyse, Outreach-Vorlage Erstbefund-Brief/LinkedIn mit Beilage) | G4 grün; an Stefans Liste + 3 fremden Echt-Listen getestet, protokolliert |
| **6** | CRO: Events vollständig, Experimente (H1/Threshold/Theme), SSG `/loesungen/*` + Answer-first, J4-Seite mit Rechtshinweis, FAQ/Founder/Methodik/Datenschutz, Launch-Review | G1–G7 grün; Funnel-Report je Stufe; **L2-Launch** |
| **Phase 2** | P2/P3-Lösungen + kuratierter Skool-Asset-Import · PrivacyFlow public (G8) · Zinsbindungs-Check-Modul (Darlehensliste: Restschuld × Zinsdelta × Countdown) | — |
| **Phase 3** | Lokaler Browser-Analyzer (stille Power-User-Option) · Executive Briefing (dynamisches Business-Case-PDF, „indikatives Potenzialprofil") · Partnerprogramm-Ausbau | — |

---

## 25. Quality Gates (CI-geprüft wo möglich)

**G1 Proof-Gate (nur L2):** ≥ 3 `ProofFindings publicApproved`, davon ≥ 1 `umsetzung-gestartet`. Ohne G1: `proofBandEnabled=false` und L2 blockiert; L0/L1 unberührt.
**G2 Benchmark-Gate:** P1-CalculationModels referenzieren ausschließlich `isPlaceholder=false`.
**G3 P1-Launch-Gate:** die drei P1-Lösungen vollständig (je ≥ 1 approved Asset, CalculationModel, scaleBreakNote, CTARule, geprüfter Datenschutz-/Rechtshinweis). Kein L2 mit nur Vermarktungs-Content.
**G4 Prüfpaket-Gate:** an 4 Echt-Listen getestet; Decke+Brücke+Disclaimer im Template; extern nie „Skill"; verlinkt auf `/mietanpassungs-pruefpaket` und in Lösung `indexmieten-pruefen`.
**G5 Anti-Pattern-Gate:** automatisierte Tests gegen §4 (kein Upload-Input, kein „Demo", kein Fake-Progress, keine €-Zahl ohne Input, PDF nicht neben Termin bei highIntent, Sprachregeln, Scarcity nur mit Flag).
**G6 Datenschutz-Gate:** Check ohne fetch/Cookie/Storage (Test) · Datenschutzerklärung deckt exakt Opt-in + Plausible + Brevo-AVV · Rechtsprüfung (inkl. Urgency-Zeile) dokumentiert.
**G7 Domain-Gate:** residentflow.de zeigt auf die eigene Seite; kein Skool-/Lovable-Link im öffentlichen Pfad.
**G8 PrivacyFlow-Gate (Phase 2):** §16 vollständig — vorher `privacyflowReady=false`.
**Objekt-Gates:** Problem live nur mit ≥ 2 Lösungen + primärer Lösung + CTARule + Relevanz (quantitativ oder qualitativ) · Lösung live nur mit ≥ 1 Asset + scaleBreakNote + CTARule + geprüftem Hinweis · Asset live nur mit korrektem Typ, funktionierendem Copy-Button (bei Prompt), keinen verlangten sensiblen Daten, gesetztem riskLevel, qualityStatus reviewed/approved.

---

## 26. MVP-Scope

**Drin:** Payload-Setup (§20) · BestandsCheck above the fold · SolutionResult + InlineKontextChips + AssetRenderer + Copy-Button · Composite Assets · CalculationModels M1–M4 · ProofStrip · BeispielAnalyse · System-Satz-Platzierungen · CTARule-Engine + HighIntentCTA + StickyBar + PDF-Fallback · Prüfpaket v1 · Lead-Kontext + cal.com + Brevo + Lead-Admin · anonyme Events + Experimente (H1/Threshold/Theme) · 7 Problem-Slugs · Founder/FAQ/Methodik/Impressum/Datenschutz · L0/L1/L2.
**Nicht MVP:** Skool-Frontend · öffentliche Prompt-Galerie · Twenty/CRM-Integration · vollständiges Business-Case-PDF-System · ResidentFlowAI-Demos je Lösung · vollständige Content-Migration · komplexe A/B-Auswertungs-Engine · PrivacyFlow-Download öffentlich · Browser-Upload/-Analyzer · Zinsbindungs-Modul.

## 27. Risiken & offene Punkte
1. Beweis-Dossier schwächer als erhofft → ehrlich kleiner kommunizieren, nie auffüllen (Sprint 0c, Ausgang c). 2. Benchmarks n=1 (eigener Bestand) → Quelle immer benennen; wächst mit Assessments. 3. Zykluslänge der Zielgruppe (Wochen–Monate) → Direktansprache mit manuellen Erstbefunden an ~20 Ziel-Accounts startet parallel ab Woche 2; die Seite muss zunächst nur den Google-Check bestehen (L0/L1). 4. Rechtsprüfung: Impressum/Datenschutz, Urgency-Zeile, J4-Hinweise — Pflicht vor Live. 5. cal.com-Metadata-Limits → Hash-Fallback. 6. Conversion-Hypothesen sind Hypothesen — am ersten echten Traffic validieren. 7. Echte Assets ausstehend: Founder-Foto/Logo, cal.com-URL, Brevo-IDs, Partnerprogramm-Link.

## 28. Glossar
**Bestands-Check** — interaktive 3-Klick-Diagnose auf der Seite (vormals intern „Schatzsuche"). **Lösung** — extern sichtbarer Lösungsweg (intern historisch „Hebel/Skill" — im UI verboten). **Asset/Baustein** — umsetzbarer Inhalt (Prompt, Guide, Checkliste, Video …). **Mietanpassungs-Prüfpaket** — mitnehmbares Analyse-Paket für KI-Assistenten (intern: Skill). **BeispielAnalyse** — interaktive echte Analyse an Stefans Bestand (Stufe 0). **HighIntent** — Segment ab Rollen-Schwelle. **Motor A/B** — Sofortwert- vs. Diagnose-Modus. **ProofFinding** — dokumentierter echter Befund. **Diagnose-Gespräch** — der Termin (führt ggf. zum Assessment; „Potenzial validieren" = Assessment, nie auf der Seite). **ResidentPrivacyFlow** — lokale Desktop-App (Phase 2, Einwand-Moment). **ResidentFlowAI** — Plattform; Name fällt nur im Skalierungs-Block.

## 29. Der entscheidende Satz
Die Seite beweist zuerst (eigener Bestand, erlebbar), lässt den Besucher in drei Klicks above the fold sein eigenes Thema quantifizieren (Spannen, Rechenweg), gibt Werkzeug dorthin mit, wo er ohnehin arbeitet (Prüfpaket) — und macht den Termin zum einzigen Ort, an dem seine echte Liste analysiert wird: vor seinen Augen, ohne dass sie ihn je verlässt. Gefunden ist nicht realisiert — realisiert wird gemeinsam.
