# Business Requirements Document — ResidentFlowAI Go-to-Market-System

> Vollständige, konsolidierte Fassung. **Version 3.0 — 04.06.2026.**
> Ersetzt v2.0 (04.06.2026) und alle früheren BRD-Stände. Bildet den AKTUELLEN, konsistenten Stand aller
> Entscheidungen aus dem gesamten Strategie- und Umsetzungsverlauf ab — inkl. der im PRD-Interview
> getroffenen Architektur- und Flow-Entscheidungen.
> **Umsetzungs-Detail verbindlich im [`PRD-landingpage.md`](./PRD-landingpage.md).** Bei Widersprüchen gilt
> dieses BRD für die Strategie, das PRD für die Detailumsetzung (Datenmodell, Flow, Test-Gates).

---

## ↻ CHANGELOG v2.0 → v3.0 (was sich geändert hat)

| # | Thema | Alt (v2.0) | Neu (v3.0) | Quelle |
|---|---|---|---|---|
| 1 | **Such-Reihenfolge** | „Start im Schmerz", dann Identität/Größe | **Tätigkeit → Größe → Probleme (zweistufig) → Detail** | PRD §8.1 |
| 2 | **Architektur** | Hebel-Datenbank (flach), 3 Kategorien | **3-Ebenen-Modell**: Rolle/Größe → übergreifende Probleme → Lifecycle-Hebel | PRD §4 |
| 3 | **Hebel-Taxonomie** | 5–8 stärkste Hebel, Kategorie Ertrag/Effizienz/Risiko | **8 Lebenszyklus-Phasen** ordnen die Hebel; Wert-Kategorie als **zweite** Dimension | PRD §6, §6.1 |
| 4 | **Problem-Auswahl** | implizit über Schmerz-Frage | **zweistufig geführt**: Schmerz-Bereich → konkretes Problem (nach Rolle+Größe gefiltert) | PRD §5 |
| 5 | **KI-Sprache** | „KI/OCR/Agenten nie als Außenbotschaft" | **„KI" extern erlaubt** (bewusste Abkehr; Gate reaktivierbar) | PRD §17, §19 |
| 6 | **Kennzahl/Routing** | Größe 200–600 WE, „ab 50" für Stufe 3 | **`relevanteEinheiten = eigene + verwaltete`** (Summe); Schwelle 50; formalisiertes Routing A/B/C | PRD §3.2–§3.3 |
| 7 | **Zahlen-Logik** | Spannen, echt | zusätzlich: **keine Euro-Zahl ohne Selbstauskunft**; Zustandsmaschine relevant→quantifiziert→präzisiert | PRD §7 |
| 8 | **Opt-in/Tooling** | Ergebnis-PDF per Mail + Abo (generisch) | **Brevo** (PDF transaktional, Double-Opt-in, speichert `ROLLE`/`EINHEITEN`); **cal.com**; **Plausible** cookieless | PRD §10.4, §11, §15.3 |
| 9 | **Tech-Stack/Betrieb** | nicht festgelegt | **React 18 + Vite 5 + TS + Vitest (TDD)**; **Netcup/Docker-Compose**; CMS nur lokal/Dev | PRD §15 |
| 10 | **Repo** | — | `leadpage_challenge` → `ResidentFlow`/`ResidentFlowHome` (Gründer in GitHub-Settings) | PRD §19 |

> Unverändert gültig aus v2.0: Paradigmenwechsel (§2), Preise/Geschäftsmodell (§5), Burggraben (§6),
> Sales-Pipeline (§8), PrivacyFlow-Blocker (§10), Ehrlichkeitsregeln (§12), Risiken (§13).

---

## 0. ZWECK & LESEHINWEIS

Dieses BRD beschreibt, WAS gebaut und betrieben werden muss und WARUM — nicht die Detailumsetzung. Es ist die
Klammer über den Einzeldokumenten:
- **[`PRD-landingpage.md`](./PRD-landingpage.md)** — verbindliche Umsetzung (Flow, Datenmodell, Test-Gates).
- **[`RFAI-Landingpage-Aufbau-v2.md`](./RFAI-Landingpage-Aufbau-v2.md)** — Abschnitts-Narrativ der Seite (Schatzsuche, Treppe, CMS).
- RFAI-Sales-Pipeline.md (operative Vertriebssteuerung).
- RFAI-Modellvergleich.xlsx (Geschäftsmodell-Rechnung).

