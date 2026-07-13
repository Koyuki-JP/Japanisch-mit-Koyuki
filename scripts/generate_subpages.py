#!/usr/bin/env python3
"""
scripts/generate_subpages.py -- erzeugt echte, einzeln teilbare
Unterseiten (z. B. /hiragana/) fuer jedes Panel der Seite.

Warum: Die Seite ist technisch eine einzige HTML-Datei (index.html).
Fenster oeffnen sich per JavaScript, die Browser-URL aendert sich dabei
nie -- man kann also nie direkt auf "Hiragana" oder "Passiv & Kausativ"
verlinken. Dieses Skript erzeugt fuer jedes Panel eine eigene, echte
index.html unter einem eigenen Ordner (z. B. hiragana/index.html),
jeweils mit eigenem <title> und <meta description> fuer Suchmaschinen
und Link-Vorschauen. Jede dieser Seiten laedt exakt dieselbe CSS/JS wie
die Haupt-index.html und oeffnet beim Laden automatisch das passende
Fenster -- alles Weitere (Navigation zwischen Fenstern per Klick)
funktioniert danach genau wie bisher, ohne Neuladen der Seite.

Wann erneut ausfuehren:
- nach jeder Aenderung an der Grundstruktur von index.html (z. B. neuer
  Button in .top-controls, geaenderte Startseiten-Kacheln)
- nach jedem Hochzaehlen der Cache-Busting-Version (CACHE_VERSION unten
  anpassen)
- wenn ein neues Panel in js/app.js dazukommt

Liest Panel-IDs, Titel und Kurzbeschreibung (quest-Text) direkt aus
js/app.js, damit nichts doppelt gepflegt werden muss.

Alle Unterseiten liegen gebündelt unter einem gemeinsamen Oberordner
(SUBPAGE_DIR), damit die Repo-Wurzel auf GitHub nicht mit 55 einzelnen
Ordnern zugemüllt wird -- aus /hiragana/ wird so /go/hiragana/.

Aufruf:
    python scripts/generate_subpages.py
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE_BASE = "https://koyuki-jp.github.io/Japanisch-mit-Koyuki"

# Gemeinsamer Oberordner fuer alle generierten Unterseiten (repo-root-
# relativ). Bei Aenderung: alte SUBPAGE_DIR-Ordner von Hand loeschen,
# Skript neu laufen lassen, sitemap.xml neu erzeugen.
SUBPAGE_DIR = "go"

# Muss zum ?v=... in index.html passen -- bei jedem Cache-Busting-Bump
# hier mit anpassen und das Skript neu laufen lassen.
CACHE_VERSION = "20260713-32"

# Panel-IDs, die im Code camelCase sind (fuer JS-Objektschluessel
# praktisch), aber als URL lieber lesbares kebab-case haben sollen.
# Muss zu den Dateinamen unter pages/ passen.
SLUG_OVERRIDES = {
    "fgGebenNehmen": "fg-geben-nehmen",
    "fgVerbindungen": "fg-verbindungen",
    "fgKonditional": "fg-konditional",
    "fgPassivKausativ": "fg-passiv-kausativ",
    "fgVermutung": "fg-vermutung",
    "fgErklaerung": "fg-erklaerung",
    "fgGrundKonzession": "fg-grund-konzession",
    "fgZeitAbfolge": "fg-zeit-abfolge",
    "fgBezug": "fg-bezug",
    "fgEinschraenkung": "fg-einschraenkung",
    "fgPflicht": "fg-pflicht",
    "fgKeigo": "fg-keigo",
    "n2Zeit": "n2-zeit",
    "n2GrundPerspektive": "n2-grund-perspektive",
    "n2WeitereGruende": "n2-weitere-gruende",
    "n2GegensatzErwartung": "n2-gegensatz-erwartung",
    "n2Bedingung": "n2-bedingung",
    "n2MoeglichkeitSchluss": "n2-moeglichkeit-schluss",
    "n2Vermutung": "n2-vermutung",
    "n2Einschraenkung": "n2-einschraenkung",
    "n2Bezug1": "n2-bezug-1",
    "n2Bezug2": "n2-bezug-2",
    "n2UmHerum": "n2-um-herum",
    "n2Ausdruecke": "n2-ausdruecke",
}


def slug_for(panel_id):
    return SLUG_OVERRIDES.get(panel_id, panel_id)


def extract_panels(app_js_text):
    """Liest alle {id: {title: "...", quest: "..."}} Eintraege aus dem
    panels-Objekt in js/app.js, per Klammer-Zaehlen statt vollem JS-
    Parser (reicht fuer die hier verwendete, einfache Objektstruktur)."""
    start = app_js_text.index('const panels = {')
    brace_start = app_js_text.index('{', start)
    depth = 0
    brace_end = None
    for i in range(brace_start, len(app_js_text)):
        if app_js_text[i] == '{':
            depth += 1
        elif app_js_text[i] == '}':
            depth -= 1
        if depth == 0:
            brace_end = i
            break
    panels_src = app_js_text[brace_start:brace_end + 1]

    keys = list(re.finditer(r'(?:^|\n)\s*(?:"([\w-]+)"|([\w-]+))\s*:\s*\{', panels_src))
    results = []
    for idx, m in enumerate(keys):
        key = m.group(1) or m.group(2)
        block_start = m.end() - 1
        depth = 0
        block_end = None
        for j in range(block_start, len(panels_src)):
            if panels_src[j] == '{':
                depth += 1
            elif panels_src[j] == '}':
                depth -= 1
            if depth == 0:
                block_end = j
                break
        block = panels_src[block_start:block_end + 1]
        title_m = re.search(r'title\s*:\s*"([^"]*)"', block)
        quest_m = re.search(r'quest\s*:\s*"([^"]*)"', block)
        title = title_m.group(1) if title_m else key
        quest = quest_m.group(1) if quest_m else ''
        results.append((key, title, quest))
    return results


def decode_entities(s):
    return (s.replace('&amp;', '&')
             .replace('&quot;', '"')
             .replace('&#39;', "'"))


def escape_attr(s):
    return (s.replace('&', '&amp;')
             .replace('"', '&quot;')
             .replace('<', '&lt;')
             .replace('>', '&gt;'))


PAGE_TEMPLATE = """<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} | Japanisch mit Koyuki</title>
<meta name="description" content="{description}">
<link rel="canonical" href="{canonical}">
<meta property="og:title" content="{title} | Japanisch mit Koyuki">
<meta property="og:description" content="{description}">
<meta property="og:type" content="website">
<meta property="og:url" content="{canonical}">
<meta name="twitter:card" content="summary">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400&family=Zen+Kaku+Gothic+New:wght@700&family=Sora:wght@400;700&family=Nunito:wght@700&family=Noto+Sans+JP:wght@500;700&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">

