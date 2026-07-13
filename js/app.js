/* ============================================================
   js/app.js — Kern der App: Kana-Tabellen-Helfer, alle
   Panel-Definitionen (Titel/Quest/Inhalt bzw. Pfad zur
   ausgelagerten Seite), der Wegweiser-Begleiter (Sora) und die
   grundlegende Steuerung (Hell-/Dunkelmodus).

   Ladereihenfolge wichtig: nach data/resources.js, js/progress.js,
   js/windows.js und js/resources.js einbinden — diese Datei ruft
   ganz am Ende updateWegweiser() auf, wenn alles andere bereits
   bereitsteht.
   ============================================================ */

function kanaTable(cells, cols){
  cols = cols || 5;
  const items = cells.map(c => {
    if(!c) return `<div class="kana-cell empty"></div>`;
    return `<button type="button" class="kana-cell" data-kana-speak="${c[0]}" aria-label="${c[0]}, gelesen ${c[1]}, anhören"><span class="char">${c[0]}</span><span class="romaji">${c[1]}</span></button>`;
  }).join('');
  return `<div class="kana-table" style="grid-template-columns:repeat(${cols},1fr);">${items}</div>`;
}

const HIRAGANA_MAIN = [
  ['あ','a'],['い','i'],['う','u'],['え','e'],['お','o'],
  ['か','ka'],['き','ki'],['く','ku'],['け','ke'],['こ','ko'],
  ['さ','sa'],['し','shi'],['す','su'],['せ','se'],['そ','so'],
  ['た','ta'],['ち','chi'],['つ','tsu'],['て','te'],['と','to'],
  ['な','na'],['に','ni'],['ぬ','nu'],['ね','ne'],['の','no'],
  ['は','ha'],['ひ','hi'],['ふ','fu'],['へ','he'],['ほ','ho'],
  ['ま','ma'],['み','mi'],['む','mu'],['め','me'],['も','mo'],
  ['や','ya'],null,['ゆ','yu'],null,['よ','yo'],
  ['ら','ra'],['り','ri'],['る','ru'],['れ','re'],['ろ','ro'],
  ['わ','wa'],null,null,null,['を','wo'],
  ['ん','n'],null,null,null,null
];
const HIRAGANA_DAKUTEN = [
  ['が','ga'],['ぎ','gi'],['ぐ','gu'],['げ','ge'],['ご','go'],
  ['ざ','za'],['じ','ji'],['ず','zu'],['ぜ','ze'],['ぞ','zo'],
  ['だ','da'],['ぢ','ji'],['づ','zu'],['で','de'],['ど','do'],
  ['ば','ba'],['び','bi'],['ぶ','bu'],['べ','be'],['ぼ','bo'],
  ['ぱ','pa'],['ぴ','pi'],['ぷ','pu'],['ぺ','pe'],['ぽ','po']
];
const HIRAGANA_YOON = [
  ['きゃ','kya'],['きゅ','kyu'],['きょ','kyo'],
  ['しゃ','sha'],['しゅ','shu'],['しょ','sho'],
  ['ちゃ','cha'],['ちゅ','chu'],['ちょ','cho'],
  ['にゃ','nya'],['にゅ','nyu'],['にょ','nyo'],
  ['ひゃ','hya'],['ひゅ','hyu'],['ひょ','hyo'],
  ['みゃ','mya'],['みゅ','myu'],['みょ','myo'],
  ['りゃ','rya'],['りゅ','ryu'],['りょ','ryo'],
  ['ぎゃ','gya'],['ぎゅ','gyu'],['ぎょ','gyo'],
  ['じゃ','ja'],['じゅ','ju'],['じょ','jo'],
  ['びゃ','bya'],['びゅ','byu'],['びょ','byo'],
  ['ぴゃ','pya'],['ぴゅ','pyu'],['ぴょ','pyo']
];
const KATAKANA_MAIN = [
  ['ア','a'],['イ','i'],['ウ','u'],['エ','e'],['オ','o'],
  ['カ','ka'],['キ','ki'],['ク','ku'],['ケ','ke'],['コ','ko'],
  ['サ','sa'],['シ','shi'],['ス','su'],['セ','se'],['ソ','so'],
  ['タ','ta'],['チ','chi'],['ツ','tsu'],['テ','te'],['ト','to'],
  ['ナ','na'],['ニ','ni'],['ヌ','nu'],['ネ','ne'],['ノ','no'],
  ['ハ','ha'],['ヒ','hi'],['フ','fu'],['ヘ','he'],['ホ','ho'],
  ['マ','ma'],['ミ','mi'],['ム','mu'],['メ','me'],['モ','mo'],
  ['ヤ','ya'],null,['ユ','yu'],null,['ヨ','yo'],
  ['ラ','ra'],['リ','ri'],['ル','ru'],['レ','re'],['ロ','ro'],
  ['ワ','wa'],null,null,null,['ヲ','wo'],
  ['ン','n'],null,null,null,null
];
const KATAKANA_DAKUTEN = [
  ['ガ','ga'],['ギ','gi'],['グ','gu'],['ゲ','ge'],['ゴ','go'],
  ['ザ','za'],['ジ','ji'],['ズ','zu'],['ゼ','ze'],['ゾ','zo'],
  ['ダ','da'],['ヂ','ji'],['ヅ','zu'],['デ','de'],['ド','do'],
  ['バ','ba'],['ビ','bi'],['ブ','bu'],['ベ','be'],['ボ','bo'],
  ['パ','pa'],['ピ','pi'],['プ','pu'],['ペ','pe'],['ポ','po']
];
const KATAKANA_YOON = [
  ['キャ','kya'],['キュ','kyu'],['キョ','kyo'],
  ['シャ','sha'],['シュ','shu'],['ショ','sho'],
  ['チャ','cha'],['チュ','chu'],['チョ','cho'],
  ['ニャ','nya'],['ニュ','nyu'],['ニョ','nyo'],
  ['ヒャ','hya'],['ヒュ','hyu'],['ヒョ','hyo'],
  ['ミャ','mya'],['ミュ','myu'],['ミョ','myo'],
  ['リャ','rya'],['リュ','ryu'],['リョ','ryo'],
  ['ギャ','gya'],['ギュ','gyu'],['ギョ','gyo'],
  ['ジャ','ja'],['ジュ','ju'],['ジョ','jo'],
  ['ビャ','bya'],['ビュ','byu'],['ビョ','byo'],
  ['ピャ','pya'],['ピュ','pyu'],['ピョ','pyo']
];

/* ===================== Fensterinhalte ===================== */