Bei Widersprüchen gilt dieses BRD als oberste Wahrheitsquelle für die **Strategie**; PRD/Landingpage-Doku für
die **Detailumsetzung**.

---

## 1. KONTEXT & CONSTRAINTS

**Gründer:** Stefan Holhut, selbst Immobilien-Bestandshalter (eigenes Geld im Spiel).
**Struktur:** Menosgada Service GmbH; Holhut KI Consulting (Gründungszuschuss, geplante Gründung 01.04.2027).
**Harter Constraint:** Solo-Gründung. Begrenzte Zeit. Kein Team zum Delegieren. → Jede Strategie muss
solo-tragfähig sein und früh Umsatz bringen, nicht erst nach langem Aufbau. **Das CMS (PRD §13) ist die
technische Einlösung dieses Constraints** — die Schatzsuche wird ohne Entwickler pflegbar.
**Bestehende Assets:** Funktionierende RFAI-Plattform (findet heute schon Indexmieten), ResidentPrivacyFlow
(Electron-Desktop-App), Skool-Bereich, eigener Bestand als Testfeld.

---

## 2. DER ZENTRALE PARADIGMENWECHSEL (Fundament aller Entscheidungen)

**Das Produkt ist Bestandsperformance — nicht Software, nicht PrivacyFlow.** RFAI ist die Maschine dahinter.

Begründung aus dem Verlauf: „Effizienz verkauft nicht für hohe Beträge. Umsatz tut es." Bestandshalter zahlen,
wenn sie überzeugt sind, dass fünf- bis sechsstellige Werte gehoben oder geschützt werden.

Konsequenz — was NICHT mehr getan wird:
- Keine Sub-Brands (kein separates Marketing für PrivacyFlow/Community als eigene Marken).
- Kein „wir helfen" → sondern „wir sorgen dafür, dass nichts liegen bleibt".
- Kein breiter Self-Service-Funnel als Hauptkanal für die kaufkräftige Zielgruppe.

**↻ Update v3.0 — Sprachregel KI:** Die frühere Regel „kein Technik-Sprech (KI/OCR/Agenten) in der
Außenbotschaft" wird **gelockert**: **„KI" darf extern verwendet werden** (bewusste Entscheidung des Gründers).
„OCR/Agenten/Workflow" bleiben Hygiene, nicht Botschaft. Das KI-Sprach-Gate (PRD §17) ist bei Revision
reaktivierbar. Unverändert: **„Skill" → „Hebel"**, **„Skool"/„Community" → nirgends**, **„ResidentFlowAI"**
außen nur an EINER Stelle (Automatisierungs-Stufe 3).

---

## 3. DIE DREI PRODUKTEBENEN

| Ebene | Was | Rolle im GTM |
|---|---|---|
| **Skills/Hebel** (Methodenbibliothek, Skool) | Methoden, die jeder mit eigener KI nutzen kann | Aufmerksamkeit + Aha-Moment, Einstieg für Kleine/Selbermacher |
| **ResidentPrivacyFlow** (lokale Desktop-App) | DSGVO-saubere lokale Anwendung der Hebel an eigenen Daten | Vertrauens-/Beweis-Moment + Selbst-Qualifizierung |
| **ResidentFlowAI** (Plattform, eigene Instanz je Kunde) | Vollautomatisierte, betreute Bestandsperformance | Skalierung, das eigentliche Mandat |

> Diese drei Produktebenen sind **nicht** identisch mit dem **3-Ebenen-Modell der Schatzsuche** (§3a) — das eine
> ist das Geschäftsmodell, das andere die Logik der interaktiven Suche.

### 3a. ↻ NEU — Das 3-Ebenen-Modell der Schatzsuche (zentrale Architektur)

```
Ebene 1: Rolle + Größe        →   Ebene 2: Probleme              →   Ebene 3: Hebel (Lösungen)
(Routing + Filter)                 (lifecycle-übergreifend,             (nach 8 Lebenszyklus-Phasen geordnet;
                                    zweistufig: Bereich → konkret)       Euro-Spanne erst nach Selbstauskunft)
```

