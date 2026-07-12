/* ============================================================
   js/windows.js — Das Fenster-System: Fenstergrößen (inkl.
   Speichern in localStorage), Erzeugen/Öffnen/Schließen von
   Fenstern, Ziehen (Drag) und Skalieren (Resize).

   Lädt Panel-Inhalte entweder direkt aus panels[id].html (in
   js/app.js definiert) oder, wenn panels[id].src gesetzt ist,
   per fetch() aus einer eigenen Datei in pages/. Für den
   Ressourcen-Tab wird zusätzlich renderResourceLibrary()
   (js/resources.js) aufgerufen, sobald der Inhalt da ist.
   ============================================================ */

/* ===================== Fenstergrößen merken ===================== */
const WINDOW_SIZE_KEY = 'japanischzimmer-window-sizes-v1';

const LARGE_GUIDE_WINDOWS = new Set([
  'guide', 'toc', 'kana', 'hiragana', 'katakana', 'kanji',
  'grammatik', 'satzstruktur', 'verbformen', 'haga', 'wo', 'nide', 'teform',
  'wortschatz', 'aussprache', 'hoeren', 'immersion', 'lesen', 'anki', 'yomitan', 'mining', 'ressourcen', 'jlpt',
  'kultur', 'tools', 'tool-asbplayer', 'tool-mpvacious', 'tool-textractor', 'tool-mokuro',
  'tool-jidoujisho', 'tool-jpdb', 'tool-bunpro', 'tool-natively'
]);

const MEDIUM_WINDOWS = new Set([
  'faq', 'kontakt'
]);

function clamp(value, min, max){
  return Math.min(Math.max(value, min), max);
}

function getDefaultWindowSize(id){
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Große Inhaltsfenster sollen ungefähr 60–70 % des Bildschirms nutzen.
  if(LARGE_GUIDE_WINDOWS.has(id)){
    return {
      width: clamp(Math.round(vw * 0.66), 820, Math.round(vw * 0.88)),
      height: clamp(Math.round(vh * 0.74), 560, Math.round(vh * 0.88))
    };
  }

  // Kleinere Utility-Fenster bleiben kompakter, aber dennoch deutlich nutzbar.
  if(MEDIUM_WINDOWS.has(id)){
    return {
      width: clamp(Math.round(vw * 0.56), 620, Math.round(vw * 0.82)),
      height: clamp(Math.round(vh * 0.60), 420, Math.round(vh * 0.78))
    };
  }

  // Fallback für alles andere.
  return {
    width: clamp(Math.round(vw * 0.60), 720, Math.round(vw * 0.86)),
    height: clamp(Math.round(vh * 0.66), 480, Math.round(vh * 0.84))
    };
}


function getSavedWindowSizes(){
  try{
    const saved = JSON.parse(localStorage.getItem(WINDOW_SIZE_KEY) || '{}');
    return saved && typeof saved === 'object' ? saved : {};
  } catch {
    return {};
  }
}

function saveWindowSize(id, width, height){
  const sizes = getSavedWindowSizes();
  sizes[id] = { width, height };
  localStorage.setItem(WINDOW_SIZE_KEY, JSON.stringify(sizes));
}

function applySavedWindowSize(id, el){
  const defaults = getDefaultWindowSize(id);
  el.style.width = defaults.width + 'px';
  el.style.height = defaults.height + 'px';

  const sizes = getSavedWindowSizes();
  const saved = sizes[id];
  if(!saved) return;

  if(saved.width) el.style.width = Math.max(420, saved.width) + 'px';
  if(saved.height) el.style.height = Math.max(360, saved.height) + 'px';
}

/* ===================== Fenster-Engine ===================== */
const windowsRoot = document.getElementById('windows-root');
const homeEl = document.getElementById('window-home');
const state = {};
let zCounter = 20;
let openCount = 0;
let activeId = 'home';
let activeEl = homeEl;

