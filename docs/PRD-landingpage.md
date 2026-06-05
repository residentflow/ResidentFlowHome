# PRD — ResidentFlowAI Landingpage & Bestandspotenzial-Suche

> **Product Requirements Document**
> Version 1.0 · Stand 2026-06-04
> Repository: `residentflow/leadpage_challenge` (Greenfield) · Branch: `claude/homepage-redesign-tdd-0x2MY`
> Quellen: BRD „ResidentFlowAI Go-to-Market-System" v2.0, „RFAI-Landingpage-Aufbau" v1.0, Interview-Verlauf.
> Umsetzung nach **TDD** (Test-Driven Development).

---

## 0. Zweck dieses Dokuments

Dieses PRD beschreibt **vollständig und verbindlich**, WAS gebaut wird und WARUM — als alleinige
Umsetzungsgrundlage für die ResidentFlowAI-Landingpage inkl. interaktiver Bestandspotenzial-Suche
(„Schatzsuche"), entfaltender Treppe, Opt-in (Brevo), Inhaltsseiten und selbstgebautem CMS.
Es dokumentiert jede im Interview getroffene Entscheidung. Bei Widerspruch zu älteren Notizen gilt
dieses PRD.

---

## 1. Vision & Positionierung

**Das Produkt ist Bestandsperformance** — nicht Software, nicht ein Rechner. Die Seite macht in
Sekunden glaubhaft, dass hier jemand systematisch findet, „wo im Bestand Ertrag liegen bleibt — und
dafür sorgt, dass es nicht liegen bleibt". Der Besucher **erlebt** sein eigenes Potenzial, bevor er
irgendetwas gibt.

**Leitprinzip (nicht verhandelbar):** *Erst Nutzen, dann Vertrauen, dann Kontakt — nie umgekehrt.*

**Entfaltende Treppe statt harter Weiche:** Jeder Fund öffnet gestaffelte Tiefe; gleiche Basis für
alle, mehr Stufen für größere Bestände. Additiv, nie ersetzend — der wertvollste Besucher bekommt die
**meiste** Wertschöpfung, nicht die wenigste.

---

## 2. Ziele & Nicht-Ziele

### 2.1 Ziele
- G1: In den ersten Abschnitten **Glaubwürdigkeit durch Substanz** beweisen (echte Findings, echte Zahlen).
- G2: Den Besucher über die **Schatzsuche** sein eigenes Potenzial erleben lassen — ohne Download, ohne Daten, ohne E-Mail.
- G3: Über die **Treppe** genau **einen** passenden nächsten Schritt öffnen (personabasiert).
- G4: Den wertvollen, aber jetzt nicht gesprächsbereiten Besucher per **freiwilligem Opt-in** (Ergebnis-PDF + monatliches Abo) im Orbit halten.
- G5: Das System **solo betreibbar** halten (CMS statt Entwickler für jede Änderung).
- G6: Das **Datenschutzversprechen technisch einlösen** (Suche überträgt nichts).

### 2.2 Nicht-Ziele / Was bewusst NICHT auf die Seite kommt
- Kein „Demo buchen" als Haupt-CTA.
- Kein E-Mail-Gate **vor** oder **während** der Suche; kein Lead-Magnet-Download als Eintrittshürde.
- Keine Feature-Liste, keine technische Architektur als Botschaft.
- **Keine Preise** auf der Seite; der Begriff **„Potenzial validieren"** erscheint NICHT (= reserviert für das bezahlte Performance Assessment).
- Keine Sub-Brands; „Skool"/„Community" als Wort kommen nirgends vor.
- Keine erfundenen Testimonials oder Prüfungs-Zahlen.
- Kein Cookie-Banner (es wird cookieless gemessen).
- **Roadmap (nach Launch, nicht in v1):** Upload-Magie (Drag&Drop-Dokumentanalyse clientseitig), Executive Briefing (dynamisches Business-Case-PDF).

---

## 3. Zielgruppen

### 3.1 Zwei Besuchertypen (ein Bedarf)
- **Der Angesprochene:** wurde direkt kontaktiert, googelt dich, prüft ob du echt bist → **SEO/Seriosität** und sofortige Substanz zählen.
- **Der Neugierige:** kommt kalt über LinkedIn/Content → will in Sekunden Relevanz erkennen.

### 3.2 Strategische Segmente & Routing (Ebene 1)
Entscheidende Kennzahl: **`relevanteEinheiten = eigene + verwaltete Einheiten`**.

**Tätigkeits-Schwerpunkt (Mehrfachauswahl):**
| Tätigkeit | Beispiel-Rollen | Größenmaß |
|---|---|---|
| A) Verwaltung eigener Immobilien | Buy & Hold, Bestandshaltung, Family Office | eigene Einheiten |
| B) Betreuung fremder Bestände | Hausverwaltung, externer Asset Manager, Immobilienberatung, Makler, Steuerberater | betreute Einheiten |
| C) Entwicklung / Fix & Flip | Projektentwicklung, Fix & Flip | Vermarktungen/Jahr |

**End-Ausgänge (Routing-Regeln):**
- **Steuerberater & Makler → Partnerprogramm** (immer, größenunabhängig — reine Multiplikatoren).
- **Bestandsverantwortliche** (A; sowie verwaltend in B: Hausverwaltung / ext. Asset Manager / Immobilienberatung):
  - `relevanteEinheiten ≥ 50` → **volle Treppe inkl. Stufe 3** (RFAI-/Gesprächsweg).
  - `< 50` → **Selbermacher-Weg** (Playbook + PrivacyFlow), kein Mandats-Push.
- **Entwicklung / Fix & Flip → kürzerer Weg** (Nebenstrang, passende Vermarktungs-Hebel).
- **Mehrfachauswahl:** der höchstwertige Weg gewinnt (eigener Bestand/Verwaltung in Summe ≥ 50 → ganze Treppe).
- **„Flow gilt für alle":** alle durchlaufen denselben Ablauf; nur der **End-Ausgang** unterscheidet sich.