<link rel="stylesheet" href="../../css/main.css?v={cache_version}">
<link rel="stylesheet" href="../../css/windows.css?v={cache_version}">
<link rel="stylesheet" href="../../css/resources.css?v={cache_version}">
<link rel="stylesheet" href="../../css/responsive.css?v={cache_version}">
</head>
<body>
<div class="stage" id="stage">

  <div class="top-controls">
    <button id="modeToggle" title="Hell-/Dunkelmodus">\U0001f319</button>
    <button class="toc-shortcut" data-open="toc" title="Inhaltsverzeichnis öffnen">\U0001f4d1</button>
    <button id="searchToggle" title="Suche (oder Taste „/“)" aria-label="Suche öffnen">\U0001f50d</button>
    <a class="kofi-link" href="https://ko-fi.com/koyuki_japanischzimmer" target="_blank" rel="noopener" title="Unterstütz mich auf Ko-fi">☕</a>
  </div>

  <div class="search-overlay" id="searchOverlay" hidden>
    <div class="search-panel">
      <div class="search-input-row">
        <span class="search-icon" aria-hidden="true">\U0001f50d</span>
        <input type="text" id="searchInput" class="search-input" placeholder="Wonach suchst du? (z. B. JLPT, て-Form, Kanji)" autocomplete="off">
        <button class="search-close" id="searchClose" aria-label="Suche schließen">✕</button>
      </div>
      <div class="search-results" id="searchResults"></div>
      <div class="search-empty" id="searchEmpty" hidden>Keine Treffer. Versuch's mit einem anderen Begriff.</div>
    </div>
  </div>

  <!-- Home-Fenster -->
  <div class="window open" id="window-home">
    <div class="window-titlebar static"><span class="tab-label">Start</span></div>
    <div class="window-content home-intro">
      <h1>Willkommen bei<span class="accent"> Japanisch mit Koyuki</span></h1>
      <p>Ein ruhiger, verständlicher Lernweg vom ersten Zeichen bis zu echtem Japanisch.</p>
      <div class="tile-grid">
        <button class="tile-btn featured" data-open="tag1">
          <span class="glyph">一</span>
          <span class="label">Tag 1 — Hier starten</span>
        </button>
        <button class="tile-btn" data-open="entscheidungsbaum"><span class="glyph">岐</span><span class="label">Was brauche ich jetzt?</span></button>
        <button class="tile-btn" data-open="kana"><span class="glyph">あ</span><span class="label">Kana</span></button>
        <button class="tile-btn" data-open="lernwege"><span class="glyph">道</span><span class="label">Lernwege</span></button>
        <button class="tile-btn" data-open="ressourcen"><span class="glyph">本</span><span class="label">Ressourcen</span></button>
        <button class="tile-btn" data-open="faq"><span class="glyph">?</span><span class="label">FAQ</span></button>
      </div>
    </div>
    <div class="resize-handle" title="Größe ändern">
      <svg width="12" height="12" viewBox="0 0 12 12"><path d="M11 1 L1 11 M11 5 L5 11 M11 9 L9 11" stroke="var(--muted)" stroke-width="1.4" stroke-linecap="round"/></svg>
    </div>
  </div>

  <div id="windows-root"></div>

  <!-- Wegweiser -->
  <div class="wegweiser" id="wegweiser">
    <div class="bubble" id="wegweiserText">Hallo! Ich bin Sora, dein Wegweiser. Klick auf eine Kachel, um deine Reise zu beginnen — oben links findest du außerdem das Inhaltsverzeichnis mit allen Bereichen.</div>
    <img class="fox-wrap" src="../../assets/images/questie.webp" alt="Sora, dein Wegweiser" width="84" height="84">
  </div>

  <div class="desktop-footer">© 2026 · Japanisch mit Koyuki</div>