function buildWindow(id){
  const data = panels[id];
  const el = document.createElement('div');
  el.className = 'window';
  el.id = 'window-' + id;
  el.innerHTML = `
    <div class="window-titlebar">
      <span class="tab-label">${data.title}</span>
      <button class="win-close" data-close="${id}">✕</button>
    </div>
    <div class="window-content">${data.html || '<p class="win-p">Lade Inhalt …</p>'}</div>
    <div class="resize-handle" title="Größe ändern">
      <svg width="12" height="12" viewBox="0 0 12 12"><path d="M11 1 L1 11 M11 5 L5 11 M11 9 L9 11" stroke="var(--muted)" stroke-width="1.4" stroke-linecap="round"/></svg>
    </div>
  `;
  windowsRoot.appendChild(el);
  applySavedWindowSize(id, el);
  makeDraggable(el, el.querySelector('.window-titlebar'));
  makeResizable(el, el.querySelector('.resize-handle'));
  el.addEventListener('pointerdown', () => setActive(id, el));
  el.querySelector('[data-close]').addEventListener('click', (e) => {
    e.stopPropagation();
    el.classList.remove('open');

    if(state[id]){
      state[id].persistent = false;
    }

    if(activeId === id) setActive('home', homeEl);
  });

  function finalizeContent(){
    const contentEl = el.querySelector('.window-content');
    if(id === 'ressourcen' && typeof renderResourceLibrary === 'function'){
      renderResourceLibrary(contentEl);
    }
    buildArticleToc(contentEl, id);
    enhanceCollapsibleSections(contentEl, id);
    updateGuideProgressUI();
  }

  if(data.html){
    // Inhalt liegt bereits als String vor (klassische, inline definierte Panels).
    finalizeContent();
    el.contentReady = Promise.resolve();
  } else if(data.src){
    // Inhalt liegt in einer eigenen Datei unter pages/ und wird per fetch() nachgeladen.
    el.contentReady = fetch(data.src, { cache: 'no-cache' })
      .then(response => {
        if(!response.ok) throw new Error('HTTP ' + response.status);
        return response.text();
      })
      .then(html => {
        data.html = html; // im Speicher behalten, damit nicht erneut geladen werden muss
        el.querySelector('.window-content').innerHTML = html;
        finalizeContent();
      })
      .catch(error => {
        el.querySelector('.window-content').innerHTML =
          `<p class="win-p">Inhalt konnte nicht geladen werden (${error.message}). ` +
          `Läuft die Seite über einen lokalen Server? Per Doppelklick geöffnete ` +
          `HTML-Dateien (file://) können pages/ nicht per fetch() nachladen.</p>`;
      });
  } else {
    el.contentReady = Promise.resolve();
  }

  return el;
}

/* ===================== Mini-Inhaltsverzeichnis für lange Artikel ===================== */
function buildArticleToc(contentEl, panelId){
  const headings = Array.from(contentEl.querySelectorAll(':scope > h3.win-h3'));
  if(headings.length < 3) return; // zu kurz, lohnt sich noch nicht

  const body = document.createElement('div');
  body.className = 'article-body';
  while(contentEl.firstChild){
    body.appendChild(contentEl.firstChild);
  }

  const nav = document.createElement('nav');
  nav.className = 'article-toc';
  nav.setAttribute('aria-label', 'Inhaltsverzeichnis dieses Artikels');
  nav.innerHTML = '<span class="article-toc-label">Auf dieser Seite</span>';

  const list = document.createElement('ul');
  const entries = headings.map((heading, index) => {
    heading.id = `toc-${panelId}-${index}`;

    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = '#' + heading.id;
    link.className = 'article-toc-link';
    link.textContent = heading.textContent.trim();
    link.addEventListener('click', (e) => {
      e.preventDefault();
      contentEl.scrollTo({ top: Math.max(0, heading.offsetTop - 14), behavior: 'smooth' });
    });
    li.appendChild(link);
    list.appendChild(li);
    return { heading, link };
  });
  nav.appendChild(list);

  contentEl.classList.add('has-toc');
  contentEl.appendChild(nav);
  contentEl.appendChild(body);

  let ticking = false;
  const setActiveLink = () => {
    const pos = contentEl.scrollTop + 24;
    let current = entries[0];
    entries.forEach(entry => {
      if(entry.heading.offsetTop <= pos) current = entry;
    });
    entries.forEach(entry => entry.link.classList.toggle('active', entry === current));
    ticking = false;
  };
  contentEl.addEventListener('scroll', () => {
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(setActiveLink);
  });
  setActiveLink();
}

