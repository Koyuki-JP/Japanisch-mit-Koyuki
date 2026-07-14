<div align="center">

# 🏮 Japanisch mit Koyuki

**Eine kostenlose, deutschsprachige Lernplattform für Japanisch: geführter Lernweg *und* Nachschlagewerk in einem.**

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
künstliche Verknappung. Nur klare, ehrliche Erklärungen und eigene
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
| 🈁 **Kana** | Hiragana & Katakana inkl. Dakuten, Yōon, Lerntabellen. Zeichen anklicken zum Anhören, plus eigenes Erkennungs-Quiz |
| 漢 **Kanji** | Lernstrategie, Radikale, RTK/WaniKani-Einordnung, ähnliche Kanji |
| 文 **Grammatik** | Satzstruktur, Verbformen, は・が, を, に・で, て-Form, je mit Beispielen, typischen Fehlern und Mini-Quiz |
| 📘 **Fortgeschrittener Guide** | Grammatik auf JLPT-N4/N3-Niveau: Geben & Nehmen, Verbindungsformen, Konditionalformen, Passiv & Kausativ, Vermutung, Erklärung/Konsequenz, Grund & Konzession, Zeit & Abfolge, formale Bezugsausdrücke, Einschränkung & Verstärkung, Pflicht & Unmöglichkeit, Keigo-Grundlagen. 12 Themenseiten, ~45 Grammatikpunkte |
| 🎓 **Experten-Guide** | Grammatik auf JLPT-N2-Niveau: zeitliche Nuancen, から-Familie, weitere Gründe, Gegensatz/Erwartung, Bedingung, Möglichkeit/Schlussfolgerung, Vermutung, Einschränkung/Betonung, formale Bezugs-Partikel, feste Ausdrücke. 12 Themenseiten, ~89 Grammatikpunkte |
| 単 **Wortschatz** | Aufbau eines Grundwortschatzes, Anki-Grunddecks im Vergleich |
| 🗣️ **Aussprache** | Mora, lange Vokale, Pitch Accent, Shadowing |
| 👂 **Hörverstehen** | Aktives/passives Hören, Untertitel-Strategie, Condensed Audio |
| 🌊 **Immersion** | Wann nachschlagen, ignorieren oder minen, realistische Lernpläne |
| 📖 **Lesen** | Lernpfad vom Graded Reader bis zur Light Novel, Furigana, Mokuro/OCR |
| 🗂️ **Anki & SRS** | FSRS, Leech-Karten, Review-Strategie |
| 🔍 **Yomitan** | Einrichtung, Wörterbücher, AnkiConnect, Troubleshooting |
| ⛏️ **Mining** | Sentence Mining, i+1-Prinzip, Mining nach Medium |
| 試 **JLPT** | Die fünf Stufen, Prüfungsinhalte, Einordnung |
| 🧰 **Tools-Bibliothek** | Steckbriefe zu asbplayer, mpvacious, Textractor, Mokuro, jidoujisho, jpdb, Bunpro, Natively, jp343 Immersion Tracker |
| 📚 **Ressourcen** | Kuratierte, eingeordnete Guides und Decks statt bloßer Linkliste |
| 🔤 **Glossar** | ~25 Fachbegriffe (Mining, i+1, FSRS, Pitch Accent u. a.) kurz auf Deutsch erklärt |
| 🛠️ **Fehlerdatenbank** | Troubleshooting nach Kategorie: Sync, Kartenfelder, Wörterbücher, Frequenzlisten, mobile Nutzung, Browser |
| 🧭 **Geführte Lernwege** | 6 Pfade (Anfänger, Anime, Manga, Visual Novel, Hörverstehen, JLPT) je mit fertiger Setup-Checkliste |
| 🌀 **Entscheidungsbaum** | Interaktives „Was brauche ich jetzt?", führt per Ja/Nein-Fragen zum passenden nächsten Schritt |
| ⛩️ **Kultur & Etikette** | Höflichkeitsebenen, Namen/Anrede, Alltagskultur, Fiktion vs. Realität |
| 参考 **Quellenverzeichnis** | Nachschlagewerke und Referenzen hinter den Grammatik-Erklärungen (DBJG, Imabi, Tae Kim, Jisho u. a.) |

## Geplant

**Als Nächstes:**

- [ ] Experten-Guide N1 als vierte Stufe: der N2-Teil ist fertig,
      N1 folgt als eigene, spätere Phase (bewusst getrennt, da der
      gesamte N2+N1-Umfang zusammen ~285-450 Grammatikpunkte umfasst)

**Bereits umgesetzt:**

- **Kerninhalte**: Grammatik, Wortschatz, Aussprache, Hörverstehen,
  Immersion, Lesen, Anki/SRS, Yomitan, Mining, JLPT, Tools-Bibliothek,
  Ressourcen, Glossar, Fehlerdatenbank, Lernwege, Entscheidungsbaum,
  Kultur, Quellenverzeichnis
- **Anfänger-Feinschliff**: Kana-Aussprache per Sprachausgabe,
  interaktives Kana-Quiz, Tag-1-Schnelleinstieg, einmaliger
  Fenster-Bedienungshinweis, gruppiertes Inhaltsverzeichnis
