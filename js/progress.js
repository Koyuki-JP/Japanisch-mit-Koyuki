/* ============================================================
   js/progress.js: Fortschritts-Tracking für den Anfänger-Guide
   (Checkliste + Fortschrittsbalken, per localStorage gespeichert)
   und die einklappbaren Abschnitte (win-h3) innerhalb der Fenster.
   ============================================================ */

/* ===================== Fortschritt Anfänger-Guide ===================== */
const GUIDE_PROGRESS_KEY = 'japanischzimmer-guide-progress-v1';
const GUIDE_STEPS = ['kana', 'wortschatz', 'grammatik', 'immersion', 'mining'];

function getGuideProgress(){
  try{
    const saved = JSON.parse(localStorage.getItem(GUIDE_PROGRESS_KEY) || '[]');
    return new Set(Array.isArray(saved) ? saved.filter(step => GUIDE_STEPS.includes(step)) : []);
  } catch {
    return new Set();
  }
}

function saveGuideProgress(progress){
  localStorage.setItem(GUIDE_PROGRESS_KEY, JSON.stringify([...progress]));
}

function updateGuideProgressUI(){
  const progress = getGuideProgress();
  const done = progress.size;
  const percent = (done / GUIDE_STEPS.length) * 100;

  const guideFill = document.getElementById('guideProgressFill');
  const guideCount = document.getElementById('guideProgressCount');
  const homeFill = document.getElementById('homeGuideProgressFill');
  const homeLabel = document.getElementById('homeGuideProgressLabel');

  if(guideFill) guideFill.style.width = `${percent}%`;
  if(guideCount) guideCount.textContent = `${done} von ${GUIDE_STEPS.length} erledigt`;
  if(homeFill) homeFill.style.width = `${percent}%`;
  if(homeLabel) homeLabel.textContent = done === GUIDE_STEPS.length
    ? 'Guide abgeschlossen ✓'
    : `${done} von ${GUIDE_STEPS.length}`;

  document.querySelectorAll('[data-guide-step]').forEach(button => {
    const isDone = progress.has(button.dataset.guideStep);
    button.classList.toggle('done', isDone);
    button.setAttribute('aria-pressed', String(isDone));
  });
}

function toggleGuideStep(step){
  if(!GUIDE_STEPS.includes(step)) return;
  const progress = getGuideProgress();
  progress.has(step) ? progress.delete(step) : progress.add(step);
  saveGuideProgress(progress);
  updateGuideProgressUI();
}


/* ===================== Einklappbare Guide-Abschnitte ===================== */
const COLLAPSE_STATE_KEY = 'japanischzimmer-collapsed-sections-v1';

function getCollapsedSections(){
  try{
    const saved = JSON.parse(localStorage.getItem(COLLAPSE_STATE_KEY) || '{}');
    return saved && typeof saved === 'object' ? saved : {};
  } catch {
    return {};
  }
}

function saveCollapsedSections(state){
  localStorage.setItem(COLLAPSE_STATE_KEY, JSON.stringify(state));
}

function getSectionSiblings(title){
  const siblings = [];
  let node = title.nextElementSibling;

  while(node && !node.matches('.win-h3')){
    siblings.push(node);
    node = node.nextElementSibling;
  }

  return siblings;
}

function setSectionCollapsed(title, collapsed, persist = true){
  getSectionSiblings(title).forEach(element => {
    element.classList.toggle('collapsible-hidden', collapsed);
  });

  title.setAttribute('aria-expanded', String(!collapsed));

  if(persist){
    const state = getCollapsedSections();
    state[title.dataset.collapseKey] = collapsed;
    saveCollapsedSections(state);
  }
}

function createCollapseKey(title, panelId, index){
  const parentPath = [];
  let parent = title.parentElement;

  while(parent && !parent.classList.contains('window-content')){
    const parentIndex = Array.from(parent.parentElement?.children || []).indexOf(parent);
    parentPath.unshift(parentIndex);
    parent = parent.parentElement;
  }

  return `${panelId}:${parentPath.join('.')}:${index}:${title.textContent.trim()}`;
}

function enhanceCollapsibleSections(contentRoot, panelId){
  // Nur echte Abschnittsüberschriften sollen aufklappbar werden, nicht
  // verschachtelte h3 in Karten (z. B. .resource-card), sonst landet der
  // Klapp-Pfeil mitten in mehrzeiligen Kartentiteln. buildArticleToc()
  // packt lange Artikel in .article-body; dort zählen nur die direkten
  // Kinder als Abschnitte, genau wie beim Mini-Inhaltsverzeichnis selbst.
  const scope = contentRoot.querySelector(':scope > .article-body') || contentRoot;
  const titles = Array.from(scope.querySelectorAll(':scope > h3.win-h3'));
  const state = getCollapsedSections();

  titles.forEach((title, index) => {
    if(title.classList.contains('collapsible-title')) return;

    const key = createCollapseKey(title, panelId, index);
    title.classList.add('collapsible-title');
    title.dataset.collapseKey = key;
    title.setAttribute('role', 'button');
    title.setAttribute('tabindex', '0');

    const collapsed = state[key] === true;
    setSectionCollapsed(title, collapsed, false);

    const toggle = () => {
      const isExpanded = title.getAttribute('aria-expanded') === 'true';
      setSectionCollapsed(title, isExpanded);
    };

    title.addEventListener('click', toggle);
    title.addEventListener('keydown', event => {
      if(event.key === 'Enter' || event.key === ' '){
        event.preventDefault();
        toggle();
      }
    });
  });
}


/* ===================== Lesestelle merken pro Fenster ===================== */
const SCROLL_POSITION_KEY = 'japanischzimmer-scroll-position-v1';
const SCROLL_SAVE_THRESHOLD = 40; // darunter zählt es als "ganz oben", nichts zu merken

function getScrollPositions(){
  try{
    const saved = JSON.parse(localStorage.getItem(SCROLL_POSITION_KEY) || '{}');
    return saved && typeof saved === 'object' ? saved : {};
  } catch {
    return {};
  }
}

function saveReadingPosition(panelId, contentEl){
  if(!contentEl) return;
  const state = getScrollPositions();
  if(contentEl.scrollTop > SCROLL_SAVE_THRESHOLD){
    state[panelId] = contentEl.scrollTop;
  } else {
    delete state[panelId];
  }
  localStorage.setItem(SCROLL_POSITION_KEY, JSON.stringify(state));
}

function restoreReadingPosition(panelId, contentEl){
  if(!contentEl) return;
  const saved = getScrollPositions()[panelId];
  if(typeof saved === 'number'){
    // Ein Frame warten, bis Inhalt/Kollaps-Zustand ihre endgültige Höhe haben.
    requestAnimationFrame(() => { contentEl.scrollTop = saved; });
  }
}

function watchReadingPosition(panelId, contentEl){
  if(!contentEl || contentEl.dataset.scrollWatched) return;
  contentEl.dataset.scrollWatched = 'true';
  let debounceTimer = null;
  contentEl.addEventListener('scroll', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => saveReadingPosition(panelId, contentEl), 400);
  });
}


/* Kompatible Weiter-Navigation für Guide-Schritte */
function geheZuNaechstemBereich(naechsterBereichId, ausloeser = null){
  openWindow(naechsterBereichId, ausloeser);
}
