/* ============================================================
   js/kanaquiz.js — Interaktives Kana-Erkennungs-Quiz im
   Kana-Quiz-Panel. Nutzt dieselben Zeichen-Daten wie die
   Kana-Tabellen (HIRAGANA- und KATAKANA-Arrays aus js/app.js) und
   die Sprachausgabe speakKana() aus js/windows.js. windows.js ruft
   initKanaQuiz() auf, sobald pages/kanaquiz.html in das Fenster
   eingesetzt wurde (siehe finalizeContent()).
   ============================================================ */

const KANA_QUIZ_LENGTH = 10;
const KANA_QUIZ_CHOICES = 4;

function kanaQuizPool(mode){
  if(mode === 'hiragana') return [...HIRAGANA_MAIN, ...HIRAGANA_DAKUTEN, ...HIRAGANA_YOON].filter(Boolean);
  if(mode === 'katakana') return [...KATAKANA_MAIN, ...KATAKANA_DAKUTEN, ...KATAKANA_YOON].filter(Boolean);
  return [
    ...HIRAGANA_MAIN, ...HIRAGANA_DAKUTEN, ...HIRAGANA_YOON,
    ...KATAKANA_MAIN, ...KATAKANA_DAKUTEN, ...KATAKANA_YOON
  ].filter(Boolean);
}

function kanaQuizShuffle(arr){
  const a = arr.slice();
  for(let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildKanaQuizQuestions(mode){
  const pool = kanaQuizPool(mode);
  const picks = kanaQuizShuffle(pool).slice(0, KANA_QUIZ_LENGTH);
  return picks.map(cell => {
    const distractorPool = pool.filter(c => c[1] !== cell[1]);
    const distractors = kanaQuizShuffle(distractorPool).slice(0, KANA_QUIZ_CHOICES - 1).map(c => c[1]);
    return { char: cell[0], answer: cell[1], options: kanaQuizShuffle([cell[1], ...distractors]) };
  });
}

const KANA_QUIZ_MODE_LABELS = {
  hiragana: 'ひらがな Hiragana',
  katakana: 'カタカナ Katakana',
  mixed: 'Gemischt'
};

function renderKanaQuizStart(root){
  root.innerHTML = `
    <p class="win-p">
      Wähle, welche Zeichen du üben möchtest. Du bekommst ${KANA_QUIZ_LENGTH}
      Fragen mit je vier Antwortmöglichkeiten.
    </p>
    <div class="quiz-mode-options">
      <button class="toc-item quiz-mode-btn" data-quiz-mode="hiragana">ひらがな Hiragana</button>
      <button class="toc-item quiz-mode-btn" data-quiz-mode="katakana">カタカナ Katakana</button>
      <button class="toc-item quiz-mode-btn" data-quiz-mode="mixed">Gemischt</button>
    </div>
  `;
}

function renderKanaQuizQuestion(root, session){
  const q = session.questions[session.index];
  const answered = session.answeredThis;
  root.innerHTML = `
    <div class="quiz-progress">
      <span>Frage ${session.index + 1} von ${session.questions.length}</span>
      <span>${session.score} richtig</span>
    </div>
    <div class="quiz-char-wrap">
      <span class="quiz-char">${q.char}</span>
      <button type="button" class="inline-link quiz-listen" data-quiz-listen>🔊 anhören</button>
    </div>
    <div class="quiz-options">
      ${q.options.map(opt => {
        let cls = 'toc-item quiz-option';
        if(answered){
          if(opt === q.answer) cls += ' correct';
          else if(opt === session.selected) cls += ' wrong';
        }
        return `<button type="button" class="${cls}" data-quiz-answer="${opt}" ${answered ? 'disabled' : ''}>${opt}</button>`;
      }).join('')}
    </div>
    ${answered ? `<button type="button" class="toc-item" data-quiz-next>${session.index + 1 < session.questions.length ? 'Weiter →' : 'Ergebnis ansehen →'}</button>` : ''}
  `;
}

function renderKanaQuizResult(root, session){
  root.innerHTML = `
    <div class="decision-result">
      <p class="win-p">
        Du hast <strong>${session.score} von ${session.questions.length}</strong>
        (${KANA_QUIZ_MODE_LABELS[session.mode]}) richtig beantwortet.
      </p>
      <div class="decision-result-actions">
        <button class="toc-item" data-quiz-restart="${session.mode}">Nochmal üben</button>
        <button class="inline-link" data-quiz-restart="">Anderen Modus wählen</button>
      </div>
    </div>
  `;
}

function initKanaQuiz(contentEl){
  const root = contentEl.querySelector('#kanaQuizRoot');
  if(!root) return;

  let session = null;
  renderKanaQuizStart(root);

  function startSession(mode){
    session = {
      mode,
      questions: buildKanaQuizQuestions(mode),
      index: 0,
      score: 0,
      answeredThis: false,
      selected: null
    };
    renderKanaQuizQuestion(root, session);
  }

  root.addEventListener('click', (e) => {
    const modeBtn = e.target.closest('[data-quiz-mode]');
    if(modeBtn){
      startSession(modeBtn.dataset.quizMode);
      return;
    }

    const listenBtn = e.target.closest('[data-quiz-listen]');
    if(listenBtn && session){
      speakKana(session.questions[session.index].char, listenBtn);
      return;
    }

    const answerBtn = e.target.closest('[data-quiz-answer]');
    if(answerBtn && session && !session.answeredThis){
      const chosen = answerBtn.dataset.quizAnswer;
      session.answeredThis = true;
      session.selected = chosen;
      if(chosen === session.questions[session.index].answer) session.score += 1;
      renderKanaQuizQuestion(root, session);
      return;
    }

    const nextBtn = e.target.closest('[data-quiz-next]');
    if(nextBtn && session){
      session.index += 1;
      session.answeredThis = false;
      session.selected = null;
      if(session.index >= session.questions.length){
        renderKanaQuizResult(root, session);
      } else {
        renderKanaQuizQuestion(root, session);
      }
      return;
    }

    const restartBtn = e.target.closest('[data-quiz-restart]');
    if(restartBtn){
      const mode = restartBtn.dataset.quizRestart;
      if(mode){
        startSession(mode);
      } else {
        session = null;
        renderKanaQuizStart(root);
      }
    }
  });
}