- Die **Probleme** des Nutzers sind **lifecycle-übergreifend** und hängen an **Rolle + Größe**, nicht an einer Phase.
- Das **Lebenszyklus-Modell ordnet nur die Hebel/Lösungen** (Angebotsseite, 8 Phasen — PRD §6).
- Ein **Mapping** verbindet jedes Problem mit **1..n Hebeln** — phasenübergreifend.
- Jeder Hebel trägt zusätzlich eine **Wert-Kategorie** (Ertrag/Effizienz/Risiko), die Rahmung und Euro-Logik bestimmt.

Vollständige Spezifikation: PRD §4–§7.

---

## 4. ZIELGRUPPE

**Kern-Personas (volle Pipeline bis Mandat):** inhabergeführte Buy-&-Hold-Bestandshalter; bestandshaltende
Gesellschaften (vvGmbH, Beteiligungs-/Vermögensverwaltungs-GmbH); Single Family Offices mit operativem
Wohnbestand; Unternehmerfamilien nach Firmenverkauf.

**Größe:** oberes Ende 200–600 Einheiten, ABER mit 1–2 Entscheidern (kurze Wege). Entscheidendes Merkmal ist
nicht Größe, sondern operativer Schmerz + ein Entscheider, der allein Ja sagen kann.

**Nebenstränge (eigener, kürzerer Weg, KEIN Mandat):** Steuerberater u.a. Multiplikatoren → Partnerprogramm;
Fix & Flip, Makler → passende Hebel, kein laufendes Bestandsmandat.

**Erkennungssignal:** mehrere Gesellschaften, verstreute Dokumente, externe Verwaltung die Marge frisst,
kein System das Potenziale systematisch hebt.

### 4a. ↻ NEU — Segmentierung & Routing (operationalisiert)

Entscheidende, **universelle** Kennzahl: **`relevanteEinheiten = eigene + verwaltete Einheiten`** (Summe).

| Tätigkeit (Mehrfachauswahl) | Beispiel-Rollen | Größenmaß | End-Ausgang |
|---|---|---|---|
| **A) Verwaltung eigener Immobilien** | Buy & Hold, Bestandshaltung, Family Office, Asset Mgmt (eigen) | eigene Einheiten | ≥50 → volle Treppe (Mandatsweg) · <50 → Selbermacher |
| **B) Betreuung fremder Bestände** | Hausverwaltung, ext. Asset Manager, Immobilienberatung | betreute Einheiten | ≥50 → volle Treppe · <50 → Selbermacher |
| **B) Multiplikatoren** | **Steuerberater, Makler** | — | **Partnerprogramm (immer, größenunabhängig)** |
| **C) Entwicklung / Fix & Flip** | Projektentwicklung, Fix & Flip | Vermarktungen/Jahr | kürzerer Weg (Nebenstrang) |

- **„Flow gilt für alle":** gleicher Ablauf, nur der End-Ausgang variiert.
- **Schwelle Stufe 3 = 50 relevante Einheiten** (im CMS global/pro Hebel übersteuerbar).
- **Mehrfachauswahl:** höchstwertiger Weg gewinnt. **Adaptive Größenfrage** je Tätigkeit.
- Verbindliche Rollen→Segment→Ausgang-Matrix: PRD §3.3.

---

## 5. GESCHÄFTSMODELL & PREISE

**Sequenz:** Performance Assessment (Türöffner) → Bestandsperformance-Partnerschaft (Kern, wiederkehrend)
→ OS-Partner für Unternehmerfamilien (Jahr 2+).

| Stufe | Was | Preis |
|---|---|---|
| **Performance Assessment** | bezahlte Potenzial-Validierung am echten Bestand, Report mit Findings in EUR | **9.500 €**, bei Mandat voll anrechenbar |
| **Bestandsperformance-Partnerschaft** | laufende Überwachung, eigene RFAI-Instanz, monatl. Chancen-Report, Fristen, Quartals-Review | **3.000–8.000 €/Monat**, Mindestlaufzeit 12 Monate |
| **OS-Partner** | digitales Operating System über Immobilien hinaus | 50–200k+/Jahr, organisch gewachsen |

**Naming-Logik (drei Ebenen, dürfen sich NICHT überlappen):** Terminlink → **Gespräch**; Gespräch → kann zum
**Assessment** führen; **„Potenzial validieren" = Assessment**.

**↻ Wichtig für die Seite (PRD §2.2, §8):** Auf der Landingpage stehen **keine Preise**; der Begriff
**„Potenzial validieren"** erscheint dort **nicht** (reserviert für das bezahlte Assessment). Die Preise hier
sind interne Strategie, nicht Seiteninhalt.