- **Feedback-Runde** (externe Bestandsaufnahme): redaktionelle
  Überarbeitung, **Fortgeschrittener Guide** (JLPT-N4/N3-Grammatik,
  12 Themenseiten, ~45 Punkte), visuell gestaffelter Anfänger-Guide,
  erweitertes Quellenverzeichnis (Grammatik, Decks, Tools mit "Stand
  der Prüfung"), Lesemodus (⤢-Maximieren-Button pro Fenster),
  teilbare Direktlinks (`/go/<slug>/` + 🔗-Kopier-Button pro Fenster),
  Suchleiste über alle Panel-Titel/-Kurzbeschreibungen
- **Experten-Guide N2**: 12 Themenseiten, ~89 Grammatikpunkte,
  gegengeprüft gegen externe Quellen, überall verlinkt
  (Inhaltsverzeichnis, Entscheidungsbaum, Lernwege, JLPT-Seite,
  Quellenverzeichnis)
- **Review-Nacharbeit** (nach ausführlicher externer Review v1.10):
  N2-Direktlink-Bug behoben (einzige Quelle für Panel-Slugs statt
  zweier hand-gepflegter Listen), eigener Mobile-Modus (kein
  Drag/Resize mehr auf kleinen Screens), Volltextsuche über alle
  Panel-Inhalte, SEO-Grundlagen (Meta-Tags, Sitemap), Fokusfalle im
  Such-Overlay, `prefers-reduced-motion`-Unterstützung, alle 24
  Themenseiten von Fortgeschrittenem und Experten-Guide deutlich
  vertieft (mehr Beispiele, genaue Anschlussregeln, Register-Hinweise,
  Abgrenzung zu ähnlichen Formen statt knapper "vs."-Boxen), Kanji +
  Furigana statt Romaji plus Hörbutton in den Grammatik-Grundlagen,
  Leseposition wird jetzt pro Fenster gemerkt, und der komplette
  Anfänger-Bereich (Kana, Grammatik-Grundlagen, Verbformen,
  Wortschatz, Aussprache, Hörverstehen) wurde ebenfalls vertieft,
  bewusst einfach gehalten statt akademisch-dicht, und die komplette
  Seite ist jetzt frei von Gedankenstrichen (Komma, Punkt oder
  Doppelpunkt statt „—", je nach Satzbau)

Alle Fenstertexte folgen einem eigenen Redaktionsleitfaden (KWS):
persönlicher Ton, klarer Kontext zum Warum, klare nächste Schritte auf
jeder Seite. Das seitliche Mini-Inhaltsverzeichnis für lange Artikel
läuft automatisch auf jedem Panel mit mehreren Zwischenüberschriften.

## Tech-Stack

Bewusst schlank gehalten, kein Framework, kein Build-Schritt:

- reines **HTML / CSS / Vanilla JavaScript**
- eigenes kleines Fenster-System (Drag, Resize, Fokus, Maximieren) in [`js/windows.js`](js/windows.js)
- Inhalte liegen entweder direkt in [`js/app.js`](js/app.js) oder werden bei Bedarf aus [`pages/*.html`](pages) nachgeladen
- Ressourcen-Bibliothek wird aus [`data/resources.js`](data/resources.js) gerendert
- interaktiver Entscheidungsbaum in [`js/decisiontree.js`](js/decisiontree.js)
- interaktives Kana-Quiz in [`js/kanaquiz.js`](js/kanaquiz.js)
- clientseitige Suche über alle Panel-Titel/-Kurzbeschreibungen in [`js/search.js`](js/search.js)
- teilbare Direktlinks unter `go/` werden aus den Panel-Daten in `js/app.js` generiert, siehe [`scripts/generate_subpages.py`](scripts/generate_subpages.py)

## Lokal starten

Da Fensterinhalte teils per `fetch()` nachgeladen werden, funktioniert ein
einfacher Doppelklick auf `index.html` nicht vollständig, es braucht einen
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
                     progress.js, resources.js, decisiontree.js,
                     kanaquiz.js, search.js
pages/               ausgelagerte, längere Fensterinhalte (*.html)
data/                Ressourcen-Bibliothek als Daten
assets/              Bilder & Icons
go/                  automatisch erzeugte Direktlink-Unterseiten
                     (nicht von Hand bearbeiten, siehe scripts/)
scripts/             generate_subpages.py -- erzeugt go/ + sitemap.xml
                     aus den Panel-Daten in js/app.js
```

## Mitreden

Fehler gefunden, ein Thema fehlt, oder du hast einen Ressourcen-Tipp?
Meld dich gerne direkt über den Kontakt-Bereich der Seite (E-Mail oder
Discord). Japanisch mit Koyuki wird von einer einzelnen Person gebaut,
Rückmeldungen helfen entsprechend viel.

**Gesucht:** eine Stimme für die Beispielsätze und Hiragana/Katakana-Tabellen.
Die Seite hat bereits eine automatische Sprachausgabe (Browser-TTS), eine
echte, gut ausgesprochene Aufnahme wäre für viele Lernende aber deutlich
angenehmer zu hören. Wer flüssig und mit guter Aussprache vorlesen kann
und Lust hat mitzuhelfen, meldet sich gerne über den Kontakt-Bereich.

## Unterstützen

Japanisch mit Koyuki bleibt kostenlos, ohne Paywall und ohne Kursverkauf.
Wenn dir die Seite hilft und du das unterstützen möchtest:

[![Ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/koyuki_japanischzimmer)

## Lizenz

Noch nicht final festgelegt.

