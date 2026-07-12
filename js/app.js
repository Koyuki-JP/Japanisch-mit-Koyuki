/* ============================================================
   js/app.js — Kern der App: Kana-Tabellen-Helfer, alle
   Panel-Definitionen (Titel/Quest/Inhalt bzw. Pfad zur
   ausgelagerten Seite), der Wegweiser-Begleiter (Yuki) und die
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
    return `<div class="kana-cell"><span class="char">${c[0]}</span><span class="romaji">${c[1]}</span></div>`;
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
      Dann bist du hier richtig.
    </p>

    <p class="win-p">
      Japanischlernen wirkt am Anfang oft chaotisch. Hiragana, Katakana, Kanji,
      Grammatik, Vokabeln, Anki, Immersion und plötzlich reden alle über Mining.
      Du musst aber nicht alles gleichzeitig lernen.
    </p>

    <p class="win-p">
      Der wichtigste erste Schritt ist, dir eine stabile Grundlage aufzubauen.
      Dieser Guide zeigt dir eine sinnvolle Reihenfolge und erklärt, was du am
      Anfang wirklich brauchst.
    </p>

    <h3 class="win-h3">1. Lerne Hiragana und Katakana</h3>

    <p class="win-p">
      Hiragana und Katakana sind die beiden grundlegenden japanischen
      Silbenschriften. Ohne sie bist du dauerhaft auf Umschriften wie
      „konnichiwa“ angewiesen, die dich später eher bremsen.
    </p>

    <p class="win-p">
      Du musst die Zeichen am Anfang nicht perfekt aus dem Gedächtnis schreiben
      können. Es reicht zunächst, wenn du sie zuverlässig erkennst und lesen kannst.
      Lerne zuerst Hiragana und danach Katakana.
    </p>

    <h3 class="win-h3">2. Baue einen ersten Wortschatz auf</h3>

    <p class="win-p">
      Sobald du die Kana einigermaßen lesen kannst, kannst du mit häufigen
      japanischen Wörtern beginnen. Ein gutes Anfänger-Deck mit ungefähr
      1.000 bis 1.500 häufigen Wörtern erleichtert dir den Einstieg in echte
      japanische Inhalte.
    </p>

    <p class="win-p">
      Wichtiger als möglichst viele neue Karten ist, dass du regelmäßig lernst
      und deine täglichen Wiederholungen überschaubar bleiben.
    </p>

    <h3 class="win-h3">3. Lerne grundlegende Grammatik</h3>

    <p class="win-p">
      Japanische Grammatik funktioniert anders als deutsche Grammatik.
      Du musst aber nicht sofort jede Regel auswendig lernen.
    </p>

    <p class="win-p">
      Dein erstes Ziel ist es, einfache Satzstrukturen, Partikel und
      Verbformen wiederzuerkennen. Grammatik soll dir dabei helfen,
      echte Sätze besser zu verstehen.
    </p>

    <h3 class="win-h3">4. Beginne früh mit Immersion</h3>

    <p class="win-p">
      Immersion bedeutet, dass du regelmäßig echtes Japanisch hörst oder liest.
      Dazu gehören zum Beispiel Anime, Manga, Podcasts, Spiele, Videos und
      Visual Novels.
    </p>

    <p class="win-p">
      Am Anfang wirst du nur wenig verstehen. Das ist vollkommen normal.
      Du musst nicht warten, bis du dich bereit fühlst. Immersion ist kein
      Endpunkt des Lernens, sondern ein wichtiger Teil davon.
    </p>

    <h3 class="win-h3">5. Starte später mit Mining</h3>

    <p class="win-p">
      Beim Mining sammelst du interessante Wörter und Sätze aus den Inhalten,
      die du selbst konsumierst, und erstellst daraus eigene Lernkarten.
    </p>

    <p class="win-p">
      Du musst damit nicht direkt am ersten Tag anfangen. Baue zunächst eine
      kleine Grundlage auf und gewöhne dich an Vokabeln, Grammatik und Immersion.
      Sobald dir regelmäßig nützliche Wörter begegnen, kannst du dein eigenes
      Mining-System einrichten.
    </p>

    <h3 class="win-h3">Ein einfacher Tagesplan</h3>

    <ul class="win-list">
      <li>10 bis 20 Minuten Vokabeln wiederholen</li>
      <li>10 bis 20 Minuten Grammatik oder Lesen</li>
      <li>15 bis 30 Minuten Immersion</li>
    </ul>

    <p class="win-p">
      Du musst nicht jeden Bereich jeden Tag perfekt abdecken. Entscheidend ist,
      dass du regelmäßig Kontakt mit Japanisch hast und dein Lernplan langfristig
      in deinen Alltag passt.
    </p>

    <p class="win-p">
      <strong>
        Du brauchst am Anfang weder perfektes Kanjiwissen noch ein kompliziertes
        Mining-Setup. Beginne klein und erweitere dein System erst dann,
        wenn du es wirklich brauchst.
      </strong>
    </p>

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
    <ul class="toc-list">
      <li><button class="toc-item" data-open="kana">Kana — Hiragana &amp; Katakana</button></li>
      <li><button class="toc-item" data-open="kanji">Kanji</button></li>
      <li><button class="toc-item" data-open="grammatik">Grammatik</button></li>
      <li><button class="toc-item" data-open="wortschatz">Wortschatz</button></li>
      <li><button class="toc-item" data-open="hoeren">Hörverstehen</button></li>
      <li><button class="toc-item" data-open="kultur">Kultur &amp; Etikette</button></li>
      <li><button class="toc-item" data-open="jlpt">JLPT-Prüfungen</button></li>
      <li><button class="toc-item" data-open="ressourcen">Ressourcen &amp; Tools</button></li>
      <li><button class="toc-item" data-open="faq">FAQ</button></li>
      <li><button class="toc-item" data-open="kontakt">Kontakt</button></li>
    </ul>
  `},
 kana: {
  title: "かな — Kana",

  quest: "Kana sind dein Fundament. Lerne zuerst Hiragana und danach Katakana. Perfektes Schreiben ist am Anfang nicht nötig, sicheres Erkennen schon.",
  src: "pages/kana.html",
},
hiragana: {
  title: "ひらがな — Hiragana",
  quest: "Die 46 Grundzeichen sind dein Fundament. Übe sie in kleinen Gruppen, nicht alle auf einmal.",
  html: `
    <span class="eyebrow win-eyebrow">Schriftsystem</span>
    <h2 class="win-h2">Hiragana</h2>
    <p class="win-p">
      Hiragana ist die grundlegendste japanische Silbenschrift. Jedes Zeichen steht
      für einen festen Laut. Unten findest du die Grundzeichen (Gojūon), die
      Zeichen mit Dakuten/Handakuten sowie die Yōon-Kombinationen mit kleinem
      ゃ・ゅ・ょ.
    </p>

    <h3 class="win-h3">Die Grundzeichen (Gojūon)</h3>
    ${kanaTable(HIRAGANA_MAIN, 5)}

    <h3 class="win-h3">Dakuten &amp; Handakuten</h3>
    <p class="win-p">
      Zwei kleine Striche (゛) oder ein kleiner Kreis (゜) verändern den Laut
      eines Zeichens, z. B. wird か (ka) zu が (ga).
    </p>
    ${kanaTable(HIRAGANA_DAKUTEN, 5)}

    <h3 class="win-h3">Yōon — Kombinationen</h3>
    <p class="win-p">
      Ein Zeichen auf „i" (z. B. き) kombiniert mit einem kleinen ゃ・ゅ・ょ
      ergibt einen neuen, einzelnen Laut, z. B. きゃ (kya).
    </p>
    ${kanaTable(HIRAGANA_YOON, 3)}

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
      Katakana stellt dieselben Laute wie Hiragana dar, wird aber vor allem für
      Fremdwörter, ausländische Namen und Lautmalerei verwendet. Die Zeichen
      wirken eckiger als Hiragana.
    </p>

    <h3 class="win-h3">Die Grundzeichen (Gojūon)</h3>
    ${kanaTable(KATAKANA_MAIN, 5)}

    <h3 class="win-h3">Dakuten &amp; Handakuten</h3>
    <p class="win-p">
      Genau wie bei Hiragana verändern ゛ und ゜ den Laut eines Zeichens,
      z. B. wird カ (ka) zu ガ (ga).
    </p>
    ${kanaTable(KATAKANA_DAKUTEN, 5)}

    <h3 class="win-h3">Yōon — Kombinationen</h3>
    <p class="win-p">
      Auch hier ergibt ein Zeichen auf „i" kombiniert mit kleinem ャ・ュ・ョ
      einen neuen Laut, z. B. キャ (kya).
    </p>
    ${kanaTable(KATAKANA_YOON, 3)}

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
      Du musst nicht warten, bis du Hunderte Kanji kennst, bevor du mit
      echten Inhalten beginnst. Durch wiederholte Begegnungen werden die
      Zeichen mit der Zeit vertrauter.
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
      Starte mit einem häufigkeitsbasierten Anfänger-Vokabeldeck oder mit
      Wörtern aus deinem aktuellen Lernmaterial. Dadurch lernst du
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

  wortschatz: {
  title: "単語 — Wortschatz",

  quest: "Neue Wörter sind kleine Puzzleteile. Sammle zuerst die, die dir häufig begegnen, statt wahllos jedes unbekannte Wort mitzunehmen.",
  src: "pages/wortschatz.html",
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
      Das ist normal und bedeutet nicht, dass du schlecht lernst.
    </p>

    <p class="win-p">
      Dein Gehirn muss erst lernen, einzelne Wörter, Satzenden und bekannte
      Strukturen aus dem Gesprochenen herauszufiltern.
    </p>

    <h3 class="win-h3">Höre von Anfang an echtes Japanisch</h3>

    <p class="win-p">
      Du musst nicht warten, bis du viele Vokabeln und Grammatikpunkte kennst.
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
      Du musst nicht jedes Wort verstehen, damit Hörpraxis sinnvoll ist.
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
      Du musst aber nicht jede Folge zehnmal analysieren.
      Wiederhole vor allem Inhalte, die dir gefallen oder bei denen du merkst,
      dass du fast etwas verstehst.
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
      Du musst nicht jedes unbekannte Wort nachschlagen.
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

    <div class="win-navigation">
      <button class="toc-item" data-open="wortschatz">
        ← Zurück zum Wortschatz
      </button>

      <button class="toc-item" data-open="ressourcen" data-resource-target="res-lesen">
        Weiter zum Lesen →
      </button>
    </div>
  `
},
  kultur: { title:"文化 — Kultur", quest:"Sprache und Kultur gehören zusammen — hier lernst du den Kontext.", html:`
    <span class="eyebrow win-eyebrow">Kontext</span>
    <h2 class="win-h2">Kultur &amp; Etikette</h2>
    <p class="win-p">[Platzhalter: Höflichkeitsebenen, Alltagskultur, Umgangsformen.]</p>
    <span class="placeholder-tag">// Inhalt folgt</span>
  `},
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
    <details class="faq-item" open><summary>[Platzhalter: Frage 1]</summary><p>[Platzhalter: Antworttext.]</p></details>
    <details class="faq-item"><summary>[Platzhalter: Frage 2]</summary><p>[Platzhalter: Antworttext.]</p></details>
    <details class="faq-item"><summary>[Platzhalter: Frage 3]</summary><p>[Platzhalter: Antworttext.]</p></details>
  `},
  kontakt: { title:"コンタクト", quest:"Du hast eine Frage an mich persönlich? Nur zu!", html:`
    <span class="eyebrow win-eyebrow">Kontakt</span>
    <h2 class="win-h2">Schreib mir</h2>
    <p class="win-p">[Platzhalter: Einladender Text, wie und warum man Kontakt aufnehmen kann.]</p>
    <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:12px;">
      <a class="btn btn-primary" href="mailto:hallo.koyuki@proton.me">✉ E-Mail schreiben</a>
      <a class="btn btn-discord" href="https://discord.gg/XhAEFS4RFV" target="_blank" rel="noopener">
        <img src="assets/icons/discord.svg" width="18" height="18" alt="">
        Discord
      </a>
    </div>
  `}
};
const homeQuest = "Hallo! Ich bin Yuki — klick auf eine Kachel, um deine Reise zu beginnen!";



/* ===================== Wegweiser-Begleiter ===================== */
const wegweiser = document.getElementById('wegweiser');
const wegweiserText = document.getElementById('wegweiserText');

function updateWegweiser(){
  wegweiserText.textContent = activeId === 'home' ? homeQuest : (panels[activeId] ? panels[activeId].quest : homeQuest);
  positionWegweiser();
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