const panels = {
tag1: {
  title: "一日目 — Tag 1",
  quest: "Nur ein Ziel für heute: Lerne die ersten Hiragana-Zeichen kennen. Mehr brauchst du jetzt nicht.",
  html: `
    <span class="eyebrow win-eyebrow">Erster Besuch</span>
    <h2 class="win-h2">Willkommen! Fangen wir klein an.</h2>

    <p class="win-p">
      Du bist neu hier und weißt noch nicht, wo du anfangen sollst? Das ist
      völlig normal. Für heute brauchst du nur ein einziges Ziel.
    </p>

    <div class="win-quote">
      Heutiges Ziel: Lerne die ersten Hiragana-Zeichen kennen. Nicht alle
      46 auf einmal, nur ein paar.
    </div>

    <p class="win-p">
      Auf der Kana-Seite kannst du dir jedes Zeichen per Klick vorlesen
      lassen. Wenn du magst, teste dich danach kurz mit dem Kana-Quiz.
      Aber auch das ist heute schon optional.
    </p>

    <button class="toc-item" data-open="kana">
      Jetzt mit Kana starten →
    </button>

    <p class="win-p" style="margin-top:1.4em;">
      Mehr willst du noch nicht wissen? Gut so. Sobald du bereit für die
      nächsten Schritte bist, findest du im vollständigen Anfänger-Guide
      die komplette Reihenfolge: Wortschatz, Grammatik und Immersion.
    </p>

    <button class="inline-link" data-open="guide">
      Zum vollständigen Anfänger-Guide →
    </button>
  `
},
guide: {
  title: "初心者ガイド",
  quest: "Willkommen zum Guide! Als Erstes solltest du dich mit dem japanischen Schriftsystem vertraut machen.",
  html: `
    <span class="eyebrow win-eyebrow">Für absolute Anfänger:innen</span>

    <h2 class="win-h2">Anfänger-Guide</h2>

    <div class="guide-progress" aria-label="Fortschritt im Anfänger-Guide">
      <div class="guide-progress-head">
        <span class="guide-progress-title">Dein Fortschritt</span>
        <span class="guide-progress-count" id="guideProgressCount">0 von 5 erledigt</span>
      </div>
      <div class="guide-progress-bar" aria-hidden="true">
        <div class="guide-progress-fill" id="guideProgressFill"></div>
      </div>
      <div class="guide-checklist">
        <button class="guide-step" type="button" data-guide-step="kana">Kana verstanden</button>
        <button class="guide-step" type="button" data-guide-step="wortschatz">Wortschatz geplant</button>
        <button class="guide-step" type="button" data-guide-step="grammatik">Grammatik eingeordnet</button>
        <button class="guide-step" type="button" data-guide-step="immersion">Immersion begonnen</button>
        <button class="guide-step" type="button" data-guide-step="mining">Mining eingeordnet</button>
      </div>
    </div>

    <p class="win-p">
      Du fängst gerade erst mit Japanisch an und weißt nicht, wo du beginnen sollst?
    </p>

    <p class="win-p">
      Dann bist du hier genau richtig.
    </p>

    <p class="win-p">
      Am Anfang wirkt Japanisch schnell wie ein ganzer Berg aus neuen Begriffen:
      Hiragana, Katakana, Kanji, Grammatik, Vokabeln, Anki, Immersion und
      irgendwann fällt auch noch das Wort „Mining“.
    </p>

    <p class="win-p">
      Keine Sorge. Du musst das nicht alles gleichzeitig verstehen oder einrichten.
    </p>

    <p class="win-p">
      Dieser Guide führt dich Schritt für Schritt durch die Reihenfolge, die für
      die meisten Anfänger:innen am sinnvollsten ist. Du bekommst zuerst eine
      stabile Grundlage und kümmerst dich erst später um die Dinge, die du dann
      wirklich brauchst.
    </p>

    <h3 class="win-h3" data-stage="jetzt">1. Lerne Hiragana und Katakana</h3>

    <p class="win-p">
      Fast jeder Lernweg beginnt mit Hiragana und Katakana. Die beiden
      Silbenschriften begegnen dir überall und geben dir zum ersten Mal das
      Gefühl, wirklich Japanisch zu lesen.
    </p>

    <p class="win-p">
      Ohne Kana bleibst du auf Umschriften wie „konnichiwa“ angewiesen. Das
      wirkt am Anfang bequemer, bremst dich später aber eher aus.
    </p>

    <p class="win-p">
      Du musst die Zeichen noch nicht perfekt aus dem Gedächtnis schreiben
      können. Für den Anfang reicht es, wenn du sie zuverlässig erkennst und
      langsam lesen kannst.
    </p>

    <p class="win-p">
      Beginne mit Hiragana. Sobald die meisten Zeichen vertraut wirken, nimmst
      du Katakana dazu.
    </p>

    <h3 class="win-h3" data-stage="bald">2. Baue einen ersten Wortschatz auf</h3>

    <p class="win-p">
      Sobald du die Kana einigermaßen lesen kannst, kannst du mit häufigen
      japanischen Wörtern anfangen.
    </p>

    <p class="win-p">
      Ein gutes Anfänger-Deck mit ungefähr 1.000 bis 1.500 häufigen Wörtern
      sorgt dafür, dass dir in Anime, Manga, Spielen oder einfachen Texten
      immer öfter etwas bekannt vorkommt.
    </p>

    <p class="win-p">
      Du musst dabei keinen Geschwindigkeitsrekord aufstellen. Wichtiger ist,
      dass du regelmäßig lernst und deine täglichen Wiederholungen nicht zu
      einem zweiten Vollzeitjob werden.
    </p>

    <p class="win-p">
      Fünf bis zehn neue Wörter, die du langfristig behältst, sind wertvoller
      als zwanzig Karten, vor denen du dich nach einer Woche versteckst.
    </p>

    <h3 class="win-h3" data-stage="bald">3. Lerne grundlegende Grammatik</h3>

    <p class="win-p">
      Japanische Grammatik funktioniert anders als deutsche Grammatik. Genau
      deshalb fühlt sie sich am Anfang manchmal verkehrt herum an.
    </p>

    <p class="win-p">
      Du musst aber nicht sofort jede Regel und jede Verbform auswendig lernen.
    </p>

    <p class="win-p">
      Dein erstes Ziel ist viel kleiner: Du möchtest häufige Satzstrukturen,
      Partikel und Verbformen wiedererkennen. Grammatik soll dir helfen, echte
      Sätze zu entschlüsseln, nicht dich mit Fachbegriffen zu erschlagen.
    </p>

    <p class="win-p">
      Mit jeder neuen Struktur wird aus einem scheinbaren Zeichensalat ein
      kleines Stück verständliches Japanisch.
    </p>

    <h3 class="win-h3" data-stage="laufend">4. Beginne früh mit Immersion</h3>

    <p class="win-p">
      Immersion bedeutet, dass du regelmäßig echtes Japanisch hörst oder liest.
    </p>

    <p class="win-p">
      Das können Anime, Manga, Podcasts, Spiele, Videos, Light Novels oder
      Visual Novels sein. Entscheidend ist nicht das Medium, sondern dass du
      immer wieder Kontakt mit der Sprache hast.
    </p>

    <p class="win-p">
      Am Anfang wirst du nur wenig verstehen. Das ist nicht das Zeichen, dass
      du noch nicht bereit bist. Es ist der normale Anfang.
    </p>

    <p class="win-p">
      Du musst also nicht warten, bis du „genug gelernt“ hast. Immersion ist
      kein Endpunkt, sondern der Ort, an dem dein Wissen langsam lebendig wird.
    </p>

    <h3 class="win-h3" data-stage="spaeter">5. Starte später mit Mining</h3>

    <p class="win-p">
      Stell dir vor, du liest einen Manga und ein Wort taucht auf, das du
      gestern schon in einem Anime gehört hast. Genau solche Wörter sind gute
      Kandidaten fürs Mining.
    </p>

    <p class="win-p">
      Beim Mining sammelst du interessante Wörter oder Sätze aus den Inhalten,
      die du selbst konsumierst, und erstellst daraus eigene Lernkarten.
    </p>

    <p class="win-p">
      Damit hat es aber am ersten Tag noch keine Eile. Zuerst reichen Kana,
      ein kleiner Grundwortschatz, etwas Grammatik und regelmäßige
      Immersion völlig aus.
    </p>

    <p class="win-p">
      Sobald dir immer wieder Wörter begegnen, die du wirklich behalten
      möchtest, lohnt es sich, dein eigenes Mining-System einzurichten.
    </p>

    <h3 class="win-h3">Ein einfacher Tagesplan</h3>

    <ul class="win-list">
      <li>10 bis 20 Minuten Vokabeln wiederholen</li>
      <li>10 bis 20 Minuten Grammatik oder Lesen</li>
      <li>15 bis 30 Minuten Immersion</li>
    </ul>

    <p class="win-p">
      Das ist keine Pflichtliste, die du jeden Tag perfekt abhaken musst.
    </p>

    <p class="win-p">
      An manchen Tagen schaffst du mehr, an anderen vielleicht nur ein paar
      Wiederholungen oder eine Anime-Folge. Entscheidend ist, dass Japanisch
      regelmäßig in deinem Alltag auftaucht und dein Lernplan auch nach
      mehreren Monaten noch zu dir passt.
    </p>

    <p class="win-p">
      Wenn du bis hier gelesen hast, kennst du bereits die wichtigsten
      Bausteine deines ersten Lernwegs.
    </p>

    <p class="win-p">
      <strong>
        Du brauchst am Anfang weder perfektes Kanjiwissen noch ein
        kompliziertes Mining-Setup. Beginne klein. Sobald deine Grundlage
        wächst, kannst du dein System Schritt für Schritt erweitern.
      </strong>
    </p>

    <div class="resource-cta">
      <p class="win-p">
        Nicht sicher, was zu deinem Ziel passt?
      </p>
      <p class="win-p">
        Vielleicht möchtest du vor allem Anime verstehen, Manga lesen, Visual
        Novels spielen oder dich auf den JLPT vorbereiten.
      </p>
      <p class="win-p">
        Der Entscheidungsbaum führt dich mit ein paar kurzen Fragen zum
        passenden nächsten Schritt. In den geführten Lernwegen findest du
        außerdem fertige Setups für unterschiedliche Ziele.
      </p>
      <p class="win-p">
        Dein nächster Schritt: Fang mit Kana an und lerne heute nur die
        ersten Zeichen kennen.
      </p>
      <button class="toc-item" data-open="entscheidungsbaum">
        Was brauche ich jetzt? →
      </button>
      <button class="toc-item" data-open="lernwege">
        Geführte Lernwege ansehen →
      </button>
    </div>

    <div class="resource-cta">
      <p class="win-p">
        Du möchtest verschiedene Lernwege vergleichen? Im Ressourcenbereich
        findest du kompakte und intensive Immersions-Guides mit Einordnung.
      </p>
      <button class="toc-item" data-open="ressourcen" data-resource-target="res-guides">
        Lernwege vergleichen →
      </button>
    </div>

    <button class="toc-item" data-open="kana">
      Mit Kana starten →
    </button>
  `
},
  toc: { title:"目次", quest:"Hier findest du alle Stationen deiner Reise. Wähle dein nächstes Ziel!", html:`
    <span class="eyebrow win-eyebrow">Übersicht</span>
    <h2 class="win-h2">Inhaltsverzeichnis</h2>
    <p class="win-p">
      Auf dieser Seite ist inzwischen einiges zusammengekommen. Keine Sorge:
      Du brauchst nicht alles auf einmal. Diese Übersicht zeigt dir nur,
      welche Tür wohin führt.
    </p>
    <p class="win-p">
      Alle Bereiche der Seite, gruppiert nach Einstieg, Vertiefung und
      Werkzeuge &amp; Referenz. Nicht sicher, wo du anfangen sollst? Tag 1
      oder der Entscheidungsbaum helfen dir weiter.
    </p>

    <h3 class="win-h3">Einstieg</h3>
    <ul class="toc-list">
      <li><button class="toc-item" data-open="tag1">Tag 1 — Hier starten</button></li>
      <li><button class="toc-item" data-open="guide">Anfänger-Guide</button></li>
      <li><button class="toc-item" data-open="entscheidungsbaum">Was brauche ich jetzt?</button></li>
      <li><button class="toc-item" data-open="lernwege">Geführte Lernwege</button></li>
      <li><button class="toc-item" data-open="kana">Kana — Hiragana &amp; Katakana</button></li>
      <li><button class="toc-item" data-open="kanaquiz">Kana-Quiz</button></li>
    </ul>

    <h3 class="win-h3">Vertiefung</h3>
    <ul class="toc-list">
      <li><button class="toc-item" data-open="kanji">Kanji</button></li>
      <li><button class="toc-item" data-open="grammatik">Grammatik</button></li>
      <li><button class="toc-item" data-open="wortschatz">Wortschatz</button></li>
      <li><button class="toc-item" data-open="aussprache">Aussprache</button></li>
      <li><button class="toc-item" data-open="hoeren">Hörverstehen</button></li>
      <li><button class="toc-item" data-open="immersion">Immersion</button></li>
      <li><button class="toc-item" data-open="lesen">Lesen</button></li>
      <li><button class="toc-item" data-open="anki">Anki &amp; SRS</button></li>
      <li><button class="toc-item" data-open="yomitan">Yomitan</button></li>
      <li><button class="toc-item" data-open="mining">Mining</button></li>
      <li><button class="toc-item" data-open="kultur">Kultur &amp; Etikette</button></li>
      <li><button class="toc-item" data-open="jlpt">JLPT-Prüfungen</button></li>
    </ul>

    <h3 class="win-h3">Werkzeuge &amp; Referenz</h3>
    <ul class="toc-list">
      <li><button class="toc-item" data-open="tools">Tools-Bibliothek</button></li>
      <li><button class="toc-item" data-open="glossar">Glossar</button></li>
      <li><button class="toc-item" data-open="fehlerhilfe">Fehlerdatenbank</button></li>
      <li><button class="toc-item" data-open="ressourcen">Ressourcen</button></li>
      <li><button class="toc-item" data-open="faq">FAQ</button></li>
      <li><button class="toc-item" data-open="kontakt">Kontakt</button></li>
    </ul>

    <p class="win-p">
      Du hast jetzt die ganze Landkarte gesehen. Dein nächster Schritt muss
      trotzdem nur eine einzige Station sein.
    </p>
  `},
 kana: {
  title: "かな — Kana",

  quest: "Kana sind dein Fundament. Lerne zuerst Hiragana und danach Katakana. Perfektes Schreiben ist am Anfang nicht nötig, sicheres Erkennen schon.",
  src: "pages/kana.html",
},
kanaquiz: {
  title: "Kana-Quiz",
  quest: "Teste in ein paar Fragen, wie sicher du Hiragana und Katakana schon erkennst!",
  src: "pages/kanaquiz.html",
},
hiragana: {
  title: "ひらがな — Hiragana",
  quest: "Die 46 Grundzeichen sind dein Fundament. Übe sie in kleinen Gruppen, nicht alle auf einmal.",
  html: `
    <span class="eyebrow win-eyebrow">Schriftsystem</span>
    <h2 class="win-h2">Hiragana</h2>

    <p class="win-p">
      Hiragana ist die Schrift, mit der für viele Lernende das erste echte
      Japanisch beginnt.
    </p>

    <p class="win-p">
      Jedes Zeichen steht für einen festen Laut. Das macht Hiragana deutlich
      übersichtlicher, als es auf den ersten Blick wirkt.
    </p>

    <p class="win-p">
      Unten findest du:
    </p>

    <ul class="win-list">
      <li>die 46 Grundzeichen</li>
      <li>Dakuten und Handakuten</li>
      <li>Yōon-Kombinationen mit kleinem ゃ・ゅ・ょ</li>
    </ul>

    <p class="win-p">
      Du musst nicht alles sofort auswendig können. Lerne die Zeichen in
      kleinen Gruppen und komm regelmäßig zu den Tabellen zurück.
    </p>

    <h3 class="win-h3">Zeichen anhören</h3>

    <p class="win-p">
      🔊 Klick auf ein Zeichen in den Tabellen, um es dir vorlesen zu lassen.
    </p>

    <p class="win-p">
      Die Aussprache läuft über die Sprachausgabe deines Browsers. Du
      brauchst dafür keine zusätzliche App.
    </p>

    <p class="win-p">
      Falls auf deinem Gerät keine japanische Stimme installiert ist, bleibt
      die Tabelle trotzdem ganz normal nutzbar. Dann kannst du die Zeichen
      weiterhin lesen und lernen, nur die Audioausgabe fällt weg.
    </p>

    <p class="win-p">
      Hör dir ein Zeichen ruhig mehrmals an und sprich es leise nach.
      Perfekte Aussprache ist heute noch nicht das Ziel. Wichtig ist
      zuerst, dass du Laut und Zeichen miteinander verbindest.
    </p>

    <h3 class="win-h3">Die Grundzeichen (Gojūon)</h3>

    <p class="win-p">
      Die Gojūon-Tabelle enthält die grundlegenden Hiragana.
    </p>

    <p class="win-p">
      Beginne am besten mit einer Reihe, zum Beispiel:
    </p>

    <div class="example-box">
      <p class="example-jp">あ・い・う・え・お</p>
    </div>

    <p class="win-p">
      Danach kannst du dich Schritt für Schritt durch die nächsten Reihen
      arbeiten.
    </p>

    <p class="win-p">
      Versuche nicht, die gesamte Tabelle in einer Sitzung in deinen Kopf
      zu pressen. Fünf Zeichen, die morgen noch da sind, bringen dir mehr
      als 46 Zeichen, die sich heute Abend schon wieder verabschiedet haben.
    </p>

    ${kanaTable(HIRAGANA_MAIN, 5)}

    <h3 class="win-h3">Dakuten &amp; Handakuten</h3>

    <p class="win-p">
      Manche Hiragana verändern ihren Laut durch kleine Zusatzzeichen.
    </p>

    <p class="win-p">
      Dakuten sind zwei kleine Striche:
    </p>

    <div class="example-box">
      <p class="example-jp">か wird zu が</p>
    </div>

    <p class="win-p">
      Der Laut verändert sich dabei zum Beispiel von „ka“ zu „ga“.
    </p>

    <p class="win-p">
      Handakuten ist ein kleiner Kreis:
    </p>

    <div class="example-box">
      <p class="example-jp">は wird zu ぱ</p>
    </div>

    <p class="win-p">
      Dadurch wird aus „ha“ der Laut „pa“.
    </p>

    <p class="win-p">
      Du lernst hier also keine komplett neue Schrift. Du erkennst ein
      bekanntes Zeichen und ergänzt eine feste Lautveränderung.
    </p>

    ${kanaTable(HIRAGANA_DAKUTEN, 5)}

    <h3 class="win-h3">Yōon — Kombinationen</h3>

    <p class="win-p">
      Bei Yōon wird ein Hiragana aus der i-Reihe mit einem kleinen
      ゃ・ゅ・ょ kombiniert.
    </p>

    <p class="win-p">
      Zum Beispiel:
    </p>

    <div class="example-box">
      <p class="example-jp">き + ゃ = きゃ</p>
    </div>

    <p class="win-p">
      きゃ wird nicht als zwei getrennte Laute gelesen, sondern zusammen
      als „kya“.
    </p>

    <p class="win-p">
      Achte darauf, dass ゃ・ゅ・ょ kleiner geschrieben werden. In normaler
      Größe würden sie zwei getrennte Laute bilden.
    </p>

    <p class="win-p">
      Auch hier reicht es, das Muster einmal verstanden zu haben — den
      Rest übernimmt mit der Zeit das Lesen von selbst, die Formen werden
      dir dabei automatisch vertrauter.
    </p>

    ${kanaTable(HIRAGANA_YOON, 3)}

    <h3 class="win-h3">Wie du diese Seite nutzen kannst</h3>

    <ol class="win-list">
      <li>Wähle eine kleine Gruppe von Zeichen.</li>
      <li>Klick jedes Zeichen an und hör dir den Laut an.</li>
      <li>Sprich den Laut kurz nach.</li>
      <li>Schau weg und versuche, die Zeichen wiederzuerkennen.</li>
      <li>Wiederhole die Gruppe später noch einmal.</li>
    </ol>

    <p class="win-p">
      Bleib zunächst bei kurzen Einheiten von fünf bis fünfzehn Minuten.
    </p>

    <p class="win-p">
      Dein nächster Schritt: Lerne heute nur die erste Hiragana-Reihe
      あ・い・う・え・お und teste danach, welche Zeichen du ohne Hilfe
      wiedererkennst.
    </p>

    <button class="toc-item" data-open="kanaquiz">Zeichen im Kana-Quiz testen →</button>

    <div class="win-navigation">
      <button class="toc-item" data-open="kana">← Zurück zu Kana</button>
      <button class="toc-item" data-open="katakana">Weiter zu Katakana →</button>
    </div>
  `
},
katakana: {
  title: "カタカナ — Katakana",
  quest: "Katakana klingt wie Hiragana, sieht aber anders aus — perfekt für Fremdwörter und Namen.",
  html: `
    <span class="eyebrow win-eyebrow">Schriftsystem</span>
    <h2 class="win-h2">Katakana</h2>

    <p class="win-p">
      Katakana zeigt dieselben grundlegenden Laute wie Hiragana, sieht aber
      kantiger und markanter aus.
    </p>

    <p class="win-p">
      Du begegnest Katakana besonders häufig bei:
    </p>

    <ul class="win-list">
      <li>Fremdwörtern</li>
      <li>ausländischen Namen</li>
      <li>Produktnamen</li>
      <li>Lautmalerei</li>
      <li>bestimmten Hervorhebungen</li>
    </ul>

    <p class="win-p">
      Ein bekanntes Beispiel ist:
    </p>

    <div class="example-box">
      <p class="example-jp">ホテル</p>
    </div>

    <p class="win-p">
      Das Wort bedeutet „Hotel“ und wird in Katakana geschrieben, weil es
      aus einer anderen Sprache übernommen wurde.
    </p>

    <p class="win-p">
      Katakana wirkt am Anfang oft etwas schwieriger als Hiragana, weil
      manche Zeichen sich sehr ähnlich sehen. Das ist normal. Mit
      regelmäßiger Wiederholung werden die Unterschiede nach und nach
      klarer.
    </p>

    <h3 class="win-h3">Zeichen anhören</h3>

    <p class="win-p">
      🔊 Klick auf ein Zeichen, um es dir vorlesen zu lassen.
    </p>

    <p class="win-p">
      Die Aussprache läuft über die Sprachausgabe deines Browsers. Du
      brauchst dafür keine zusätzliche App.
    </p>

    <p class="win-p">
      Falls dein Gerät keine japanische Stimme installiert hat, kannst du
      die Tabelle trotzdem ganz normal zum Lernen verwenden.
    </p>

    <p class="win-p">
      Sprich die Zeichen ruhig kurz nach. Dein Ziel ist zuerst, Laut und
      Schriftbild miteinander zu verbinden.
    </p>

    <h3 class="win-h3">Die Grundzeichen (Gojūon)</h3>

    <p class="win-p">
      Die Grundzeichen folgen denselben Lautreihen wie Hiragana.
    </p>

    <p class="win-p">
      Wenn du Hiragana schon kennst, lernst du also keine neuen Laute. Du
      lernst nur ein zweites Schriftbild dafür.
    </p>

    <p class="win-p">
      Beginne wieder mit kleinen Gruppen.
    </p>

    <p class="win-p">
      Zum Beispiel:
    </p>

    <div class="example-box">
      <p class="example-jp">ア・イ・ウ・エ・オ</p>
    </div>

    <p class="win-p">
      Danach arbeitest du dich Reihe für Reihe weiter.
    </p>

    <p class="win-p">
      Achte besonders auf ähnlich aussehende Zeichen wie:
    </p>

    <div class="example-box">
      <p class="example-jp">シ und ツ</p>
    </div>

    <div class="example-box">
      <p class="example-jp">ソ und ン</p>
    </div>

    <p class="win-p">
      Solche Paare verwirren fast alle am Anfang. Das ist kein Zeichen,
      dass du schlecht lernst. Dein Blick muss sich einfach erst an die
      kleinen Unterschiede gewöhnen.
    </p>

    ${kanaTable(KATAKANA_MAIN, 5)}

    <h3 class="win-h3">Dakuten &amp; Handakuten</h3>

    <p class="win-p">
      Genau wie bei Hiragana verändern Dakuten und Handakuten den Laut
      eines Zeichens.
    </p>

    <p class="win-p">
      Dakuten sind zwei kleine Striche:
    </p>

    <div class="example-box">
      <p class="example-jp">カ wird zu ガ</p>
    </div>

    <p class="win-p">
      Aus „ka“ wird „ga“.
    </p>

    <p class="win-p">
      Handakuten ist ein kleiner Kreis:
    </p>

    <div class="example-box">
      <p class="example-jp">ハ wird zu パ</p>
    </div>

    <p class="win-p">
      Aus „ha“ wird „pa“.
    </p>

    <p class="win-p">
      Das Muster ist also bereits bekannt. Du überträgst nur das, was du
      bei Hiragana gelernt hast, auf Katakana.
    </p>

    ${kanaTable(KATAKANA_DAKUTEN, 5)}

    <h3 class="win-h3">Yōon — Kombinationen</h3>

    <p class="win-p">
      Auch bei Katakana können Zeichen aus der i-Reihe mit kleinem
      ャ・ュ・ョ kombiniert werden.
    </p>

    <p class="win-p">
      Zum Beispiel:
    </p>

    <div class="example-box">
      <p class="example-jp">キ + ャ = キャ</p>
    </div>

    <p class="win-p">
      キャ wird zusammen als „kya“ gelesen.
    </p>

    <p class="win-p">
      Die kleinen Zeichen sind wichtig. In normaler Größe würden sie
      getrennt gelesen werden.
    </p>

    <p class="win-p">
      Sobald du das Prinzip aus Hiragana kennst, funktioniert es hier
      fast genauso.
    </p>

    ${kanaTable(KATAKANA_YOON, 3)}

    <h3 class="win-h3">Wie du diese Seite nutzen kannst</h3>

    <ol class="win-list">
      <li>Wähle eine kleine Reihe von Zeichen.</li>
      <li>Hör dir jedes Zeichen an.</li>
      <li>Sprich den Laut kurz nach.</li>
      <li>Vergleiche ähnliche Zeichen bewusst miteinander.</li>
      <li>Wiederhole die Gruppe später noch einmal.</li>
    </ol>

    <p class="win-p">
      Katakana braucht bei vielen etwas länger als Hiragana. Lass dich
      davon nicht nerven. Gerade durch Fremdwörter wirst du die Zeichen
      später immer wieder sehen.
    </p>

    <p class="win-p">
      Dein nächster Schritt: Lerne heute nur die erste Katakana-Reihe
      ア・イ・ウ・エ・オ und schau danach, welche Zeichen du ohne Hilfe
      erkennst.
    </p>

    <button class="toc-item" data-open="kanaquiz">Zeichen im Kana-Quiz testen →</button>

    <div class="win-navigation">
      <button class="toc-item" data-open="hiragana">← Zurück zu Hiragana</button>
      <button class="toc-item" data-open="kanji">Weiter zu Kanji →</button>
    </div>
  `
},
kanji: {
  title: "漢字 — Kanji",

  quest: "Kanji sehen zunächst kompliziert aus. Lerne sie zusammen mit echten Wörtern, dann werden sie Schritt für Schritt vertrauter.",

  html: `
    <span class="eyebrow win-eyebrow">Schriftsystem</span>

    <h2 class="win-h2">Kanji</h2>

    <p class="win-p">
      Kanji sehen am Anfang oft aus wie eine endlose Wand aus Strichen.
      Fast alle Lernenden fühlen sich davon zuerst erschlagen. Die gute
      Nachricht: Du lernst diese Wand nicht auf einmal, sondern Wort für
      Wort.
    </p>

    <p class="win-p">
      Kanji sind Schriftzeichen, die ursprünglich aus dem Chinesischen
      übernommen wurden. Anders als Hiragana und Katakana stehen sie nicht
      nur für Laute, sondern tragen meistens auch eine Bedeutung.
    </p>

    <ul class="win-list">
      <li><strong>山</strong> = Berg</li>
      <li><strong>水</strong> = Wasser</li>
      <li><strong>人</strong> = Mensch</li>
      <li><strong>日</strong> = Sonne oder Tag</li>
    </ul>

    <p class="win-p">
      Kanji wirken am Anfang oft einschüchternd, weil es sehr viele gibt
      und ein Zeichen mehrere Lesungen haben kann. Du musst sie aber nicht
      alle auf einmal lernen.
    </p>

    <h3 class="win-h3">Lerne Kanji zusammen mit Wörtern</h3>

    <p class="win-p">
      Für Anfänger:innen ist es meist sinnvoller, Kanji über echte Wörter
      zu lernen, statt jedes Zeichen isoliert mit allen möglichen Lesungen
      auswendig zu lernen.
    </p>

    <ul class="win-list">
      <li><strong>食べる</strong> = essen</li>
      <li><strong>飲む</strong> = trinken</li>
      <li><strong>日本</strong> = Japan</li>
    </ul>

    <p class="win-p">
      So lernst du direkt, wie ein Kanji in einem echten Wort verwendet
      und ausgesprochen wird.
    </p>

    <h3 class="win-h3">Warum haben Kanji mehrere Lesungen?</h3>

    <p class="win-p">
      Viele Kanji besitzen unterschiedliche Aussprachen, weil sie je nach
      Wort anders gelesen werden.
    </p>

    <p class="win-p">
      Das Kanji <strong>日</strong> kann zum Beispiel in verschiedenen
      Wörtern unterschiedlich gelesen werden:
    </p>

    <ul class="win-list">
      <li><strong>日（ひ）</strong> = Tag oder Sonne</li>
      <li><strong>日本（にほん）</strong> = Japan</li>
      <li><strong>毎日（まいにち）</strong> = jeden Tag</li>
    </ul>

    <p class="win-p">
      Du musst diese Lesungen nicht als lange Liste auswendig lernen.
      Lerne sie nach und nach mit den Wörtern, in denen sie vorkommen.
    </p>

    <h3 class="win-h3">Was sind Radikale?</h3>

    <p class="win-p">
      Radikale sind kleinere Bestandteile, aus denen Kanji aufgebaut sind.
      Sie können dir helfen, ähnliche Zeichen auseinanderzuhalten und neue
      Kanji leichter wiederzuerkennen.
    </p>

    <p class="win-p">
      Viele Kanji mit einem Bezug zu Wasser enthalten zum Beispiel das
      Element <strong>氵</strong>:
    </p>

    <ul class="win-list">
      <li><strong>海</strong> = Meer</li>
      <li><strong>洗</strong> = waschen</li>
      <li><strong>酒</strong> = Alkohol</li>
    </ul>

    <p class="win-p">
      Du musst am Anfang nicht alle Radikale auswendig lernen.
      Nutze sie zunächst nur als Orientierungshilfe.
    </p>

    <h3 class="win-h3">Ähnliche Kanji unterscheiden</h3>

    <p class="win-p">
      Manche Kanji unterscheiden sich nur durch einen einzigen Strich oder
      ein kleines Detail. Gerade am Anfang führt das leicht zu Verwechslungen.
    </p>

    <ul class="win-list">
      <li><strong>未</strong> (noch nicht) vs. <strong>末</strong> (Ende) — der obere Strich ist unterschiedlich lang</li>
      <li><strong>人</strong> (Mensch) vs. <strong>入</strong> (hinein) — die Striche kreuzen sich unterschiedlich</li>
      <li><strong>大</strong> (groß) vs. <strong>犬</strong> (Hund) — nur ein zusätzlicher Punkt</li>
      <li><strong>土</strong> (Erde) vs. <strong>士</strong> (Krieger/Fachmann) — die Strichlängen sind vertauscht</li>
    </ul>

    <p class="win-p">
      Radikale helfen dir dabei, solche Zeichen bewusster zu betrachten,
      statt sie nur oberflächlich als „ähnlich aussehende Form“ abzuspeichern.
      Beim Lesen in echten Wörtern fällt der Unterschied mit der Zeit fast
      automatisch auf, weil der Kontext meist eindeutig macht, welches
      Zeichen gemeint ist.
    </p>

    <h3 class="win-h3">Musst du Kanji schreiben können?</h3>

    <p class="win-p">
      Für Anime, Manga, Spiele und allgemeines Lesen ist das Erkennen
      wichtiger als perfektes Schreiben aus dem Gedächtnis.
    </p>

    <p class="win-p">
      Handschrift kann trotzdem hilfreich sein, wenn du dir Zeichen dadurch
      besser merkst, später in Japan handschriftlich schreiben möchtest oder
      einfach Spaß daran hast.
    </p>

    <p class="win-p">
      Für den Einstieg reicht es, Kanji zuverlässig zu erkennen und sie
      innerhalb von Wörtern lesen zu können.
    </p>

    <h3 class="win-h3">Wie solltest du Kanji lernen?</h3>

    <ol class="win-list">
      <li>Lerne zuerst Hiragana und Katakana.</li>
      <li>Beginne mit häufigen japanischen Wörtern.</li>
      <li>Achte darauf, welche Kanji in diesen Wörtern vorkommen.</li>
      <li>Wiederhole die Wörter regelmäßig mit einem SRS wie Anki.</li>
      <li>Begegne den Kanji beim Lesen und in deiner Immersion erneut.</li>
    </ol>

    <p class="win-p">
      Du brauchst nicht warten, bis du Hunderte Kanji kennst, bevor du mit
      echten Inhalten beginnst. Durch wiederholte Begegnungen werden die
      Zeichen mit der Zeit vertrauter.
    </p>

    <h3 class="win-h3">RTK und WaniKani einordnen</h3>

    <p class="win-p">
      Zwei Namen begegnen dir beim Thema Kanji besonders häufig:
      <strong>Remembering the Kanji</strong> (RTK) und <strong>WaniKani</strong>.
      Beide gehen einen anderen Weg als das oben beschriebene Vorgehen über
      Wörter.
    </p>

    <ul class="win-list">
      <li>
        <strong>RTK</strong> lehrt Kanji isoliert über selbst erdachte
        Eselsbrücken zu Bedeutung und Aufbau — bewusst ohne Lesungen. Erst
        danach lernst du, wie die Zeichen in echten Wörtern ausgesprochen
        werden.
      </li>
      <li>
        <strong>WaniKani</strong> ist ein webbasiertes SRS, das Radikale,
        Kanji und Vokabeln in aufeinander aufbauenden Stufen kombiniert und
        dabei sowohl Bedeutung als auch Lesung direkt mitliefert.
      </li>
    </ul>

    <p class="win-p">
      Beide Systeme können funktionieren, sind aber ein zusätzliches,
      eigenständiges Lernprojekt neben Vokabeln und Immersion — nicht
      automatisch der bessere Weg. Für die meisten Anfänger:innen reicht
      es völlig, Kanji direkt über häufige Wörter zu lernen. RTK oder
      WaniKani lohnen sich vor allem, wenn dir das reine Erkennen von
      Formen leichter fällt als das Lernen über Wörter, oder wenn du
      gezielt eine breite Kanji-Basis vor viel Wortschatzarbeit aufbauen
      möchtest.
    </p>

    <h3 class="win-h3">Was solltest du vermeiden?</h3>

    <p class="win-p">
      Versuche nicht, direkt alle Lesungen eines einzelnen Kanji zu lernen.
      Das erzeugt viel Arbeit, ohne dass du diese Informationen sicher
      anwenden kannst.
    </p>

    <p class="win-p">
      Vermeide außerdem den Gedanken:
    </p>

    <blockquote class="win-quote">
      Erst muss ich alle Kanji können, dann darf ich lesen.
    </blockquote>

    <p class="win-p">
      Gerade durch das Lesen lernst du, Kanji schneller zu erkennen und
      besser zu verstehen.
    </p>

    <h3 class="win-h3">Ein sinnvoller Anfang</h3>

    <p class="win-p">
      Starte mit einem häufigkeitsbasierten Anfänger-Vokabeldeck (siehe
      <button class="inline-link" data-open="wortschatz">Wortschatz-Bereich</button>)
      oder mit Wörtern aus deinem aktuellen Lernmaterial. Dadurch lernst du
      automatisch viele häufige Kanji in einem verständlichen Zusammenhang.
    </p>

    <p class="win-p">
      Dein Ziel ist zunächst nicht, jedes Zeichen vollständig zu beherrschen.
      Es reicht, wenn du wichtige Wörter erkennst und Stück für Stück ein
      Gefühl für die Schrift entwickelst.
    </p>

    <p class="win-p">
      <strong>
        Kanji sind kein einzelner Lernblock, den du irgendwann vollständig
        abschließt. Sie begleiten dich während deines gesamten Lernwegs und
        werden mit jeder Begegnung ein kleines Stück vertrauter.
      </strong>
    </p>

    <p class="win-p">
      Wenn du bis hier gelesen hast, kennst du bereits den wichtigsten
      Gedanken: Kanji werden nicht als gigantischer Block bezwungen. Dein
      nächster Schritt ist ein einziges häufiges Wort mit Kanji.
    </p>

    <div class="win-navigation">
      <button class="toc-item" data-open="kana">
        ← Zurück zu Kana
      </button>

      <button class="toc-item" data-open="grammatik">
        Weiter zu Grammatik →
      </button>
    </div>
  `
},


grammatik: {
  title: "文法 — Grammatik",
  quest: "Grammatik ist kein Regelmonster. Nutze sie als Landkarte, damit echte japanische Sätze nach und nach Sinn ergeben.",
  src: "pages/grammatik.html",
},
satzstruktur: {
  title: "文の構造 — Satzstruktur",
  quest: "Im Japanischen steht das Verb am Ende. Alles davor darfst du relativ frei anordnen, solange die Partikel stimmen.",
  src: "pages/grammatik-satzstruktur.html",
},
verbformen: {
  title: "動詞の形 — Verbformen",
  quest: "Drei Verbgruppen, ein System. Sobald du sie erkennst, folgen die Formen fast von selbst.",
  src: "pages/grammatik-verbformen.html",
},
haga: {
  title: "は・が",
  quest: "は für das Thema, が für neue Information. Klingt knifflig, wird aber mit jedem Beispiel klarer.",
  src: "pages/grammatik-haga.html",
},
wo: {
  title: "を",
  quest: "Was gegessen, gelesen oder gekauft wird, bekommt ein を. Kurz, aber unverzichtbar.",
  src: "pages/grammatik-wo.html",
},
nide: {
  title: "に・で",
  quest: "に für Existenz und Zeit, で für Handlungsorte und Mittel. Zwei kleine Partikel mit großem Unterschied.",
  src: "pages/grammatik-nide.html",
},
teform: {
  title: "て形 — die て-Form",
  quest: "Die て-Form verbindet Handlungen, Bitten und laufende Aktionen — ein zentraler Baustein für vieles danach.",
  src: "pages/grammatik-teform.html",
},

  wortschatz: {
  title: "単語 — Wortschatz",

  quest: "Neue Wörter sind kleine Puzzleteile. Sammle zuerst die, die dir häufig begegnen, statt wahllos jedes unbekannte Wort mitzunehmen.",
  src: "pages/wortschatz.html",
},

aussprache: {
  title: "発音 — Aussprache",
  quest: "Mora, lange Vokale und Pitch Accent — kleine Details, die großen Einfluss darauf haben, wie gut du verstanden wirst.",
  src: "pages/aussprache.html",
},

hoeren: {
  title: "聴解 — Hörverstehen",

  quest: "Ohren auf! Du musst noch nicht alles verstehen. Sammle zuerst bekannte Wörter und lass aus dem Geräusch langsam Sprache werden.",

  html: `
    <span class="eyebrow win-eyebrow">Übung</span>

    <h2 class="win-h2">Hörverstehen</h2>

    <p class="win-p">
      Hörverstehen gehört zu den Fähigkeiten, die sich nur langsam aufbauen.
      Am Anfang klingt Japanisch oft wie ein einziger schneller Wortstrom.
      Das ist völlig normal und bedeutet nicht, dass du schlecht lernst.
    </p>

    <p class="win-p">
      Am Anfang klingt gesprochenes Japanisch oft wie ein einziger
      schneller Strom ohne sichtbare Wortgrenzen. Das ist kein Beweis,
      dass dein Hörverstehen schlecht ist. Dein Gehirn lernt gerade erst,
      im Rauschen kleine bekannte Inseln zu finden.
    </p>

    <p class="win-p">
      Dein Gehirn muss erst lernen, einzelne Wörter, Satzenden und bekannte
      Strukturen aus dem Gesprochenen herauszufiltern.
    </p>

    <h3 class="win-h3">Höre von Anfang an echtes Japanisch</h3>

    <p class="win-p">
      Du brauchst nicht warten, bis du viele Vokabeln und Grammatikpunkte kennst.
      Beginne früh mit Inhalten, die du gerne hörst:
    </p>

    <ul class="win-list">
      <li>Anime und Serien</li>
      <li>Podcasts</li>
      <li>YouTube-Videos</li>
      <li>Livestreams</li>
      <li>Spiele und Visual Novels</li>
      <li>Hörbücher und Dialoge</li>
    </ul>

    <p class="win-p">
      Am Anfang wirst du nur einzelne Wörter erkennen.
      Mit der Zeit werden daraus Satzteile und später ganze Aussagen.
    </p>

    <h3 class="win-h3">Verstehen muss nicht vollständig sein</h3>

    <p class="win-p">
      Hörpraxis funktioniert auch, wenn längst nicht jedes Wort ankommt.
    </p>

    <p class="win-p">
      Achte zunächst auf:
    </p>

    <ul class="win-list">
      <li>bekannte Wörter</li>
      <li>wiederkehrende Satzenden</li>
      <li>Namen und Situationen</li>
      <li>Tonfall und Emotionen</li>
      <li>den groben Zusammenhang</li>
    </ul>

    <p class="win-p">
      Wenn du ungefähr weißt, was gerade passiert, kann dein Gehirn neue
      Sprache leichter einordnen.
    </p>

    <h3 class="win-h3">Aktives und passives Hören</h3>

    <p class="win-p">
      Beide Formen sind nützlich, erfüllen aber unterschiedliche Aufgaben.
    </p>

    <h3 class="win-h3">Aktives Hören</h3>

    <p class="win-p">
      Beim aktiven Hören konzentrierst du dich bewusst auf das Gesprochene.
    </p>

    <ul class="win-list">
      <li>kurze Stellen wiederholen</li>
      <li>japanische Untertitel mitlesen</li>
      <li>unbekannte Wörter nachschlagen</li>
      <li>einzelne Sätze mehrmals anhören</li>
      <li>auf Aussprache und Satzstruktur achten</li>
    </ul>

    <p class="win-p">
      Aktives Hören ist anstrengender, bringt dir aber besonders viel.
    </p>

    <h3 class="win-h3">Passives Hören</h3>

    <p class="win-p">
      Beim passiven Hören läuft Japanisch nebenbei, etwa beim Aufräumen,
      Kochen oder Einschlafen.
    </p>

    <p class="win-p">
      Das kann dir helfen, dich an Klang, Rhythmus und Aussprache zu gewöhnen.
      Es ersetzt jedoch kein konzentriertes Lernen.
    </p>

    <p class="win-p">
      Nutze passives Hören als Ergänzung und nicht als einzige Form der Immersion.
    </p>

    <h3 class="win-h3">Japanische Untertitel verwenden</h3>

    <p class="win-p">
      Japanische Untertitel können den Einstieg deutlich erleichtern.
      Sie helfen dir dabei, gehörte Wörter mit ihrer Schreibweise zu verbinden.
    </p>

    <ol class="win-list">
      <li>Eine Szene ohne Untertitel ansehen</li>
      <li>Die Szene mit japanischen Untertiteln wiederholen</li>
      <li>Wichtige Wörter nachschlagen</li>
      <li>Die Szene erneut anhören</li>
    </ol>

    <p class="win-p">
      Deutsche Untertitel helfen dir zwar, der Handlung zu folgen,
      aber oft liest du dann nur Deutsch und hörst dem Japanischen
      kaum noch bewusst zu.
    </p>

    <h3 class="win-h3">Geeignete Inhalte auswählen</h3>

    <p class="win-p">
      Für Anfänger:innen eignen sich Inhalte mit:
    </p>

    <ul class="win-list">
      <li>klarer Aussprache</li>
      <li>bekannten Alltagssituationen</li>
      <li>vielen visuellen Hinweisen</li>
      <li>kurzen Folgen oder Videos</li>
      <li>Themen, die dich wirklich interessieren</li>
    </ul>

    <p class="win-p">
      Kinderserien sind nicht automatisch leichter. Manche verwenden
      ungewöhnliche Stimmen, Wortspiele oder sehr kindliche Sprache.
    </p>

    <p class="win-p">
      Wichtiger als das angeblich perfekte Lernmaterial ist,
      dass du regelmäßig dranbleibst.
    </p>

    <h3 class="win-h3">Podcasts für Anfänger:innen</h3>

    <p class="win-p">
      Lernpodcasts sprechen oft langsamer und verwenden einfachere Sprache
      als normale Gespräche.
    </p>

    <p class="win-p">
      Gut geeignet sind Formate mit:
    </p>

    <ul class="win-list">
      <li>kurzen Episoden</li>
      <li>klarer Aussprache</li>
      <li>einfachen Alltagsthemen</li>
      <li>Transkripten oder Untertiteln</li>
      <li>wiederkehrendem Wortschatz</li>
    </ul>

    <p class="win-p">
      Später kannst du zusätzlich normale japanische Podcasts und Videos hören.
    </p>

    <h3 class="win-h3">Wiederholtes Hören</h3>

    <p class="win-p">
      Eine Folge oder einen kurzen Abschnitt mehrmals anzuhören ist oft
      hilfreicher als ständig neues Material zu konsumieren.
    </p>

    <p class="win-p">
      Beim ersten Hören erkennst du vielleicht nur das Thema.
      Beim zweiten Mal fallen dir bekannte Wörter auf.
      Beim dritten Mal verstehst du möglicherweise bereits einzelne Satzstrukturen.
    </p>

    <p class="win-p">
      Du brauchst aber nicht jede Folge zehnmal analysieren.
      Wiederhole vor allem Inhalte, die dir gefallen oder bei denen du merkst,
      dass du fast etwas verstehst.
    </p>

    <h3 class="win-h3">Shadowing und Condensed Audio</h3>

    <p class="win-p">
      Zwei Techniken helfen dir, dein Hörtraining gezielter zu machen:
    </p>

    <p class="win-p">
      Beim <strong>Shadowing</strong> sprichst du einen kurzen Audioclip so
      gleichzeitig oder unmittelbar danach mit, dass du Rhythmus und
      Betonung möglichst genau nachahmst. Das trainiert Hören und
      Aussprache gleichzeitig — die genaue Vorgehensweise steht im
      <button class="inline-link" data-open="aussprache">Aussprache-Bereich</button>.
    </p>

    <p class="win-p">
      <strong>Condensed Audio</strong> ist eine gekürzte Fassung einer
      Folge oder eines Hörbuchs, bei der stille oder dialogfreie Abschnitte
      automatisiert herausgeschnitten wurden. Dadurch hörst du auf
      derselben Zeit deutlich mehr echten Dialog — praktisch für passives
      Hören nebenbei, etwa beim Pendeln oder Aufräumen.
    </p>

    <h3 class="win-h3">Was tun, wenn du fast nichts verstehst?</h3>

    <p class="win-p">
      Wenn du nur sehr wenig verstehst, kannst du:
    </p>

    <ul class="win-list">
      <li>leichteres Material wählen</li>
      <li>kürzere Abschnitte verwenden</li>
      <li>japanische Untertitel einschalten</li>
      <li>vorher eine Zusammenfassung lesen</li>
      <li>bekannte Folgen erneut ansehen</li>
      <li>wichtige Wörter vorher lernen</li>
    </ul>

    <p class="win-p">
      Nicht jedes unbekannte Wort braucht einen Klick ins Wörterbuch.
      Konzentriere dich auf Wörter, die mehrfach vorkommen oder für das
      Verständnis wichtig sind.
    </p>

    <h3 class="win-h3">Ein einfacher Hörplan</h3>

    <p class="win-p">
      Für den Anfang könntest du täglich ungefähr 15 bis 30 Minuten hören:
    </p>

    <ul class="win-list">
      <li>5 bis 10 Minuten konzentriertes Hören</li>
      <li>10 bis 20 Minuten entspanntes Schauen oder Hören</li>
      <li>optional passives Hören nebenbei</li>
    </ul>

    <p class="win-p">
      Regelmäßigkeit ist wichtiger als eine einzelne lange Sitzung pro Woche.
    </p>

    <p class="win-p">
      <strong>
        Hörverstehen wächst oft unbemerkt. Lange scheint kaum etwas zu passieren,
        bis du plötzlich einen Satz verstehst, ohne ihn im Kopf übersetzen zu müssen.
      </strong>
    </p>

    <h3 class="win-h3">Passende Ressourcen</h3>

    <p class="win-p">
      Im Ressourcenbereich findest du empfohlene Podcasts, Anime,
      YouTube-Kanäle, Untertitel-Tools und weitere Materialien für dein Hörverstehen.
    </p>

    <p class="win-p">
      Dort kannst du gezielt nach Inhalten suchen, die zu deinem aktuellen
      Niveau und deinen Interessen passen.
    </p>

    <button class="toc-item" data-open="ressourcen" data-resource-target="res-hoeren">
      Hörverstehen-Ressourcen öffnen →
    </button>

    <p class="win-p">
      Hörfortschritt wächst oft leise. Wähle heute einen kurzen Clip, höre
      ihn einmal ohne und einmal mit japanischen Untertiteln und achte nur
      auf ein bekanntes Wort.
    </p>

    <div class="win-navigation">
      <button class="toc-item" data-open="aussprache">
        ← Zurück zur Aussprache
      </button>

      <button class="toc-item" data-open="immersion">
        Weiter zur Immersion →
      </button>
    </div>
  `
},
immersion: {
  title: "Immersion",
  quest: "Immersion ist kein Zaubertrick — regelmäßiger, echter Kontakt mit Japanisch bringt dich weiter als jede einzelne perfekte Session.",
  src: "pages/immersion.html",
},
lesen: {
  title: "Lesen",
  quest: "Vom ersten Graded Reader bis zur Light Novel — Lesen bringt dir Kanji, Grammatik und Wortschatz gleichzeitig näher.",
  src: "pages/lesen.html",
},
anki: {
  title: "Anki &amp; SRS",
  quest: "Ein SRS zeigt dir Karten genau dann, wenn du sie sonst vergessen würdest. Bewerte ehrlich — nicht bequem.",
  src: "pages/anki.html",
},
yomitan: {
  title: "Yomitan",
  quest: "Ein Klick, eine Bedeutung. Yomitan macht jeden japanischen Text zu einem Nachschlagewerk.",
  src: "pages/yomitan.html",
},
mining: {
  title: "Mining",
  quest: "Aus echten Sätzen eigene Karten bauen — der Übergang von fertigen Decks zu deinem eigenen Wortschatz.",
  src: "pages/mining.html",
},
tools: {
  title: "Tools-Bibliothek",
  quest: "Nicht jedes Tool ist für dich. Schau nach, welches Problem du gerade wirklich hast, bevor du etwas Neues installierst.",
  src: "pages/tools.html",
},
"tool-asbplayer": {
  title: "asbplayer",
  quest: "Untertitelzeile anklicken, Karte fertig — asbplayer nimmt dir beim Streaming-Mining viel Handarbeit ab.",
  src: "pages/tool-asbplayer.html",
},
"tool-mpvacious": {
  title: "mpvacious",
  quest: "Dasselbe Prinzip wie asbplayer, nur für lokale Videos im Player mpv.",
  src: "pages/tool-mpvacious.html",
},
"tool-textractor": {
  title: "Textractor",
  quest: "Kein kopierbarer Text im Spiel? Textractor liest ihn trotzdem direkt aus dem Arbeitsspeicher aus.",
  src: "pages/tool-textractor.html",
},
"tool-mokuro": {
  title: "Mokuro",
  quest: "Macht gescannte Manga-Seiten nachträglich durchsuch- und anklickbar.",
  src: "pages/tool-mokuro.html",
},
"tool-jidoujisho": {
  title: "jidoujisho",
  quest: "Mining unterwegs: Player, Wörterbuch und Kartenerstellung in einer Android-App.",
  src: "pages/tool-jidoujisho.html",
},
"tool-jpdb": {
  title: "jpdb",
  quest: "Wörterbuch, Medien-Decks und ein eigenes SRS an einem Ort — praktisch, wenn du kein eigenes Setup willst.",
  src: "pages/tool-jpdb.html",
},
"tool-bunpro": {
  title: "Bunpro",
  quest: "Grammatik mit eingebauter Wiederholung statt nur Erklärung.",
  src: "pages/tool-bunpro.html",
},
"tool-natively": {
  title: "Natively",
  quest: "Bevor du ein Buch anfängst: Community-Bewertungen zeigen dir, ob es zu deinem Niveau passt.",
  src: "pages/tool-natively.html",
},
glossar: {
  title: "Glossar",
  quest: "Mining, i+1, FSRS, Shadowing — Fachbegriffe kurz und auf Deutsch erklärt.",
  src: "pages/glossar.html",
},
fehlerhilfe: {
  title: "Fehlerdatenbank",
  quest: "Technische Probleme gehören dazu. Hier findest du Lösungen für die häufigsten Stolpersteine.",
  src: "pages/fehlerhilfe.html",
},
lernwege: {
  title: "Lernwege",
  quest: "Anime, Manga, Visual Novels oder JLPT — je nach Ziel lohnen sich andere Schwerpunkte.",
  src: "pages/lernwege.html",
},
entscheidungsbaum: {
  title: "Was brauche ich jetzt?",
  quest: "Beantworte ein paar kurze Fragen, dann zeige ich dir einen passenden nächsten Schritt.",
  src: "pages/entscheidungsbaum.html",
},
  kultur: {
    title: "文化 — Kultur",
    quest: "Sprache und Kultur gehören zusammen — hier lernst du den Kontext.",
    src: "pages/kultur.html",
  },
jlpt: {
  title: "試験 — JLPT",

  quest: "Bereit für den Bosskampf? Der JLPT kann dir ein klares Ziel geben, ist aber nicht der einzige Maßstab für echtes Japanisch.",
  src: "pages/jlpt.html",
},
  ressourcen: {
  title:"リソース — Ressourcen",
  quest:"Hier liegt deine Ausrüstung. Wähle nur die Werkzeuge, die zu deinem aktuellen Lernschritt passen.",
  src: "pages/ressourcen.html",
},
    faq: { title:"よくある質問", quest:"Fragen über Fragen — hier gibt's hoffentlich die passenden Antworten.", html:`
    <span class="eyebrow win-eyebrow">Fragen</span>
    <h2 class="win-h2">FAQ</h2>

    <p class="win-p">
      Manche Fragen tauchen fast bei allen am Anfang auf. Hier findest du
      ehrliche Antworten, ohne dass du dich erst durch zwanzig
      widersprüchliche Forenbeiträge graben musst.
    </p>

    <details class="faq-item" open>
      <summary>Ist Japanisch mit Koyuki wirklich komplett kostenlos?</summary>
      <p>
        Ja. Keine Paywall, kein Kursverkauf, keine versteckten
        Premium-Inhalte. Manche verlinkten externen Tools (z. B. Bunpro)
        sind selbst kostenpflichtig — das steht dann aber immer klar dabei.
      </p>
    </details>

    <details class="faq-item">
      <summary>Brauche ich Vorkenntnisse, um hier anzufangen?</summary>
      <p>
        Nein. Der Anfänger-Guide setzt bei null an. Kannst du schon Kana
        oder sogar Grammatik, kannst du direkt zu den passenden Bereichen
        springen.
      </p>
    </details>

    <details class="faq-item">
      <summary>Muss ich erst alle Kanji können, bevor ich mit echten Inhalten anfange?</summary>
      <p>
        Nein — im Gegenteil. Gerade durch Lesen, Hören und Immersion lernst
        du Kanji und Wortschatz schneller wiederzuerkennen. Warte nicht,
        bis du dich „bereit“ fühlst.
      </p>
    </details>

    <details class="faq-item">
      <summary>Muss ich den JLPT machen?</summary>
      <p>
        Nein. Du kannst erfolgreich Japanisch lernen, ohne je eine
        JLPT-Prüfung abzulegen. Er kann aber ein hilfreiches Ziel sein,
        wenn dir klare Meilensteine oder ein offizieller Nachweis wichtig
        sind.
      </p>
    </details>

    <details class="faq-item">
      <summary>In welcher Reihenfolge sollte ich die Bereiche durcharbeiten?</summary>
      <p>
        Als groben roten Faden empfiehlt sich Kana → erster Wortschatz →
        Grammatik-Grundlagen → früh mit Immersion beginnen → später Mining.
        Der Anfänger-Guide führt dich Schritt für Schritt durch genau
        diesen Weg. Bist du unsicher, was <em>speziell für dich</em> als
        Nächstes sinnvoll ist, hilft der
        <button class="inline-link" data-open="entscheidungsbaum">Entscheidungsbaum</button>
        oder einer der
        <button class="inline-link" data-open="lernwege">geführten Lernwege</button>.
      </p>
    </details>

    <details class="faq-item">
      <summary>Ich verstehe einen Fachbegriff nicht oder habe ein technisches Problem</summary>
      <p>
        Für Fachbegriffe (Mining, i+1, FSRS, Shadowing …) gibt es das
        <button class="inline-link" data-open="glossar">Glossar</button>,
        für technische Probleme (Anki-Sync, Yomitan, Untertitel …) die
        <button class="inline-link" data-open="fehlerhilfe">Fehlerdatenbank</button>.
      </p>
    </details>

    <details class="faq-item">
      <summary>Wird die Seite noch weiter ausgebaut?</summary>
      <p>
        Ja. Die geplante Kerninhalts-Bibliothek (Grammatik, Mining,
        Yomitan, Tools, Glossar, Lernwege) ist inzwischen fertig — Politur,
        weitere Feinheiten und neue Inhalte kommen aber laufend dazu.
      </p>
    </details>

    <details class="faq-item">
      <summary>Ich habe einen Fehler gefunden oder eine Idee für neue Inhalte — was tue ich?</summary>
      <p>
        Immer gerne melden! Schreib mir per E-Mail oder auf Discord — beides
        findest du im Kontakt-Bereich.
      </p>
    </details>

    <p class="win-p">
      Ist deine Frage noch offen, ist das kein Problem. Die passende
      Themenseite geht meist tiefer und zeigt dir den nächsten
      praktischen Schritt.
    </p>

    <div class="win-navigation">
      <button class="toc-item" data-open="kontakt">Kontakt öffnen →</button>
    </div>
  `},
  kontakt: { title:"コンタクト", quest:"Du hast eine Frage an mich persönlich? Nur zu!", html:`
    <span class="eyebrow win-eyebrow">Kontakt</span>
    <h2 class="win-h2">Schreib mir</h2>
    <p class="win-p">
      Danke, dass du beim Verbessern mithilfst. Hinter jeder guten
      Lernseite stehen viele kleine Hinweise von Menschen, die sie
      wirklich benutzen.
    </p>
    <p class="win-p">
      Hast du einen Fehler gefunden, fehlt dir eine Erklärung oder hängt
      ein Teil der Seite? Solches Feedback hilft dabei, das
      Japanischzimmer Stück für Stück besser zu machen.
    </p>
    <p class="win-p">
      Japanisch mit Koyuki wird von einer einzelnen Person gebaut und
      gepflegt — Fehler und Lücken passieren also garantiert. Wenn dir
      etwas kaputt vorkommt, unklar erklärt ist oder einfach fehlt, sag
      mir gerne Bescheid.
    </p>
    <p class="win-p">
      Genauso willkommen sind Themenwünsche, Ressourcen-Tipps, die anderen
      Lernenden helfen könnten, oder einfach eine Nachricht, wenn dir
      Japanisch mit Koyuki bei deinem Lernweg geholfen hat. Für schnellen
      Austausch eignet sich Discord am besten, für längere Nachrichten
      oder persönliche Anliegen die E-Mail.
    </p>
    <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:12px;">
      <a class="btn btn-primary" href="mailto:hallo.koyuki@proton.me">✉ E-Mail schreiben</a>
      <a class="btn btn-discord" href="https://discord.gg/XhAEFS4RFV" target="_blank" rel="noopener">
        <img src="assets/icons/discord.svg" width="18" height="18" alt="">
        Discord
      </a>
    </div>
  `}
};
const homeQuest = "Hallo! Ich bin Sora — klick auf eine Kachel, um deine Reise zu beginnen! Oben links findest du außerdem das Inhaltsverzeichnis mit allen Bereichen.";



