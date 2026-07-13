/* ============================================================
   data/panel-slugs.js — Einzige Quelle für Panel-IDs, die im Code
   camelCase sind (praktisch als JS-Objektschlüssel), aber als
   Direktlink-URL lesbares kebab-case haben sollen. Muss zu den
   Dateinamen unter pages/ passen.

   Wird von zwei Stellen gelesen, damit nichts doppelt gepflegt wird:
   - js/windows.js (Browser) nutzt PANEL_SLUG_OVERRIDES direkt für
     den 🔗-Direktlink-Button
   - scripts/generate_subpages.py liest diese Datei per Skript aus
     (nicht als eigenständige Python-Kopie), um dieselben Slugs für
     die /go/-Unterseiten zu erzeugen

   Neues camelCase-Panel dazu? Hier eintragen, dann
   scripts/generate_subpages.py erneut ausführen.
   ============================================================ */
const PANEL_SLUG_OVERRIDES = {
  fgGebenNehmen: "fg-geben-nehmen",
  fgVerbindungen: "fg-verbindungen",
  fgKonditional: "fg-konditional",
  fgPassivKausativ: "fg-passiv-kausativ",
  fgVermutung: "fg-vermutung",
  fgErklaerung: "fg-erklaerung",
  fgGrundKonzession: "fg-grund-konzession",
  fgZeitAbfolge: "fg-zeit-abfolge",
  fgBezug: "fg-bezug",
  fgEinschraenkung: "fg-einschraenkung",
  fgPflicht: "fg-pflicht",
  fgKeigo: "fg-keigo",
  n2Zeit: "n2-zeit",
  n2GrundPerspektive: "n2-grund-perspektive",
  n2WeitereGruende: "n2-weitere-gruende",
  n2GegensatzErwartung: "n2-gegensatz-erwartung",
  n2Bedingung: "n2-bedingung",
  n2MoeglichkeitSchluss: "n2-moeglichkeit-schluss",
  n2Vermutung: "n2-vermutung",
  n2Einschraenkung: "n2-einschraenkung",
  n2Bezug1: "n2-bezug-1",
  n2Bezug2: "n2-bezug-2",
  n2UmHerum: "n2-um-herum",
  n2Ausdruecke: "n2-ausdruecke",
};
