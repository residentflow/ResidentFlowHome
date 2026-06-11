# Classroom-Content-Import → Payload (PRD §20, §24.2 Phase 2)

Migriert die Inhalte des Classroom (`residentcashflow-6876`) in das Payload-Datenmodell
**Assets · CompositeAssets · Solutions**. Zweistufig, reproduzierbar, gate-konform.

## Pipeline

1. **Extrahieren** — `npm run skool:extract` (Repo-Root)
   - Liest **nur öffentlich** (`public:true`) freigegebene Kurse über den Next.js-Datenendpunkt;
     **keine Anmeldedaten**.
   - Wandelt die TipTap-Inhalte je Lektion in Markdown.
   - **G7 (§25 Domain-Gate):** entfernt **jeden** `skool.com`-Link aus den Inhalten und zählt
     die Treffer mit (`strippedSkoolLinkCount`). Ergebnis ist nachweislich link-frei.
   - **Videos** werden getrennt erfasst (`videoUrl`, hier YouTube — also bereits separat
     gehostet, nie über Skool eingebettet).
   - Schreibt `apps/admin/src/seed-data/skool-content.json`.

2. **Importieren** — `npm run import-skool` (in `apps/admin`, benötigt Postgres)
   - **Asset** je Lektion (71). Prompts: `promptText` + `copyable` + `requiresPrivacyNote=true`
     (Pflicht-Datenschutzhinweis, §11.1). Andere: `bodyText`. Videos: `videoUrl`.
   - **CompositeAsset** je benannter Sektion (6, z. B. „Prompts Ankaufsprüfung").
   - **Solution** je Kurs (7), qualitativ: `nutzenAussage` + `scaleBreakNote` gesetzt
     (Schema-Gates erfüllt), `valueCategory` als Startwert.

## Qualitäts-Gates (§25) — bewusst „nicht live"

Der Import ist konservativ: nichts erscheint im öffentlichen Pfad, bis es kuratiert wurde.

| Gate | Umsetzung im Import |
|---|---|
| Asset live nur mit `qualityStatus∈{reviewed,approved}` **und** `riskLevel` | Alle Assets `qualityStatus='draft'`, `riskLevel` **ungesetzt** ⇒ Export-Gate filtert sie heraus |
| Datenschutzhinweis bei Prompts | `requiresPrivacyNote=true` für jedes Prompt-Asset |
| Lösung ohne `scaleBreakNote` abgelehnt | `scaleBreakNote` gesetzt |
| Qualitative Lösung ⇒ `nutzenAussage` Pflicht | `nutzenAussage` gesetzt |
| G7: kein Skool-Link öffentlich | Im Extrakt entfernt + im Import als Assertion (`assertNoSkool`) geprüft |

Idempotent: nur Datensätze mit slug-Präfix `ci-` werden ersetzt — der handgepflegte Seed (§8)
bleibt unberührt (Deaktivieren-ohne-Löschen, §20).

## Review vor Live-Schaltung (manuell, je Asset)

1. `riskLevel` setzen (niedrig/mittel/hoch) und `assetType` bestätigen.
2. Bei Prompts `promptText` von erklärendem Beiwerk trennen; `requiredInputs` ergänzen.
3. `qualityStatus` auf `reviewed`/`approved` heben.
4. Solutions Problemen zuordnen (`relatedProblems`), `valueCategory` prüfen, ggf. `active`.