function bringToFront(el){ zCounter += 1; el.style.zIndex = zCounter; }

function positionCascade(el){
  const idx = openCount % 6;
  openCount += 1;
  const offset = idx * 26;

  // Inhaltsfenster werden direkt mit echten Pixelkoordinaten positioniert.
  // Dadurch bleibt beim allerersten Ziehen keine translate-Zentrierung übrig,
  // die das Fenster seitlich springen lassen könnte.
  const rect = el.getBoundingClientRect();
  const centeredLeft = Math.max(12, (window.innerWidth - rect.width) / 2 + offset);
  const centeredTop = Math.max(12, (window.innerHeight - rect.height) / 2 + offset);

  el.style.transition = 'none';
  el.style.transform = 'none';
  el.style.left = centeredLeft + 'px';
  el.style.top = centeredTop + 'px';

  // Nach einem Frame darf die normale Einblendanimation wieder greifen.
  requestAnimationFrame(() => {
    el.style.transition = '';
  });
}

function setActive(id, el){
  activeId = id; activeEl = el;
  if(id !== 'home') bringToFront(el);
  updateWegweiser();
}

function closeAllContentWindows(){
  Object.values(state).forEach(entry => {
    entry.el.classList.remove('open');
    entry.persistent = false;
  });
  setActive('home', homeEl);
}


function scrollToResourceTarget(targetId){
  if(!targetId) return;

  requestAnimationFrame(() => {
    const resourceWindow = document.getElementById('window-ressourcen');
    if(!resourceWindow) return;

    const content = resourceWindow.querySelector('.window-content');
    const target = resourceWindow.querySelector('#' + CSS.escape(targetId));
    if(!content || !target) return;

    const top = Math.max(0, target.offsetTop - 18);
    content.scrollTo({ top, behavior:'smooth' });
  });
}

function openWindow(id, opener = null){
  if(!panels[id]) return;

  const sourceWindow = opener ? opener.closest('.window') : null;
  const openedFromHome = sourceWindow?.id === 'window-home';
  const sourceId = sourceWindow && sourceWindow.id !== 'window-home'
    ? sourceWindow.id.replace('window-', '')
    : null;

  let s = state[id];
  if(!s){
    s = {
      el: buildWindow(id),
      positioned: false,
      persistent: false
    };
    state[id] = s;
  }

  if(openedFromHome){
    // Direkt aus dem Startmenü geöffnete Fenster gelten als Hauptfenster.
    s.persistent = true;
  } else {
    // Navigation innerhalb eines Fensters:
    // Das Quellfenster wird geschlossen, damit z. B. das Inhaltsverzeichnis
    // beim Öffnen von Kana nicht im Hintergrund offen bleibt.
    if(sourceId && state[sourceId]){
      state[sourceId].el.classList.remove('open');
      state[sourceId].persistent = false;
    }

    // Andere nicht-persistente Guide-/Unterfenster ebenfalls schließen.
    Object.entries(state).forEach(([windowId, entry]) => {
      if(windowId !== id && !entry.persistent){
        entry.el.classList.remove('open');
      }
    });
  }

  if(!s.positioned){
    positionCascade(s.el);
    s.positioned = true;
  }

  s.el.classList.add('open');
  setActive(id, s.el);

  const content = s.el.querySelector('.window-content');
  if(content) content.scrollTop = 0;
}