---

## 6. DER BURGGRABEN

Die Technologie ist KEIN Graben (in ~18 Monaten kopierbar). Der Graben:
1. **Instanz-Isolation als Vertrauensanker** — jeder Kunde hat seine EIGENE RFAI-Instanz (self-hosted/EU).
2. **Wechselkosten** — tief eingebaute Instanz (Verträge, Entitäten, Fristen, DATEV).
3. **Zentrales Methodenwissen** — Daten pro Kunde getrennt, Muster über viele Bestände akkumulieren bei Stefan
   → fließen als Hebel/Konfiguration (CMS) in jede neue Instanz. **Die Hebel-/Problem-/Benchmark-Datenbank des
   CMS (PRD §13) ist dieser Graben in Reinform.**
4. **DSGVO kostenlos gelöst** — lokale Verarbeitung + „erst Nutzen, dann Vertrauen, dann Kontakt".

Der Graben wächst mit jedem Assessment/Mandat — nicht mit Reichweite.

---

## 7. DAS GTM-SYSTEM (Gesamtfluss)

```
LinkedIn-Content → Landingpage → Schatzsuche → Playbooks → PrivacyFlow → RFAI → Gespräch
```
Die Schatzsuche ist nicht der CTA, sondern der ÜBERGANG zwischen Content und Produkt.

**Zwei Zuflüsse, eine Pipeline:** Direktansprache (aktiv, Umsatz Jahr 1) + Flywheel/Content (passiv, wärmt an).
**Reihenfolge:** Flywheel zuerst, dann verkaufen — mit zwei Sicherungen: (1) Flywheel speist sich ab Tag 1 aus
eigenem Bestand (= Plattform-Validierung), (2) hartes Umsatz-Tor Ende Woche 8.

---

## 8. DIE SALES-PIPELINE (Zusammenfassung; Detail in RFAI-Sales-Pipeline.md)

S0 Identifiziert → S1 Kontakt → S2 Diagnose-Gespräch → S3 Beweis-Moment (PrivacyFlow lokal)
→ S4 Performance Assessment (9.500 €) → S5 Partnerschaft (3.000–8.000 €/Mon) → S6 OS-Partner.

**↻ CTA→Pipeline-Mapping der Landingpage (PRD §18):** Stufe 3 „Bestand gemeinsam ansehen" → **S2 Diagnose** ·
PrivacyFlow (Stufe 2) → **S3 Beweis-Moment** · Playbook (Stufe 1) → außerhalb der Mandats-Pipeline ·
Multiplikator → **Partnerprogramm**.

Pipeline-Mathematik (Hypothese): 60 Accounts → ~15 Gespräche → ~10 Beweis-Momente → 4–5 Assessments (~40k)
→ 3 Partnerschaften (~180k p.a. wiederkehrend). Conversion-Raten sind HYPOTHESEN.

---

## 9. DIE LANDINGPAGE (Zusammenfassung; Detail in RFAI-Landingpage-Aufbau-v2 & PRD)

Aufgabe: Glaubwürdigkeit beweisen + einen Weg ins Ökosystem öffnen. Warmer Traffic, kein Massenkanal.

Aufbau (9 Abschnitte, Reihenfolge fix): Hero (+ „Was andere sehen / Was wir sehen") → Problem → Beweis (echte
Findings + Founder-Micro-Zitat) → Brücke „Was Sie in 3 Min herausfinden" → **Schatzsuche** → **entfaltende
Treppe + verdichtetes Ergebnis + Opt-in** → Datenschutz-Beweis → Founder (lange Story).

**↻ Schatzsuche (Update v3.0):** kein Formular, sondern Entdeckung. **Neue Reihenfolge:**
① Tätigkeit (A/B/C, Mehrfachauswahl) → ② Größe (adaptiv) → ③ Probleme (zweistufig: Schmerz-Bereich → konkretes
Problem, nach Rolle+Größe gefiltert) → ④ Detail (Selbstauskunft je relevantem Hebel). Hebel nach **8
Lebenszyklus-Phasen** geordnet, Wert-Kategorie Ertrag/Effizienz/Risiko als zweite Dimension. **Keine Euro-Zahl
ohne Selbstauskunft** (relevant → quantifiziert → präzisiert). Reines clientseitiges JS, keine Datenübertragung,
kein Cookie.