### 3.3 Vollständige Rollen → Segment → End-Ausgang (verbindlich)
Universelles Entscheidungskriterium ist **immer** die Anzahl eigener/verwalteter Einheiten.

| Rolle | Tätigkeit/Bucket | Größenmaß | End-Ausgang |
|---|---|---|---|
| Buy & Hold | A (eigen) | eigene Einheiten | ≥50 → volle Treppe · <50 → Selbermacher |
| Bestandshaltung | A (eigen) | eigene Einheiten | ≥50 → volle Treppe · <50 → Selbermacher |
| Family Office | A (eigen) | eigene Einheiten | ≥50 → volle Treppe · <50 → Selbermacher |
| Asset Management (eigener Bestand) | A (eigen) | eigene Einheiten | ≥50 → volle Treppe · <50 → Selbermacher |
| Hausverwaltung | B-verwaltend | betreute Einheiten | ≥50 → volle Treppe · <50 → Selbermacher |
| Externer Asset Manager | B-verwaltend | betreute Einheiten | ≥50 → volle Treppe · <50 → Selbermacher |
| Immobilienberatung | B-verwaltend | betreute Einheiten | ≥50 → volle Treppe · <50 → Selbermacher |
| **Steuerberater** | B-Partner | — | **Partnerprogramm (immer)** |
| **Makler** | B-Partner | — | **Partnerprogramm (immer)** |
| Projektentwicklung | C | Vermarktungen/Jahr | kürzerer Weg (Nebenstrang) |
| Fix & Flip | C | Vermarktungen/Jahr | kürzerer Weg (Nebenstrang) |

- **Asset Management** kann A **oder** B sein — die Mehrfachauswahl + Größenfrage „eigener vs. betreuter Bestand" entscheidet.
- **Adaptive Größenfrage** je Tätigkeit: A → „Anzahl Einheiten im eigenen Bestand"; B → „Anzahl betreute Einheiten"; C → „Anzahl Vermarktungen/Verkäufe pro Jahr".
- Threshold-Standard 50, im CMS global oder pro Hebel übersteuerbar.

**Erkennungssignal (BRD §4):** mehrere Gesellschaften, verstreute Dokumente, externe Verwaltung die
Marge frisst, kein System das Potenziale systematisch hebt → fließt in die Problem-Texte ein.

---

## 4. Das 3-Ebenen-Modell (zentrale Architektur)

```
Ebene 1: Rolle + Größe          →   Ebene 2: Probleme               →   Ebene 3: Hebel (Lösungen)
(Routing + Filter)                   (übergreifend, Nutzer-Sprache,        (nach Lifecycle geordnet;
                                      zweistufig: Bereich → konkret)        Euro-Spanne erst nach Selbstauskunft)
```

**Kernunterscheidung (Interview-Entscheidung):**
- Die **Probleme** des Nutzers sind **lifecycle-übergreifend** und hängen an **Rolle + Größe**, nicht an einer Phase
  (z.B. „Vermarktung dauert zu lange", „Unzufrieden mit der Hausverwaltung").
- Das **Lifecycle-Modell ordnet nur die Hebel/Lösungen** (Angebotsseite).
- Ein **Mapping** verbindet jedes Problem mit **1..n Hebeln** — phasenübergreifend.

---

## 5. Ebene 2 — Probleme (zweistufig geführt)

### 5.1 Auswahlmechanik
**Stufe A — grobe Schmerz-Bereiche** (wenige, sofort verständlich), Seed:
`Ertrag & Rendite` · `Zeit & Verwaltungsaufwand` · `Vermarktung & Leerstand` · `Liquidität & Finanzierung` ·
`Risiko & Sicherheit` · `Wachstum & Skalierung` · `„weiß ich nicht genau"`.

**Stufe B — konkrete Probleme** je gewähltem Bereich, **in der Sprache des Nutzers**, **nach Rolle+Größe
gefiltert**, Mehrfachauswahl. `„weiß ich nicht genau"` → zeigt die häufigsten Hebel der Rolle.

### 5.2 Beispiel-Probleme (Seed, im CMS pflegbar)
„Mieterhöhungen / Indexmieten werden nicht konsequent gezogen" · „Vermarktung/Neuvermietung dauert zu
lange" · „Unzufrieden mit der (eigenen/externen) Hausverwaltung" · „Belegchaos vor der Steuer" · „Wissen
hängt an einzelnen Köpfen" · „Fristen/Termine gehen unter" · „Ankaufprüfung kostet zu viel Zeit" ·
„Keine Transparenz über Liquidität/Cashflow" · „Zu viele manuelle Routinetätigkeiten".

### 5.3 Datenregeln
- Jedes Problem hat: `schmerzBereich`, `text`, `rollenFilter[]`, optionale `größenBedingung`, `verknüpfteHebel[]`, `aktiv`.
- Kein Problem ohne mindestens **einen** verknüpften Hebel (Schema-Validierung).

---

## 6. Ebene 3 — Hebel-Taxonomie: 8 Lebenszyklus-Phasen

Die Phasen **ordnen die Lösungen**; der Nutzer begegnet ihnen über seine Probleme, nicht über Phasen.
Jede Phase liefert **Problemstellungen** (Mapping-Quelle) und **Hebel** (Funde). Vollständiger Seed-Katalog:

### Phase 1 — Akquise & Ankaufprüfung
- *Problemstellungen:* zu wenig attraktive Objekte; fehlende Off-Market-Deals; zu hoher Prüfungsaufwand; versteckte Risiken in Dokumenten; unsichere Rendite-/Cashflow-Berechnungen; fehlende Vergleichswerte.
- *Hebel:* Markt- und Standortanalyse; Deal-Screening & Priorisierung; Analyse von Exposés/Mietlisten/Verträgen; Risikoerkennung in Dokumenten; automatische Wirtschaftlichkeitsberechnungen; Erstellung von Investment-Memoranden.