function makeDraggable(win, titlebar){
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let origX = 0;
  let origY = 0;

  titlebar.addEventListener('pointerdown', (e) => {
    if(e.target.closest('.win-close')) return;

    dragging = true;
    setActive(win.id.replace('window-','') || 'home', win);

    startX = e.clientX;
    startY = e.clientY;

    const rect = win.getBoundingClientRect();
    origX = rect.left;
    origY = rect.top;

    // Vor dem Ziehen auf feste Koordinaten wechseln, damit nichts springt.
    win.style.transition = 'none';
    win.style.transform = 'none';
    win.style.left = origX + 'px';
    win.style.top = origY + 'px';

    titlebar.setPointerCapture(e.pointerId);
  });

  titlebar.addEventListener('pointermove', (e) => {
    if(!dragging) return;

    const maxLeft = Math.max(12, window.innerWidth - win.offsetWidth - 12);
    const maxTop = Math.max(12, window.innerHeight - win.offsetHeight - 12);

    const nextLeft = Math.min(
      Math.max(12, origX + (e.clientX - startX)),
      maxLeft
    );

    const nextTop = Math.min(
      Math.max(12, origY + (e.clientY - startY)),
      maxTop
    );

    win.style.left = nextLeft + 'px';
    win.style.top = nextTop + 'px';

    positionWegweiser();
  });

  function stopDragging(){
    if(!dragging) return;
    dragging = false;

    requestAnimationFrame(() => {
      win.style.transition = '';
    });
  }

  titlebar.addEventListener('pointerup', stopDragging);
  titlebar.addEventListener('pointercancel', stopDragging);
}

function makeResizable(win, handle){
  let resizing = false;
  let startX = 0;
  let startY = 0;
  let startW = 0;
  let startH = 0;

  handle.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    e.stopPropagation();

    resizing = true;
    setActive(win.id.replace('window-','') || 'home', win);

    const rect = win.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    startW = rect.width;
    startH = rect.height;

    // Beim ersten Resize von CSS-/Auto-Größen auf feste Pixel wechseln.
    win.style.width = startW + 'px';
    win.style.height = startH + 'px';
    win.style.maxHeight = '92vh';
    win.classList.add('resizing');

    handle.setPointerCapture(e.pointerId);
  });

  handle.addEventListener('pointermove', (e) => {
    if(!resizing) return;

    const computed = getComputedStyle(win);
    const minW = parseFloat(computed.minWidth) || 320;
    const minH = parseFloat(computed.minHeight) || 260;
    const maxW = Math.max(minW, window.innerWidth - 24);
    const maxH = Math.max(minH, window.innerHeight - 24);

    const nextWidth = Math.min(
      Math.max(minW, startW + (e.clientX - startX)),
      maxW
    );

    const nextHeight = Math.min(
      Math.max(minH, startH + (e.clientY - startY)),
      maxH
    );

    win.style.width = nextWidth + 'px';
    win.style.height = nextHeight + 'px';

    if(win.id){
      const id = win.id.replace('window-','') || 'home';
      saveWindowSize(id, nextWidth, nextHeight);
    }

    positionWegweiser();
  });

  function stopResizing(){
    if(!resizing) return;
    resizing = false;
    win.classList.remove('resizing');
  }

  handle.addEventListener('pointerup', stopResizing);
  handle.addEventListener('pointercancel', stopResizing);
}

document.addEventListener('click', (e) => {
  const guideStep = e.target.closest('[data-guide-step]');
  if(guideStep){
    toggleGuideStep(guideStep.dataset.guideStep);
    return;
  }

  const opener = e.target.closest('[data-open]');
  if(opener){
    const targetId = opener.getAttribute('data-open');
    openWindow(targetId, opener);

    const resourceTarget = opener.getAttribute('data-resource-target');
    if(resourceTarget){
      // Bei ausgelagerten Seiten (z. B. Ressourcen) erst warten, bis der
      // Inhalt per fetch() eingesetzt wurde, sonst existiert das Sprungziel
      // im DOM noch gar nicht.
      const win = state[targetId] && state[targetId].el;
      Promise.resolve(win && win.contentReady).then(() => scrollToResourceTarget(resourceTarget));
    }
    return;
  }

  // Ein Klick auf den freien Hintergrund schließt alle Inhaltsfenster.
  const clickedInterface =
    e.target.closest('.window') ||
    e.target.closest('.wegweiser') ||
    e.target.closest('.top-controls');

  if(!clickedInterface && e.target.closest('.stage')){
    closeAllContentWindows();
  }
});
applySavedWindowSize('home', homeEl);
homeEl.addEventListener('pointerdown', () => setActive('home', homeEl));
makeResizable(homeEl, homeEl.querySelector('.resize-handle'));
updateGuideProgressUI();
