# Japanisch mit Koyuki

Deutschsprachige Lernplattform für Japanisch (Hiragana bis JLPT N1),
gehostet auf GitHub Pages (`koyuki-jp.github.io/Japanisch-mit-Koyuki`).
Vanilla JS, kein Build-Schritt, kein Framework.

## Architektur

**Einstiegspunkt:** `index.html` lädt CSS/JS in fester Reihenfolge
(Daten zuerst, dann progress/windows/resources, `app.js` zuletzt).

**Fenster-System** (alles ist ein "Fenster", wie ein Desktop-Manager):
- `js/windows.js`: Fenster öffnen/schließen/ziehen/resizen/maximieren.
  `LARGE_GUIDE_WINDOWS`/`MEDIUM_WINDOWS` steuern die Default-Größe neuer
  Fenster. `PANEL_SLUG_OVERRIDES` (aus `data/panel-slugs.js`) mappt
  camelCase-Panel-IDs auf kebab-case-URLs für Direktlinks.
- `js/app.js`: **die zentrale Datei**, riesiges `panels`-Objekt, jeder
  Eintrag hat `title`/`quest` plus entweder `src: "pages/xyz.html"`
  (extern, wird per `fetch()` nachgeladen) oder ein inline `html:`
  Template-Literal. Neues Thema/neue Seite → hier registrieren.
- `js/progress.js`: Fortschritts-Tracking, einklappbare Abschnitte,
  Leseposition-Erinnerung pro Fenster.
- `js/decisiontree.js`, `js/kanaquiz.js`, `js/resources.js`,
  `js/search.js`: featurespezifisch.

**Content:** Die meisten Grammatik-/Themenseiten liegen als eigene
Dateien unter `pages/*.html` (per `fetch()` nachgeladen), nicht inline
in `app.js`. `data/resources.js` speist die Ressourcen-Bibliothek,
`data/search-index.js` wird automatisch generiert (nicht von Hand
bearbeiten).

**Statische Unterseiten:** `scripts/generate_subpages.py` liest die
`panels` aus `js/app.js` aus und erzeugt daraus `go/<slug>/index.html`
(SEO-/Direktlink-Unterseiten), `data/search-index.js` und
`sitemap.xml`. **Nach jeder Content-Änderung erneut laufen lassen:**
`python scripts/generate_subpages.py`

## Zwingende Konventionen

- **Cache-Busting:** Bei jeder Änderung an CSS/JS/Daten-Dateien den
  Query-Parameter `?v=YYYYMMDD-N` in `index.html` (14 Vorkommen) UND
  `CACHE_VERSION` in `scripts/generate_subpages.py` hochzählen, dann
  den Generator laufen lassen.
- **Keine Gedankenstriche (—) irgendwo im Content.** Nutzer empfindet
  das als eindeutiges AI-Schreib-Tell. Komma, Punkt oder Doppelpunkt
  statt „—", je nach Satzbau. Gilt für alle neuen Texte, nicht nur
  Grammatikseiten.
- **Beispielsätze im Grammatik-Content:** Kanji + Furigana (Ruby-
  Markup) statt Romaji, plus 🔊-Hörbutton:
  ```html
  <p class="example-jp jp"><button class="example-listen" data-listen="ともだちにほんをかした" title="Satz anhören" aria-label="Satz anhören">🔊</button><ruby>友達<rt>ともだち</rt></ruby>に<ruby>本<rt>ほん</rt></ruby>を<ruby>貸<rt>か</rt></ruby>した。</p>
  <p class="example-de">Deutsche Übersetzung.</p>
  ```
  `data-listen` bekommt die volle Kana-Umschrift des Satzes (kein
  Romaji, keine Kanji). Kein separates `<p class="example-reading">`
  mehr (altes Format, nicht neu verwenden).
- **Commits:** deutsche Nachrichten, enden mit
  `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`. Niemals
  `--amend`, immer neue Commits.
- **Review vor dem Push bei grossen neuen Content-Batches** (neue
  Grammatikseiten, neue Guides): HTML-Review-Artefakt bauen und
  explizite Freigabe abwarten, bevor gepusht wird. Gilt NICHT für
  Bugfixes oder Iterationen auf bereits freigegebenem Content, die
  können direkt gepusht werden.

