/* Kern: Speicher, Ton, Sprachausgabe, Filmplayer, Aufgabentypen. */
(function () {
  const KA = window.KA = {};

  /* ---------- Hilfen ---------- */
  KA.el = function (tag, attrs = {}, ...kids) {
    const e = document.createElement(tag);
    for (const k in attrs) {
      const v = attrs[k];
      if (v === undefined || v === null || v === false) continue;
      if (k === 'class') e.className = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k === 'text') e.textContent = v;
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? '' : v);
    }
    for (const kid of kids.flat()) if (kid !== null && kid !== undefined && kid !== false) e.append(kid.nodeType ? kid : document.createTextNode(kid));
    return e;
  };
  KA.shuffle = function (arr, seed) {
    const a = arr.slice();
    let s = seed || Math.floor(Math.random() * 1e9);
    const rnd = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  KA.fmt = function (v, d = 2) {
    const r = Math.round(v * Math.pow(10, d)) / Math.pow(10, d);
    return String(r).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  };
  KA.plain = function (html) { const d = document.createElement('div'); d.innerHTML = html; return d.textContent.replace(/\s+/g, ' ').trim(); };
  /* Text für die Sprachausgabe: Formeln und Einheiten aussprechbar machen */
  KA.speakable = function (t) {
    return t
      .replace(/F_G/g, 'F G').replace(/F_R/g, 'F R').replace(/F_H/g, 'F H')
      .replace(/(\d)\s?N\/kg/g, '$1 Newton pro Kilogramm').replace(/N\/kg/g, 'Newton pro Kilogramm')
      .replace(/N\/cm/g, 'Newton pro Zentimeter').replace(/N\/m\b/g, 'Newton pro Meter')
      .replace(/(\d)\s?kN\b/g, '$1 Kilonewton').replace(/(\d)\s?N\b/g, '$1 Newton').replace(/(\d)\s?J\b/g, '$1 Joule').replace(/(\d)\s?kJ\b/g, '$1 Kilojoule')
      .replace(/(\d)\s?Nm\b/g, '$1 Newtonmeter').replace(/(\d)\s?kg\b/g, '$1 Kilogramm').replace(/(\d)\s?g\b/g, '$1 Gramm')
      .replace(/(\d)\s?cm\b/g, '$1 Zentimeter').replace(/(\d)\s?m\b/g, '$1 Meter')
      .replace(/·/g, ' mal ').replace(/≙/g, ' entspricht ').replace(/≈/g, ' ungefähr ').replace(/=/g, ' gleich ')
      .replace(/(\d),(\d)/g, '$1 Komma $2').replace(/'/g, '');
  };

  /* ---------- Speicher ---------- */
  const KEY = 'kraft-arbeit-v1';
  const blank = () => ({ ex: {}, films: {}, sims: {}, lessons: {}, time: {}, name: '', voice: true, sound: true, test: null });
  KA.state = blank();
  try { const raw = localStorage.getItem(KEY); if (raw) KA.state = Object.assign(blank(), JSON.parse(raw)); } catch (e) { /* ohne Speicher weiter */ }
  KA.save = function () { try { localStorage.setItem(KEY, JSON.stringify(KA.state)); } catch (e) { } };
  KA.reset = function () { const keep = { voice: KA.state.voice, sound: KA.state.sound }; KA.state = Object.assign(blank(), keep); KA.save(); };
  KA.points = function () {
    let p = 0;
    for (const k in KA.state.ex) p += KA.state.ex[k].pts || 0;
    for (const k in KA.state.films) if (KA.state.films[k]) p += 5;
    for (const k in KA.state.sims) if (KA.state.sims[k]) p += 5;
    if (KA.state.test) p += KA.state.test.pts || 0;
    return p;
  };
  KA.onPoints = () => { };

  /* ---------- Töne (Web Audio, selbst erzeugt) ---------- */
  let actx = null;
  function ac() {
    if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { actx = null; } }
    if (actx && actx.state === 'suspended') actx.resume();
    return actx;
  }
  function tone(freq, start, dur, type = 'sine', vol = 0.18) {
    const a = ac(); if (!a) return;
    const o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, a.currentTime + start);
    g.gain.exponentialRampToValueAtTime(vol, a.currentTime + start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + start + dur);
    o.connect(g); g.connect(a.destination);
    o.start(a.currentTime + start); o.stop(a.currentTime + start + dur + 0.05);
  }
  KA.sfx = function (kind) {
    if (!KA.state.sound) return;
    if (kind === 'ok') { tone(660, 0, .15, 'triangle'); tone(880, .1, .22, 'triangle'); }
    else if (kind === 'bad') { tone(220, 0, .25, 'sawtooth', .08); tone(180, .12, .25, 'sawtooth', .06); }
    else if (kind === 'click') { tone(1200, 0, .04, 'square', .04); }
    else if (kind === 'win') { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * .12, .3, 'triangle', .16)); }
    else if (kind === 'thud') { tone(90, 0, .25, 'sine', .3); }
    else if (kind === 'spring') { const a = ac(); if (!a) return; const o = a.createOscillator(), g = a.createGain(); o.type = 'sine';
      o.frequency.setValueAtTime(300, a.currentTime); o.frequency.exponentialRampToValueAtTime(900, a.currentTime + .25);
      g.gain.setValueAtTime(.12, a.currentTime); g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .3); o.connect(g); g.connect(a.destination); o.start(); o.stop(a.currentTime + .32); }
  };

  /* ---------- Sprachausgabe (Text-to-Speech des Geräts) ---------- */
  const synth = window.speechSynthesis || null;
  let voice = null;
  function pickVoice() {
    if (!synth) return;
    const vs = synth.getVoices();
    voice = vs.find(v => /de-CH/i.test(v.lang)) || vs.find(v => /^de/i.test(v.lang) && /google|natural|online/i.test(v.name)) || vs.find(v => /^de/i.test(v.lang)) || null;
  }
  if (synth) { pickVoice(); synth.onvoiceschanged = pickVoice; }
  KA.voiceAvailable = () => !!synth;
  KA.speak = function (text, onend) {
    if (!synth || !KA.state.voice) { if (onend) onend(false); return null; }
    synth.cancel();
    const u = new SpeechSynthesisUtterance(KA.speakable(text));
    u.lang = voice ? voice.lang : 'de-DE';
    if (voice) u.voice = voice;
    u.rate = 0.98;
    let fired = false;
    const done = () => { if (!fired) { fired = true; if (onend) onend(true); } };
    u.onend = done; u.onerror = done;
    synth.speak(u);
    return u;
  };
  KA.stopSpeak = function () { if (synth) synth.cancel(); };

  /* Vorlese-Knopf */
  KA.readButton = function (getText) {
    let speaking = false;
    const b = KA.el('button', { class: 'btn ghost small', type: 'button', title: 'Text vorlesen lassen' }, '▶ Vorlesen');
    b.addEventListener('click', () => {
      if (speaking) { KA.stopSpeak(); speaking = false; b.textContent = '▶ Vorlesen'; return; }
      if (!KA.state.voice) { KA.toast('Die Stimme ist ausgeschaltet. Oben rechts einschalten.'); return; }
      if (!KA.voiceAvailable()) { KA.toast('Dieses Gerät bietet keine Sprachausgabe an.'); return; }
      speaking = true; b.textContent = '■ Stopp';
      KA.speak(getText(), () => { speaking = false; b.textContent = '▶ Vorlesen'; });
    });
    return b;
  };

  /* ---------- Toast ---------- */
  let toastEl = null, toastT = 0;
  KA.toast = function (msg) {
    if (!toastEl) { toastEl = KA.el('div', { class: 'toast', role: 'status' }); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('show'), 2600);
  };

  /* ---------- Animations-Schleife mit Aufräumen ---------- */
  KA.loops = new Set();
  KA.loop = function (fn) {
    const L = { alive: true, raf: 0 };
    let last = performance.now();
    const tick = (now) => {
      if (!L.alive) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!document.hidden) fn(dt, now / 1000);
      L.raf = requestAnimationFrame(tick);
    };
    L.raf = requestAnimationFrame(tick);
    L.stop = () => { L.alive = false; cancelAnimationFrame(L.raf); KA.loops.delete(L); };
    KA.loops.add(L);
    return L;
  };
  KA.stopAll = function () { for (const L of [...KA.loops]) L.stop(); KA.stopSpeak(); };

  /* ---------- Filmplayer ---------- */
  KA.filmPlayer = function (film, container, onComplete) {
    const root = KA.el('div', { class: 'film' });
    container.appendChild(root);
    const cvo = KD.makeCanvas(root, 800, 450, 'Erklärfilm: ' + film.title);
    const overlay = KA.el('button', { class: 'play-overlay', type: 'button', 'aria-label': 'Film abspielen' }, KA.el('span', {}, '▶ Film starten'));
    cvo.wrap.appendChild(overlay);
    const prog = KA.el('div', { class: 'film-progress', 'aria-hidden': 'true' });
    film.scenes.forEach(() => prog.appendChild(KA.el('i')));
    const sub = KA.el('div', { class: 'subtitle', 'aria-live': 'polite' }, film.scenes[0].say);
    const bPrev = KA.el('button', { class: 'btn ghost small', type: 'button', 'aria-label': 'Vorherige Szene' }, '⏮');
    const bPlay = KA.el('button', { class: 'btn small', type: 'button' }, '▶ Abspielen');
    const bNext = KA.el('button', { class: 'btn ghost small', type: 'button', 'aria-label': 'Nächste Szene' }, '⏭');
    const bRe = KA.el('button', { class: 'btn ghost small', type: 'button' }, '↺ Szene wiederholen');
    const count = KA.el('span', { class: 'count' });
    root.append(prog, KA.el('div', { class: 'film-ctrl' }, bPrev, bPlay, bNext, bRe, count), sub);

    let idx = 0, t = 0, playing = false, speechDone = true, finished = false;
    const sceneDur = (s) => s.dur || Math.max(4.5, s.say.split(/\s+/).length * 0.42);
    function setScene(i, autoplaySpeech) {
      idx = KD.clamp(i, 0, film.scenes.length - 1); t = 0;
      sub.textContent = film.scenes[idx].say;
      [...prog.children].forEach((e, j) => e.classList.toggle('on', j <= idx));
      count.textContent = `Szene ${idx + 1} / ${film.scenes.length}`;
      speechDone = true;
      if (autoplaySpeech && KA.state.voice && KA.voiceAvailable()) {
        speechDone = false;
        const myIdx = idx;
        KA.speak(film.scenes[idx].say, () => { if (myIdx === idx) speechDone = true; });
      } else KA.stopSpeak();
    }
    function play() {
      playing = true; overlay.hidden = true; bPlay.textContent = '❚❚ Pause';
      if (finished) { finished = false; setScene(0, true); } else setScene(idx, true);
    }
    function pause() { playing = false; bPlay.textContent = '▶ Abspielen'; KA.stopSpeak(); speechDone = true; }
    overlay.addEventListener('click', play);
    bPlay.addEventListener('click', () => playing ? pause() : play());
    bPrev.addEventListener('click', () => { overlay.hidden = true; setScene(idx - 1, playing); });
    bNext.addEventListener('click', () => { overlay.hidden = true; if (idx === film.scenes.length - 1) { finish(); return; } setScene(idx + 1, playing); });
    bRe.addEventListener('click', () => { overlay.hidden = true; setScene(idx, playing); });
    function finish() {
      t = sceneDur(film.scenes[idx]);
      playing = false; finished = true; bPlay.textContent = '↺ Nochmals';
      if (!KA.state.films[film.id]) { KA.state.films[film.id] = true; KA.save(); KA.onPoints(5); }
      if (onComplete) onComplete();
    }
    setScene(0, false);
    KA.loop((dt) => {
      const s = film.scenes[idx];
      const dur = sceneDur(s);
      if (playing) {
        t += dt;
        if (t >= dur && speechDone) {
          if (idx < film.scenes.length - 1) setScene(idx + 1, true); else finish();
        }
      }
      const c = cvo.begin();
      KD.grid(cvo.ctx, 800, 450);
      const tt = Math.min(t, dur + 30);
      s.draw(cvo.ctx, tt, KD.clamp(tt / dur, 0, 1), c);
    });
    return root;
  };

  /* ---------- Aufgaben ---------- */
  const norm = (s) => String(s).toLowerCase().replace(/ß/g, 'ss').replace(/[\s ]+/g, ' ').replace(/[.!?]$/, '').trim();
  const toNum = (s) => { const v = parseFloat(String(s).replace(/'/g, '').replace(/\s/g, '').replace(',', '.')); return isNaN(v) ? null : v; };
  function within(v, ans, tol) {
    if (v === null) return false;
    if (tol === undefined) tol = Math.max(Math.abs(ans) * 0.02, 0.011);
    return Math.abs(v - ans) <= tol;
  }
  KA.checkText = function (val, answers) {
    const n = norm(val);
    if (!n) return false;
    return answers.some(a => {
      const na = norm(a);
      if (na === n) return true;
      const vn = toNum(n), an = toNum(na);
      if (an !== null && /^[\d.,'\s-]+$/.test(na) && vn !== null) return Math.abs(vn - an) < 1e-9 + Math.abs(an) * 0.005;
      return false;
    });
  };

  const types = {};

  types.mc = function (ex, body) {
    const multi = Array.isArray(ex.correct);
    const corr = multi ? ex.correct : [ex.correct];
    const order = ex.keepOrder ? ex.options.map((_, i) => i) : KA.shuffle(ex.options.map((_, i) => i));
    const box = KA.el('div', { class: 'opts' + (multi ? ' multi' : ''), role: multi ? 'group' : 'radiogroup' });
    const sel = new Set();
    const btns = [];
    order.forEach((oi, k) => {
      const b = KA.el('button', { class: 'opt', type: 'button', 'aria-pressed': 'false' },
        KA.el('span', { class: 'mark' }, String.fromCharCode(65 + k)), KA.el('span', { html: ex.options[oi] }));
      b.addEventListener('click', () => {
        KA.sfx('click');
        if (multi) { sel.has(oi) ? sel.delete(oi) : sel.add(oi); }
        else { sel.clear(); sel.add(oi); }
        btns.forEach(x => { x.b.classList.toggle('sel', sel.has(x.oi)); x.b.setAttribute('aria-pressed', sel.has(x.oi)); });
      });
      btns.push({ b, oi }); box.appendChild(b);
    });
    if (multi) body.appendChild(KA.el('p', { class: 'hint' }, 'Mehrere Antworten können richtig sein.'));
    body.appendChild(box);
    return {
      check() {
        if (!sel.size) return null;
        btns.forEach(x => x.b.classList.remove('right', 'wrong'));
        const ok = sel.size === corr.length && corr.every(c => sel.has(c));
        if (!ok) btns.forEach(x => { if (sel.has(x.oi) && !corr.includes(x.oi)) x.b.classList.add('wrong'); });
        return ok;
      },
      reveal() { btns.forEach(x => { x.b.classList.remove('wrong', 'sel'); if (corr.includes(x.oi)) x.b.classList.add('right'); }); },
      lock() { btns.forEach(x => x.b.disabled = true); }
    };
  };

  types.tf = function (ex, body) {
    const rows = ex.items.map((it) => {
      let v = null;
      const bT = KA.el('button', { type: 'button' }, 'richtig'), bF = KA.el('button', { type: 'button' }, 'falsch');
      const row = KA.el('div', { class: 'tf-row' }, KA.el('span', { html: it.t }), KA.el('div', { class: 'seg' }, bT, bF));
      const set = (val) => { v = val; bT.classList.toggle('on', val === true); bF.classList.toggle('on', val === false); row.classList.remove('right', 'wrong'); KA.sfx('click'); };
      bT.addEventListener('click', () => set(true)); bF.addEventListener('click', () => set(false));
      body.appendChild(row);
      return { it, row, get: () => v, bT, bF, set };
    });
    body.classList.add('tf-list');
    return {
      check() {
        if (rows.some(r => r.get() === null)) return null;
        let all = true;
        rows.forEach(r => { const ok = r.get() === r.it.a; r.row.classList.toggle('right', ok); r.row.classList.toggle('wrong', !ok); if (!ok) all = false; });
        return all;
      },
      reveal() { rows.forEach(r => { r.set(r.it.a); r.row.classList.add('right'); r.row.classList.remove('wrong'); }); },
      lock() { rows.forEach(r => { r.bT.disabled = true; r.bF.disabled = true; }); }
    };
  };

  types.cloze = function (ex, body) {
    const blanks = [];
    const wrap = KA.el('div', { class: 'cloze' });
    const html = ex.text.replace(/\{([^}]+)\}/g, (m, inner) => {
      blanks.push(inner.split('|'));
      return `<input data-b="${blanks.length - 1}" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Lücke ${blanks.length}">`;
    });
    wrap.innerHTML = html;
    const inputs = [...wrap.querySelectorAll('input')];
    inputs.forEach((inp, i) => { const L = Math.max(...blanks[i].map(a => a.length)); inp.style.width = Math.max(4, L + 2) + 'ch'; });
    let focused = inputs[0];
    inputs.forEach(inp => inp.addEventListener('focus', () => { focused = inp; }));
    if (ex.bank !== false) {
      const words = KA.shuffle(blanks.map(b => b[0]).concat(ex.extra || []));
      const bank = KA.el('div', { class: 'bank', 'aria-label': 'Wortspeicher' });
      words.forEach(w => {
        const chip = KA.el('button', { class: 'chip', type: 'button' }, w);
        chip.addEventListener('click', () => {
          const target = (focused && !focused.value) ? focused : inputs.find(x => !x.value) || focused;
          if (!target || target.disabled) return;
          target.value = w; target.classList.remove('right', 'wrong'); KA.sfx('click');
          const next = inputs.find(x => !x.value); if (next) { focused = next; next.focus({ preventScroll: true }); }
        });
        bank.appendChild(chip);
      });
      body.appendChild(KA.el('p', { class: 'hint' }, 'Tippe in eine Lücke und wähle ein Wort aus dem Speicher – oder schreibe selbst.'));
      body.appendChild(bank);
    }
    body.appendChild(wrap);
    return {
      check() {
        if (inputs.every(i => !i.value.trim())) return null;
        let all = true;
        inputs.forEach((inp, i) => { const ok = KA.checkText(inp.value, blanks[i]); inp.classList.toggle('right', ok); inp.classList.toggle('wrong', !ok); if (!ok) all = false; });
        return all;
      },
      reveal() { inputs.forEach((inp, i) => { inp.value = blanks[i][0]; inp.classList.add('right'); inp.classList.remove('wrong'); }); },
      lock() { inputs.forEach(i => i.disabled = true); body.querySelectorAll('.chip').forEach(c => c.disabled = true); }
    };
  };

  types.num = function (ex, body) {
    const fields = ex.fields || [{ label: ex.label || 'Ergebnis', answer: ex.answer, unit: ex.unit, tol: ex.tol }];
    const inps = fields.map((f, i) => {
      const inp = KA.el('input', { type: 'text', inputmode: 'decimal', autocomplete: 'off', id: `${ex.id}-f${i}`, 'aria-label': f.label });
      body.appendChild(KA.el('div', { class: 'num-row' }, KA.el('label', { for: `${ex.id}-f${i}` }, f.label + ' ='), inp, KA.el('span', { class: 'unit' }, f.unit || '')));
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') body.closest('.exercise')?.querySelector('.btn-check')?.click(); });
      return inp;
    });
    return {
      check() {
        if (inps.every(i => !i.value.trim())) return null;
        let all = true;
        inps.forEach((inp, i) => { const ok = within(toNum(inp.value), fields[i].answer, fields[i].tol); inp.classList.toggle('right', ok); inp.classList.toggle('wrong', !ok); if (!ok) all = false; });
        return all;
      },
      reveal() { inps.forEach((inp, i) => { inp.value = KA.fmt(fields[i].answer, 2); inp.classList.add('right'); inp.classList.remove('wrong'); }); },
      lock() { inps.forEach(i => i.disabled = true); }
    };
  };

  types.sort = function (ex, body) {
    let picked = null;
    const pool = KA.el('div', { class: 'sort-pool', 'aria-label': 'Noch nicht zugeordnet' });
    const cats = KA.el('div', { class: 'sort-cats' });
    const items = KA.shuffle(ex.items).map(it => {
      const b = KA.el('button', { class: 'card-item', type: 'button', draggable: 'true' }, it.t);
      const o = { it, b, cat: -1 };
      b.addEventListener('click', (e) => { e.stopPropagation(); if (b.disabled) return; picked = picked === o ? null : o; items.forEach(x => x.b.classList.toggle('picked', x === picked)); KA.sfx('click'); });
      b.addEventListener('dragstart', (e) => { picked = o; e.dataTransfer.setData('text/plain', 'x'); });
      pool.appendChild(b);
      return o;
    });
    const zones = ex.cats.map((name, ci) => {
      const list = KA.el('div', { class: 'items' });
      const z = KA.el('div', { class: 'sort-cat', role: 'button', tabindex: '0', 'aria-label': 'Ablegen in: ' + name }, KA.el('h4', {}, name), list);
      const drop = () => { if (!picked) return; picked.cat = ci; list.appendChild(picked.b); picked.b.classList.remove('picked', 'right', 'wrong'); picked = null; KA.sfx('click'); };
      z.addEventListener('click', drop);
      z.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); drop(); } });
      z.addEventListener('dragover', (e) => { e.preventDefault(); z.classList.add('hot'); });
      z.addEventListener('dragleave', () => z.classList.remove('hot'));
      z.addEventListener('drop', (e) => { e.preventDefault(); z.classList.remove('hot'); drop(); });
      cats.appendChild(z);
      return list;
    });
    pool.addEventListener('click', () => { if (picked) { picked.cat = -1; pool.appendChild(picked.b); picked.b.classList.remove('picked'); picked = null; } });
    body.append(KA.el('p', { class: 'hint' }, 'Tippe eine Karte an und dann das passende Feld (oder ziehe sie mit der Maus).'), pool, cats);
    return {
      check() {
        if (items.some(x => x.cat < 0)) return null;
        let all = true;
        items.forEach(x => { const ok = x.cat === x.it.c; x.b.classList.toggle('right', ok); x.b.classList.toggle('wrong', !ok); if (!ok) all = false; });
        return all;
      },
      reveal() { items.forEach(x => { x.cat = x.it.c; zones[x.it.c].appendChild(x.b); x.b.classList.add('right'); x.b.classList.remove('wrong'); }); },
      lock() { items.forEach(x => { x.b.disabled = true; x.b.draggable = false; }); }
    };
  };

  types.match = function (ex, body) {
    const rights = KA.shuffle(ex.pairs.map(p => p[1]));
    const grid = KA.el('div', { class: 'match-grid' });
    const sels = ex.pairs.map((p, i) => {
      const s = KA.el('select', { id: `${ex.id}-m${i}`, 'aria-label': KA.plain(p[0]) }, KA.el('option', { value: '' }, '– wählen –'), ...rights.map(r => KA.el('option', { value: r }, r)));
      s.addEventListener('change', () => s.classList.remove('right', 'wrong'));
      grid.appendChild(KA.el('div', { class: 'match-row' }, KA.el('label', { for: `${ex.id}-m${i}`, html: p[0] }), s));
      return s;
    });
    body.appendChild(grid);
    return {
      check() {
        if (sels.some(s => !s.value)) return null;
        let all = true;
        sels.forEach((s, i) => { const ok = s.value === ex.pairs[i][1]; s.classList.toggle('right', ok); s.classList.toggle('wrong', !ok); if (!ok) all = false; });
        return all;
      },
      reveal() { sels.forEach((s, i) => { s.value = ex.pairs[i][1]; s.classList.add('right'); s.classList.remove('wrong'); }); },
      lock() { sels.forEach(s => s.disabled = true); }
    };
  };

  types.order = function (ex, body) {
    let cur = KA.shuffle(ex.items.map((_, i) => i));
    if (cur.every((v, i) => v === i)) cur.reverse();
    const ol = KA.el('ol', { class: 'order-list' });
    let locked = false;
    function render(marks) {
      ol.innerHTML = '';
      cur.forEach((ii, pos) => {
        const up = KA.el('button', { type: 'button', 'aria-label': 'nach oben' }, '▲');
        const dn = KA.el('button', { type: 'button', 'aria-label': 'nach unten' }, '▼');
        up.disabled = locked || pos === 0; dn.disabled = locked || pos === cur.length - 1;
        up.addEventListener('click', () => { [cur[pos - 1], cur[pos]] = [cur[pos], cur[pos - 1]]; KA.sfx('click'); render(); });
        dn.addEventListener('click', () => { [cur[pos + 1], cur[pos]] = [cur[pos], cur[pos + 1]]; KA.sfx('click'); render(); });
        const li = KA.el('li', { class: marks ? (ii === pos ? 'right' : 'wrong') : '' }, KA.el('span', { html: ex.items[ii] }), up, dn);
        ol.appendChild(li);
      });
    }
    render();
    body.append(KA.el('p', { class: 'hint' }, 'Bringe die Schritte mit den Pfeilen in die richtige Reihenfolge.'), ol);
    return {
      check() { const ok = cur.every((v, i) => v === i); render(true); return ok; },
      reveal() { cur = ex.items.map((_, i) => i); render(true); },
      lock() { locked = true; render(true); }
    };
  };

  /* Kraftpfeil zeichnen: Länge und Richtung einstellen */
  types.arrow = function (ex, body) {
    const holder = KA.el('div');
    body.appendChild(holder);
    const cvo = KD.makeCanvas(holder, 800, 300, 'Kraftpfeil-Zeichenfeld');
    const st = { len: 2, ang: 0 };
    const lenIn = KA.el('input', { type: 'range', min: '0.5', max: '7', step: '0.5', value: '2', id: ex.id + '-len' });
    const angIn = KA.el('input', { type: 'range', min: '0', max: '315', step: '45', value: '0', id: ex.id + '-ang' });
    const oL = KA.el('output', {}, '2 cm'), oA = KA.el('output', {}, 'nach rechts');
    const dirName = (a) => ({ 0: 'nach rechts', 45: 'schräg nach rechts oben', 90: 'nach oben', 135: 'schräg nach links oben', 180: 'nach links', 225: 'schräg nach links unten', 270: 'nach unten', 315: 'schräg nach rechts unten' })[a];
    lenIn.addEventListener('input', () => { st.len = +lenIn.value; oL.textContent = KA.fmt(st.len, 1) + ' cm'; });
    angIn.addEventListener('input', () => { st.ang = +angIn.value; oA.textContent = dirName(st.ang); });
    body.append(
      KA.el('div', { class: 'ctl' }, KA.el('label', { for: ex.id + '-len' }, 'Pfeillänge', oL), lenIn),
      KA.el('div', { class: 'ctl' }, KA.el('label', { for: ex.id + '-ang' }, 'Richtung', oA), angIn));
    const PX = 40; // 1 cm = 40 px im Bild
    KA.loop(() => {
      const c = cvo.begin(); const ctx = cvo.ctx;
      KD.grid(ctx, 800, 300, PX / 2);
      // Massstab
      KD.text(ctx, `Massstab: 1 cm ≙ ${ex.scale} N`, 20, 30, { font: 'mono', size: 15, color: c.muted });
      ctx.strokeStyle = c.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(20, 45); ctx.lineTo(20 + PX, 45); ctx.moveTo(20, 40); ctx.lineTo(20, 50); ctx.moveTo(20 + PX, 40); ctx.lineTo(20 + PX, 50); ctx.stroke();
      KD.box(ctx, 360, 120, 80, 80, { fill: c.accent, crate: true });
      const a = st.ang * Math.PI / 180;
      const x1 = 400, y1 = 160;
      KD.arrow(ctx, x1, y1, x1 + Math.cos(a) * st.len * PX, y1 - Math.sin(a) * st.len * PX, { width: 5 });
      KD.text(ctx, `${KA.fmt(st.len, 1)} cm ≙ ${KA.fmt(st.len * ex.scale, 1)} N`, 780, 280, { align: 'right', font: 'mono', size: 15, color: c.force, weight: 700 });
    });
    return {
      check() { return Math.abs(st.len - ex.len) < 0.01 && st.ang === ex.ang; },
      reveal() { st.len = ex.len; st.ang = ex.ang; lenIn.value = ex.len; angIn.value = ex.ang; oL.textContent = KA.fmt(ex.len, 1) + ' cm'; oA.textContent = dirName(ex.ang); },
      lock() { lenIn.disabled = true; angIn.disabled = true; }
    };
  };

  KA.types = types;

  /* Aufgabe darstellen (gemeinsamer Rahmen: Prüfen, Feedback, Punkte) */
  KA.renderExercise = function (ex, container, onDone, opts = {}) {
    const wrapEl = KA.el('div', { class: 'exercise' });
    const head = KA.el('div', { class: 'kind' }, KA.el('span', { class: 'ex-tag' }, ex.tag || KA.typeLabel[ex.type] || 'Aufgabe'));
    wrapEl.appendChild(head);
    if (ex.q) wrapEl.appendChild(KA.el('p', { class: 'q', html: ex.q }));
    if (ex.img) { const holder = KA.el('div'); wrapEl.appendChild(holder); ex.img(holder); }
    const body = KA.el('div', { class: 'ex-body' });
    wrapEl.appendChild(body);
    const api = types[ex.type](ex, body);
    const fb = KA.el('div', { class: 'feedback', role: 'status' });
    const bCheck = KA.el('button', { class: 'btn btn-check', type: 'button' }, 'Prüfen');
    const bReveal = KA.el('button', { class: 'btn ghost', type: 'button', hidden: true }, 'Lösung zeigen');
    const row = KA.el('div', { class: 'btn-row' }, bCheck, bReveal);
    if (ex.hint) row.appendChild(KA.el('details', { class: 'hintbox' }, KA.el('summary', {}, 'Tipp'), KA.el('div', { class: 'hint', html: ex.hint })));
    wrapEl.append(row, fb);
    container.appendChild(wrapEl);
    let tries = 0, done = false;
    const prev = opts.noStore ? null : KA.state.ex[ex.id];

    function finish(pts, ok) {
      done = true; api.lock(); bCheck.hidden = true; bReveal.hidden = true;
      if (!opts.noStore) {
        const old = KA.state.ex[ex.id];
        if (!old || (old.pts || 0) < pts) { KA.state.ex[ex.id] = { pts, ok }; KA.save(); if (pts - ((old && old.pts) || 0) > 0) KA.onPoints(pts - ((old && old.pts) || 0)); }
        else if (!old.done) { old.done = true; KA.save(); }
      }
      if (onDone) onDone({ ok, pts, tries });
    }
    bCheck.addEventListener('click', () => {
      if (done) return;
      const r = api.check();
      if (r === null) { fb.className = 'feedback show bad'; fb.innerHTML = '<b>Noch nichts eingegeben.</b>Fülle die Aufgabe zuerst aus.'; return; }
      tries++;
      if (r) {
        const pts = tries === 1 ? 10 : tries === 2 ? 6 : 3;
        KA.sfx('ok');
        fb.className = 'feedback show ok';
        fb.innerHTML = `<b>Richtig! +${pts} Punkte</b>${ex.explain || ''}`;
        finish(pts, true);
      } else {
        KA.sfx('bad');
        fb.className = 'feedback show bad';
        fb.innerHTML = `<b>Noch nicht ganz.</b>${tries === 1 ? (ex.wrong || 'Schau dir die rot markierten Stellen nochmals an.') : (ex.hint ? 'Öffne den Tipp oder versuche es nochmals.' : 'Versuche es nochmals.')}`;
        if (tries >= 2) bReveal.hidden = false;
        if (opts.single) { api.reveal(); fb.innerHTML = `<b>Leider falsch.</b>Richtig wäre (grün markiert): ${ex.explain || ''}`; finish(0, false); }
      }
    });
    bReveal.addEventListener('click', () => {
      api.reveal();
      fb.className = 'feedback show ok';
      fb.innerHTML = `<b>Lösung</b>${ex.explain || ''}`;
      finish(0, false);
    });
    if (prev && !opts.fresh) {
      api.reveal(); api.lock(); done = true; bCheck.hidden = true;
      fb.className = 'feedback show ok';
      fb.innerHTML = `<b>Bereits gelöst (${prev.pts} Punkte).</b>${ex.explain || ''}`;
      const bAgain = KA.el('button', { class: 'btn ghost small', type: 'button' }, 'Nochmals üben');
      bAgain.addEventListener('click', () => { const holder = KA.el('div'); wrapEl.replaceWith(holder); KA.renderExercise(ex, holder, onDone, { fresh: true }); });
      row.appendChild(bAgain);
    }
    return wrapEl;
  };
  KA.typeLabel = { mc: 'Multiple Choice', tf: 'Richtig oder falsch?', cloze: 'Lückentext', num: 'Rechnen', sort: 'Zuordnen', match: 'Paare finden', order: 'Reihenfolge', arrow: 'Kraftpfeil zeichnen' };
})();
