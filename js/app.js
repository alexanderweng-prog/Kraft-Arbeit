/* App: Navigation, Startseite, Modulansicht, Abschlusstest, Formelkarte, Quellen. */
(function () {
  const el = KA.el, app = document.getElementById('app');
  const MODS = window.KMODS, FILMS = window.KFILMS, SIMS = window.KSIMS;

  /* ---------- Kopfzeile ---------- */
  const pill = document.getElementById('scorePill');
  const bVoice = document.getElementById('btnVoice'), bSound = document.getElementById('btnSound');
  function refreshPill(bump) {
    pill.textContent = KA.points() + ' P';
    if (bump) { pill.classList.remove('bump'); void pill.offsetWidth; pill.classList.add('bump'); }
  }
  KA.onPoints = () => refreshPill(true);
  function refreshToggles() {
    bVoice.setAttribute('aria-pressed', String(!!KA.state.voice));
    bSound.setAttribute('aria-pressed', String(!!KA.state.sound));
  }
  bVoice.addEventListener('click', () => { KA.state.voice = !KA.state.voice; KA.save(); refreshToggles(); if (!KA.state.voice) KA.stopSpeak(); KA.toast(KA.state.voice ? 'Vorlesen eingeschaltet' : 'Vorlesen ausgeschaltet'); });
  bSound.addEventListener('click', () => { KA.state.sound = !KA.state.sound; KA.save(); refreshToggles(); KA.sfx('click'); KA.toast(KA.state.sound ? 'Töne eingeschaltet' : 'Töne ausgeschaltet'); });
  refreshToggles(); refreshPill();

  /* ---------- Fortschritt ---------- */
  function stepDone(mod, i) {
    const s = mod.steps[i];
    if (s.k === 'lesson') return !!KA.state.lessons[mod.id + '-' + i];
    if (s.k === 'film') return !!KA.state.films[s.film];
    if (s.k === 'sim') return !!KA.state.sims[s.sim];
    if (s.k === 'ex') return !!KA.state.ex[s.ex.id];
    return false;
  }
  function modProgress(mod) {
    let d = 0; mod.steps.forEach((_, i) => { if (stepDone(mod, i)) d++; });
    return { done: d, total: mod.steps.length, pct: Math.round(d / mod.steps.length * 100) };
  }
  const fmtTime = (sec) => { const m = Math.floor(sec / 60), s = Math.floor(sec % 60); return `${m}:${String(s).padStart(2, '0')}`; };
  const totalMin = MODS.reduce((a, m) => a + m.min, 0) + 12;

  /* ---------- Zeitmessung pro Modul ---------- */
  let timerMod = null, timerEl = null, lastTick = 0;
  setInterval(() => {
    if (!timerMod || document.hidden) { lastTick = performance.now(); return; }
    const now = performance.now();
    const dt = Math.min(5, (now - lastTick) / 1000); lastTick = now;
    KA.state.time[timerMod] = (KA.state.time[timerMod] || 0) + dt;
    if (timerEl) timerEl.textContent = 'Zeit in diesem Modul: ' + fmtTime(KA.state.time[timerMod]);
    if (Math.floor(KA.state.time[timerMod]) % 10 === 0) KA.save();
  }, 1000);

  /* ---------- Router ---------- */
  function route() {
    KA.stopAll();
    timerMod = null; timerEl = null; lastTick = performance.now();
    const h = (location.hash || '#start').slice(1);
    app.innerHTML = '';
    let m;
    if ((m = h.match(/^(m\d+)(?:-(\d+))?$/)) && MODS.find(x => x.id === m[1])) renderModule(MODS.find(x => x.id === m[1]), m[2] !== undefined ? +m[2] : null);
    else if (h === 'test') renderTest();
    else if (h === 'formeln') renderFormulas();
    else if (h === 'quellen') renderSources();
    else if (h === 'abschluss') renderCert();
    else renderHome();
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);
  const go = (hash) => { if (location.hash === '#' + hash) route(); else location.hash = hash; };

  /* ---------- Startseite ---------- */
  function renderHome() {
    const hero = el('section', { class: 'hero' });
    const txt = el('div', {},
      el('p', { class: 'eyebrow' }, 'Physik · Sekundarstufe I'),
      el('h1', {}, 'Kraft & Arbeit'),
      el('p', { class: 'lead' }, 'Lerne in acht Modulen, was Kräfte bewirken, wie man sie misst und wann in der Physik Arbeit verrichtet wird – mit Erklärfilmen, Laboren zum Ausprobieren und vielen Aufgaben.'),
    );
    const next = MODS.find(mm => modProgress(mm).pct < 100);
    const row = el('div', { class: 'btn-row' },
      el('a', { class: 'btn', href: next ? '#' + next.id : '#test' }, next ? (modProgress(next).done ? `Weiter mit Modul ${next.nr}` : (next.nr === 1 ? 'Los geht’s' : `Weiter mit Modul ${next.nr}`)) : 'Zum Abschlusstest'),
      el('a', { class: 'btn ghost', href: '#formeln' }, 'Formelkarte'));
    txt.appendChild(row);
    const nEx = MODS.reduce((a, mm) => a + mm.steps.filter(s => s.k === 'ex').length, 0) + 15;
    txt.appendChild(el('div', { class: 'stats' },
      el('span', {}, el('b', {}, String(Object.keys(FILMS).length)), ' Erklärfilme'),
      el('span', {}, el('b', {}, String(Object.keys(SIMS).length)), ' Labore'),
      el('span', {}, el('b', {}, String(nEx)), ' Aufgaben'),
      el('span', {}, 'ca. ', el('b', {}, String(Math.round(totalMin / 5) * 5)), ' Minuten')));
    const cvBox = el('div', { class: 'hero-art' });
    hero.append(txt, cvBox);
    app.appendChild(hero);
    heroAnim(cvBox);

    app.appendChild(el('div', { class: 'path-head' }, el('h2', {}, 'Dein Lernpfad'), el('span', { class: 'tip' }, 'Die Module bauen aufeinander auf. Du kannst aber jederzeit springen.')));
    const list = el('div', { class: 'module-list' });
    MODS.forEach(mm => {
      const pr = modProgress(mm);
      const t = KA.state.time[mm.id] || 0;
      list.appendChild(el('a', { class: 'mcard' + (pr.pct === 100 ? ' done' : ''), href: '#' + mm.id },
        el('span', { class: 'num' }, pr.pct === 100 ? '✓' : String(mm.nr)),
        el('div', {}, el('h3', {}, mm.title), el('p', { class: 'sub' }, mm.sub),
          el('div', { class: 'meta' }, el('span', {}, `ca. ${mm.min} min`), el('span', {}, `${pr.done}/${pr.total} Stationen`), t > 30 ? el('span', {}, 'gelernt ' + fmtTime(t)) : null),
          el('div', { class: 'bar' }, el('i', { style: `width:${pr.pct}%` })))));
    });
    const tst = KA.state.test;
    list.appendChild(el('a', { class: 'mcard' + (tst ? ' done' : ''), href: '#test' },
      el('span', { class: 'num' }, tst ? '✓' : '9'),
      el('div', {}, el('h3', {}, 'Abschlusstest'), el('p', { class: 'sub' }, '15 gemischte Fragen aus allen Modulen'),
        el('div', { class: 'meta' }, el('span', {}, 'ca. 12 min'), tst ? el('span', {}, `bestes Ergebnis: ${tst.correct}/${tst.total}`) : el('span', {}, 'noch nicht gemacht')))));
    app.appendChild(list);

    const resetBox = el('span', { class: 'confirm-inline' });
    const bReset = el('button', { class: 'btn ghost small', type: 'button' }, 'Fortschritt zurücksetzen');
    bReset.addEventListener('click', () => {
      resetBox.innerHTML = '';
      const yes = el('button', { class: 'btn small', type: 'button' }, 'Ja, alles löschen');
      const no = el('button', { class: 'btn ghost small', type: 'button' }, 'Abbrechen');
      yes.addEventListener('click', () => { KA.reset(); refreshPill(); route(); KA.toast('Fortschritt gelöscht'); });
      no.addEventListener('click', () => { resetBox.innerHTML = ''; resetBox.appendChild(bReset); });
      resetBox.append(el('span', {}, 'Wirklich alle Punkte löschen? '), yes, no);
    });
    resetBox.appendChild(bReset);
    app.appendChild(el('div', { class: 'extras' },
      el('a', { class: 'extra', href: '#formeln' }, el('h3', {}, 'Formelkarte'), el('p', {}, 'Alle Formeln, Einheiten und Ortsfaktoren auf einen Blick.')),
      el('a', { class: 'extra', href: '#quellen' }, el('h3', {}, 'Mehr entdecken'), el('p', {}, 'Simulationen und Videos anderer Anbieter zum Weiterlernen.')),
      el('a', { class: 'extra', href: '#abschluss' }, el('h3', {}, 'Mein Abschluss'), el('p', {}, 'Punkte, Abzeichen und Lernzeit.'))));
    app.appendChild(el('p', { class: 'tip', style: 'margin-top:18px' }, 'Dein Fortschritt wird nur in diesem Browser gespeichert. ', resetBox));
  }

  function heroAnim(box) {
    const cvo = KD.makeCanvas(box, 800, 520, 'Animation: Eine Person zieht eine Kiste, Kraftpfeil und Weg werden angezeigt');
    cvo.wrap.classList.add('hero-canvas');
    KA.loop((dt, now) => {
      const c = cvo.begin(), ctx = cvo.ctx;
      KD.grid(ctx, 800, 520);
      const T = now % 8;
      const u = KD.ease(Math.min(1, T / 6));
      const x = 120 + u * 380;
      KD.ground(ctx, 400);
      KD.box(ctx, x, 300, 100, 100, { crate: true });
            const pr = KD.person(ctx, x + 215, 400, { dir: -1, lean: 0, armR: 25, armL: 30, step: T < 6 ? Math.sin(now * 6) * 6 : 0 });
      KD.rope(ctx, [[x + 100, 350], [pr.hand.x, pr.hand.y]]);
      KD.arrow(ctx, x + 100, 290, x + 200, 290, { label: 'F = 80 N', ly: 276, width: 6 });
      KD.arrow(ctx, 120, 450, Math.max(130, x), 450, { color: c.work, width: 4, label: `s = ${KA.fmt(u * 3, 1)} m`, ly: 480 });
      KD.text(ctx, `W = F · s = ${Math.round(80 * u * 3)} J`, 60, 90, { font: 'mono', size: 30, weight: 700, color: c.work });
      KD.text(ctx, 'Kraft × Weg = Arbeit', 60, 130, { size: 20, color: c.muted });
    });
  }

  /* ---------- Modulansicht ---------- */
  function renderModule(mod, stepIdx) {
    if (stepIdx === null) { stepIdx = mod.steps.findIndex((_, i) => !stepDone(mod, i)); if (stepIdx < 0) stepIdx = 0; }
    stepIdx = Math.max(0, Math.min(mod.steps.length - 1, stepIdx));
    timerMod = mod.id;
    timerEl = el('span', { class: 'timer' }, 'Zeit in diesem Modul: ' + fmtTime(KA.state.time[mod.id] || 0));
    app.appendChild(el('div', { class: 'mod-head' },
      el('div', {}, el('a', { class: 'back', href: '#start' }, '← Lernpfad'), el('p', { class: 'eyebrow' }, `Modul ${mod.nr} von ${MODS.length}`), el('h1', { style: 'font-size:clamp(1.7rem,4vw,2.4rem)' }, mod.title)),
      timerEl));
    const stepper = el('nav', { class: 'stepper', 'aria-label': 'Stationen' });
    const labels = { lesson: 'Lernen', film: 'Film', sim: 'Labor', ex: 'Aufgabe' };
    let exN = 0;
    mod.steps.forEach((s, i) => {
      const lab = s.k === 'ex' ? `${labels.ex} ${++exN}` : labels[s.k];
      const b = el('button', { type: 'button', class: `k-${s.k}${i === stepIdx ? ' cur' : ''}${stepDone(mod, i) ? ' ok' : ''}`, 'aria-current': i === stepIdx ? 'step' : null }, el('span', { class: 'k' }), lab);
      b.addEventListener('click', () => go(`${mod.id}-${i}`));
      stepper.appendChild(b);
    });
    app.appendChild(stepper);
    const step = mod.steps[stepIdx];
    const panel = el('section', { class: 'panel' });
    app.appendChild(panel);
    const markStepper = () => { const b = stepper.children[stepIdx]; if (b && stepDone(mod, stepIdx)) b.classList.add('ok'); };

    if (step.k === 'lesson') {
      const les = el('div', { class: 'lesson' });
      les.innerHTML = step.html;
      panel.append(el('div', { class: 'kind' }, el('h2', {}, step.title), KA.readButton(() => step.title + '. ' + KA.plain(step.html))), les);
      if (!KA.state.lessons[mod.id + '-' + stepIdx]) { KA.state.lessons[mod.id + '-' + stepIdx] = true; KA.save(); }
      markStepper();
    } else if (step.k === 'film') {
      const f = FILMS[step.film];
      panel.append(el('div', { class: 'kind' }, el('div', {}, el('p', { class: 'eyebrow' }, 'Erklärfilm'), el('h2', {}, f.title)),
        el('span', { class: 'tip' }, KA.voiceAvailable() ? 'Mit Sprecherstimme (oben rechts ein-/ausschaltbar)' : 'Untertitel unter dem Bild')));
      KA.filmPlayer(f, panel, () => { markStepper(); refreshPill(); });
    } else if (step.k === 'sim') {
      const sim = SIMS[step.sim];
      const task = el('div', { class: 'task' + (KA.state.sims[step.sim] ? ' solved' : '') }, el('p', { class: 'eyebrow' }, KA.state.sims[step.sim] ? 'Auftrag erfüllt ✓' : 'Dein Auftrag'), el('p', {}, sim.task));
      panel.append(el('div', { class: 'kind' }, el('div', {}, el('p', { class: 'eyebrow' }, 'Labor'), el('h2', {}, sim.title)), KA.readButton(() => sim.task)), task);
      sim.mount(panel, () => {
        task.classList.add('solved'); task.firstChild.textContent = 'Auftrag erfüllt ✓';
        if (!KA.state.sims[step.sim]) { KA.state.sims[step.sim] = true; KA.save(); KA.onPoints(5); KA.sfx('win'); KA.toast('Auftrag erfüllt: +5 Punkte'); }
        markStepper();
      });
    } else if (step.k === 'ex') {
      KA.renderExercise(step.ex, panel, () => { markStepper(); refreshPill(); });
      panel.querySelector('.kind').appendChild(KA.readButton(() => KA.plain((step.ex.q || '') + ' ' + (step.ex.text ? step.ex.text.replace(/\{[^}]+\}/g, ' Lücke ') : '') + (step.ex.options ? ' ' + step.ex.options.map((o, i) => o).join('. ') : '') + (step.ex.items && step.ex.type === 'tf' ? ' ' + step.ex.items.map(x => x.t).join(' ') : ''))));
    }

    const nav = el('div', { class: 'step-nav' });
    const prev = el('button', { class: 'btn ghost', type: 'button' }, '← Zurück');
    prev.disabled = stepIdx === 0;
    prev.addEventListener('click', () => go(`${mod.id}-${stepIdx - 1}`));
    const last = stepIdx === mod.steps.length - 1;
    const next = el('button', { class: 'btn', type: 'button' }, last ? 'Modul abschliessen ✓' : 'Weiter →');
    next.addEventListener('click', () => { if (last) renderModuleEnd(mod); else go(`${mod.id}-${stepIdx + 1}`); });
    nav.append(prev, next);
    app.appendChild(nav);
  }

  function renderModuleEnd(mod) {
    KA.stopAll();
    app.innerHTML = '';
    const pr = modProgress(mod);
    const pts = mod.steps.reduce((a, s) => a + (s.k === 'ex' && KA.state.ex[s.ex.id] ? KA.state.ex[s.ex.id].pts : 0) + (s.k === 'film' && KA.state.films[s.film] ? 5 : 0) + (s.k === 'sim' && KA.state.sims[s.sim] ? 5 : 0), 0);
    const max = mod.steps.reduce((a, s) => a + (s.k === 'ex' ? 10 : s.k === 'lesson' ? 0 : 5), 0);
    const nextMod = MODS[MODS.indexOf(mod) + 1];
    if (pr.pct === 100) KA.sfx('win');
    const open = mod.steps.map((s, i) => !stepDone(mod, i) ? i : -1).filter(i => i >= 0);
    app.appendChild(el('section', { class: 'panel', style: 'text-align:center' },
      el('p', { class: 'eyebrow' }, `Modul ${mod.nr}`), el('h1', {}, pr.pct === 100 ? 'Modul geschafft!' : 'Fast geschafft'),
      el('p', { class: 'result-big' }, `${pts} / ${max} P`),
      el('p', {}, `${pr.done} von ${pr.total} Stationen erledigt · Lernzeit ${fmtTime(KA.state.time[mod.id] || 0)}`),
      open.length ? el('p', { class: 'tip' }, 'Noch offen: ', ...open.map(i => el('a', { href: `#${mod.id}-${i}`, style: 'margin:0 4px' }, `Station ${i + 1}`))) : null,
      el('div', { class: 'btn-row', style: 'justify-content:center' },
        nextMod ? el('a', { class: 'btn', href: '#' + nextMod.id }, `Weiter zu Modul ${nextMod.nr}: ${nextMod.title}`) : el('a', { class: 'btn', href: '#test' }, 'Zum Abschlusstest'),
        el('a', { class: 'btn ghost', href: '#start' }, 'Zum Lernpfad'))));
    window.scrollTo(0, 0);
  }

  /* ---------- Abschlusstest ---------- */
  function renderTest() {
    app.appendChild(el('div', { class: 'mod-head' }, el('div', {}, el('a', { class: 'back', href: '#start' }, '← Lernpfad'), el('p', { class: 'eyebrow' }, 'Abschlusstest'), el('h1', { style: 'font-size:clamp(1.7rem,4vw,2.4rem)' }, 'Zeig, was du kannst'))));
    const intro = el('section', { class: 'panel' },
      el('p', {}, '15 Fragen aus allen Modulen, zufällig gemischt. Du hast pro Frage nur einen Versuch. Danach siehst du sofort die Lösung.'),
      el('p', { class: 'tip' }, 'Rechne mit g = 9,81 N/kg. Dezimalzahlen darfst du mit Komma oder Punkt schreiben.'));
    const bStart = el('button', { class: 'btn', type: 'button' }, 'Test starten');
    intro.appendChild(el('div', { class: 'btn-row' }, bStart));
    if (KA.state.test) intro.appendChild(el('p', { class: 'tip' }, `Dein bestes Ergebnis bisher: ${KA.state.test.correct} von ${KA.state.test.total} richtig.`));
    app.appendChild(intro);
    bStart.addEventListener('click', () => {
      const qs = KA.shuffle(window.KTEST).slice(0, 15);
      let i = 0, correct = 0;
      const area = el('section', { class: 'panel' });
      intro.replaceWith(area);
      const show = () => {
        KA.stopAll(); area.innerHTML = '';
        if (i >= qs.length) return finish();
        area.appendChild(el('p', { class: 'eyebrow' }, `Frage ${i + 1} von ${qs.length} · ${correct} richtig`));
        const bar = el('div', { class: 'bar' }, el('i', { style: `width:${i / qs.length * 100}%` }));
        area.appendChild(bar);
        const holder = el('div'); area.appendChild(holder);
        const ex = Object.assign({}, qs[i], { id: 'test-' + qs[i].id + '-' + Date.now() });
        KA.renderExercise(ex, holder, (r) => {
          if (r.ok) correct++;
          const nb = el('button', { class: 'btn', type: 'button' }, i + 1 < qs.length ? 'Nächste Frage →' : 'Auswertung');
          nb.addEventListener('click', () => { i++; show(); });
          area.appendChild(el('div', { class: 'step-nav' }, el('span'), nb));
        }, { noStore: true, single: true });
      };
      const finish = () => {
        const pts = correct * 6;
        const best = KA.state.test;
        if (!best || best.correct < correct) { KA.state.test = { correct, total: qs.length, pts, date: new Date().toISOString() }; KA.save(); refreshPill(true); }
        const pct = correct / qs.length;
        KA.sfx(pct >= .6 ? 'win' : 'bad');
        area.innerHTML = '';
        area.append(el('p', { class: 'eyebrow' }, 'Auswertung'),
          el('p', { class: 'result-big' }, `${correct} / ${qs.length}`),
          el('p', {}, pct >= .9 ? 'Hervorragend – du beherrschst Kraft und Arbeit.' : pct >= .7 ? 'Gut gemacht! Ein paar Stellen kannst du noch festigen.' : pct >= .5 ? 'Solide Basis. Wiederhole die Module, bei denen du unsicher warst.' : 'Schau dir die Module nochmals an und versuche es dann erneut.'),
          el('div', { class: 'btn-row' }, el('a', { class: 'btn', href: '#abschluss' }, 'Zu meinem Abschluss'), el('button', { class: 'btn ghost', type: 'button', onclick: () => route() }, 'Test wiederholen')));
      };
      show();
    });
  }

  /* ---------- Abschluss / Urkunde ---------- */
  function renderCert() {
    const totalT = Object.values(KA.state.time).reduce((a, b) => a + b, 0);
    const badges = MODS.map(mm => ({ t: mm.title, got: modProgress(mm).pct === 100 }));
    badges.push({ t: 'Abschlusstest ≥ 80 %', got: !!(KA.state.test && KA.state.test.correct / KA.state.test.total >= 0.8) });
    const nameIn = el('input', { type: 'text', id: 'cert-name', placeholder: 'Dein Name', value: KA.state.name || '', 'aria-label': 'Dein Name' });
    nameIn.addEventListener('input', () => { KA.state.name = nameIn.value; KA.save(); });
    app.append(el('div', { class: 'mod-head' }, el('div', {}, el('a', { class: 'back', href: '#start' }, '← Lernpfad'))),
      el('section', { class: 'cert' },
        el('p', { class: 'eyebrow' }, 'Lernnachweis'),
        el('h1', {}, 'Kraft & Arbeit'),
        nameIn,
        el('p', { class: 'result-big' }, KA.points() + ' Punkte'),
        el('p', {}, `Lernzeit: ${fmtTime(totalT)} · Abschlusstest: ${KA.state.test ? `${KA.state.test.correct}/${KA.state.test.total}` : 'noch offen'}`),
        el('div', { class: 'badges' }, ...badges.map(b => el('span', { class: 'badge' + (b.got ? ' got' : '') }, (b.got ? '✓ ' : '○ ') + b.t))),
        el('p', { class: 'tip' }, new Date().toLocaleDateString('de-CH', { day: 'numeric', month: 'long', year: 'numeric' }) + ' · Mach ein Bildschirmfoto als Nachweis für deine Lehrperson.')));
  }

  /* ---------- Formelkarte ---------- */
  function renderFormulas() {
    const cards = [
      ['Gewichtskraft', 'F<sub>G</sub> = m · g', 'g (Erde) = 9,81 N/kg · Mond 1,62 · Mars 3,71 · Jupiter 24,79'],
      ['Federkraft (Hooke)', 'F = D · s', 'D: Federkonstante in N/cm, gilt bis zur Elastizitätsgrenze'],
      ['Kraftpfeil', 'Länge = F : Massstab', 'z. B. 1 cm ≙ 10 N'],
      ['Kräfte auf einer Linie', 'F<sub>res</sub> = F₁ + F₂ bzw. F₁ − F₂', 'Gleichgewicht: F<sub>res</sub> = 0 N'],
      ['Reibung (Zusatz)', 'F<sub>R</sub> = μ · F<sub>N</sub>', 'Haftreibung > Gleitreibung > Rollreibung'],
      ['Arbeit', 'W = F · s', '1 J = 1 N · 1 m = 1 Nm · Kraft und Weg in gleicher Richtung'],
      ['Hubarbeit', 'W = F<sub>G</sub> · h = m · g · h', 'nur der Höhenunterschied zählt'],
      ['Spannarbeit (Zusatz)', 'W = ½ · F · s', 'F: Endkraft der Feder'],
      ['Hebelgesetz', 'F₁ · a₁ = F₂ · a₂', 'a: Abstand zur Drehachse'],
      ['Flaschenzug', 'F = F<sub>G</sub> : n · s = n · h', 'n: tragende Seilstücke'],
      ['Schiefe Ebene', 'F = F<sub>G</sub> · h : l', 'ohne Reibung'],
      ['Goldene Regel', 'F₁ · s₁ = F₂ · s₂', 'Was man an Kraft spart, muss man an Weg zusetzen.']
    ];
    app.append(el('div', { class: 'mod-head' }, el('div', {}, el('a', { class: 'back', href: '#start' }, '← Lernpfad'), el('h1', { style: 'font-size:clamp(1.7rem,4vw,2.4rem)' }, 'Formelkarte'))),
      el('div', { class: 'formula-sheet' }, ...cards.map(c => el('div', { class: 'fs-card' }, el('h3', {}, c[0]), el('div', { class: 'formula-box', html: c[1] }), el('p', { class: 'tip', html: c[2] })))),
      el('h2', { style: 'margin-top:28px' }, 'Einheiten'),
      el('div', { class: 'table-wrap', style: 'margin-top:10px' }, el('table', { class: 'data', html: '<tr><th>Grösse</th><th>Zeichen</th><th>Einheit</th></tr><tr><td style="text-align:left">Kraft</td><td>F</td><td>Newton (N)</td></tr><tr><td style="text-align:left">Masse</td><td>m</td><td>Kilogramm (kg)</td></tr><tr><td style="text-align:left">Ortsfaktor</td><td>g</td><td>N/kg</td></tr><tr><td style="text-align:left">Weg, Höhe</td><td>s, h</td><td>Meter (m)</td></tr><tr><td style="text-align:left">Arbeit</td><td>W</td><td>Joule (J)</td></tr><tr><td style="text-align:left">Federkonstante</td><td>D</td><td>N/cm oder N/m</td></tr>' })));
  }

  /* ---------- Quellen ---------- */
  function renderSources() {
    const yt = (q) => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q);
    const links = [
      ['PhET: Kräfte und Bewegung – Grundlagen', 'https://phet.colorado.edu/de/simulations/forces-and-motion-basics', 'Tauziehen, Reibung, Beschleunigung (Universität Colorado, kostenlos)'],
      ['PhET: Hookesches Gesetz', 'https://phet.colorado.edu/de/simulations/hookes-law', 'Federn dehnen und Federkonstante untersuchen'],
      ['PhET: Massen und Federn – Grundlagen', 'https://phet.colorado.edu/de/simulations/masses-and-springs-basics', 'Gewichte an Federn, auch auf anderen Planeten'],
      ['PhET: Balancieren', 'https://phet.colorado.edu/de/simulations/balancing-act', 'Hebelgesetz an der Wippe'],
      ['PhET: Reibung', 'https://phet.colorado.edu/de/simulations/friction', 'Reibung auf Teilchenebene'],
      ['LEIFIphysik: Mechanik', 'https://www.leifiphysik.de/mechanik', 'Erklärungen, Versuche und Aufgaben'],
      ['YouTube-Suche: Kraft einfach erklärt', yt('Kraft Physik einfach erklärt Newton'), 'Erklärvideos verschiedener Kanäle'],
      ['YouTube-Suche: Masse und Gewichtskraft', yt('Masse Gewichtskraft Unterschied Physik'), ''],
      ['YouTube-Suche: Hookesches Gesetz', yt('Hookesches Gesetz einfach erklärt'), ''],
      ['YouTube-Suche: Mechanische Arbeit', yt('mechanische Arbeit Physik einfach erklärt'), ''],
      ['YouTube-Suche: Goldene Regel der Mechanik', yt('Goldene Regel der Mechanik Flaschenzug Hebel'), '']
    ];
    app.append(el('div', { class: 'mod-head' }, el('div', {}, el('a', { class: 'back', href: '#start' }, '← Lernpfad'), el('h1', { style: 'font-size:clamp(1.7rem,4vw,2.4rem)' }, 'Mehr entdecken'))),
      el('p', { class: 'tip', style: 'margin-bottom:14px' }, 'Diese Angebote gehören nicht zur App und öffnen sich in einem neuen Tab. Inhalte externer Seiten können sich ändern.'),
      el('ul', { class: 'link-list' }, ...links.map(l => el('li', {}, el('a', { href: l[1], target: '_blank', rel: 'noopener' }, l[0]), l[2] ? el('small', {}, l[2]) : null))));
  }

  route();
})();