/* ===================== Wegweiser-Begleiter ===================== */
const wegweiser = document.getElementById('wegweiser');
const wegweiserText = document.getElementById('wegweiserText');

function updateWegweiser(){
  wegweiserText.textContent = activeId === 'home' ? homeQuest : (panels[activeId] ? panels[activeId].quest : homeQuest);
  positionWegweiser();
}

/* Einmaliger Hinweis zur Fenster-Bedienung (Ziehen/Größe ändern) beim
   allerersten geöffneten Fenster — danach nie wieder, per localStorage. */
const WINDOW_HINT_KEY = 'japanischzimmer-window-hint-seen-v1';
const WINDOW_HINT_TEXT = "Kleiner Tipp: Du kannst dieses Fenster an der Titelleiste verschieben und unten rechts in der Größe verändern.";

function maybeShowWindowHint(){
  if(localStorage.getItem(WINDOW_HINT_KEY)) return;
  localStorage.setItem(WINDOW_HINT_KEY, '1');
  wegweiserText.textContent = WINDOW_HINT_TEXT;
  setTimeout(updateWegweiser, 7000);
}

function positionWegweiser(){
  const rect = activeEl.getBoundingClientRect();
  const compW = wegweiser.offsetWidth || 170;
  const compH = wegweiser.offsetHeight || 220;

  if(window.innerWidth < 760){
    wegweiser.classList.add('mobile-dock');
    return;
  }
  wegweiser.classList.remove('mobile-dock');

  let x, y;
  if(rect.right + compW + 28 < window.innerWidth){
    x = rect.right + 22;
    y = rect.top + rect.height/2 - compH/2;
  } else if(rect.left - compW - 28 > 0){
    x = rect.left - compW - 22;
    y = rect.top + rect.height/2 - compH/2;
  } else {
    x = window.innerWidth/2 - compW/2;
    y = Math.max(rect.top - compH - 14, 14);
  }
  y = Math.min(Math.max(y, 14), window.innerHeight - compH - 14);
  wegweiser.style.left = x + 'px';
  wegweiser.style.top = y + 'px';
}

window.addEventListener('resize', positionWegweiser);

/* ===================== Sonstige Steuerung ===================== */
document.getElementById('modeToggle').addEventListener('click', () => document.body.classList.toggle('light'));

/* initial */
updateWegweiser();

/* Schriftarten und das Fuchs-Bild laden asynchron nach — die erste
   Positionierung kann dadurch noch mit falschen Maßen rechnen (z. B.
   Fallback-Font-Metriken). Nach dem Nachladen einmal neu positionieren,
   damit der Wegweiser nicht versehentlich eine Kachel überlappt. */
if(document.fonts && document.fonts.ready){
  document.fonts.ready.then(positionWegweiser);
}
const wegweiserFox = wegweiser.querySelector('.fox-wrap');
if(wegweiserFox && !wegweiserFox.complete){
  wegweiserFox.addEventListener('load', positionWegweiser, { once: true });
}
window.addEventListener('load', positionWegweiser);
