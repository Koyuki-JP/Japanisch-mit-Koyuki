/* ============================================================
   data/resources.js — Inhaltsdaten für die Ressourcen-Bibliothek
   (Ressourcen-Tab). Neue Tools/Guides hier eintragen -- js/resources.js
   rendert daraus automatisch die Karten im Ressourcen-Fenster.

   Jeder Abschnitt (Schlüssel = Section-ID, muss zu einem
   <section class="resource-section" id="..."> in pages/ressourcen.html
   passen) enthaelt:
     title  -- Überschrift des Abschnitts
     note   -- kleiner Hinweistext neben der Überschrift
     items  -- Liste einzelner Ressourcen-Karten:
       recommended  -- true/false, hebt die Karte optisch hervor
       eyebrow      -- kleines Label über dem Titel (z. B. Kategorie)
       title        -- Name der Ressource
       badges       -- Liste von { label, type }
                        type ist optional: "free" | "paid" | "freemium" | "hardcore"
       summary      -- Kurzbeschreibung
       verdictLabel -- z. B. "Einordnung:" (leer lassen = kein Verdict)
       verdict      -- Einordnungstext
       href         -- Link zur Ressource
       linkLabel    -- Text auf dem Link-Button
   ============================================================ */

const RESOURCE_LIBRARY = {
  "res-guides": {
    "title": "Lernwege & Methoden",
    "note": "Englischsprachige Meta-Guides und Erfahrungsberichte",
    "items": [
      {
        "recommended": true,
        "eyebrow": "Empfohlener Überblick",
        "title": "Morg Japanese Primer",
        "badges": [
          {
            "label": "Kostenlos",
            "type": "free"
          },
          {
            "label": "Englisch",
            "type": null
          },
          {
            "label": "Anfänger",
            "type": null
          },
          {
            "label": "Immersion",
            "type": null
          }
        ],
        "summary": "Kompakter Einstieg in Kana, Grundwortschatz, Grammatik, Immersion und späteres Mining.",
        "verdictLabel": "Einordnung:",
        "verdict": "Klar und übersichtlich. Gut als kurze Orientierung, aber keine vollständige Ausbildung.",
        "href": "https://morg.systems/Japanese-Primer",
        "linkLabel": "Primer öffnen ↗"
      },
      {
        "recommended": false,
        "eyebrow": "Umfangreich",
        "title": "TheMoeWay",
        "badges": [
          {
            "label": "Kostenlos",
            "type": "free"
          },
          {
            "label": "Englisch",
            "type": null
          },
          {
            "label": "Anfänger–Fortgeschritten",
            "type": null
          },
          {
            "label": "Intensiv",
            "type": "hardcore"
          }
        ],
        "summary": "Große Wissensbasis zu Immersion, Anki, Mining, Lesen, Wörterbüchern und technischen Setups.",
        "verdictLabel": "Community-Eindruck:",
        "verdict": "Häufig empfohlen und sehr nützlich als Nachschlagewerk. Die Informationsmenge kann am Anfang jedoch erschlagen.",
        "href": "https://learnjapanese.moe/",
        "linkLabel": "TheMoeWay öffnen ↗"
      },
      {
        "recommended": false,
        "eyebrow": "Immersionsarchiv",
        "title": "AJATT / Tatsumoto",
        "badges": [
          {
            "label": "Kostenlos",
            "type": "free"
          },
          {
            "label": "Englisch",
            "type": null
          },
          {
            "label": "Alle Stufen",
            "type": null
          },
          {
            "label": "Sehr intensiv",
            "type": "hardcore"
          }
        ],
        "summary": "Sehr umfangreiche Artikel zu Immersion, Satz-Mining, Untertiteln, Wörterbüchern, Pitch Accent und Lernumgebung.",
        "verdictLabel": "Einordnung:",
        "verdict": "Reich an praktischen Ideen, aber stark meinungsbasiert. Einzelne Bausteine herauspicken statt alles wortwörtlich zu übernehmen.",
        "href": "https://ajatt.top/blog/table-of-contents.html",
        "linkLabel": "Inhaltsverzeichnis öffnen ↗"
      },
      {
        "recommended": false,
        "eyebrow": "Sammlung",
        "title": "Awesome Japanese",
        "badges": [
          {
            "label": "Kostenlos",
            "type": "free"
          },
          {
            "label": "Englisch",
            "type": null
          },
          {
            "label": "Alle Stufen",
            "type": null
          }
        ],
        "summary": "Kuratierte GitHub-Sammlung mit Lernwegen, Wörterbüchern, Lesematerial, Software und vielen weiteren Links.",
        "verdictLabel": "Einordnung:",
        "verdict": "Hervorragend zum Stöbern und Nachschlagen, aber kein geführter Lernweg.",
        "href": "https://github.com/mh-343/Awesome-Japanese",
        "linkLabel": "Sammlung öffnen ↗"
      },
      {
        "recommended": false,
        "eyebrow": "Erfahrungsbericht",
        "title": "180/180 beim N1 in 8,5 Monaten",
        "badges": [
          {
            "label": "Kostenlos",
            "type": "free"
          },
          {
            "label": "Englisch",
            "type": null
          },
          {
            "label": "Extrem",
            "type": "hardcore"
          }
        ],
        "summary": "Persönlicher Reddit-Bericht über einen außergewöhnlich schnellen und sehr intensiven Weg zum JLPT N1.",
        "verdictLabel": "Wichtig:",
        "verdict": "Interessant als Fallstudie, aber nicht als realistischer Standardplan oder Erwartung an das eigene Tempo.",
        "href": "https://www.reddit.com/r/LearnJapanese/comments/sedr0m/how_i_got_180180_on_n1_in_85_months/?rdt=44642",
        "linkLabel": "Bericht lesen ↗"
      }
    ]
  },
  "res-kana": {
    "title": "Kana lernen und üben",
    "note": "Für die ersten Tage und kurze Wiederholungen",
    "items": [
      {
        "recommended": false,
        "eyebrow": "Video",
        "title": "Hiragana-Einstieg",
        "badges": [
          {
            "label": "Kostenlos",
            "type": "free"
          },
          {
            "label": "Video",
            "type": null
          },
          {
            "label": "Anfänger",
            "type": null
          }
        ],
        "summary": "Visueller Einstieg in die Hiragana-Grundzeichen.",
        "verdictLabel": "",
        "verdict": "",
        "href": "https://youtu.be/_wZHqOghvSs?si=uMGSXSq28z8F6i3f",
        "linkLabel": "Video öffnen ↗"
      },
      {
        "recommended": false,
        "eyebrow": "Video",
        "title": "Katakana-Einstieg",
        "badges": [
          {
            "label": "Kostenlos",
            "type": "free"
          },
          {
            "label": "Video",
            "type": null
          },
          {
            "label": "Anfänger",
            "type": null
          }
        ],
        "summary": "Visueller Einstieg in die Katakana-Grundzeichen.",
        "verdictLabel": "",
        "verdict": "",
        "href": "https://youtu.be/LmZdpOXoLoU?si=ZH3zKUw_ZPW8dFgG",
        "linkLabel": "Video öffnen ↗"
      },
      {
        "recommended": true,
        "eyebrow": "Übungstool",
        "title": "Kana Pro",
        "badges": [
          {
            "label": "Kostenlos",
            "type": "free"
          },
          {
            "label": "Interaktiv",
            "type": null
          },
          {
            "label": "Anfänger",
            "type": null
          }
        ],
        "summary": "Schnelle Erkennungsübungen für Hiragana und Katakana. Ideal nach dem ersten Lernen der Zeichen.",
        "verdictLabel": "",
        "verdict": "",
        "href": "https://kana.pro/",
        "linkLabel": "Kana Pro öffnen ↗"
      }
    ]
  },
  "res-vokabeln": {
    "title": "Vokabeln, Anki & Grunddecks",
    "note": "Wähle nur ein Grundwortschatz-Deck gleichzeitig",
    "items": [
      {
        "recommended": false,
        "eyebrow": "Software",
        "title": "Anki",
        "badges": [
          {
            "label": "Desktop kostenlos",
            "type": "free"
          },
          {
            "label": "Deutsch verfügbar",
            "type": null
          },
          {
            "label": "Alle Stufen",
            "type": null
          }
        ],
        "summary": "Flexibles Spaced-Repetition-System für Vokabeln, Sätze, Audio und später eigenes Mining.",
        "verdictLabel": "",
        "verdict": "",
        "href": "https://apps.ankiweb.net/",
        "linkLabel": "Anki öffnen ↗"
      },
      {
        "recommended": true,
        "eyebrow": "Hauptempfehlung",
        "title": "Kaishi 1.5k",
        "badges": [
          {
            "label": "Kostenlos",
            "type": "free"
          },
          {
            "label": "Englische Bedeutungen",
            "type": null
          },
          {
            "label": "Anfänger",
            "type": null
          },
          {
            "label": "ca. 1.500 Wörter",
            "type": null
          }
        ],
        "summary": "Modernes, kompaktes Anfänger-Deck mit häufigen Wörtern, Audio und Beispielsätzen. Gut als Brücke zu Immersion und Mining.",
        "verdictLabel": "Community-Eindruck:",
        "verdict": "Wird häufig als moderner, überschaubarer Einstieg empfohlen. Besonders passend, wenn du nicht jahrelang bei vorgefertigten Decks bleiben möchtest.",
        "href": "https://ankiweb.net/shared/info/1196762551",
        "linkLabel": "Kaishi 1.5k öffnen ↗"
      },
      {
        "recommended": false,
        "eyebrow": "Alternative",
        "title": "Core 2k",
        "badges": [
          {
            "label": "Kostenlos",
            "type": "free"
          },
          {
            "label": "Englisch",
            "type": null
          },
          {
            "label": "Anfänger",
            "type": null
          },
          {
            "label": "ca. 2.000 Wörter",
            "type": null
          }
        ],
        "summary": "Klassisches Grundwortschatz-Deck mit größerem Umfang als Kaishi.",
        "verdictLabel": "",
        "verdict": "",
        "href": "https://ankiweb.net/shared/info/2141233552",
        "linkLabel": "Core 2k öffnen ↗"
      },
      {
        "recommended": false,
        "eyebrow": "Langzeitdeck",
        "title": "Core 6k",
        "badges": [
          {
            "label": "Kostenlos",
            "type": "free"
          },
          {
            "label": "Englisch",
            "type": null
          },
          {
            "label": "Anfänger–Mittelstufe",
            "type": null
          },
          {
            "label": "ca. 6.000 Wörter",
            "type": null
          }
        ],
        "summary": "Umfangreicher, vorgegebener Wortschatzweg. Sinnvoll für Lernende, die lange mit einem fertigen Deck arbeiten möchten.",
        "verdictLabel": "",
        "verdict": "",
        "href": "https://ankiweb.net/shared/info/1880390099",
        "linkLabel": "Core 6k öffnen ↗"
      },
      {
        "recommended": false,
        "eyebrow": "Prüfungsfokus",
        "title": "JLPT Vocabulary Deck",
        "badges": [
          {
            "label": "Kostenlos",
            "type": "free"
          },
          {
            "label": "Englisch",
            "type": null
          },
          {
            "label": "JLPT",
            "type": null
          }
        ],
        "summary": "Prüfungsorientierter Wortschatz. Eher als Ergänzung für ein konkretes JLPT-Ziel als als allgemeines erstes Immersionsdeck.",
        "verdictLabel": "",
        "verdict": "",
        "href": "https://ankiweb.net/shared/info/1550984460",
        "linkLabel": "JLPT-Deck öffnen ↗"
      },
      {
        "recommended": false,
        "eyebrow": "Wörterbuch & SRS",
        "title": "jpdb",
        "badges": [
          {
            "label": "Kostenlos nutzbar",
            "type": "free"
          },
          {
            "label": "Englisch",
            "type": null
          },
          {
            "label": "Mittelstufe",
            "type": null
          }
        ],
        "summary": "Wörterbuch, Medien-Decks, Schwierigkeitslisten und ein integriertes SRS für Anime, Bücher, Visual Novels und weitere Medien.",
        "verdictLabel": "",
        "verdict": "",
        "href": "https://jpdb.io/",
        "linkLabel": "jpdb öffnen ↗"
      }
    ]
  },
  "res-grammatik": {
    "title": "Grammatik",
    "note": "Erklärungen, Videos und optionale SRS-Übungen",
    "items": [
      {
        "recommended": true,
        "eyebrow": "Referenz",
        "title": "Tae Kim's Grammar Guide",
        "badges": [
          {
            "label": "Kostenlos",
            "type": "free"
          },
          {
            "label": "Englisch",
            "type": null
          },
          {
            "label": "Anfänger–Mittelstufe",
            "type": null
          }
        ],
        "summary": "Strukturierter Grammatik-Guide, der sich gut zum ersten Überblick und späteren Nachschlagen eignet.",
        "verdictLabel": "",
        "verdict": "",
        "href": "https://guidetojapanese.org/learn/grammar",
        "linkLabel": "Tae Kim öffnen ↗"
      },
      {
        "recommended": false,
        "eyebrow": "Grammatik-SRS",
        "title": "Bunpro",
        "badges": [
          {
            "label": "Kostenpflichtig",
            "type": "paid"
          },
          {
            "label": "30 Tage Testphase",
            "type": "freemium"
          },
          {
            "label": "Englisch",
            "type": null
          },
          {
            "label": "N5–N1",
            "type": null
          }
        ],
        "summary": "SRS-basierte Grammatikübungen mit vielen Beispielsätzen, Lernpfaden und Verweisen auf externe Erklärungen.",
        "verdictLabel": "Community-Eindruck:",
        "verdict": "Häufig für Wiederholung und Struktur gelobt. Als einziges Grammatiksystem kann es trocken wirken; am besten zusammen mit echten Sätzen verwenden.",
        "href": "https://bunpro.jp/",
        "linkLabel": "Bunpro öffnen ↗"
      },
      {
        "recommended": false,
        "eyebrow": "Videokurs",
        "title": "YouTube-Grammatik-Playlist",
        "badges": [
          {
            "label": "Kostenlos",
            "type": "free"
          },
          {
            "label": "Video",
            "type": null
          },
          {
            "label": "Anfänger",
            "type": null
          }
        ],
        "summary": "Zusammenhängende Videoreihe für grundlegende Grammatik.",
        "verdictLabel": "",
        "verdict": "",
        "href": "https://www.youtube.com/watch?v=pSvH9vH60Ig&list=PLg9uYxuZf8x_A-vcqqyOFZu06WlhnypWj",
        "linkLabel": "Playlist öffnen ↗"
      },
      {
        "recommended": false,
        "eyebrow": "Alternative Perspektive",
        "title": "Cure Dolly Transcripts",
        "badges": [
          {
            "label": "Kostenlos",
            "type": "free"
          },
          {
            "label": "Englisch",
            "type": null
          },
          {
            "label": "Anfänger–Mittelstufe",
            "type": null
          }
        ],
        "summary": "Textfassungen der Cure-Dolly-Erklärungen. Nützlich, wenn klassische Schulgrammatik für dich nicht klickt.",
        "verdictLabel": "Einordnung:",
        "verdict": "Für manche Lernende ein Aha-Moment, für andere unnötig eigenwillig. Als ergänzende Perspektive nutzen.",
        "href": "https://kellenok.github.io/cure-script/about.html",
        "linkLabel": "Transkripte öffnen ↗"
      },
      {
        "recommended": false,
        "eyebrow": "Gaming",
        "title": "Game Gengo",
        "badges": [
          {
            "label": "Kostenlos",
            "type": "free"
          },
          {
            "label": "Englisch",
            "type": null
          },
          {
            "label": "Video",
            "type": null
          },
          {
            "label": "Anfänger–Mittelstufe",
            "type": null
          }
        ],
        "summary": "Grammatik und Sprachgebrauch anhand japanischer Videospiele. Besonders motivierend für Gaming-Fans.",
        "verdictLabel": "",
        "verdict": "",
        "href": "https://www.youtube.com/@GameGengo/playlists",
        "linkLabel": "Playlists öffnen ↗"
      },
      {
        "recommended": false,
        "eyebrow": "Einzelvideo",
        "title": "Zusätzliche Grammatikerklärung",
        "badges": [
          {
            "label": "Kostenlos",
            "type": "free"
          },
          {
            "label": "Video",
            "type": null
          }
        ],
        "summary": "Ergänzendes Video für eine weitere Erklärungsperspektive.",
        "verdictLabel": "",
        "verdict": "",
        "href": "https://youtu.be/sbw5IDYyoF0?si=89GZr6OHCqnxltWr",
        "linkLabel": "Video öffnen ↗"
      }
    ]
  },
  "res-lesen": {
    "title": "Lesen & Graded Readers",
    "note": "Vom ersten einfachen Text bis zu nativen Büchern",
    "items": [
      {
        "recommended": true,
        "eyebrow": "Graded Readers",
        "title": "Tadoku Free Books",
        "badges": [
          {
            "label": "Kostenlos",
            "type": "free"
          },
          {
            "label": "Japanisch",
            "type": null
          },
          {
            "label": "Starter–Fortgeschritten",
            "type": null
          },
          {
            "label": "teilweise Audio",
            "type": null
          }
        ],
        "summary": "Große Sammlung nach Schwierigkeitsstufen sortierter Kurztexte. Viele Bücher lassen sich im Browser lesen oder als PDF herunterladen.",
        "verdictLabel": "Community-Eindruck:",
        "verdict": "Einer der häufigsten Einstiegstipps fürs Lesen. Die einfachsten Geschichten können kindlich oder sehr simpel wirken, erfüllen aber ihren Zweck.",
        "href": "https://tadoku.org/japanese/en/free-books-en/",
        "linkLabel": "Tadoku öffnen ↗"
      },
      {
        "recommended": false,
        "eyebrow": "Geführtes Lesen",
        "title": "Satori Reader",
        "badges": [
          {
            "label": "Freemium",
            "type": "freemium"
          },
          {
            "label": "Vollzugang kostenpflichtig",
            "type": "paid"
          },
          {
            "label": "Englisch",
            "type": null
          },
          {
            "label": "Mittelstufe",
            "type": null
          },
          {
            "label": "Audio",
            "type": null
          }
        ],
        "summary": "Geschichten mit Satz-für-Satz-Erklärungen, Audio, Grammatikhinweisen und konfigurierbaren Kanji-Darstellungen.",
        "verdictLabel": "Community-Eindruck:",
        "verdict": "Oft als starke Brücke zu nativen Texten gelobt. Für komplette Anfänger meist noch zu schwer; Geschmack an den Geschichten ist sehr individuell.",
        "href": "https://www.satorireader.com/",
        "linkLabel": "Satori Reader öffnen ↗"
      },
      {
        "recommended": false,
        "eyebrow": "Lerner-Manga",
        "title": "Crystal Hunters",
        "badges": [
          {
            "label": "Band 1 kostenlos",
            "type": "freemium"
          },
          {
            "label": "weitere Bände kostenpflichtig",
            "type": "paid"
          },
          {
            "label": "Japanisch",
            "type": null
          },
          {
            "label": "Anfänger",
            "type": null
          }
        ],
        "summary": "Fantasy-Manga mit stark begrenztem Wortschatz, viel Wiederholung und kostenlosen Sprachguides. Zusätzlich existiert eine natürlichere japanische Fassung.",
        "verdictLabel": "Community-Eindruck:",
        "verdict": "Häufig als erster Manga empfohlen. Die Wiederholungen helfen Anfängern, können für manche Leser aber künstlich wirken.",
        "href": "https://crystalhuntersmanga.com/free-stuff/",
        "linkLabel": "Kostenlose Inhalte öffnen ↗"
      },
      {
        "recommended": false,
        "eyebrow": "Schwierigkeit & Reviews",
        "title": "Natively",
        "badges": [
          {
            "label": "Kostenlos nutzbar",
            "type": "free"
          },
          {
            "label": "Englisch",
            "type": null
          },
          {
            "label": "Alle Stufen",
            "type": null
          },
          {
            "label": "Community-Ratings",
            "type": null
          }
        ],
        "summary": "Community-Datenbank mit Schwierigkeitsbewertungen, Reviews und Leselisten für Manga, Bücher, Filme und Serien.",
        "verdictLabel": "Einordnung:",
        "verdict": "Sehr hilfreich für die Materialwahl. Schwierigkeitswerte bleiben subjektiv und werden zuverlässiger, wenn viele Personen ein Werk bewertet haben.",
        "href": "https://learnnatively.com/search/jpn/books/",
        "linkLabel": "Bücher durchsuchen ↗"
      }
    ]
  },
  "res-hoeren": {
    "title": "Hörverstehen & Immersion",
    "note": "Medienlisten, Podcasts und Schwierigkeitsdaten",
    "items": [
      {
        "recommended": true,
        "eyebrow": "Große Sammlung",
        "title": "Allgemeine Immersionsliste",
        "badges": [
          {
            "label": "Kostenlos",
            "type": "free"
          },
          {
            "label": "Gemischt",
            "type": null
          },
          {
            "label": "Alle Stufen",
            "type": null
          }
        ],
        "summary": "Umfangreiche Tabelle mit unterschiedlichen japanischen Medien und Einstiegsmöglichkeiten.",
        "verdictLabel": "",
        "verdict": "",
        "href": "https://docs.google.com/spreadsheets/d/1w42HEKEu2AzZg9K7PI0ma9ICmr2qYEKQ9IF4XxFSnQU/edit?gid=1999205540#gid=1999205540",
        "linkLabel": "Liste öffnen ↗"
      },
      {
        "recommended": false,
        "eyebrow": "Podcasts",
        "title": "Podcast-Liste",
        "badges": [
          {
            "label": "Kostenlos",
            "type": "free"
          },
          {
            "label": "Japanisch",
            "type": null
          },
          {
            "label": "Anfänger–Fortgeschritten",
            "type": null
          }
        ],
        "summary": "Nachschlageliste für japanische Podcasts mit unterschiedlichen Sprechgeschwindigkeiten und Themen.",
        "verdictLabel": "",
        "verdict": "",
        "href": "https://docs.google.com/spreadsheets/d/17P2dBQHnBnHcG3ua_24IO6sP9RDC-5b3WHV9Ri2N5qU/edit?gid=0#gid=0",
        "linkLabel": "Podcast-Liste öffnen ↗"
      },
      {
        "recommended": false,
        "eyebrow": "Medien-Datenbank",
        "title": "Jiten",
        "badges": [
          {
            "label": "Kostenlos",
            "type": "free"
          },
          {
            "label": "Englisch",
            "type": null
          },
          {
            "label": "Alle Stufen",
            "type": null
          }
        ],
        "summary": "Große Liste von Anime, Manga, Büchern, Spielen und weiteren Medien, sortierbar nach Titel und Datensätzen.",
        "verdictLabel": "",
        "verdict": "",
        "href": "https://jiten.moe/decks/media?offset=0&sortBy=title&sortOrder=0",
        "linkLabel": "Jiten öffnen ↗"
      },
      {
        "recommended": false,
        "eyebrow": "YouTube",
        "title": "Japanische YouTube-Liste",
        "badges": [
          {
            "label": "Kostenlos",
            "type": "free"
          },
          {
            "label": "Japanisch",
            "type": null
          },
          {
            "label": "verschiedene Niveaus",
            "type": null
          }
        ],
        "summary": "Sammlung japanischer Kanäle für Unterhaltung, Gaming, Alltag und regelmäßiges Hörtraining.",
        "verdictLabel": "",
        "verdict": "",
        "href": "https://docs.google.com/spreadsheets/d/1ETQWRoNKmWKpZxUO3OCpNXSLXuXB7UpQxEYtGXjdjVw/edit?usp=sharing",
        "linkLabel": "YouTube-Liste öffnen ↗"
      },
      {
        "recommended": false,
        "eyebrow": "Japanische E-Books",
        "title": "BOOK☆WALKER Japan",
        "badges": [
          {
            "label": "Kostenpflichtiger Shop",
            "type": "paid"
          },
          {
            "label": "Japanisch",
            "type": null
          },
          {
            "label": "Mittelstufe–Fortgeschritten",
            "type": null
          }
        ],
        "summary": "Japanischer Shop für Manga, Light Novels und Bücher. Leseproben und zeitweise kostenlose Aktionen sind möglich, die meisten vollständigen Werke sind kostenpflichtig.",
        "verdictLabel": "",
        "verdict": "",
        "href": "https://bookwalker.jp/st3/",
        "linkLabel": "BOOK☆WALKER öffnen ↗"
      }
    ]
  },
  "res-jlpt": {
    "title": "JLPT",
    "note": "Offizielle Aufgaben und gezielte Prüfungsvorbereitung",
    "items": [
      {
        "recommended": true,
        "eyebrow": "Offiziell",
        "title": "JLPT Sample Questions",
        "badges": [
          {
            "label": "Kostenlos",
            "type": "free"
          },
          {
            "label": "Japanisch / Englisch",
            "type": null
          },
          {
            "label": "N5–N1",
            "type": null
          }
        ],
        "summary": "Offizielle Beispielaufgaben und Informationen zum Prüfungsformat. Der beste Ausgangspunkt, bevor du Übungsbücher kaufst.",
        "verdictLabel": "",
        "verdict": "",
        "href": "https://www.jlpt.jp/e/samples/forlearners.html",
        "linkLabel": "Offizielle Aufgaben öffnen ↗"
      },
      {
        "recommended": false,
        "eyebrow": "Anki",
        "title": "JLPT Vocabulary Deck",
        "badges": [
          {
            "label": "Kostenlos",
            "type": "free"
          },
          {
            "label": "Englisch",
            "type": null
          },
          {
            "label": "JLPT",
            "type": null
          }
        ],
        "summary": "Prüfungswortschatz als Ergänzung zu echten Beispielaufgaben. Nicht als alleiniger Nachweis für ein JLPT-Niveau verstehen.",
        "verdictLabel": "",
        "verdict": "",
        "href": "https://ankiweb.net/shared/info/1550984460",
        "linkLabel": "JLPT-Deck öffnen ↗"
      }
    ]
  }
};
