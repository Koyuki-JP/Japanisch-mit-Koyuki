/* ============================================================
   js/decisiontree.js — Interaktiver Entscheidungsbaum "Was
   brauche ich jetzt?" im Entscheidungsbaum-Panel. windows.js ruft
   initDecisionTree() auf, sobald pages/entscheidungsbaum.html in
   das Fenster eingesetzt wurde (siehe finalizeContent()).
   ============================================================ */

const DECISION_TREE = {
  start: {
    question: "Kannst du Hiragana und Katakana sicher lesen?",
    options: [
      { label: "Nein", next: "rec_kana" },
      { label: "Ja", next: "q_wortschatz" }
    ]
  },
  q_wortschatz: {
    question: "Hast du schon einen Grundwortschatz (ungefähr 1.000+ Wörter)?",
    options: [
      { label: "Nein", next: "rec_wortschatz" },
      { label: "Ja", next: "q_grammatik" }
    ]
  },
  q_grammatik: {
    question: "Verstehst du grundlegende Grammatik (Satzstruktur, は・が, て-Form …)?",
    options: [
      { label: "Nein", next: "rec_grammatik" },
      { label: "Ja", next: "q_grammatik_advanced" }
    ]
  },
  q_grammatik_advanced: {
    question: "Möchtest du deine Grammatik vertiefen (Passiv, Kausativ, Konditionalformen …), oder erstmal mit Immersion weitermachen?",
    options: [
      { label: "Grammatik vertiefen", next: "q_grammatik_level" },
      { label: "Immersion", next: "q_immersion" }
    ]
  },
  q_grammatik_level: {
    question: "Passiv, Kausativ und Konditionalformen — ist dir das noch neu, oder sitzt das schon?",
    options: [
      { label: "Noch neu", next: "rec_fortgeschritten" },
      { label: "Sitzt schon", next: "rec_experte" }
    ]
  },
  q_immersion: {
    question: "Konsumierst du schon regelmäßig echte japanische Inhalte (Anime, Manga, Podcasts …)?",
    options: [
      { label: "Nein", next: "rec_immersion" },
      { label: "Ja", next: "q_mining_words" }
    ]
  },
  q_mining_words: {
    question: "Begegnen dir dabei regelmäßig Wörter, die du dir merken möchtest?",
    options: [
      { label: "Nein", next: "rec_keep_immersion" },
      { label: "Ja", next: "q_setup" }
    ]
  },
  q_setup: {
    question: "Hast du schon ein Mining-Setup (Yomitan + Anki) eingerichtet?",
    options: [
      { label: "Nein", next: "rec_yomitan" },
      { label: "Ja", next: "rec_mining" }
    ]
  },
  rec_kana: {
    recommendation: "Starte mit Kana — dem Fundament für alles Weitere.",
    panel: "kana", panelLabel: "Zu Kana"
  },
  rec_wortschatz: {
    recommendation: "Wähle ein Grundwortschatz-Deck und leg los.",
    panel: "wortschatz", panelLabel: "Zu Wortschatz"
  },
  rec_grammatik: {
    recommendation: "Arbeite dich durch die Grammatik-Grundlagen.",
    panel: "grammatik", panelLabel: "Zu Grammatik"
  },
  rec_fortgeschritten: {
    recommendation: "Der Fortgeschrittene Guide führt dich durch Grammatik auf JLPT-N4/N3-Niveau — Passiv, Kausativ, Konditionalformen und mehr.",
    panel: "fortgeschritten", panelLabel: "Zum Fortgeschrittenen Guide"
  },
  rec_experte: {
    recommendation: "Der Experten-Guide führt dich durch Grammatik auf JLPT-N2-Niveau — feinere Nuancen und formellere Ausdrucksformen für Texte, die nicht mehr für Lernende geschrieben wurden.",
    panel: "experte", panelLabel: "Zum Experten-Guide"
  },
  rec_immersion: {
    recommendation: "Zeit, mit Immersion anzufangen — auch mit wenig Verständnis ist das schon sinnvoll.",
    panel: "immersion", panelLabel: "Zur Immersion"
  },
  rec_keep_immersion: {
    recommendation: "Bleib erstmal bei der Immersion. Mining lohnt sich, sobald dir regelmäßig Wörter auffallen, die du behalten möchtest.",
    panel: "immersion", panelLabel: "Zur Immersion"
  },
  rec_yomitan: {
    recommendation: "Richte zuerst Yomitan ein — das ist die technische Basis fürs Mining.",
    panel: "yomitan", panelLabel: "Zu Yomitan"
  },
  rec_mining: {
    recommendation: "Du bist bereit. Leg los mit Mining.",
    panel: "mining", panelLabel: "Zu Mining"
  }
};

function renderDecisionNode(root, nodeId, step){
  const node = DECISION_TREE[nodeId];
  if(!node) return;

  if(node.question){
    root.innerHTML = `
      <div class="decision-step" aria-hidden="true">Schritt ${step}</div>
      <p class="decision-question">${node.question}</p>
      <div class="decision-options">
        ${node.options.map(opt =>
          `<button class="toc-item decision-option" data-tree-next="${opt.next}">${opt.label}</button>`
        ).join('')}
      </div>
    `;
  } else {
    root.innerHTML = `
      <div class="decision-result">
        <p class="win-p">${node.recommendation}</p>
        <div class="decision-result-actions">
          <button class="toc-item" data-open="${node.panel}">${node.panelLabel} →</button>
          <button class="inline-link" data-tree-restart="1">Neu starten</button>
        </div>
      </div>
    `;
  }
}

function initDecisionTree(contentEl){
  const root = contentEl.querySelector('#decisionTreeRoot');
  if(!root) return;

  let step = 1;
  renderDecisionNode(root, 'start', step);

  root.addEventListener('click', (e) => {
    const nextBtn = e.target.closest('[data-tree-next]');
    if(nextBtn){
      step += 1;
      renderDecisionNode(root, nextBtn.dataset.treeNext, step);
      return;
    }
    const restartBtn = e.target.closest('[data-tree-restart]');
    if(restartBtn){
      step = 1;
      renderDecisionNode(root, 'start', step);
    }
  });
}
