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
- wenn sich der Inhalt einer pages/*.html-Datei oder eines inline
  html-Templates in js/app.js aendert -- sonst bleibt data/search-index.js
  (Volltextsuche) veraltet

Liest Panel-IDs, Titel und Kurzbeschreibung (quest-Text) direkt aus
js/app.js, damit nichts doppelt gepflegt werden muss. Die camelCase-
zu-kebab-case-Slug-Zuordnung kommt ebenso automatisch aus
data/panel-slugs.js -- das ist dieselbe Datei, die js/windows.js im
Browser fuer den 🔗-Direktlink-Button verwendet. Frueher gab es hier
eine eigene Python-Kopie dieser Zuordnung, die beim Hinzufuegen neuer
Panels leicht vergessen wurde (siehe: N2-Direktlink-Bug, Juli 2026) --
jetzt gibt es nur noch eine einzige Quelle.

Alle Unterseiten liegen gebündelt unter einem gemeinsamen Oberordner
(SUBPAGE_DIR), damit die Repo-Wurzel auf GitHub nicht mit 55 einzelnen
Ordnern zugemüllt wird -- aus /hiragana/ wird so /go/hiragana/.

Erzeugt außerdem data/search-index.js: Fließtext aus jeder pages/*.html
bzw. jedem inline html-Template (Tags entfernt), für die Volltextsuche
in js/search.js -- damit findet die Suche auch Begriffe, die nur im
Artikeltext stehen, nicht nur im Panel-Titel/der Kurzbeschreibung.

Aufruf:
    python scripts/generate_subpages.py
"""
import json
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
CACHE_VERSION = "20260714-2"

def load_slug_overrides():
    """Liest PANEL_SLUG_OVERRIDES aus data/panel-slugs.js -- dieselbe
    Datei, die js/windows.js direkt im Browser fuer den Direktlink-
    Button einliest. So gibt es nur eine Stelle, an der camelCase-
    Panel-IDs (fgGebenNehmen, n2Zeit, ...) auf ihren URL-Slug
    (fg-geben-nehmen, n2-zeit, ...) abgebildet werden."""
    js_text = (ROOT / 'data' / 'panel-slugs.js').read_text(encoding='utf-8')
    start = js_text.index('const PANEL_SLUG_OVERRIDES = {')
    brace_start = js_text.index('{', start)
    depth = 0
    brace_end = None
    for i in range(brace_start, len(js_text)):
        if js_text[i] == '{':
            depth += 1
        elif js_text[i] == '}':
            depth -= 1
        if depth == 0:
            brace_end = i
            break
    body = js_text[brace_start + 1:brace_end]
    pairs = re.findall(r'(\w+)\s*:\s*"([\w-]+)"', body)
    return dict(pairs)


SLUG_OVERRIDES = load_slug_overrides()


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
        results.append((key, title, quest, block))
    return results


def decode_entities(s):
    return (s.replace('&amp;', '&')
             .replace('&quot;', '"')
             .replace('&#39;', "'")
             .replace('&nbsp;', ' '))


def strip_html_to_text(html_text):
    """Entfernt Tags, dekodiert die gaengigsten Entities, normalisiert
    Leerraum -- fuer den Volltext-Suchindex, nicht fuer Anzeige."""
    text = re.sub(r'<[^>]+>', ' ', html_text)
    text = decode_entities(text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def extract_panel_body(block, panel_id):
    """Liefert den durchsuchbaren Fliesstext eines Panels -- entweder
    aus einer ausgelagerten pages/*.html-Datei (src) oder aus einem
    inline html-Template-Literal direkt im panels-Objekt."""
    src_m = re.search(r'src\s*:\s*"([^"]*)"', block)
    if src_m:
        path = ROOT / src_m.group(1)
        if not path.exists():
            print(f"  Warnung: {src_m.group(1)} fuer Panel '{panel_id}' nicht gefunden")
            return ''
        return strip_html_to_text(path.read_text(encoding='utf-8'))

    html_m = re.search(r'html\s*:\s*`([\s\S]*?)`', block)
    if html_m:
        return strip_html_to_text(html_m.group(1))

    return ''


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
    <div class="search-panel" role="dialog" aria-modal="true" aria-label="Suche">
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
<script src="../../data/panel-slugs.js?v={cache_version}"></script>
<script src="../../data/search-index.js?v={cache_version}"></script>
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
    search_index = {}
    for panel_id, title, quest, block in panels:
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

        body = extract_panel_body(block, panel_id)
        if body:
            search_index[panel_id] = body

    write_search_index(search_index)

    print(f"{len(generated)} Unterseiten erzeugt unter jeweils {SUBPAGE_DIR}/<slug>/index.html")

    write_sitemap(generated)

    return generated


def write_search_index(search_index):
    """Schreibt data/search-index.js -- Fliesstext jedes Panels (Tags
    entfernt) fuer die Volltextsuche in js/search.js. Titel/Kurz-
    beschreibung stehen schon im panels-Objekt (js/app.js) und werden
    hier nicht dupliziert."""
    lines = ['/* ============================================================',
             '   data/search-index.js -- automatisch erzeugt von',
             '   scripts/generate_subpages.py, NICHT von Hand bearbeiten.',
             '   Fliesstext jedes Panels (HTML-Tags entfernt) fuer die',
             '   Volltextsuche in js/search.js -- Aenderungen an einer',
             '   pages/*.html-Datei erst nach erneutem Skriptlauf sichtbar.',
             '   ============================================================ */',
             'const SEARCH_INDEX = {']
    for panel_id, body in search_index.items():
        lines.append(f'  {json.dumps(panel_id)}: {json.dumps(body, ensure_ascii=False)},')
    lines.append('};')

    out = ROOT / 'data' / 'search-index.js'
    out.write_text('\n'.join(lines) + '\n', encoding='utf-8')
    print(f"data/search-index.js erzeugt ({len(search_index)} Panels)")


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