## Testen (kein Test-Framework vorhanden)

**Standard-Smoke-Test** nach Content-/JS-Änderungen: Kopie von
`index.html` anlegen, ein Script vor `</body>` injizieren, das
`Object.keys(panels)` durchläuft, `openWindow(id)` aufruft und prüft,
dass jedes Panel Inhalt rendert, Ergebnis in ein verstecktes Div
schreiben, per `--dump-dom` auslesen, danach `index.html` aus der
Kopie wiederherstellen. Chrome-Pfad in dieser Umgebung:
`/c/Program Files/Google/Chrome/Application/chrome.exe` (Edge war
zuletzt mid-update/nicht verfügbar).

**Mobile-/Viewport-Tests:** headless Chrome mit `--window-size` ist
für schmale Breiten in dieser Umgebung **unzuverlässig**, es gibt
einen faktischen Mindestwert um ~500px, das Flag wird darunter
ignoriert, ohne Fehlermeldung. Für echte Mobile-Viewport-Tests
stattdessen **Playwright** mit `viewport={"width":390,"height":844},
is_mobile=True` benutzen (Chrome-Executable explizit über
`executable_path` referenzieren, System-Chrome statt Download).

## Bekannte Architektur-Fallstricke

- `#window-home` (Startbildschirm) hat im Markup **ein einziges** Div
  mit den Klassen `window-content` UND `home-intro` gleichzeitig.
  Zwei separate CSS-Regeln für `.window-content` und `.home-intro`
  können sich über Shorthand-Properties gegenseitig überschreiben
  (z. B. `overflow: visible` killt ein vorher gesetztes
  `overflow-y: auto` auf demselben Element). Bei Overrides für dieses
  Element beide Klassen im Kopf behalten oder in einer Regel bündeln.
- `@container`-Width- und Height-Queries auf demselben Container
  können **gleichzeitig** greifen und sich widersprechen, wenn beide
  dieselbe Property setzen (z. B. `grid-template-rows`). Auf echten
  Handys ist das eher die Regel als die Ausnahme, weil Fenster oft
  bewusst nur einen Bruchteil der Viewport-Höhe nutzen. Im Zweifel:
  redundante/konfliktträchtige Height-Query-Regeln entfernen statt
  beide Bedingungen "gewinnen" zu lassen, oder `container-type: normal`
  setzen, um Container-Queries für ein Element in einem bestimmten
  Breakpoint komplett abzuschalten.
- `applySavedWindowSize()`/`saveWindowSize()` (`js/windows.js`) setzen
  `el.style.width`/`height` **inline** und ohne `!important`. Eigene
  CSS-Overrides für Breite/Höhe auf `#window-home` oder `.window`
  brauchen deshalb selbst `!important`, sonst gewinnt der inline Style.

## Grammatikseiten-Format (fg-\*.html, n2-\*.html, n1-\*.html)

Eyebrow-Span → h2 → Intro-p → „Bedeutung"-Liste (`<strong>Form:</strong>
Erklärung`) → „Beispiele"-h3 mit `example-box`-Divs → 2-3 Deep-Dive-h3-
Abschnitte (Vergleich mit ähnlichen Formen, Abgrenzung von bereits
behandelten Themen) → `resource-warning`-Box für den typischen Fehler
→ „Teste dich selbst"-h3 mit `<details class="faq-item">` → Schluss-p
→ `resource-cta` → `win-navigation`. Bei Grenzfällen zu bereits
vorhandenem Content (z. B. N1-Form, die einer N2-Form ähnelt) explizit
verlinken und abgrenzen statt zu duplizieren.

## Planung-Ordner

`Planung/` liegt **neben** diesem Repo (nicht Teil von Git). Enthält
`Versionsverlauf.txt` (ein Eintrag pro größerem Arbeits-Batch),
Phasenplan-Dateien, `Aenderungen/`-Unterordner mit Detail-Changelogs.
Nach Abschluss eines Phasen-/Feature-Batches dort dokumentieren, plus
README.md-Roadmap/Content-Tabelle unaufgefordert aktualisieren.