**Entfaltende Treppe (additiv):** Stufe 1 Playbook (immer) → Stufe 2 PrivacyFlow **oder** geführte Analyse ohne
Installation (immer) → Stufe 3 ab 50 relevanten Einheiten: hebel-eigenes Automatisierungs-Video + Terminlink
**„Ihren Bestand gemeinsam ansehen"**. „ResidentFlowAI" fällt nur hier.

**↻ Follow-up/Opt-in (Update v3.0):** nach dem Ergebnis freiwilliges Opt-in — **Ergebnis-PDF via Brevo
(transaktional)** als Hauptkanal + nicht vorausgewähltes Häkchen fürs monatliche Erkenntnis-Abo
(**Double-Opt-in**). Bei Einwilligung werden **Rolle und Anzahl Einheiten in Brevo** gespeichert
(Attribute `ROLLE`/`EINHEITEN`). Einzige bewusste Datensammlung; betrifft nur die anonyme Suche.

**Inhaltsseiten:** Founder-Story (Verkaufselement), FAQ (5 Vertrauensfragen), Impressum/Datenschutz (durch
tatsächliches Verhalten gedeckt; rechtlich prüfen lassen).

**CMS/Einstellungsmenü:** eigenes lokales System zur Pflege der Schatzsuche (Schmerz-Bereiche, Probleme,
8 Phasen, Hebel, Problem↔Hebel-Mapping, Benchmark-Faktoren als Spannen, Segmente/Ausgänge, Schwellenwerte,
Spannen-Zwang technisch erzwungen, Deaktivieren ohne Löschen, Vorschau). Detail: PRD §13.

---

## 10. RESIDENTPRIVACYFLOW — ANFORDERUNGEN

**Ist-Stand:** Electron-Desktop-App, kein Server. Pseudonymisierung, OCR, Schwärzung, Export lokal. KI-Chat
(default AUS) sendet pseudonymisierten Volltext an wählbaren Provider; abgesichert durch Pseudonymisierung +
HITL-Vorschau + EU/self-hosted.

