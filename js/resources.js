/* ============================================================
   js/resources.js — Logik für den Ressourcen-Tab: rendert die
   Ressourcen-Bibliothek aus data/resources.js in die leeren
   Grid-Container von pages/ressourcen.html und kümmert sich um
   das Scrollen zu einem Abschnitt (Toolbar-Sprungmarken).

   Voraussetzung: data/resources.js muss VOR dieser Datei geladen
   werden (definiert das globale RESOURCE_LIBRARY-Objekt).
   ============================================================ */

function badgeHtml(badge){
  const typeClass = badge.type ? ' ' + badge.type : '';
  return `<span class="resource-badge${typeClass}">${badge.label}</span>`;
}

function resourceCardHtml(item){
  const recommendedClass = item.recommended ? ' recommended' : '';
  const badges = (item.badges || []).map(badgeHtml).join('');
  const verdict = item.verdictLabel
    ? `<p class="resource-verdict"><strong>${item.verdictLabel}</strong> ${item.verdict}</p>`
    : '';

  return `
    <article class="resource-library-card${recommendedClass}">
      <span class="eyebrow">${item.eyebrow}</span>
      <h4 class="resource-card-title">${item.title}</h4>
      <div class="resource-meta">${badges}</div>
      <p class="resource-summary">${item.summary}</p>
      ${verdict}
      <a class="toc-item" href="${item.href}" target="_blank" rel="noopener">${item.linkLabel}</a>
    </article>
  `;
}

/* Füllt alle [data-resource-grid]-Container innerhalb von contentRoot
   mit den passenden Karten aus RESOURCE_LIBRARY. Wird von windows.js
   direkt nach dem Einsetzen von pages/ressourcen.html aufgerufen. */
function renderResourceLibrary(contentRoot){
  if(typeof RESOURCE_LIBRARY === 'undefined') return;
  const grids = contentRoot.querySelectorAll('[data-resource-grid]');

  grids.forEach(grid => {
    const sectionId = grid.getAttribute('data-resource-grid');
    const section = RESOURCE_LIBRARY[sectionId];
    if(!section) return;
    grid.innerHTML = section.items.map(resourceCardHtml).join('');
  });
}

/* Scrollt innerhalb des offenen Ressourcen-Fensters sanft zu einem
   Abschnitt (z. B. von der Toolbar oder von Verlinkungen aus anderen
   Fenstern aus, etwa "Core-Decks" im Wortschatz-Bereich). */
function scrollToResourceTarget(targetId){
  if(!targetId) return;

  requestAnimationFrame(() => {
    const resourceWindow = document.getElementById('window-ressourcen');
    if(!resourceWindow) return;

    const content = resourceWindow.querySelector('.window-content');
    const target = resourceWindow.querySelector('#' + CSS.escape(targetId));
    if(!content || !target) return;

    const top = Math.max(0, target.offsetTop - 18);
    content.scrollTo({ top, behavior: scrollBehaviorPref() });
  });
}
