<div align="center">

# 🏮 Japanisch mit Koyuki

**Eine kostenlose, deutschsprachige Lernplattform für Japanisch — geführter Lernweg *und* Nachschlagewerk in einem.**

![Status](https://img.shields.io/badge/Status-in%20Entwicklung-8b5cf6)
![Sprache](https://img.shields.io/badge/Sprache-Deutsch-ec4899)
![Kostenlos](https://img.shields.io/badge/Zugang-kostenlos%2C%20keine%20Paywall-f0abfc)
![Stack](https://img.shields.io/badge/Stack-HTML%20%2F%20CSS%20%2F%20Vanilla%20JS-1a1424)
[![Ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/koyuki_japanischzimmer)

</div>

---

Japanisch mit Koyuki soll sich vom Anfänger-Guide zu einer vollständigen
kostenlosen Anlaufstelle für Japanischlernende im deutschsprachigen Raum
entwickeln. Kein Kursverkauf, keine versteckten Premium-Inhalte, keine
künstliche Verknappung — nur klare, ehrliche Erklärungen und eigene
Beispiele statt bloßer Übersetzungen englischer Guides.

Die Seite ist bewusst als kleine "Desktop-Oberfläche" gebaut: Themen öffnen
sich als verschiebbare, in der Größe veränderbare Fenster, begleitet von
Sora, dem Fuchs-Wegweiser, der dir passend zum geöffneten Thema kurze Tipps
gibt.

## Inhalt

- [Was ist drin?](#was-ist-drin)
- [Geplant](#geplant)
- [Tech-Stack](#tech-stack)
- [Lokal starten](#lokal-starten)
- [Projektstruktur](#projektstruktur)
- [Mitreden](#mitreden)
- [Unterstützen](#unterstützen)
- [Lizenz](#lizenz)

## Was ist drin?

| Bereich | Inhalt |
|---|---|
| 🈁 **Kana** | Hiragana & Katakana inkl. Dakuten, Yōon, Lerntabellen — Zeichen anklicken zum Anhören, plus eigenes Erkennungs-Quiz |
| 漢 **Kanji** | Lernstrategie, Radikale, RTK/WaniKani-Einordnung, ähnliche Kanji |
| 文 **Grammatik** | Satzstruktur, Verbformen, は・が, を, に・で, て-Form — je mit Beispielen, typischen Fehlern und Mini-Quiz |
| 📘 **Fortgeschrittener Guide** | Grammatik auf JLPT-N4/N3-Niveau: Geben & Nehmen, Verbindungsformen, Konditionalformen, Passiv & Kausativ, Vermutung, Erklärung/Konsequenz, Grund & Konzession, Zeit & Abfolge, formale Bezugsausdrücke, Einschränkung & Verstärkung, Pflicht & Unmöglichkeit, Keigo-Grundlagen — 12 Themenseiten, ~45 Grammatikpunkte |
| 単 **Wortschatz** | Aufbau eines Grundwortschatzes, Anki-Grunddecks im Vergleich |
| 🗣️ **Aussprache** | Mora, lange Vokale, Pitch Accent, Shadowing |
| 👂 **Hörverstehen** | Aktives/passives Hören, Untertitel-Strategie, Condensed Audio |
| 🌊 **Immersion** | Wann nachschlagen, ignorieren oder minen — realistische Lernpläne |
| 📖 **Lesen** | Lernpfad vom Graded Reader bis zur Light Novel, Furigana, Mokuro/OCR |
| 🗂️ **Anki & SRS** | FSRS, Leech-Karten, Review-Strategie |
| 🔍 **Yomitan** | Einrichtung, Wörterbücher, AnkiConnect, Troubleshooting |
| ⛏️ **Mining** | Sentence Mining, i+1-Prinzip, Mining nach Medium |
| 試 **JLPT** | Die fünf Stufen, Prüfungsinhalte, Einordnung |
| 🧰 **Tools-Bibliothek** | Steckbriefe zu asbplayer, mpvacious, Textractor, Mokuro, jidoujisho, jpdb, Bunpro, Natively |
| 📚 **Ressourcen** | Kuratierte, eingeordnete Guides und Decks statt bloßer Linkliste |
| 🔤 **Glossar** | ~25 Fachbegriffe (Mining, i+1, FSRS, Pitch Accent u. a.) kurz auf Deutsch erklärt |
| 🛠️ **Fehlerdatenbank** | Troubleshooting nach Kategorie: Sync, Kartenfelder, Wörterbücher, Frequenzlisten, mobile Nutzung, Browser |
| 🧭 **Geführte Lernwege** | 6 Pfade (Anfänger, Anime, Manga, Visual Novel, Hörverstehen, JLPT) je mit fertiger Setup-Checkliste |
| 🌀 **Entscheidungsbaum** | Interaktives „Was brauche ich jetzt?" — führt per Ja/Nein-Fragen zum passenden nächsten Schritt |
| ⛩️ **Kultur & Etikette** | Höflichkeitsebenen, Namen/Anrede, Alltagskultur, Fiktion vs. Realität |
| 参考 **Quellenverzeichnis** | Nachschlagewerke und Referenzen hinter den Grammatik-Erklärungen (DBJG, Imabi, Tae Kim, Jisho u. a.) |

## Geplant

Der ursprüngliche Phasenplan für die Kerninhalte ist komplett abgearbeitet:

- [x] Grammatik-Themenseiten, Aussprache
- [x] Anki/SRS → Yomitan → Mining
- [x] Immersion & Lesen
- [x] Tools-Bibliothek (asbplayer, mpvacious, Textractor, Mokuro, jidoujisho, jpdb, Bunpro, Natively)
- [x] Deutsche Begriffsdatenbank & Fehlerdatenbank
- [x] Geführte Lernwege & interaktiver Entscheidungsbaum
- [x] Politur: Cross-Linking, Kultur-Bereich, veraltete Platzhalter bereinigt

Japanisch mit Koyuki wächst trotzdem weiter — neue Inhalte, weitere
Tool-Steckbriefe und Feinschliff kommen laufend dazu.

Ein zweiter, gezielt auf Anfänger:innen ausgerichteter Feinschliff ist
mittlerweile ebenfalls komplett abgearbeitet:

- [x] Kana-Tabellen mit Aussprache per Sprachausgabe (Web Speech API)
- [x] Interaktives Kana-Erkennungs-Quiz
- [x] Kurzer Tag-1-Schnelleinstieg vor dem vollen Anfänger-Guide
- [x] Einmaliger Hinweis zur Fenster-Bedienung beim ersten Besuch
- [x] Gruppiertes Inhaltsverzeichnis (Einstieg / Vertiefung / Referenz)

Alle Fenstertexte wurden außerdem einmal komplett nach einem eigenen
Redaktionsleitfaden (KWS) überarbeitet — persönlicherer Ton, mehr Kontext
zum Warum, klarere nächste Schritte auf jeder Seite.

Aus der Feedback-Runde (externe Bestandsaufnahme) sind mittlerweile
erledigt:

- [x] Redaktionelle Wiederholungen im KWS-Text reduzieren (größte
      Häufungen in Wortschatz, Hörverstehen, Guide und Hiragana entschärft)
- [x] Zielgruppenebenen geprüft — ursprünglich als "reicht aktuell aus"
      eingestuft; mit dem Fortgeschrittenen Guide (siehe unten) ist die
      vierte Ebene "Fortgeschritten" inzwischen tatsächlich entstanden
- [x] Anfängerführung visuell gestaffelt: Der Anfänger-Guide markiert
      seine 5 Schritte jetzt mit Jetzt/Bald/Laufend/Später-Badges
- [x] Quellen- und Aktualisierungssystem: Quellenverzeichnis deckt jetzt
      Grammatik (DBJG, Imabi, Tae Kim, Maggie Sensei, Bunpro, Jisho),
      Vokabel-Decks und Tools ab, inkl. "Stand der Prüfung"-Angaben.
      Dabei aufgefallen: Textractor gilt 2026 als nicht mehr aktiv
      gepflegt, LunaTranslator als aktueller Nachfolger — entsprechender
      Hinweis auf der Textractor-Seite ergänzt

Neu dazugekommen (nicht ursprünglich geplant): ein kompletter
**Fortgeschrittener Guide** mit Grammatik auf JLPT-N4/N3-Niveau — 12
Themenseiten von Konditionalformen über Passiv/Kausativ bis zu
Keigo-Grundlagen, im gleichen Format wie die bestehenden
Grammatikseiten.

- [x] Teilbare Direktlinks: alle 55 Panels haben jetzt eine eigene,
      echte URL (gebündelt unter `/go/`, z. B. `/go/hiragana/`) mit
      eigenem Titel und Vorschautext zum Teilen/Verlinken — dazu ein
      🔗-Button in jeder Fenster-Titelleiste, der den passenden Link
      direkt in die Zwischenablage kopiert. Die Navigation innerhalb
      der Seite bleibt dabei komplett client-seitig wie bisher

Damit ist auch der Feedback-Phasenplan vollständig abgearbeitet.

Als Nächstes geplant:

- [ ] Suchleiste: durchsucht alle Panel-Titel/-Kurzbeschreibungen live
      und öffnet Treffer direkt — kein Backend, rein client-seitig
- [ ] Experten-Guide (N2/N1) als dritte Stufe nach Anfänger- und
      Fortgeschrittenem Guide, gleiches Format und Vorgehen

Das seitliche Mini-Inhaltsverzeichnis für lange Artikel läuft bereits
automatisch auf jedem Panel mit mehreren Zwischenüberschriften, nicht nur
im Anfänger-Guide. Jedes Fenster lässt sich außerdem per ⤢-Button (oder
Doppelklick auf die Titelleiste) auf Lesemodus-Größe maximieren — das
deckt den ursprünglich geplanten separaten "Lesemodus" bereits ab.

## Tech-Stack

Bewusst schlank gehalten — kein Framework, kein Build-Schritt:

- reines **HTML / CSS / Vanilla JavaScript**
- eigenes kleines Fenster-System (Drag, Resize, Fokus) in [`js/windows.js`](js/windows.js)
- Inhalte liegen entweder direkt in [`js/app.js`](js/app.js) oder werden bei Bedarf aus [`pages/*.html`](pages) nachgeladen
- Ressourcen-Bibliothek wird aus [`data/resources.js`](data/resources.js) gerendert
- interaktiver Entscheidungsbaum in [`js/decisiontree.js`](js/decisiontree.js)
- interaktives Kana-Quiz in [`js/kanaquiz.js`](js/kanaquiz.js)

## Lokal starten

Da Fensterinhalte teils per `fetch()` nachgeladen werden, funktioniert ein
einfacher Doppelklick auf `index.html` nicht vollständig — es braucht einen
lokalen Server:

```bash
# im Projektordner
python -m http.server 8000
# dann im Browser öffnen:
# http://localhost:8000
```

Jede andere einfache Static-Server-Lösung (z. B. die VS-Code-Erweiterung
„Live Server") funktioniert genauso.

## Projektstruktur

```
index.html          Einstiegspunkt, Fenster-Grundgerüst
css/                 main / windows / resources / responsive
js/                  windows.js (Fenster-Engine), app.js (Panel-Inhalte),
                     progress.js, resources.js, decisiontree.js
pages/               ausgelagerte, längere Fensterinhalte (*.html)
data/                Ressourcen-Bibliothek als Daten
assets/              Bilder & Icons
```

## Mitreden

Fehler gefunden, ein Thema fehlt, oder du hast einen Ressourcen-Tipp?
Meld dich gerne direkt über den Kontakt-Bereich der Seite (E-Mail oder
Discord) — Japanisch mit Koyuki wird von einer einzelnen Person gebaut,
Rückmeldungen helfen entsprechend viel.

## Unterstützen

Japanisch mit Koyuki bleibt kostenlos, ohne Paywall und ohne Kursverkauf.
Wenn dir die Seite hilft und du das unterstützen möchtest:

[![Ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/koyuki_japanischzimmer)

## Lizenz

Noch nicht final festgelegt.