**Voraussetzungen vor Live (Blocker — decken die Datenschutz-/Download-Aussagen der Seite):**
1. NER-Modell-Download verifizieren (sonst stille Degradierung auf Regex).
2. US-Provider sperren / KI-Chat nur EU (Azure EU-Region) + self-hosted (Ollama).
3. Code-Signing (sonst SmartScreen/Gatekeeper-Warnung).
4. Doku an Code anpassen (kein „nur Variablennamen").
5. lokale Klartext-Dateien (CSV/State-JSON) at rest verschlüsseln.
6. Vorschau deckungsgleich mit gesendetem Text (inkl. ~8.000-Zeichen-Grenze).
7. lokaler Business Case bauen (sonst Gratis-Tool ohne Conversion).

**Conversion-Mechanik (lokal, einwilligungsbasiert):** lokaler Potenzialscore + Business Case, nichts verlässt
das Gerät ohne aktive Freigabe. KEIN zentrales Lead-Scoring, keine Telemetrie.

> **↻ Entscheidung „Endzustand annehmen" (PRD §19):** Die Seite wird so gebaut, als seien diese Blocker gelöst.
> Vor Live müssen die Datenschutz-/Download-Aussagen durch Code gedeckt sein — sonst Übergangs-Schalter
> nachrüsten (Stufe 2/Datenschutz-Abschnitt führen vorerst zum Terminlink).

---

## 11. DIE HEBEL-DATENBANK (der eigentliche Unternehmenswert)

Langfristig liegt der Wert nicht in der Landingpage, sondern in der strukturierten Sammlung aus: Schmerz-
Bereichen · Problemen · Hebeln · Rechenlogiken (Spannen) · Playbooks · Automatisierungs-Workflows. Die
Landingpage ist die Oberfläche; das CMS die Verwaltung; der Burggraben (zentrales Methodenwissen) ist die
Datenbank in Reinform.

**↻ Strukturvorgabe (Update v3.0 — jetzt vollständig im PRD §6, §14 spezifiziert):**
- **8 Lebenszyklus-Phasen** ordnen die Hebel (Akquise/Ankaufprüfung · Finanzierung · Vermarktung/Neuvermietung ·
  Mietermanagement · Objektverwaltung/Betriebskosten · Buchhaltung/Controlling · Projektentwicklung/Sanierung ·
  Automatisierung/Prozesse).
- Je Hebel: auslösende Probleme, Persona/Tätigkeit, **Wert-Kategorie** (Ertrag/Effizienz/Risiko), Rechenlogik
  (Spanne) **oder** qualitative Nutzenaussage, Playbook, Video.
- Problem↔Hebel ist ein **n:m-Mapping**, phasenübergreifend.

**Nächste Entwicklungsstufe (NACH Launch — PRD §20):** Upload-Magie (clientseitige Dokumentanalyse, Start
Excel-Mieterliste); Executive Briefing (dynamisches Business-Case-PDF, „indikatives Potenzialprofil").

---

## 12. EHRLICHKEITS-/QUALITÄTSREGELN (rote Linien)

- Potenziale IMMER als Spannen, nie als Punktwerte (technisch erzwungen, PRD §14).
- **↻ Keine Euro-Zahl ohne Selbstauskunft** des Nutzers; Rechenweg sichtbar, konservativ (PRD §7).
- Findings nur echt — solange nur eigener Bestand: „aus unserem eigenen Portfolio", keine erfundenen Zahlen.
- Datenschutz-Aussagen müssen durch den Code gedeckt sein, bevor sie öffentlich werden.
- Verlust-Rahmung nur bei Risiko-Hebeln. Kein Drängen: erst Nutzen, dann Vertrauen, dann Kontakt.

---

## 13. RISIKEN & UNGEPRÜFTE ANNAHMEN

1. **HITL-Skalierungsgrenze** — Prüfzeit/Kunde/Monat unbekannt, am 1. Kunden zu messen.
2. **Instanz-Einrichtungszeit** (20–60 Std./Kunde) fehlt in den Stundenschätzungen.
3. **Akquise-Verlustzeit** der Absagen nicht eingepreist.
4. **Conversion-Raten** sind Hypothesen.
5. **Zykluslänge** der Zielgruppe (Wochen–Monate) kann Umsatz hinter den Plan schieben.
6. **NER-Modell-Existenz** (`openai/privacy-filter`) unverifiziert.
7. **Azure-EU-Region & Ollama-self-hosted** im Code unverifiziert.
8. **↻ „KI extern" widerspricht der alten Sprachregel** — bewusste Gründerentscheidung; Gate reaktivierbar.
9. **↻ Rechtsprüfung** Impressum/Datenschutz erforderlich (Pflicht vor Live).

Drei Zahlen heben das Modell von Schätzung auf Fakten (alle aus dem ersten zahlenden Kunden): (a) Einrichtungs-
zeit auf Fremddaten, (b) Prüfzeit pro Report, (c) echte Conversion.

---

## 14. WAS ZUERST STEHEN MUSS (Reihenfolge)

1. PrivacyFlow-Blocker (NER-Test zuerst, dann US-Provider sperren, Doku, Signing, lokaler Business Case).
2. Eigener Bestand als erster Assessment-Beweis (echte Findings/EUR).
3. **↻ Hebel-Datenbank strukturieren** nach 8 Phasen × Wert-Kategorie (Problem→1..n Hebel, Spannen).
4. Assessment-Report-Format als Vorlage.
5. **↻ Schatzsuche nach TDD bauen** (PRD §18: M0 Gerüst → M10 E2E) aus der Hebel-Datenbank.
6. Flywheel anwerfen (Content aus eigenen Findings), 8 Wochen Vorlauf.
7. Umsatz-Tor: Direktansprache startet (Zielliste 40–60 Accounts).
8. Erstes Assessment → HITL-Aufwand & Zykluslänge messen → erste Partnerschaft.

---

## 15. DER EINE SATZ

> Wir sprechen wenige richtige Eigentümer an (und lassen den Content sie wärmer machen), beweisen an ihrem
> eigenen Gerät dass ihre Daten sicher sind, lassen sie ihr Potenzial selbst entdecken, validieren es in einem
> bezahlten Assessment — und sorgen dann laufend dafür, dass es nie wieder liegen bleibt. Das Produkt ist
> Bestandsperformance; alles andere ist unsichtbare Infrastruktur.

---

> **Verweise:** Umsetzung → [`PRD-landingpage.md`](./PRD-landingpage.md) · Seiten-Narrativ →
> [`RFAI-Landingpage-Aufbau-v2.md`](./RFAI-Landingpage-Aufbau-v2.md).
