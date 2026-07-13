/* ============================================================
   js/search.js — Client-seitige Suche über alle Panel-Titel und
   Kurzbeschreibungen (panels[id].quest aus js/app.js). Kein
   Backend, filtert live beim Tippen, Treffer öffnen per Klick
   oder Enter.
   ============================================================ */

(function(){
  const toggleBtn = document.getElementById('searchToggle');
  const overlay = document.getElementById('searchOverlay');
  const input = document.getElementById('searchInput');
  const resultsEl = document.getElementById('searchResults');
  const emptyEl = document.getElementById('searchEmpty');
  const closeBtn = document.getElementById('searchClose');

  if(!toggleBtn || !overlay || !input || !resultsEl) return;

  let activeIndex = -1;
  let currentMatches = [];

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

  function runSearch(query){
    const q = query.trim().toLowerCase();
    if(!q){
      currentMatches = [];
      renderResults(q);
      return;
    }
    currentMatches = Object.keys(panels)
      .map(id => ({ id, title: panels[id].title || id, quest: panels[id].quest || '' }))
      .filter(item => item.title.toLowerCase().includes(q) || item.quest.toLowerCase().includes(q))
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
        <span class="search-result-desc">${highlight(item.quest, query)}</span>
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

  function openOverlay(){
    overlay.hidden = false;
    input.value = '';
    resultsEl.innerHTML = '';
    emptyEl.hidden = true;
    activeIndex = -1;
    requestAnimationFrame(() => input.focus());
  }

  function closeOverlay(){
    overlay.hidden = true;
    input.blur();
  }

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
