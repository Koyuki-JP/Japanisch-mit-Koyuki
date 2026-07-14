/* ============================================================
   js/search.js: Client-seitige Suche über alle Panel-Titel und
   Kurzbeschreibungen (panels[id].quest aus js/app.js). Kein
   Backend, filtert live beim Tippen, Treffer öffnen per Klick
   oder Enter.
   ============================================================ */

(function(){
  // Muss synchron beim ersten Ausführen erfasst werden -- danach ist
  // document.currentScript wieder null. Liefert die absolute URL dieser
  // Datei, egal ob von index.html oder go/<slug>/index.html geladen.
  const SELF_SRC = document.currentScript ? document.currentScript.src : '';

  const toggleBtn = document.getElementById('searchToggle');
  const overlay = document.getElementById('searchOverlay');
  const input = document.getElementById('searchInput');
  const resultsEl = document.getElementById('searchResults');
  const emptyEl = document.getElementById('searchEmpty');
  const closeBtn = document.getElementById('searchClose');

  if(!toggleBtn || !overlay || !input || !resultsEl) return;

  let activeIndex = -1;
  let currentMatches = [];
  let searchIndexPromise = null;

  /* data/search-index.js ist mit Abstand die größte JS-Datei (Volltext
     aller Panels) und wird nur für die Suche gebraucht -- statt sie auf
     jeder Seitenanfrage mitzuladen, holen wir sie erst beim ersten
     Öffnen der Suche nach. runSearch() hat ohnehin schon einen Fallback
     auf {}, falls SEARCH_INDEX noch nicht da ist. */
  function ensureSearchIndex(){
    if(searchIndexPromise) return searchIndexPromise;
    searchIndexPromise = new Promise((resolve) => {
      if(typeof SEARCH_INDEX !== 'undefined'){ resolve(); return; }
      if(!SELF_SRC){ resolve(); return; }
      const script = document.createElement('script');
      script.src = SELF_SRC.replace('/js/search.js', '/data/search-index.js');
      script.onload = () => resolve();
      script.onerror = () => resolve();
      document.head.appendChild(script);
    });
    return searchIndexPromise;
  }

  function escapeHtml(s){
    return s.replace(/[&<>]/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;'}[c]));
  }

  function highlight(text, query){
    const idx = text.toLowerCase().indexOf(query);
    if(idx === -1) return escapeHtml(text);
    return escapeHtml(text.slice(0, idx))
      + '<mark>' + escapeHtml(text.slice(idx, idx + query.length)) + '</mark>'
      + escapeHtml(text.slice(idx + query.length));
  }

  /* Wenn ein Treffer nur im Fließtext steckt (nicht in Titel/
     Kurzbeschreibung), zeigt ein kurzer Ausschnitt rund um die
     Fundstelle mehr als die sonst unpassende Kurzbeschreibung. */
  function snippetAround(text, q){
    const idx = text.toLowerCase().indexOf(q);
    if(idx === -1) return text.slice(0, 100);
    const start = Math.max(0, idx - 40);
    const end = Math.min(text.length, idx + q.length + 60);
    return (start > 0 ? '… ' : '') + text.slice(start, end).trim() + (end < text.length ? ' …' : '');
  }

  function runSearch(query){
    const q = query.trim().toLowerCase();
    if(!q){
      currentMatches = [];
      renderResults(q);
      return;
    }
    const bodyIndex = typeof SEARCH_INDEX !== 'undefined' ? SEARCH_INDEX : {};
    currentMatches = Object.keys(panels)
      .map(id => {
        const title = panels[id].title || id;
        const quest = panels[id].quest || '';
        const body = bodyIndex[id] || '';
        const titleHit = title.toLowerCase().includes(q);
        const questHit = quest.toLowerCase().includes(q);
        const bodyHit = body.toLowerCase().includes(q);
        if(!titleHit && !questHit && !bodyHit) return null;
        const score = titleHit ? 3 : (questHit ? 2 : 1);
        const desc = (titleHit || questHit) ? quest : snippetAround(body, q);
        return { id, title, desc, score };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);
    renderResults(q);
  }

  function renderResults(query){
    activeIndex = currentMatches.length ? 0 : -1;
    if(!query){
      resultsEl.innerHTML = '';
      emptyEl.hidden = true;
      return;
    }
    if(!currentMatches.length){
      resultsEl.innerHTML = '';
      emptyEl.hidden = false;
      return;
    }
    emptyEl.hidden = true;
    resultsEl.innerHTML = currentMatches.map((item, i) => `
      <button class="search-result${i === 0 ? ' active' : ''}" data-search-open="${item.id}">
        <span class="search-result-title">${highlight(item.title, query)}</span>
        <span class="search-result-desc">${highlight(item.desc, query)}</span>
      </button>
    `).join('');
  }

  function updateActive(){
    resultsEl.querySelectorAll('.search-result').forEach((el, i) => {
      el.classList.toggle('active', i === activeIndex);
    });
    const activeEl = resultsEl.querySelector('.search-result.active');
    if(activeEl) activeEl.scrollIntoView({ block: 'nearest' });
  }

  function selectResult(id){
    closeOverlay();
    openWindow(id, toggleBtn);
  }

  let lastFocused = null;

  function openOverlay(){
    lastFocused = document.activeElement;
    overlay.hidden = false;
    input.value = '';
    resultsEl.innerHTML = '';
    emptyEl.hidden = true;
    activeIndex = -1;
    requestAnimationFrame(() => input.focus());
    ensureSearchIndex().then(() => {
      // Falls der Nutzer schon getippt hat, bevor der Volltext-Index da war,
      // Ergebnisse mit dem jetzt vollständigen Index neu berechnen.
      if(!overlay.hidden && input.value.trim()) runSearch(input.value);
    });
  }

  function closeOverlay(){
    overlay.hidden = true;
    input.blur();
    // Fokus zurück an das Element, von dem aus die Suche geöffnet wurde
    // (Suche-Button oder das Element, auf dem "/" gedrückt wurde).
    if(lastFocused && typeof lastFocused.focus === 'function'){
      lastFocused.focus();
    }
    lastFocused = null;
  }

  /* Fokusfalle: Tab/Umschalt+Tab bleiben innerhalb des Dialogs, statt
     dahinterliegende Seite zu erreichen, solange die Suche offen ist. */
  overlay.addEventListener('keydown', (e) => {
    if(e.key !== 'Tab') return;
    const focusable = Array.from(overlay.querySelectorAll('button, input, [tabindex]:not([tabindex="-1"])'))
      .filter(el => !el.disabled);
    if(!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if(e.shiftKey && document.activeElement === first){
      e.preventDefault();
      last.focus();
    } else if(!e.shiftKey && document.activeElement === last){
      e.preventDefault();
      first.focus();
    }
  });

  toggleBtn.addEventListener('click', () => {
    if(overlay.hidden) openOverlay(); else closeOverlay();
  });
  closeBtn.addEventListener('click', closeOverlay);
  overlay.addEventListener('click', (e) => {
    if(e.target === overlay) closeOverlay();
  });

  input.addEventListener('input', () => runSearch(input.value));

  input.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowDown'){
      e.preventDefault();
      if(!currentMatches.length) return;
      activeIndex = (activeIndex + 1) % currentMatches.length;
      updateActive();
    } else if(e.key === 'ArrowUp'){
      e.preventDefault();
      if(!currentMatches.length) return;
      activeIndex = (activeIndex - 1 + currentMatches.length) % currentMatches.length;
      updateActive();
    } else if(e.key === 'Enter'){
      e.preventDefault();
      if(activeIndex >= 0 && currentMatches[activeIndex]) selectResult(currentMatches[activeIndex].id);
    } else if(e.key === 'Escape'){
      closeOverlay();
    }
  });

  resultsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-search-open]');
    if(!btn) return;
    selectResult(btn.getAttribute('data-search-open'));
  });

  document.addEventListener('keydown', (e) => {
    if(e.key !== '/' || !overlay.hidden) return;
    const tag = (e.target.tagName || '').toLowerCase();
    if(tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;
    e.preventDefault();
    openOverlay();
  });
})();