### Phase 2 — Finanzierung & Investorenkommunikation
- *Problemstellungen:* komplexe Finanzierungsstrukturen; schwierige Bank-/Investorengespräche; fehlende Szenario-Transparenz; hoher Unterlagenaufwand.
- *Hebel:* Finanzierungsvergleiche; Cashflow-/Liquiditätssimulationen; Investorenpräsentationen; Erstellung von Finanzierungsunterlagen; Szenarioanalysen für Zinsen und Tilgung.

### Phase 3 — Vermarktung & Neuvermietung
- *Problemstellungen:* lange Vermarktungszeiten; schlechte Exposés; wenige qualifizierte Interessenten; Leerstandskosten; veraltete Objektunterlagen.
- *Hebel:* professionelle Exposés; zielgruppenspezifische Vermarktungstexte; virtuelles Homestaging; digitale Möblierung leerer Wohnungen; Digitalisierung alter Grundrisse; moderne 2D-/3D-Grundrisse; KI-generierte Objektbilder; Inseratsoptimierung; Vorqualifizierung von Interessenten.

### Phase 4 — Mietermanagement & Kommunikation
- *Problemstellungen:* hoher Kommunikationsaufwand; wiederkehrende Anfragen; Beschwerden/Konflikte; langsame Vorgangsbearbeitung.
- *Hebel:* automatisierte Kommunikation; Antwortvorschläge für E-Mails; Priorisierung von Anfragen; Schadensmanagement; Dokumentation der Mieterkommunikation.

### Phase 5 — Objektverwaltung & Betriebskosten
- *Problemstellungen:* hoher Verwaltungsaufwand; Abrechnungsfehler; übersehene Fristen/Termine; unübersichtliche Prozesse.
- *Hebel:* Betriebskostenabrechnungen prüfen; Dokumentenmanagement; Fristenüberwachung; Aufgabensteuerung; automatische Berichte/Auswertungen.

### Phase 6 — Buchhaltung & Controlling
- *Problemstellungen:* Belegchaos; fehlende Transparenz; aufwendige Auswertungen; unsichere Liquiditätsplanung.
- *Hebel:* Belegerkennung; Buchungsvorschläge; Liquiditätsprognosen; Kostenanalysen; Portfolio-Reporting; Vorbereitung für Steuerberater.

### Phase 7 — Projektentwicklung & Sanierung
- *Problemstellungen:* Kostenüberschreitungen; unsichere Kalkulationen; Projektverzögerungen; fehlende Entscheidungsgrundlagen.
- *Hebel:* Wirtschaftlichkeitsanalysen; Szenario-/Sensitivitätsanalysen; Projektplanung; Sanierungsbudgetierung; Risikoanalysen; Unterstützung bei Genehmigungsunterlagen.

### Phase 8 — Automatisierung & Prozesse (querschnittlich)
- *Problemstellungen:* zu viele manuelle Tätigkeiten; Medienbrüche; fehlende Skalierbarkeit; hoher Verwaltungsaufwand.
- *Hebel:* Workflow-Automatisierung; Dokumentenverarbeitung; Datenerfassung; KI-Agenten für Routineaufgaben; Verknüpfung verschiedener Softwarelösungen.

