/* Interaktive Labore (Simulationen). Jede Simulation: { title, task, mount(root, solved) } */
(function () {
  const D = KD, el = KA.el, fmt = KA.fmt;
  const S = {};
  const G = 9.81;

  function slider(id, label, min, max, step, val, show, onInput) {
    const inp = el('input', { type: 'range', id, min, max, step, value: val });
    const out = el('output', { for: id }, show(+val));
    inp.addEventListener('input', () => { out.textContent = show(+inp.value); onInput(+inp.value); });
    const box = el('div', { class: 'ctl' }, el('label', { for: id }, label, out), inp);
    box.set = (v) => { inp.value = v; out.textContent = show(+v); onInput(+v); };
    return box;
  }
  function seg(label, options, cur, onSel) {
    const wrap = el('div', { class: 'seg', role: 'group', 'aria-label': label });
    const btns = options.map((o) => {
      const b = el('button', { type: 'button', class: o.v === cur ? 'on' : '' }, o.t);
      b.addEventListener('click', () => { btns.forEach(x => x.classList.remove('on')); b.classList.add('on'); KA.sfx('click'); onSel(o.v); });
      wrap.appendChild(b); return b;
    });
    return el('div', { class: 'ctl' }, el('label', {}, label), wrap);
  }
  function layout(root, label) {
    const grid = el('div', { class: 'sim-grid' });
    const left = el('div'), right = el('div', { class: 'controls' });
    grid.append(left, right); root.appendChild(grid);
    const cvo = D.makeCanvas(left, 800, 450, label);
    return { cvo, left, right };
  }

  /* ---------- 1. Planeten-Waage ---------- */
  S.planet = {
    title: 'Planeten-Waage', task: 'Finde heraus, wie gross die Gewichtskraft einer Person mit 60 kg auf dem Mars ist. Stelle dazu Mars und 60 kg ein.',
    mount(root, solved) {
      const planets = [{ v: 'Erde', g: 9.81, col: 'accent' }, { v: 'Mond', g: 1.62, col: 'muted' }, { v: 'Mars', g: 3.71, col: 'bad' }, { v: 'Venus', g: 8.87, col: 'scale' }, { v: 'Jupiter', g: 24.79, col: 'force' }];
      const st = { p: planets[0], m: 20, shown: 0 };
      const { cvo, right } = layout(root, 'Planeten-Waage mit Federkraftmesser und Balkenwaage');
      const ro = el('div', { class: 'readout' });
      right.append(
        seg('Ort', planets.map(p => ({ t: p.v, v: p.v })), 'Erde', (v) => { st.p = planets.find(p => p.v === v); upd(); }),
        slider('pl-m', 'Masse m', 1, 100, 1, 20, v => v + ' kg', v => { st.m = v; upd(); }),
        ro);
      let done = false;
      function upd() {
        const F = st.m * st.p.g;
        ro.innerHTML = `Ort: ${st.p.v} · g = ${fmt(st.p.g)} N/kg<br>Masse m = <span class="w">${st.m} kg</span><br>F<sub>G</sub> = m · g = ${st.m} kg · ${fmt(st.p.g)} N/kg = <b>${fmt(F, 1)} N</b>`;
        if (!done && st.p.v === 'Mars' && st.m === 60) { done = true; solved(); }
      }
      upd();
      KA.loop((dt) => {
        const c = cvo.begin(), ctx = cvo.ctx;
        const F = st.m * st.p.g;
        st.shown += (F - st.shown) * Math.min(1, dt * 6);
        ctx.save(); ctx.fillStyle = c[st.p.col]; ctx.globalAlpha = .18; ctx.beginPath(); ctx.ellipse(400, 900, 700, 480, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        D.text(ctx, st.p.v, 30, 50, { font: 'display', size: 30, weight: 800 });
        D.text(ctx, `g = ${fmt(st.p.g)} N/kg`, 30, 80, { font: 'mono', size: 16, color: c.muted });
        // Federkraftmesser
        D.ceiling(ctx, 150, 290, 110);
        const r = D.springScale(ctx, 220, 120, { len: 180, max: 2500, value: st.shown, steps: 5 });
        const sz = 30 + st.m * 0.5;
        D.box(ctx, 220 - sz / 2, r.hookY, sz, sz, { crate: true, fill: c.accent });
        D.text(ctx, `${st.m} kg`, 220, r.hookY + sz + 22, { align: 'center', font: 'mono', weight: 700 });
        D.text(ctx, 'Federkraftmesser', 220, 440, { align: 'center', size: 14, color: c.muted });
        D.text(ctx, `${fmt(st.shown, 0)} N`, 270, 200, { font: 'mono', size: 22, weight: 700, color: c.force });
        // Balkenwaage: immer im Gleichgewicht
        const bx = 580, by = 220;
        ctx.save(); ctx.fillStyle = c.ink; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx - 18, 400); ctx.lineTo(bx + 18, 400); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = c.ink; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(bx - 140, by); ctx.lineTo(bx + 140, by); ctx.stroke();
        ctx.lineWidth = 2; [-130, 130].forEach(x => { ctx.beginPath(); ctx.moveTo(bx + x, by); ctx.lineTo(bx + x - 34, by + 80); ctx.moveTo(bx + x, by); ctx.lineTo(bx + x + 34, by + 80); ctx.stroke(); ctx.fillStyle = c.muted; ctx.fillRect(bx + x - 44, by + 80, 88, 5); });
        ctx.restore();
        D.box(ctx, bx - 130 - 22, by + 80 - 44, 44, 44, { crate: true, fill: c.accent });
        ctx.save(); ctx.fillStyle = c.muted; D.roundRect(ctx, bx + 130 - 26, by + 80 - 34, 52, 34, 6); ctx.fill(); ctx.restore();
        D.text(ctx, `${st.m} kg`, bx + 130, by + 80 - 12, { align: 'center', font: 'mono', size: 13, color: '#fff', weight: 700 });
        D.text(ctx, 'Balkenwaage', bx, 440, { align: 'center', size: 14, color: c.muted });
        D.text(ctx, 'misst die Masse: überall gleich', bx, 170, { align: 'center', size: 15, color: c.work, weight: 700 });
      });
    }
  };

  /* ---------- 2. Feder-Labor ---------- */
  S.feder = {
    title: 'Feder-Labor', task: 'Wähle die mittlere Feder. Hänge nacheinander 1, 2, 3 und 4 Gewichtsstücke (je 1 N) an und notiere jedes Mal den Messwert. Bestimme daraus die Federkonstante D.',
    mount(root, solved) {
      const springs = { weich: { D: 0.4, lim: 6, coils: 14 }, mittel: { D: 0.8, lim: 99, coils: 11 }, hart: { D: 2, lim: 99, coils: 8 } };
      const st = { sp: 'mittel', n: 0, perm: { weich: 0, mittel: 0, hart: 0 }, shown: 0, rows: [] };
      const PX = 8; // px pro cm
      const { cvo, right } = layout(root, 'Feder mit Gewichtsstücken und Massstab');
      const ro = el('div', { class: 'readout' });
      const bAdd = el('button', { class: 'btn small', type: 'button' }, '+ 1 N anhängen');
      const bRem = el('button', { class: 'btn ghost small', type: 'button' }, '− abnehmen');
      const bRec = el('button', { class: 'btn small', type: 'button' }, 'Messwert notieren');
      const bNew = el('button', { class: 'btn ghost small', type: 'button', hidden: true }, 'Neue weiche Feder holen');
      const tblWrap = el('div', { class: 'table-wrap' });
      right.append(
        seg('Feder', [{ t: 'weich', v: 'weich' }, { t: 'mittel', v: 'mittel' }, { t: 'hart', v: 'hart' }], 'mittel', v => { st.sp = v; st.n = 0; upd(); }),
        el('div', { class: 'btn-row' }, bAdd, bRem), ro, el('div', { class: 'btn-row' }, bRec, bNew), tblWrap);
      let done = false;
      const ext = () => {
        const s = springs[st.sp], F = st.n;
        let e = F / s.D;
        if (F > s.lim) e += (F - s.lim) * 3;
        return e + st.perm[st.sp];
      };
      function upd() {
        const s = springs[st.sp];
        if (st.n > s.lim && !st.perm[st.sp]) { st.perm[st.sp] = 3; KA.toast('Überdehnt! Die Feder ist jetzt bleibend länger.'); KA.sfx('bad'); }
        bNew.hidden = !st.perm[st.sp];
        ro.innerHTML = `Feder: ${st.sp}${st.perm[st.sp] ? ' <span style="color:var(--bad)">(überdehnt)</span>' : ''}<br>Kraft F = <b>${st.n} N</b><br>Verlängerung s = <span class="w">${fmt(ext(), 1)} cm</span>`;
        bAdd.disabled = st.n >= 8; bRem.disabled = st.n <= 0;
        const rows = st.rows.filter(r => r.sp === st.sp);
        tblWrap.innerHTML = rows.length ? `<table class="data"><tr><th>F in N</th><th>s in cm</th><th>F : s</th></tr>${rows.map(r => `<tr><td>${r.F}</td><td>${fmt(r.s, 1)}</td><td>${r.s ? fmt(r.F / r.s, 2) : '–'}</td></tr>`).join('')}</table>` : '<p class="hint">Noch keine Messwerte für diese Feder.</p>';
      }
      bAdd.addEventListener('click', () => { st.n++; KA.sfx('spring'); upd(); });
      bRem.addEventListener('click', () => { st.n--; KA.sfx('click'); upd(); });
      bNew.addEventListener('click', () => { st.perm[st.sp] = 0; st.rows = st.rows.filter(r => r.sp !== st.sp); st.n = 0; upd(); });
      bRec.addEventListener('click', () => {
        const s = Math.round(ext() * 10) / 10;
        if (st.rows.some(r => r.sp === st.sp && r.F === st.n)) { KA.toast('Diesen Messwert hast du schon notiert.'); return; }
        st.rows.push({ sp: st.sp, F: st.n, s }); st.rows.sort((a, b) => a.F - b.F); KA.sfx('click'); upd();
        const m = st.rows.filter(r => r.sp === 'mittel' && r.F >= 1 && r.F <= 4);
        if (!done && m.length >= 4) { done = true; solved(); }
      });
      upd();
      KA.loop((dt) => {
        const c = cvo.begin(), ctx = cvo.ctx;
        st.shown += (ext() - st.shown) * Math.min(1, dt * 8);
        const top = 40, rest = 80;
        D.ceiling(ctx, 120, 280, top);
        const yEnd = top + rest + st.shown * PX;
        D.spring(ctx, 200, top, yEnd, { coils: springs[st.sp].coils, w: st.sp === 'hart' ? 18 : 13, lw: st.sp === 'hart' ? 4 : st.sp === 'mittel' ? 3 : 2, color: st.perm[st.sp] ? c.bad : c.ink });
        let y = yEnd + 2;
        ctx.save(); ctx.fillStyle = c.ink; ctx.fillRect(186, y - 2, 28, 4); ctx.restore();
        for (let i = 0; i < st.n; i++) { ctx.save(); ctx.fillStyle = i % 2 ? c.muted : c.ink; ctx.globalAlpha = .85; D.roundRect(ctx, 182, y + 2, 36, 12, 3); ctx.fill(); ctx.restore(); y += 14; }
        D.ruler(ctx, 260, top + rest, top + rest + 26 * PX, { pxPerCm: PX });
        ctx.save(); ctx.strokeStyle = c.force; ctx.lineWidth = 2; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(214, yEnd); ctx.lineTo(260, yEnd); ctx.stroke();
        ctx.strokeStyle = c.muted; ctx.beginPath(); ctx.moveTo(140, top + rest); ctx.lineTo(260, top + rest); ctx.stroke(); ctx.restore();
        D.text(ctx, '0', 254, top + rest + 4, { align: 'right', size: 11, color: c.muted, font: 'mono' });
        if (st.n) D.arrow(ctx, 160, yEnd + 6, 160, yEnd + 6 + st.n * 12, { label: `${st.n} N`, lx: 130, ly: yEnd + 30 });
        // Diagramm rechts
        const ox = 380, oy = 400, w = 380, h = 320;
        ctx.save(); ctx.strokeStyle = c.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + w, oy); ctx.moveTo(ox, oy); ctx.lineTo(ox, oy - h); ctx.stroke(); ctx.restore();
        D.text(ctx, 's in cm', ox + w, oy + 30, { align: 'right', size: 13, font: 'mono' });
        D.text(ctx, 'F in N', ox + 6, oy - h - 8, { size: 13, font: 'mono' });
        const sMax = 25, fMax = 8;
        for (let i = 0; i <= 25; i += 5) D.text(ctx, String(i), ox + i / sMax * w, oy + 16, { align: 'center', size: 11, color: c.muted, font: 'mono' });
        for (let i = 0; i <= 8; i += 2) D.text(ctx, String(i), ox - 6, oy - i / fMax * h + 4, { align: 'right', size: 11, color: c.muted, font: 'mono' });
        const cols = { weich: c.scale, mittel: c.accent, hart: c.work };
        for (const k of ['weich', 'mittel', 'hart']) {
          const rows = st.rows.filter(r => r.sp === k);
          if (!rows.length) continue;
          ctx.save(); ctx.strokeStyle = cols[k]; ctx.fillStyle = cols[k]; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(ox, oy); rows.forEach(r => ctx.lineTo(ox + Math.min(r.s, sMax) / sMax * w, oy - r.F / fMax * h)); ctx.stroke();
          rows.forEach(r => { ctx.beginPath(); ctx.arc(ox + Math.min(r.s, sMax) / sMax * w, oy - r.F / fMax * h, 5, 0, 7); ctx.fill(); });
          ctx.restore();
          const last = rows[rows.length - 1];
          D.text(ctx, k, ox + Math.min(last.s, sMax) / sMax * w + 8, oy - last.F / fMax * h - 6, { size: 13, color: cols[k], weight: 700 });
        }
      });
    }
  };

  /* ---------- 3. Tauziehen ---------- */
  S.tau = {
    title: 'Tauziehen', task: 'Links ziehen eine erwachsene Person und ein Kind. Stelle rechts ein Team zusammen, das anders aussieht, aber genau gleich stark zieht – das Seil soll sich nicht bewegen.',
    mount(root, solved) {
      const types = { K: { t: 'Kind', F: 150 }, J: { t: 'Jugendliche', F: 300 }, E: { t: 'Erwachsene', F: 450 } };
      const st = { L: ['E', 'K'], R: [], pos: 0 };
      const { cvo, right } = layout(root, 'Tauziehen mit zwei Teams');
      const ro = el('div', { class: 'readout' });
      const sideCtl = (side) => {
        const row = el('div', { class: 'btn-row' });
        Object.keys(types).forEach(k => {
          const b = el('button', { class: 'btn ghost small', type: 'button' }, `+ ${types[k].t} (${types[k].F} N)`);
          b.addEventListener('click', () => { if (st[side].length >= 4) { KA.toast('Maximal 4 Personen pro Team.'); return; } st[side].push(k); KA.sfx('click'); upd(); });
          row.appendChild(b);
        });
        const clr = el('button', { class: 'btn ghost small', type: 'button' }, 'Team leeren');
        clr.addEventListener('click', () => { st[side] = []; upd(); });
        row.appendChild(clr);
        return el('div', { class: 'ctl' }, el('label', {}, side === 'L' ? 'Team links' : 'Team rechts'), row);
      };
      right.append(sideCtl('L'), sideCtl('R'), ro);
      const sum = (a) => a.reduce((s, k) => s + types[k].F, 0);
      let done = false;
      function upd() {
        const l = sum(st.L), r = sum(st.R), res = r - l;
        ro.innerHTML = `Links: <b>${l} N</b> · Rechts: <b>${r} N</b><br>Resultierende: <span class="w">${Math.abs(res)} N ${res > 0 ? 'nach rechts' : res < 0 ? 'nach links' : '→ Gleichgewicht'}</span>`;
        const sameTeam = [...st.L].sort().join() === [...st.R].sort().join();
        if (!done && l === r && st.R.length >= 1 && !sameTeam && st.L.length >= 1) { done = true; solved(); }
      }
      upd();
      KA.loop((dt, now) => {
        const c = cvo.begin(), ctx = cvo.ctx;
        const res = sum(st.R) - sum(st.L);
        const target = D.clamp(res * 0.25, -170, 170);
        st.pos += (target - st.pos) * Math.min(1, dt * 1.5);
        D.ground(ctx, 380);
        ctx.save(); ctx.strokeStyle = c.muted; ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.moveTo(400, 250); ctx.lineTo(400, 380); ctx.stroke(); ctx.restore();
        D.rope(ctx, [[60 + st.pos, 300], [740 + st.pos, 300]]);
        ctx.save(); ctx.fillStyle = c.force; ctx.fillRect(397 + st.pos, 290, 6, 20); ctx.restore();
        const wob = Math.sin(now * 5) * 2;
        st.L.forEach((k, i) => D.person(ctx, 330 - i * 70 + st.pos + wob, 380, { dir: -1, lean: 16, armR: 2, armL: 8, s: k === 'K' ? .7 : k === 'J' ? .88 : 1, color: c.ink }));
        st.R.forEach((k, i) => D.person(ctx, 470 + i * 70 + st.pos - wob, 380, { dir: 1, lean: 16, armR: 2, armL: 8, s: k === 'K' ? .7 : k === 'J' ? .88 : 1, color: c.accent }));
        const sc = 0.22;
        const l = sum(st.L), r = sum(st.R);
        if (l) D.arrow(ctx, 400, 150, 400 - l * sc, 150, { label: l + ' N', ly: 135 });
        if (r) D.arrow(ctx, 400, 150, 400 + r * sc, 150, { label: r + ' N', ly: 135, color: c.accent });
        if (res) D.arrow(ctx, 400, 200, 400 + res * sc, 200, { label: 'resultierend ' + Math.abs(res) + ' N', ly: 226, color: c.work, width: 6 });
        else if (l) D.text(ctx, 'Gleichgewicht: resultierende Kraft 0 N', 400, 210, { align: 'center', weight: 700, color: c.work });
        D.text(ctx, 'Massstab: 1 cm ≙ 200 N', 20, 30, { font: 'mono', size: 13, color: c.muted });
      });
    }
  };

  /* ---------- 5. Hubarbeit ---------- */
  S.hub = {
    title: 'Hub-Labor', task: 'Hebe einen Zementsack mit 20 kg auf 3 m Höhe. Lies die Hubarbeit ab.',
    mount(root, solved) {
      const st = { m: 10, h: 2, y: 0, lifting: false };
      const { cvo, right } = layout(root, 'Kran hebt einen Sack, daneben Kraft-Weg-Diagramm');
      const ro = el('div', { class: 'readout' });
      const bGo = el('button', { class: 'btn', type: 'button' }, '▲ Hochheben');
      const bDown = el('button', { class: 'btn ghost', type: 'button' }, '▼ Absenken');
      right.append(
        slider('hb-m', 'Masse m', 1, 50, 1, 10, v => v + ' kg', v => { st.m = v; st.y = 0; st.lifting = false; upd(); }),
        slider('hb-h', 'Höhe h', 0.5, 5, 0.5, 2, v => fmt(v, 1) + ' m', v => { st.h = v; st.y = 0; st.lifting = false; upd(); }),
        el('div', { class: 'btn-row' }, bGo, bDown), ro);
      bGo.addEventListener('click', () => { st.lifting = true; KA.sfx('click'); });
      bDown.addEventListener('click', () => { st.lifting = false; st.y = 0; upd(); });
      let done = false;
      function upd() {
        const F = st.m * G, W = F * st.y;
        ro.innerHTML = `F<sub>G</sub> = m · g = ${st.m} kg · 9,81 N/kg = <b>${fmt(F, 1)} N</b><br>gehoben: ${fmt(st.y, 2)} m von ${fmt(st.h, 1)} m<br>W = F<sub>G</sub> · h = <span class="w">${fmt(W, 1)} J</span>`;
      }
      upd();
      KA.loop((dt) => {
        if (st.lifting && st.y < st.h) {
          st.y = Math.min(st.h, st.y + dt * 0.9); upd();
          if (st.y >= st.h) { st.lifting = false; KA.sfx('thud'); if (!done && st.m === 20 && Math.abs(st.h - 3) < 1e-6) { done = true; solved(); } }
        }
        const c = cvo.begin(), ctx = cvo.ctx;
        const gy = 410, PXM = 64; // px pro Meter
        D.ground(ctx, gy, 0, 400);
        // Kran
        ctx.save(); ctx.strokeStyle = c.scale; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(60, gy); ctx.lineTo(60, 40); ctx.lineTo(300, 40); ctx.stroke(); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(60, 90); ctx.lineTo(120, 40); ctx.stroke(); ctx.restore();
        // Höhenskala
        for (let m = 0; m <= 5; m++) { const y = gy - m * PXM; ctx.save(); ctx.strokeStyle = c.line; ctx.beginPath(); ctx.moveTo(330, y); ctx.lineTo(370, y); ctx.stroke(); ctx.restore(); D.text(ctx, m + ' m', 376, y + 4, { size: 12, font: 'mono', color: c.muted }); }
        ctx.save(); ctx.strokeStyle = c.work; ctx.setLineDash([5, 5]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(180, gy - st.h * PXM); ctx.lineTo(370, gy - st.h * PXM); ctx.stroke(); ctx.restore();
        const sw = 40 + st.m * 0.8, sh = 30 + st.m * 0.5;
        const sy = gy - sh - st.y * PXM;
        D.rope(ctx, [[250, 40], [250, sy]], { color: c.ink, lw: 2 });
        ctx.save(); ctx.fillStyle = '#9a8f80'; D.roundRect(ctx, 250 - sw / 2, sy, sw, sh, 10); ctx.fill(); ctx.restore();
        D.text(ctx, st.m + ' kg', 250, sy + sh / 2 + 5, { align: 'center', size: 13, font: 'mono', weight: 700, color: '#fff' });
        D.arrow(ctx, 250 + sw / 2 + 12, sy + sh / 2, 250 + sw / 2 + 12, sy + sh / 2 - Math.min(120, st.m * G * 0.25), { label: 'F', lx: 250 + sw / 2 + 30 });
        // F-s-Diagramm
        const ox = 470, oy = 400, w = 300, h = 300;
        ctx.save(); ctx.strokeStyle = c.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + w, oy); ctx.moveTo(ox, oy); ctx.lineTo(ox, oy - h); ctx.stroke(); ctx.restore();
        D.text(ctx, 'h in m', ox + w, oy + 30, { align: 'right', size: 13, font: 'mono' });
        D.text(ctx, 'F in N', ox + 6, oy - h - 8, { size: 13, font: 'mono' });
        const fMax = 500, sMax = 5;
        for (let i = 0; i <= 5; i++) D.text(ctx, String(i), ox + i / sMax * w, oy + 16, { align: 'center', size: 11, color: c.muted, font: 'mono' });
        for (let i = 0; i <= 500; i += 100) D.text(ctx, String(i), ox - 6, oy - i / fMax * h + 4, { align: 'right', size: 11, color: c.muted, font: 'mono' });
        const F = st.m * G;
        ctx.save(); ctx.fillStyle = c.work; ctx.globalAlpha = .3; ctx.fillRect(ox, oy - F / fMax * h, st.y / sMax * w, F / fMax * h); ctx.restore();
        ctx.save(); ctx.strokeStyle = c.force; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ox, oy - F / fMax * h); ctx.lineTo(ox + st.h / sMax * w, oy - F / fMax * h); ctx.stroke(); ctx.restore();
        D.text(ctx, `W = ${fmt(F * st.y, 0)} J`, ox + 150, 90, { align: 'center', font: 'mono', size: 20, weight: 700, color: c.work });
        D.text(ctx, 'Fläche = Arbeit', ox + 150, 116, { align: 'center', size: 14, color: c.muted });
      });
    }
  };

  /* ---------- 6. Hebel (Wippe) ---------- */
  S.hebel = {
    title: 'Hebel-Wippe', task: 'Die linke Seite ist vorgegeben. Setze Gewichte auf die rechte Seite, bis die Wippe im Gleichgewicht ist. Es gilt: F₁ · a₁ = F₂ · a₂.',
    mount(root, solved) {
      const puzzles = [
        { L: { 3: [20] } }, { L: { 2: [30] } }, { L: { 5: [10], 2: [20] } }, { L: { 4: [30] } }, { L: { 1: [30], 3: [10] } }
      ];
      const st = { pi: 0, R: {}, pick: 10, ang: 0 };
      const { cvo, right } = layout(root, 'Zweiseitiger Hebel mit Steckplätzen');
      const ro = el('div', { class: 'readout' });
      const info = el('p', { class: 'hint' }, 'Wähle ein Gewicht und tippe dann auf einen Platz rechts der Achse. Tippe ein Gewicht im Bild an, um es zu entfernen.');
      const bClear = el('button', { class: 'btn ghost small', type: 'button' }, 'Rechte Seite leeren');
      const bNext = el('button', { class: 'btn small', type: 'button', hidden: true }, 'Nächstes Rätsel →');
      right.append(seg('Gewicht wählen', [{ t: '10 N', v: 10 }, { t: '20 N', v: 20 }, { t: '30 N', v: 30 }], 10, v => st.pick = v), info, el('div', { class: 'btn-row' }, bClear, bNext), ro);
      bClear.addEventListener('click', () => { st.R = {}; upd(); });
      bNext.addEventListener('click', () => { st.pi = (st.pi + 1) % puzzles.length; st.R = {}; bNext.hidden = true; upd(); });
      let done = false, balancedShown = false;
      const PX = 60, cx = 400, cy = 260;
      const torque = (side) => { let t = 0; for (const p in side) for (const w of side[p]) t += w * p; return t; };
      const list = (side) => Object.keys(side).filter(p => side[p].length).map(p => `${side[p].reduce((a, b) => a + b, 0)} N · ${p * 10} cm`).join(' + ') || '–';
      function upd() {
        const L = puzzles[st.pi].L, l = torque(L) * 10, r = torque(st.R) * 10;
        const bal = l === r && r > 0;
        ro.innerHTML = `Rätsel ${st.pi + 1} von ${puzzles.length}<br>links: ${list(L)} = <b>${l} N·cm</b><br>rechts: ${list(st.R)} = <b>${r} N·cm</b><br>${bal ? '<span class="w">Gleichgewicht!</span>' : l > r ? 'links überwiegt' : 'rechts überwiegt'}`;
        if (bal && !balancedShown) { balancedShown = true; KA.sfx('ok'); bNext.hidden = false; if (!done) { done = true; solved(); } }
        if (!bal) balancedShown = false;
      }
      upd();
      cvo.cv.addEventListener('click', (ev) => {
        const p = cvo.toLocal(ev);
        // Steckplatz rechts finden (entlang des gekippten Balkens)
        const a = st.ang;
        for (let i = 1; i <= 5; i++) {
          const sx = cx + i * PX * Math.cos(a), sy = cy + i * PX * Math.sin(a);
          if (Math.abs(p.x - sx) < 26 && p.y < sy + 20 && p.y > sy - 120) {
            const stack = st.R[i] || [];
            const stackTop = sy - 10 - stack.length * 26;
            if (stack.length && p.y < sy - 6 && p.y > stackTop - 6) { stack.pop(); KA.sfx('click'); }
            else if (stack.length < 4) { stack.push(st.pick); KA.sfx('thud'); }
            st.R[i] = stack; upd(); return;
          }
        }
      });
      KA.loop((dt) => {
        const L = puzzles[st.pi].L;
        const diff = torque(st.R) - torque(L);
        const target = D.clamp(diff * 0.004, -0.28, 0.28);
        st.ang += (target - st.ang) * Math.min(1, dt * 4);
        const c = cvo.begin(), ctx = cvo.ctx;
        D.ground(ctx, 400);
        ctx.save(); ctx.fillStyle = c.ink; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx - 30, 400); ctx.lineTo(cx + 30, 400); ctx.closePath(); ctx.fill(); ctx.restore();
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(st.ang);
        ctx.fillStyle = c.scale; ctx.fillRect(-5.5 * PX, -8, 11 * PX, 14);
        ctx.fillStyle = '#1a1a1a'; ctx.font = '600 11px "JetBrains Mono", monospace'; ctx.textAlign = 'center';
        for (let i = -5; i <= 5; i++) { if (!i) continue; ctx.fillRect(i * PX - 1, -8, 2, 14); ctx.fillText(Math.abs(i) * 10 + '', i * PX, 22); }
        // Gewichte zeichnen
        const drawStack = (pos, arr, side) => arr.forEach((w, k) => {
          const x = side * pos * PX, h = 22, wd = 20 + w * 0.6;
          ctx.fillStyle = side < 0 ? c.muted : c.accent;
          D.roundRect(ctx, x - wd / 2, -10 - (k + 1) * (h + 4), wd, h, 4); ctx.fill();
          ctx.fillStyle = '#fff'; ctx.fillText(w + '', x, -10 - (k + 1) * (h + 4) + 15);
        });
        for (const p in L) drawStack(+p, L[p], -1);
        for (const p in st.R) drawStack(+p, st.R[p], 1);
        // Platzhalter rechts
        ctx.strokeStyle = c.accent; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.5;
        for (let i = 1; i <= 5; i++) if (!(st.R[i] && st.R[i].length)) { D.roundRect(ctx, i * PX - 14, -36, 28, 22, 4); ctx.stroke(); }
        ctx.restore();
        D.text(ctx, 'Abstand zur Achse in cm', cx, 440, { align: 'center', size: 13, color: c.muted });
        const bal = diff === 0 && torque(st.R) > 0;
        D.text(ctx, bal ? 'Gleichgewicht' : diff > 0 ? 'rechts zu schwer' : 'links zu schwer', 400, 60, { align: 'center', font: 'display', size: 26, color: bal ? c.work : c.ink });
      });
    }
  };

  /* ---------- 7. Flaschenzug ---------- */
  S.flasche = {
    title: 'Rollen und Flaschenzug', task: 'Die Last hat eine Gewichtskraft von 600 N. Wähle die Anordnung, bei der du nur mit 150 N ziehen musst, und hebe die Last ganz auf 1 m.',
    mount(root, solved) {
      const st = { n: 1, s: 0 };
      const FG = 600;
      const { cvo, right } = layout(root, 'Rollen und Flaschenzug mit Last');
      const ro = el('div', { class: 'readout' });
      const sl = slider('fz-s', 'Seil ziehen', 0, 1, 0.01, 0, v => fmt(v * st.n, 2) + ' m', v => { st.s = v; upd(); });
      right.append(seg('Anordnung', [{ t: 'feste Rolle', v: 1 }, { t: 'lose Rolle', v: 2 }, { t: 'Flaschenzug 4', v: 4 }, { t: 'Flaschenzug 6', v: 6 }], 1, v => { st.n = v; sl.set(0); }), sl, ro);
      let done = false;
      function upd() {
        const F = FG / st.n, sRope = st.s * st.n, h = st.s;
        ro.innerHTML = `tragende Seilstücke n = ${st.n}<br>Zugkraft F = F<sub>G</sub> : n = 600 N : ${st.n} = <b>${fmt(F, 0)} N</b><br>Hubhöhe h = ${fmt(h, 2)} m · Seilweg s = ${fmt(sRope, 2)} m<br>W = F · s = <span class="w">${fmt(F * sRope, 0)} J</span> = F<sub>G</sub> · h`;
        if (!done && st.n === 4 && st.s >= 0.999) { done = true; solved(); }
      }
      upd();
      KA.loop(() => {
        const c = cvo.begin(), ctx = cvo.ctx;
        const n = st.n, PXM = 150;
        const topY = 70;
        D.ceiling(ctx, 150, 560, 40);
        const loadTop = 330 - st.s * PXM;
        D.ground(ctx, 400, 100, 700);
        if (n === 1) {
          D.pulley(ctx, 340, topY + 20, 30);
          ctx.save(); ctx.strokeStyle = c.ink; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(340, 40); ctx.lineTo(340, topY + 20); ctx.stroke(); ctx.restore();
          ctx.save(); ctx.strokeStyle = '#a0703a'; ctx.lineWidth = 3; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(310, loadTop); ctx.lineTo(310, topY + 20); ctx.arc(340, topY + 20, 30, Math.PI, 0, false); ctx.lineTo(370, 220 + st.s * PXM); ctx.stroke(); ctx.restore();
          D.box(ctx, 270, loadTop, 80, 70, { crate: true, label: '600 N', lsize: 13 });
          D.arrow(ctx, 370, 220 + st.s * PXM, 370, 290 + st.s * PXM, { label: '600 N', lx: 420 });
        } else {
          const g = n === 6 ? 36 : 44, xs = 400 - g * n / 2;
          const botY = loadTop - 36, tY = topY + 14;
          const fy = 230 + st.s * PXM * Math.min(n, 2) / 2;
          const tk = D.tackle(ctx, { n, x0: xs, gap: g, topY: tY, botY, endY: fy });
          ctx.save(); ctx.strokeStyle = c.ink; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(tk.hangX, 40); ctx.lineTo(tk.hangX, tk.hangY); ctx.stroke();
          ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(tk.loadX, tk.loadY); ctx.lineTo(tk.loadX, loadTop); ctx.stroke(); ctx.restore();
          D.box(ctx, tk.loadX - 40, loadTop, 80, 70, { crate: true, label: '600 N', lsize: 13 });
          D.arrow(ctx, tk.endX, fy, tk.endX, fy + 600 / n * 0.12 + 20, { label: fmt(600 / n, 0) + ' N', lx: tk.endX + 50 });
          for (let i = 0; i < n; i++) D.text(ctx, String(i + 1), tk.seg(i), (tY + botY) / 2 + 5, { align: 'center', size: 12, weight: 700, color: c.force, bg: c.surface });
        }
        // Höhenmarke
        ctx.save(); ctx.strokeStyle = c.work; ctx.setLineDash([5, 5]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(120, 330 - PXM); ctx.lineTo(240, 330 - PXM); ctx.stroke(); ctx.restore();
        D.text(ctx, 'Ziel: 1 m', 120, 330 - PXM - 8, { size: 13, color: c.work, weight: 700 });
        D.text(ctx, `Seilweg ${fmt(st.s * n, 2)} m`, 780, 440, { align: 'right', font: 'mono', size: 15, color: c.muted });
      });
    }
  };

  /* ---------- 8. Schiefe Ebene ---------- */
  S.rampe = {
    title: 'Schiefe Ebene', task: 'Eine Kiste (600 N) soll auf eine 1 m hohe Laderampe. Stelle die Rampenlänge so ein, dass du nur 200 N brauchst. Schiebe die Kiste dann hoch.',
    mount(root, solved) {
      const st = { l: 2, u: 0, go: false };
      const FG = 600, H = 1;
      const { cvo, right } = layout(root, 'Kiste auf einer schiefen Ebene');
      const ro = el('div', { class: 'readout' });
      const bGo = el('button', { class: 'btn', type: 'button' }, '▲ Hochschieben');
      const bRe = el('button', { class: 'btn ghost', type: 'button' }, 'Zurück nach unten');
      right.append(slider('rp-l', 'Rampenlänge l', 1, 6, 0.5, 2, v => fmt(v, 1) + ' m', v => { st.l = v; st.u = 0; st.go = false; upd(); }), el('div', { class: 'btn-row' }, bGo, bRe), ro);
      bGo.addEventListener('click', () => { st.go = true; });
      bRe.addEventListener('click', () => { st.go = false; st.u = 0; upd(); });
      let done = false;
      function upd() {
        const F = FG * H / st.l;
        ro.innerHTML = `Höhe h = 1 m · Länge l = ${fmt(st.l, 1)} m<br>Kraft F = F<sub>G</sub> · h : l = <b>${fmt(F, 0)} N</b><br>Weg ${fmt(st.u * st.l, 2)} m · W = F · s = <span class="w">${fmt(F * st.u * st.l, 0)} J</span><br><span style="color:var(--muted)">ohne Reibung gerechnet</span>`;
      }
      upd();
      KA.loop((dt, now) => {
        if (st.go && st.u < 1) { st.u = Math.min(1, st.u + dt * 0.35); upd(); if (st.u >= 1) { st.go = false; KA.sfx('thud'); if (!done && Math.abs(st.l - 3) < 1e-6) { done = true; solved(); } } }
        const c = cvo.begin(), ctx = cvo.ctx;
        const gy = 400, PXM = 120;
        const hpx = H * PXM;
        const base = Math.sqrt(st.l * st.l - H * H) * PXM;
        const x1 = 720, x0 = x1 - base, y1 = gy - hpx;
        D.ground(ctx, gy);
        ctx.save(); ctx.fillStyle = c.surface2; ctx.strokeStyle = c.line; ctx.beginPath(); ctx.moveTo(x0, gy); ctx.lineTo(x1, y1); ctx.lineTo(x1, gy); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillRect(x1, y1, 80, hpx); ctx.restore();
        D.text(ctx, '1 m', x1 + 40, y1 + hpx / 2, { align: 'center', font: 'mono', color: c.muted });
        const ang = Math.atan2(y1 - gy, x1 - x0);
        const L = Math.hypot(x1 - x0, y1 - gy);
        const bx = x0 + Math.cos(ang) * (20 + (L - 40) * st.u), by = gy + Math.sin(ang) * (20 + (L - 40) * st.u);
        ctx.save(); ctx.translate(bx, by); ctx.rotate(ang); D.box(ctx, -28, -50, 56, 50, { crate: true }); ctx.restore();
        const F = FG * H / st.l;
        const len = F * 0.22;
        const ax = bx - Math.cos(ang) * 20 + Math.sin(ang) * 70, ay = by - Math.sin(ang) * 20 - Math.cos(ang) * 70;
        D.arrow(ctx, ax, ay, ax + Math.cos(ang) * len, ay + Math.sin(ang) * len, { label: fmt(F, 0) + ' N', ly: ay - 14, lx: ax + Math.cos(ang) * len / 2 });
        D.text(ctx, `l = ${fmt(st.l, 1)} m`, (x0 + x1) / 2 - 20, (gy + y1) / 2 + 34, { align: 'center', font: 'mono', size: 15, color: c.muted });
        D.text(ctx, 'Goldene Regel: F · l = F_G · h = 600 J', 400, 50, { align: 'center', font: 'mono', size: 18, weight: 700, color: c.work });
      });
    }
  };

  window.KSIMS = S;
})();