</div>


<!-- Diese Datei wurde automatisch von scripts/generate_subpages.py
     erzeugt. Nicht von Hand bearbeiten -- Aenderungen gehoeren in die
     Vorlage im Skript selbst, dann das Skript erneut ausfuehren. -->
<!-- Ladereihenfolge ist wichtig: data zuerst, dann progress/windows/resources,
     app.js zuletzt (baut u. a. die Panel-Definitionen und startet den Wegweiser) -->
<script src="../../data/resources.js?v={cache_version}"></script>
<script src="../../js/progress.js?v={cache_version}"></script>
<script src="../../js/windows.js?v={cache_version}"></script>
<script src="../../js/resources.js?v={cache_version}"></script>
<script src="../../js/decisiontree.js?v={cache_version}"></script>
<script src="../../js/kanaquiz.js?v={cache_version}"></script>
<script src="../../js/app.js?v={cache_version}"></script>
<script src="../../js/search.js?v={cache_version}"></script>
<script>
  if (typeof openWindow === 'function') {{ openWindow('{panel_id}'); }}
</script>

</body>
</html>
"""


def main():
    app_js = (ROOT / 'js' / 'app.js').read_text(encoding='utf-8')
    panels = extract_panels(app_js)
    print(f"{len(panels)} Panels in js/app.js gefunden")

    generated = []
    for panel_id, title, quest in panels:
        slug = slug_for(panel_id)
        out_dir = ROOT / SUBPAGE_DIR / slug
        out_dir.mkdir(parents=True, exist_ok=True)
        out_file = out_dir / 'index.html'

        clean_title = escape_attr(decode_entities(title))
        clean_desc = escape_attr(decode_entities(quest))
        canonical = f"{SITE_BASE}/{SUBPAGE_DIR}/{slug}/"

        html = PAGE_TEMPLATE.format(
            title=clean_title,
            description=clean_desc,
            canonical=canonical,
            cache_version=CACHE_VERSION,
            panel_id=panel_id,
        )
        out_file.write_text(html, encoding='utf-8')
        generated.append((panel_id, slug, canonical))

    print(f"{len(generated)} Unterseiten erzeugt unter jeweils {SUBPAGE_DIR}/<slug>/index.html")

    write_sitemap(generated)

    return generated


def write_sitemap(generated):
    """Schreibt sitemap.xml (Startseite + eine Zeile pro Unterseite) neu.
    Wird bei jedem Lauf komplett neu erzeugt, nicht von Hand gepflegt."""
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        '  <url>',
        f'    <loc>{SITE_BASE}/</loc>',
        '    <priority>1.0</priority>',
        '  </url>',
    ]
    for panel_id, slug, canonical in generated:
        lines.append('  <url>')
        lines.append(f'    <loc>{canonical}</loc>')
        lines.append('    <priority>0.7</priority>')
        lines.append('  </url>')
    lines.append('</urlset>')

    out = ROOT / 'sitemap.xml'
    out.write_text('\n'.join(lines) + '\n', encoding='utf-8')
    print(f"sitemap.xml aktualisiert mit {len(generated) + 1} URLs")


if __name__ == '__main__':
    main()