### 6.1 Wert-Kategorie je Hebel (zweite Dimension)
Jeder Hebel trägt zusätzlich eine **Wert-Kategorie**, die Rahmung und Euro-Logik bestimmt:
| Kategorie | Rahmung | Euro-Logik |
|---|---|---|
| **Ertrag** | CHANCE („Potenzial") | quantifizierbar (Mehr-Ertrag) |
| **Effizienz** | CHANCE (gesparte Zeit/Kosten) | quantifizierbar oder qualitativ |
| **Risiko** | VERLUST („droht", „ungesichert") | i.d.R. qualitativ + Wahrscheinlichkeit |

**Regel:** Verlust-Rahmung **nur** bei Risiko-Hebeln (ehrlich). Hebel sind `quantifizierbar` (Euro-Spanne)
**oder** `qualitativ` (Zeit-/Sicherheits-Nutzenaussage). Optional `personaSprache` (gleicher Hebel,
andere Worte je Rolle).

---

## 7. Berechnungsmodell — „Wie kommen die Zahlen zustande?"

**Grundregel: keine Euro-Zahl ohne Selbstauskunft des Nutzers.**

Zustandsmaschine je Hebel:
1. **`relevant` (qualitativ):** sobald Rolle + Größe + Problem passen → Hebel erscheint als „relevant"
   (bei Risiko: Wahrscheinlichkeits-Hinweis), **ohne** Euro-Zahl.
2. **`quantifiziert` (Spanne):** erst wenn der Nutzer die nötige **Detailangabe** macht:
   `Ausgabe = Eingaben(Nutzer) × Benchmark-Faktoren → {min, max}` (konservativ).
3. **`präzisiert`:** weitere Angaben verengen die Spanne.

**Benchmark-Faktoren:** im CMS hinterlegt, **immer als Spannen**, Quelle = **Stefans realer Bestand**
(BRD §12 „aus unserem eigenen Portfolio") — bis zur Lieferung klar markierte Platzhalter. Beispiele:
Anteil betroffener Verträge, Ø-Mietdifferenz/Monat, Ø-Stundensatz, Ø-Leerstandstage, Ø-Verkürzung.

**Ehrlichkeits-/Qualitätsregeln (rote Linien):**
- Potenziale **immer als Spannen**, nie als Punktwerte (Punktwert = Messlatte). Technisch erzwungen.
- Rechenweg **sichtbar** und nachvollziehbar; konservativ kalkuliert.
- Findings nur echt; solange nur eigener Bestand → „aus unserem eigenen Portfolio". Keine erfundenen Zahlen.

**Rechenbeispiel (Hebel „Virtuelles Staging", Phase 3):**
Detailangabe Nutzer: 5 Neuvermietungen/Jahr · Benchmark-Faktoren (CMS): Ø-Miete 600 € ·
Verkürzung 3–4 Wochen → `5 × 600 € × (3–4 Wo.) ≈ 2.700 – 3.600 € p.a.` (Spanne, sichtbarer
Rechenweg, konservativ). Erst nach Eingabe der „5" erscheint die Spanne; vorher nur „relevant".

---

## 8. Schatzsuche — Flow & Funde-Mechanik

### 8.1 Reihenfolge
① **Tätigkeit** (Mehrfachauswahl A/B/C) → ② **Größe** (adaptiver Regler/Auswahl: eigene Einheiten /
betreute Einheiten / Vermarktungen pro Jahr) → ③ **Probleme** (zweistufig, nach Rolle+Größe gefiltert) →
④ **Schatzsuche-Detail** (Selbstauskunft je relevantem Hebel).

> **Bewusste Abweichung vom Ursprungsdoku:** Die Anleitung startete „im Schmerz". Im Interview wurde
> die Reihenfolge auf **Tätigkeit → Größe → Schmerz/Probleme → Detail** geändert, damit das System früh
> Rolle + Größe kennt und die Probleme passend filtern kann.

### 8.2 Sammel-Logik
Der Besucher sammelt **Erkenntnisse, nicht eine hochzählende Euro-Summe**. Mitlaufende Liste oben:
„Bereits identifizierte Hebel: N", je Zeile **Erkenntnis + Euro-Spanne / qualitativer Nutzen gleich stark**.

```
Bereits identifizierte Hebel: 3
✅ Mietpotenzial erkannt              18.000 – 42.000 € p.a.
✅ Dokumentationsrisiko erkannt       (Aufwand/Risiko)
✅ Leerstandsoptimierung erkannt       6.000 – 19.000 € p.a.
```

### 8.3 Karten (Mini-Vorschau je Fund)
**Ertrags-/Effizienz-Karte (CHANCE):** Titel + Spanne + „Typische Ursache" + „Im Playbook erfahren Sie: …".
**Risiko-Karte (VERLUST):** ⚠️ Titel + Wahrscheinlichkeit/Grund + „Was droht: …".
Sprache: „Hebel entdeckt", nie „Skill".

### 8.4 Progressive Funde-Mechanik (Interview-Wortlaut)
- **Schätze sind immer sichtbar** und werden **mit jeder Antwort sichtbarer/mehr** — der Wert kommt bei
  JEDER Interaktion, nicht erst am Schluss (Sog statt Mühe).
- **Neusortierung bei Problem-/Schmerz-Eingabe:** die zum gewählten Problem passenden Hebel rücken nach oben.
- **Präzisierung je Eingabe:** mit jeder Detailangabe wird das Potenzial genauer berechnet (Spanne verengt sich).
- **Fortschrittsbalken** („x von y relevanten Bereichen analysiert") — Zeigarnik-Effekt, Conversion-Hebel.
- **Bedingte Logik (deklaratives Regelmodell):** Fragen/Hebel erscheinen nur, wenn sie zur Rolle/Größe/zum
  Problem passen. Beispiel: „Wie viele Neuvermietungen pro Jahr?" nur bei Makler/Verwaltung für Dritte →
  Eingabe „5" deckt Hebel **Virtuelles Staging** auf (Rechenweg sichtbar).
- **Wenige starke Funde**, nicht viele kleine.

### 8.5 Technik (hart)
**Reines clientseitiges JavaScript. Keine Datenübertragung, kein Cookie, keine Speicherung, keine
E-Mail-Abfrage während der Suche.** Eingaben verlassen den Browser nicht.

---

## 9. Landingpage — Abschnitts-Spezifikation (Reihenfolge fix)

| # | Abschnitt | Aufgabe & Inhalt |
|---|---|---|
| 1 | **Hero** | 3-Sek-Erkennung. Topline (Bestand optimieren · Rendite steigern · Verwaltungsaufwand reduzieren), **breite** Subline (nicht ausschließend — kein „ab 200 WE"), Versprechen-Satz. Kein Produktname/„Software" oben. |
| 2 | **„Was andere sehen / Was wir sehen"** | Wahrnehmungs-Shift: Leerstände→nicht gezogene Mieterhöhungen; Dokumente→versteckte Ertragspotenziale; „→ aus eigenem Bestand identifiziert". |
| 3 | **Problem** | Konkreter Alltag + Entlastung („nicht weil Ihr Team schlecht arbeitet — sondern weil kein System es systematisch findet") + Merk-Zahl (z.B. 25.000–90.000 € bei ~150 Einheiten, als Spanne). Noch kein Verkauf. |
| 4 | **Beweis ★** | Echte Findings in € „aus unserem eigenen Portfolio" + **Founder-Micro-Zitat direkt daneben** (Foto + Name) → Identifikation VOR der Suche. |
| 5 | **Brücke „Was Sie in 3 Min herausfinden"** | 3 Entlastungen *(Keine Registrierung. Keine Dokumente. Keine E-Mail.)*, 4 Nutzen-Häkchen, CTA **„Bestand analysieren"** + Subtext (3 Min · keine Datenübertragung · keine Registrierung). |
| 6 | **Schatzsuche** | siehe §8. |
| 7 | **Treppe + Ergebnis + Opt-in** | siehe §10. |
| 8 | **Datenschutz-Beweis** | „Ihre Daten verlassen Ihr Gerät nicht … läuft lokal … EU/self-hosted, nie US-Cloud … Kontakt nur auf Ihren Wunsch." Signale: *lokal · EU/self-hosted · Daten bleiben bei Ihnen*. Steht NACH der Suche (Bestätigung statt Behauptung). Voraussetzung: code-gedeckt. |
| 9 | **Founder ★** | Lange Story: eigener Bestandshalter, eigenes Geld im Spiel, aus eigenem Bedarf gebaut, zuerst am eigenen Bestand erprobt; endet mit „…verstehe Ihr Problem von innen". |

Gewichtung: Abschnitte 1–4 und 8–9 tragen ~90% der Glaubwürdigkeit; Suche+Treppe sind der interaktive Kern.

---

## 10. Treppe, Ergebnis & Opt-in

### 10.1 Entfaltende Treppe (additiv, nie ersetzend)
| Stufe | Für wen | Element | Ziel |
|---|---|---|---|
| 1 — Playbook ansehen | IMMER | „Playbook ansehen" | Methodenbibliothek (Skool — Wort nie sichtbar) |
| 2 — Für eigenen Bestand umsetzen | IMMER | **zwei Wege** | (a) ResidentPrivacyFlow-Download **oder** (b) geführte Analyse ohne Installation im Termin |
| 3 — Vollautomatisierung | nur ab Schwelle (A + B-verwaltend, ≥50; NICHT Steuerberater/Makler, NICHT C) | **Video pro Hebel** + Terminlink | Terminbuchung |

- **Stufe 3 ist die einzige Stelle, an der „ResidentFlowAI" fällt** (zeigt die Automatisierung genau dieses Hebels).
- **Terminlink-Text: „Ihren Bestand gemeinsam ansehen"** (NICHT „Gespräch buchen", NICHT „Potenzial validieren").
- **Übergangszustand:** Hebel ohne fertiges Video zeigen ab Schwelle direkt den Terminlink (Videos werden nachgeliefert).

### 10.2 Verdichtetes Ergebnis (nicht drei lose CTAs)
EIN empfohlener, persona-basierter Hauptweg + Alternativen darunter; Gesamtpotenzial als **Spanne**.
Multiplikatoren (Steuerberater/Makler) → **Partnerprogramm-Link**.

### 10.3 Ergebnis-PDF
Ehrlich gerahmt als **„Indikatives Potenzialprofil auf Basis Ihrer Angaben"** (Spannen, kein Gutachten),
gedacht zur internen Weitergabe (Asset Manager/Steuerberater).

### 10.4 Opt-in (kein Gate davor)
- **Hauptkanal:** „Ihr Potenzialprofil als PDF erhalten" → per Brevo transaktional.
- **Zusatz-Häkchen:** monatliches Erkenntnis-Abo, **nicht** vorausgewählt, **Double-Opt-in**.
- **Fallback-Staffel:** ① Ergebnis-PDF → ② monatliches Abo → ③ asynchroner nächster Schritt („auf die Ergebnis-Mail antworten").

---

## 11. Opt-in-Daten & Brevo (einwilligungsbasiert)

> **Entscheidung:** Entscheidet sich der Nutzer, seine E-Mail zu hinterlassen, werden **Rolle und Anzahl
> Einheiten in Brevo gespeichert** (Lead-Qualifizierung).

- **Datensammlung nur nach aktiver Einwilligung**; betrifft ausschließlich die anonyme Suche (keine Bestandsinhalte).
- **Payload an `POST /api/optin`:** `{ email, consentPdf, consentAbo, rolle/taetigkeit, relevanteEinheiten, ergebnisSpanne }`.
- **Brevo-Kontaktattribute:** `ROLLE`, `EINHEITEN` (+ optional grobe `POTENZIAL_SPANNE`).
- **PDF:** transaktional (immer, da angefordert). **Abo:** nur bei `consentAbo`, **Double-Opt-in**, Add-to-List.
- **Datenschutzerklärung** beschreibt genau diesen einen Kanal (was, wofür, Abmeldung) + Brevo als
  **Auftragsverarbeiter (AVV)**. Kein zentrales Lead-Scoring, keine Telemetrie über die Suche.

---

## 12. Inhaltsseiten

- **Founder-Story (lang, Verkaufselement):** eigener Bestandshalter, eigenes Geld, aus eigenem Bedarf
  gebaut, zuerst am eigenen Bestand angewandt. Endet mit „…deshalb verstehe ich Ihr Problem von innen".
- **FAQ (Vertrauensfragen):**
  1. Was genau passiert mit meinen Daten? *(die eigentliche Kaufhürde — prominent)*
  2. Ersetzen oder ergänzen Sie meine Hausverwaltung?
  3. Was ist der Unterschied zu den bekannten Immobilien-Tools?
  4. Was passiert, wenn ich wieder aussteigen will? *(Wechselkosten ehrlich adressieren)*
  5. Läuft das wirklich lokal / wo liegt die KI?
- **Impressum & Datenschutzerklärung:** muss durch tatsächliches Verhalten gedeckt sein (Suche überträgt
  nichts; Opt-in-Kanal; Plausible cookieless; Brevo-AVV). Entwurf + **„rechtlich prüfen lassen"** (Hinweis).

---

## 13. Einstellungsmenü / CMS (Schatzsuche-CMS)

> **Zweck:** Die Schatzsuche ohne Code pflegen. **Verwaltet nur Konfiguration, niemals Besucherdaten.**

### 13.1 Architektur-Entscheidung
- **Selbstgebaut**, **Config-as-Code im Repo** (versionierte JSON/TS), **nur lokal/Dev erreichbar**
  (nicht im Prod-Build, kein Login nötig). Änderung → Commit → Redeploy.
- Persistenz: **lokal schreiben** (Dev-Endpoint/File-System-Access) **+ JSON-Export/Import** als Fallback.

### 13.2 Verwaltete Objekte
- **SchmerzBereiche** (Stufe-A-Auswahl).
- **Probleme** (Stufe B): Text, `schmerzBereich`, `rollenFilter[]`, `größenBedingung`, `verknüpfteHebel[]`, `aktiv`.
- **Lifecycle-Phasen** (1–8).
- **Hebel:** Name, Phase, `wertKategorie`, `rahmung`, `quantifizierbar`, `taetigkeiten[]`, `detailFragen[]`,
  Berechnung (Formel) **oder** `nutzenAussage`, `personaSprache`, `playbookLink`, `videoLink`, `kartenText`.
- **Problem↔Hebel-Mapping** (n:m, phasenübergreifend).
- **Benchmark-Faktoren** (als Spannen).
- **Segmente:** Tätigkeit → Typ → End-Ausgang (Pflicht).
- **GlobalConfig:** Schwellenwert (Standard 50), Termin-Link, Partnerprogramm-Link, Brevo-Listen-ID, PrivacyFlow-Download-URL.

### 13.3 Funktionen
- **Potenzial-Berechnung** hinterlegbar (Eingaben × Faktoren × Spanne); **Spannen-Zwang technisch erzwungen** (kein Punktwert).
- **Schwellenwert-Logik** global oder pro Hebel.
- **Persona-gesteuerte Ausgänge** (Gespräch / Partnerprogramm / nur Playbook).
- **Deaktivieren ohne Löschen.**
- **Vorschau:** zeigt die Suche für gewählte Rolle + Größe + Problem.

### 13.4 Was das Menü NICHT tut
- Keine Besucherdaten speichern/auswerten. Keine Punktwerte zulassen. Keine Persona ohne definierten Ausgang.

---

## 14. Datenmodell (TypeScript + Zod)

```
SchmerzBereich { id, name, reihenfolge }
Problem        { id, schmerzBereich, text, rollenFilter[], größenBedingung?, verknüpfteHebel[], aktiv }
Phase          { id, name, reihenfolge }
Hebel          { id, name, lebenszyklusPhase, wertKategorie('ertrag'|'effizienz'|'risiko'),
                 rahmung('chance'|'verlust'), quantifizierbar, taetigkeiten[], detailFragen[],
                 berechnung?: Formel, nutzenAussage?, personaSprache?, playbookLink, videoLink?, kartenText }
Formel         { inputs[], faktoren(Benchmark-Spannen), ausgabe {min,max} + einheit, rechenwegText }
Segment        { taetigkeit, typ('kern'|'multiplikator'|'nebenstrang'), endAusgang('gespraech'|'partnerprogramm'|'nur-playbook') }
GlobalConfig   { schwellenwertStufe3=50, terminLink, partnerprogrammLink, brevoListId, privacyFlowDownloadUrl }
```
**Zod-Validierungen (Schema-Gates):** Formel-Ausgabe & Faktoren immer Spanne (`min<max`, nie Punktwert);
Risiko ⇒ `rahmung='verlust'`; qualitativer Hebel ⇒ `nutzenAussage` Pflicht; Segment ohne `endAusgang`
abgelehnt; Problem ohne Hebel-Mapping abgelehnt.

---

## 15. Technische Architektur & Infrastruktur

### 15.1 Stack
React 18 + Vite 5 + TypeScript (strict) + Vitest + Testing-Library. Deutsch-only. Konventionen analog
`residentprivacyflow` (Tests in `__tests__/`, deutsche `it(...)`-Beschreibungen). Prettier (semi, singleQuote, 2, 100).

### 15.2 Verzeichnisstruktur (Soll)
```
src/
  domain/        # framework-freie Logik (Engine, Schema) — TDD-Kern
  components/sections | schatzsuche | treppe | content | admin
  services/      # brevo-client, pdf-export, config-io
  content/       # schatzsuche.config (Single Source of Truth, Seed)
netlify? nein → netzcup/Docker:
api/             # Fastify: POST /api/optin
docker-compose.yml, Dockerfile(web), Dockerfile(api), nginx/, .env.example
```

### 15.3 Hosting (Netcup, Docker-Compose)
- **`web`**: nginx serviert statisches Vite-Build (Landingpage; **CMS nicht im Prod-Build**).
- **`api`**: Fastify — `POST /api/optin` → Brevo transaktional-PDF (pdf-lib) + Attribute + Double-Opt-in.
  Env-Secrets: `BREVO_API_KEY`, `BREVO_LIST_ID`.
- **`analytics`**: Plausible (cookieless, self-hosted).
- **cal.com**: extern (Terminlink/Embed).

### 15.4 Qualität: SEO, Performance, A11y, Responsive
- Statische Seiten **vorgerendert (SSG/Prerender)** für den googelnden Besucher; Meta-Title/Description,
  **Open-Graph/Twitter-Cards**, semantische Überschriften, `robots`/`sitemap`.
- **Mobile-first/responsive**, gute **Lighthouse**-Werte, **A11y** (semantisch, Tastatur, Kontraste).
- Suche ist JS-only → klarer **No-JS-Hinweis-Fallback**. Kein Cookie-Banner.

### 15.5 Designprinzipien (Light Editorial — „modern, professionell, luxuriös")
Hochwertige Report-/Magazin-Anmutung: edle Serifen-Headlines + klare, ruhige Sans für Fließtext;
großzügiger Weißraum; zurückhaltende, wertige Farbpalette (hell, ein einzelner edler Akzent);
präzise Typo-Hierarchie; dezente Linien/Trenner statt verspielter Effekte; ruhige, glaubwürdige
Anmutung statt „Marketing-laut". Vollständig responsive/mobil; Founder-Foto + Logo als Platzhalter
bis zur Lieferung echter Assets.

---

## 16. Datenschutz & Recht

- **Suche:** überträgt nichts (clientseitig). Muss in der Datenschutzerklärung so stehen.
- **Opt-in:** einziger bewusster Datenkanal; E-Mail + Rolle + Einheiten + Einwilligung; Abmeldung beschrieben.
- **Analytics:** Plausible cookieless — kein personenbezogenes Tracking, kein Banner.
- **Brevo:** Auftragsverarbeiter, AVV; EU-Verarbeitung.
- **Datenschutz-Aussagen erst öffentlich, wenn durch Code gedeckt** (PrivacyFlow-Blocker, §19).
- **Rechtsprüfung** von Impressum/Datenschutz durch Person mit Rechtskenntnis (Pflicht vor Live).

---

## 17. Sprachregeln & rote Linien (als automatisierte Test-Gates)

- **Spannen-Zwang** + **keine Euro-Zahl ohne Selbstauskunft** (Test: Hebel ohne Detaileingabe bleibt qualitativ).
- **„Skool"/„Community" kommen nirgends vor.**
- **„ResidentFlowAI" ausschließlich in der Stufe-3-Komponente.**
- Fund-Label = **„Hebel"** (nicht „Skill").
- **„KI" ist extern erlaubt** (bewusste Abkehr von der BRD-Sprachregel §2/§3 — Entscheidung des Gründers; Gate reaktivierbar).
- **Verlust-Rahmung nur bei Risiko-Hebeln.**
- **Suche überträgt nichts** (kein fetch/cookie/localStorage während der Suche).
- **Keine Preise / kein „Potenzial validieren"** auf der Seite.
- Nicht-Ziele aus §2.2 (kein „Demo buchen"-Haupt-CTA, kein E-Mail-Gate vor/während Suche, keine erfundenen Zahlen, kein Cookie-Banner).

---

## 18. TDD-Meilensteinplan

| MS | Inhalt (Tests zuerst) |
|---|---|
| **M0** | Gerüst: Vite/React/TS/Vitest, Routing-Skelett, Smoke-Test |
| **M1** | Typen + Zod-Schema: alle Schema-Gates (§14) |
| **M2** | Engine (rein): routing, filterProbleme, findeRelevanteHebel (phasenübergreifend), Zustandsmaschine relevant→quantifiziert→präzisiert, berechneSpanne, aggregiere, bestimmeStufen, fortschritt |
| **M3** | Schatzsuche-UI: Reihenfolge, zweistufige gefilterte Problemauswahl, qualitativ→Spanne nach Selbstauskunft, Erkenntnis-Liste, Fortschrittsbalken, Chance/Verlust-Karten, **keine Netzwerk-/Storage-Zugriffe** |
| **M4** | Treppe: Schwellen-/Segment-Logik, St.2 zwei Wege, ResidentFlowAI nur St.3, Terminlink-Text, Video-Übergang, verdichtetes Ergebnis |
| **M5** | Ergebnis + Opt-in: Abo-Häkchen nicht vorausgewählt, Einwilligung Pflicht, PDF „indikativ", api/optin (Brevo gemockt) → PDF + Attribute ROLLE/EINHEITEN + Double-Opt-in, Fallback-Staffel |
| **M6** | Statische Abschnitte (alle 9) + Sprach-Gates |
| **M7** | Inhaltsseiten: Founder-Story, FAQ (5 Fragen), Impressum, Datenschutz (deckt Verhalten/Brevo/Plausible) |
| **M8** | CMS (lokal): CRUD + Problem↔Hebel-Mapping + Benchmark-Faktoren, Punktwert-Block, Segment-Ausgang Pflicht, Aktiv/Inaktiv, Vorschau, Save + Export/Import |
| **M9** | Infrastruktur: Fastify, Brevo-Client, Server-PDF, Plausible, Compose, nginx, .env.example, SSG/Prerender, Meta/OG |
| **M10** | Verdrahtung & E2E: Routen, Pipeline-Mapping der CTAs, responsive Politur, Build grün |

**Pipeline-Mapping (BRD §8):** St.3 „Bestand gemeinsam ansehen" → S2 Diagnose · PrivacyFlow (St.2) → S3
Beweis-Moment · Playbook (St.1) → außerhalb Mandats-Pipeline · Multiplikator → Partnerprogramm.

---

## 19. Offene Punkte, Annahmen & Risiken

- **Echte Werte** ersetzen Platzhalter: Benchmark-Faktoren, Findings (§7), Founder-Assets (Foto/Logo), Links (Skool/Partnerprogramm/Video/PrivacyFlow-Download), cal.com-Link, Brevo-Listen-ID/Key.
- **„KI extern"** widerspricht BRD §2/§3 — bewusste Entscheidung des Gründers; das KI-Sprach-Gate ist bei Revision reaktivierbar.
- **Repo-Umbenennung** `leadpage_challenge` → `ResidentFlow`: kein Rename-Tool verfügbar → durch Gründer in GitHub-Settings; danach `origin` aktualisieren.
- **PrivacyFlow-Live-Blocker** (BRD §10 / Doku §7): NER-Modell verifizieren, US-Provider sperren / KI-Chat nur EU, Code-Signing, Doku=Code, lokale Verschlüsselung. **Decken die Datenschutz-/Download-Aussagen.** „Endzustand annehmen" gewählt → vor Live müssen die Aussagen durch Code gedeckt sein, sonst Übergangs-Schalter nachrüsten.
- **Conversion-Raten** und **Zykluslänge** der Zielgruppe sind Hypothesen.
- **Rechtsprüfung** Impressum/Datenschutz erforderlich.

---

## 20. Roadmap (nach Launch — bewusst nicht in v1)

- **Upload-Magie:** Drag-and-Drop eines Dokuments → sofort Hebel + Euro, **clientseitig im Browser** (harte Bedingung; Start mit Excel-Mieterliste).
- **Executive Briefing:** dynamisch generiertes Business-Case-PDF zur internen Weitergabe (ehrlich als „indikatives Potenzialprofil" gerahmt) → stärkste Form des Haupt-Opt-ins.

---

## 21. Glossar

- **Hebel** — extern sichtbarer Name für eine Lösung/einen Optimierungsansatz (intern „Skill").
- **Schatzsuche** — interaktive, clientseitige Bestandspotenzial-Suche.
- **Treppe** — gestaffelte Tiefe je Hebel (Playbook → eigener Bestand → Vollautomatisierung).
- **Selbermacher-Weg** — Playbook + PrivacyFlow (Bestand < 50).
- **Partnerprogramm** — End-Ausgang für Multiplikatoren (Steuerberater/Makler).
- **Performance Assessment** — bezahlte Potenzial-Validierung (NICHT auf der Seite; „Potenzial validieren").
- **ResidentPrivacyFlow** — lokale Desktop-App (Beweis-Moment, Stufe 2).
- **ResidentFlowAI** — Plattform/Vollautomatisierung (nur in Stufe 3 namentlich).

---

## 22. Erfolgskriterien (Hypothesen — am ersten echten Traffic zu messen)

Keine Vanity-Metriken; die Seite ist kein Massenfunnel (warmer Traffic). Relevante Signale:
- **Erste-Klick-Rate** auf „Bestand analysieren" (kritischster Engpass — ist der erste Klick getan, steigt die Conversion stark).
- **Abschlussrate der Schatzsuche** (wie viele kommen bis zum verdichteten Ergebnis).
- **Opt-in-Rate** (Ergebnis-PDF) und **Abo-Quote** (Double-Opt-in bestätigt).
- **Segment-Verteilung** der Opt-ins (über Brevo-Attribute `ROLLE`/`EINHEITEN`) → Qualität des Traffics.
- **Terminbuchungen** (cal.com) aus Stufe 3.
> Conversion-Raten sind ausdrücklich **Hypothesen**, am ersten echten Besucher/Kunden zu validieren (BRD §13).

---

## 23. Entscheidungs-Traceability (jede Interview-Entscheidung → PRD-Abschnitt)

| # | Entscheidung | Wert | PRD |
|---|---|---|---|
| 1 | Tech-Stack | React 18 + Vite 5 + TS + Vitest + Testing-Library (Empfehlung des Gründers angenommen) | §15.1 |
| 2 | Umfang | Voll inkl. CMS | §0, §13 |
| 3 | Repo-Umbenennung gewünscht | `leadpage_challenge`→`ResidentFlow` (kein Tool; Gründer in GitHub-Settings) | §19 |
| 4 | Design | Light Editorial, modern/professionell/luxuriös | §2-Tabelle, §15.5 |
| 5 | Copy | frei neu getextet | §2-Tabelle, §9 |
| 6 | Zahlen | echt aus Stefans Bestand; bis dahin konservative Platzhalter | §7, §19 |
| 7 | Hosting | Netcup, Docker-Compose | §15.3 |
| 8 | Termin-Tool | cal.com | §10.1, §15.3 |
| 9 | Ergebnis-PDF/Mail | Brevo versendet PDF transaktional | §10.3, §11 |
| 10 | Abo-Anmeldung | Double-Opt-in | §10.4, §11 |
| 11 | Opt-in-Daten | Rolle + Anzahl Einheiten in Brevo speichern | §11 |
| 12 | Analytics | Plausible, cookieless | §15.3, §16 |
| 13 | Übergangszustände | Endzustand annehmen (Risiko notiert) | §19 |
| 14 | CMS-Zugang | nur lokal/Dev, kein Login | §13.1 |
| 15 | CMS-Persistenz | lokal schreiben + Commit, JSON-Export/Import | §13.1 |
| 16 | Bedingte Logik | deklaratives Regelmodell | §8.4, §14 |
| 17 | Links/IDs | erst Platzhalter, später im CMS | §19 |
| 18 | Schwelle Stufe 3 | 50 relevante Einheiten | §3.3, §10.1 |
| 19 | Segmentierung | Tätigkeit (A/B/C, Mehrfachauswahl) + adaptive Größe | §3.2, §3.3 |
| 20 | Routing | Steuerberater/Makler→Partner; A/B-verwaltend ≥50→volle Treppe, <50→Selbermacher; C→kürzerer Weg | §3.3 |
| 21 | Kennzahl | eigene + verwaltete Einheiten (Summe) | §3.2, §3.3 |
| 22 | „Flow gilt für alle" | gleicher Ablauf, nur End-Ausgang variiert | §3.2 |
| 23 | Flow-Reihenfolge | Tätigkeit → Größe → Schmerz/Probleme → Detail | §8.1 |
| 24 | Progressive Funde | immer sichtbar, Neusortierung bei Problem, Präzisierung je Eingabe | §8.4 |
| 25 | Hebel-Taxonomie | 8 Lebenszyklus-Phasen, zweidimensional (Phase × Wert-Kategorie) | §6, §6.1 |
| 26 | KI extern | erlaubt (bewusste Abkehr von BRD §2/§3) | §17, §19 |
| 27 | 3-Ebenen-Modell | Rolle/Größe → übergreifende Probleme → Lifecycle-Hebel | §4 |
| 28 | Problem-Auswahl | zweistufig geführt (Bereich → konkretes Problem) | §5.1 |
| 29 | Probleme an Rolle+Größe | lifecycle-übergreifend; Mapping Problem→1..n Hebel | §4, §5.3 |
| 30 | Zahlen-Logik | qualitativ → Spanne erst nach Selbstauskunft × Benchmark-Faktoren | §7 |

> Quellen-Mapping: BRD-Vorgaben (Sprachregeln, rote Linien, Pipeline, Burggraben) → §2, §3, §7, §10–§12, §16–§17;
> Landingpage-Doku (Abschnittsaufbau, Treppe, Opt-in, CMS) → §5, §6, §8–§13.
