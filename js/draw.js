/* Zeichen-Hilfsfunktionen für Erklärfilme und Simulationen (Canvas, logisch 800 × 450). */
(function () {
  const D = {};
  let colorCache = null, colorTime = 0;

  D.colors = function () {
    const now = performance.now();
    if (colorCache && now - colorTime < 500) return colorCache;
    const cs = getComputedStyle(document.documentElement);
    const g = (n) => cs.getPropertyValue(n).trim() || '#888';
    colorCache = {
      bg: g('--bg'), surface: g('--surface'), surface2: g('--surface-2'), ink: g('--ink'), muted: g('--muted'), line: g('--line'),
      accent: g('--accent'), force: g('--force'), work: g('--work'), scale: g('--scale'), ok: g('--ok'), bad: g('--bad'), grid: g('--grid')
    };
    colorTime = now;
    return colorCache;
  };

  /* Canvas mit Retina-Skalierung in einem Container anlegen. */
  D.makeCanvas = function (container, W = 800, H = 450, label = '') {
    const wrap = document.createElement('div');
    wrap.className = 'cv-wrap';
    const cv = document.createElement('canvas');
    cv.setAttribute('role', 'img');
    if (label) cv.setAttribute('aria-label', label);
    wrap.appendChild(cv);
    container.appendChild(wrap);
    const ctx = cv.getContext('2d');
    const obj = { wrap, cv, ctx, W, H, scale: 1 };
    function fit() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = wrap.clientWidth || W;
      cv.width = Math.round(cssW * dpr);
      cv.height = Math.round(cssW * dpr * H / W);
      obj.scale = cv.width / W;
    }
    fit();
    obj.fit = fit;
    obj.begin = function () {
      if (Math.abs(cv.width - (wrap.clientWidth || W) * Math.min(window.devicePixelRatio || 1, 2)) > 2) fit();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.setTransform(obj.scale, 0, 0, obj.scale, 0, 0);
      const c = D.colors();
      ctx.fillStyle = c.surface;
      ctx.fillRect(0, 0, W, H);
      return c;
    };
    /* Pointer-Koordinaten in logische Koordinaten umrechnen */
    obj.toLocal = function (ev) {
      const r = cv.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * W / r.width, y: (ev.clientY - r.top) * H / r.height };
    };
    return obj;
  };

  D.ease = (t) => t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t);
  D.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  D.lerp = (a, b, t) => a + (b - a) * t;
  D.seg = (p, a, b) => D.ease((p - a) / (b - a)); // Teilfortschritt im Intervall [a,b]

  D.grid = function (ctx, W, H, step = 25) {
    const c = D.colors();
    ctx.save();
    ctx.strokeStyle = c.grid; ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= W; x += step) { ctx.moveTo(x + .5, 0); ctx.lineTo(x + .5, H); }
    for (let y = 0; y <= H; y += step) { ctx.moveTo(0, y + .5); ctx.lineTo(W, y + .5); }
    ctx.stroke();
    ctx.restore();
  };

  D.text = function (ctx, str, x, y, o = {}) {
    const c = D.colors();
    ctx.save();
    ctx.fillStyle = o.color || c.ink;
    const fam = o.font === 'mono' ? '"JetBrains Mono", monospace' : o.font === 'display' ? '"Bricolage Grotesque", sans-serif' : '"Atkinson Hyperlegible", sans-serif';
    ctx.font = `${o.weight || (o.font === 'display' ? 700 : 400)} ${o.size || 18}px ${fam}`;
    ctx.textAlign = o.align || 'left';
    ctx.textBaseline = o.base || 'alphabetic';
    if (o.alpha !== undefined) ctx.globalAlpha = o.alpha;
    if (o.bg) {
      const m = ctx.measureText(str);
      const w = m.width + 12, h = (o.size || 18) + 8;
      let bx = x - 6; if (ctx.textAlign === 'center') bx = x - w / 2; if (ctx.textAlign === 'right') bx = x - w + 6;
      ctx.fillStyle = o.bg;
      D.roundRect(ctx, bx, y - (o.size || 18) - 1, w, h, 6); ctx.fill();
      ctx.fillStyle = o.color || c.ink;
    }
    ctx.fillText(str, x, y);
    ctx.restore();
  };

  D.roundRect = function (ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };

  /* Kraftpfeil von (x1,y1) nach (x2,y2) */
  D.arrow = function (ctx, x1, y1, x2, y2, o = {}) {
    const c = D.colors();
    const col = o.color || c.force;
    const w = o.width || 5;
    const len = Math.hypot(x2 - x1, y2 - y1);
    if (len < 1) return;
    const ang = Math.atan2(y2 - y1, x2 - x1);
    const head = Math.min(o.head || 16, len * 0.6);
    ctx.save();
    if (o.alpha !== undefined) ctx.globalAlpha = o.alpha;
    ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round';
    if (o.dash) ctx.setLineDash(o.dash);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2 - Math.cos(ang) * head * 0.8, y2 - Math.sin(ang) * head * 0.8);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - Math.cos(ang - 0.42) * head, y2 - Math.sin(ang - 0.42) * head);
    ctx.lineTo(x2 - Math.cos(ang + 0.42) * head, y2 - Math.sin(ang + 0.42) * head);
    ctx.closePath(); ctx.fill();
    if (o.origin !== false) { ctx.beginPath(); ctx.arc(x1, y1, w * 0.9, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
    if (o.label) {
      const lx = o.lx !== undefined ? o.lx : (x1 + x2) / 2 + Math.sin(ang) * 18;
      const ly = o.ly !== undefined ? o.ly : (y1 + y2) / 2 - Math.cos(ang) * 18 + 6;
      D.text(ctx, o.label, lx, ly, { color: col, weight: 700, size: o.lsize || 17, align: o.lalign || 'center', font: 'mono' });
    }
  };

  D.box = function (ctx, x, y, w, h, o = {}) {
    const c = D.colors();
    ctx.save();
    ctx.fillStyle = o.fill || c.accent;
    ctx.strokeStyle = o.stroke || 'rgba(0,0,0,.25)';
    ctx.lineWidth = 2;
    D.roundRect(ctx, x, y, w, h, o.r || 4);
    ctx.fill(); ctx.stroke();
    if (o.crate) {
      ctx.strokeStyle = 'rgba(0,0,0,.22)'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x + 6, y + 6); ctx.lineTo(x + w - 6, y + h - 6); ctx.moveTo(x + w - 6, y + 6); ctx.lineTo(x + 6, y + h - 6); ctx.stroke();
      ctx.strokeRect(x + 5, y + 5, w - 10, h - 10);
    }
    ctx.restore();
    if (o.label) D.text(ctx, o.label, x + w / 2, y + h / 2 + 6, { align: 'center', color: o.lcolor || '#fff', weight: 700, size: o.lsize || 16, font: 'mono' });
  };

  D.ground = function (ctx, y, x0 = 0, x1 = 800, o = {}) {
    const c = D.colors();
    ctx.save();
    ctx.strokeStyle = o.color || c.muted; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
    ctx.lineWidth = 1.5; ctx.globalAlpha = 0.5;
    ctx.beginPath();
    for (let x = x0; x < x1; x += 14) { ctx.moveTo(x, y + 14); ctx.lineTo(x + 14, y); }
    ctx.stroke();
    ctx.restore();
  };

  /* Ceiling (Decke) zum Aufhängen */
  D.ceiling = function (ctx, x0, x1, y) {
    const c = D.colors();
    ctx.save();
    ctx.strokeStyle = c.muted; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
    ctx.lineWidth = 1.5; ctx.globalAlpha = 0.5; ctx.beginPath();
    for (let x = x0; x < x1; x += 12) { ctx.moveTo(x, y); ctx.lineTo(x + 12, y - 12); }
    ctx.stroke(); ctx.restore();
  };

  /* Feder vertikal von y1 bis y2 */
  D.spring = function (ctx, x, y1, y2, o = {}) {
    const c = D.colors();
    const coils = o.coils || 12, w = o.w || 16;
    const lead = 10;
    ctx.save();
    ctx.strokeStyle = o.color || c.ink; ctx.lineWidth = o.lw || 2.5; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(x, y1); ctx.lineTo(x, y1 + lead);
    const L = (y2 - y1) - 2 * lead;
    for (let i = 0; i <= coils * 2; i++) {
      const yy = y1 + lead + L * i / (coils * 2);
      const xx = i === 0 || i === coils * 2 ? x : x + (i % 2 ? w : -w);
      ctx.lineTo(xx, yy);
    }
    ctx.lineTo(x, y2); ctx.stroke(); ctx.restore();
  };
  /* Feder horizontal */
  D.springH = function (ctx, x1, x2, y, o = {}) {
    const c = D.colors();
    const coils = o.coils || 10, w = o.w || 12, lead = 8;
    ctx.save(); ctx.strokeStyle = o.color || c.ink; ctx.lineWidth = o.lw || 2.5; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x1 + lead, y);
    const L = (x2 - x1) - 2 * lead;
    for (let i = 0; i <= coils * 2; i++) {
      const xx = x1 + lead + L * i / (coils * 2);
      const yy = i === 0 || i === coils * 2 ? y : y + (i % 2 ? w : -w);
      ctx.lineTo(xx, yy);
    }
    ctx.lineTo(x2, y); ctx.stroke(); ctx.restore();
  };

  /* Strichfigur. pose: {armL, armR} Winkel in Grad (0 = waagrecht nach vorne, 90 = nach unten, -90 = nach oben), lean in Grad, dir 1/-1 */
  D.person = function (ctx, x, footY, o = {}) {
    const c = D.colors();
    const s = o.s || 1, dir = o.dir || 1;
    const col = o.color || c.ink;
    const lean = (o.lean || 0) * Math.PI / 180 * dir;
    ctx.save();
    ctx.translate(x, footY);
    ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 4 * s; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const hipY = -46 * s, shoulderY = -96 * s;
    // Beine
    const step = o.step || 0;
    ctx.beginPath();
    ctx.moveTo(-10 * s * dir + step * s, 0); ctx.lineTo(0, hipY); ctx.lineTo(12 * s * dir - step * s, 0);
    ctx.stroke();
    ctx.translate(0, hipY); ctx.rotate(lean); ctx.translate(0, -hipY);
    ctx.beginPath(); ctx.moveTo(0, hipY); ctx.lineTo(0, shoulderY); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, shoulderY - 15 * s, 13 * s, 0, Math.PI * 2); ctx.fill();
    const arm = (deg) => {
      const a = deg * Math.PI / 180;
      const ex = Math.cos(a) * 24 * s * dir, ey = Math.sin(a) * 24 * s;
      const hx = ex + Math.cos(a) * 22 * s * dir, hy = ey + Math.sin(a) * 22 * s;
      ctx.beginPath(); ctx.moveTo(0, shoulderY + 4 * s); ctx.lineTo(ex, shoulderY + 4 * s + ey); ctx.lineTo(hx, shoulderY + 4 * s + hy); ctx.stroke();
      return { x: hx, y: shoulderY + 4 * s + hy };
    };
    const hR = arm(o.armR !== undefined ? o.armR : 70);
    const hL = arm(o.armL !== undefined ? o.armL : 80);
    ctx.restore();
    // Handposition (ohne Lean-Korrektur für einfache Fälle)
    return { hand: { x: x + hR.x, y: footY + hR.y }, hand2: { x: x + hL.x, y: footY + hL.y } };
  };

  D.ball = function (ctx, x, y, r, o = {}) {
    const c = D.colors();
    ctx.save();
    ctx.translate(x, y); ctx.rotate(o.rot || 0);
    ctx.fillStyle = o.fill || c.scale;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = o.stroke || c.accent; ctx.lineWidth = 2.5;
    ctx.stroke();
    // Volleyball-Nähte
    ctx.beginPath(); ctx.arc(-r * 0.9, 0, r * 0.95, -0.9, 0.9); ctx.stroke();
    ctx.beginPath(); ctx.arc(r * 0.6, -r * 0.9, r * 0.95, 1.3, 2.7); ctx.stroke();
    ctx.beginPath(); ctx.arc(r * 0.6, r * 0.9, r * 0.95, -2.7, -1.3); ctx.stroke();
    ctx.restore();
  };

  /* Federkraftmesser: oben bei (x,y), Gehäuselänge len; reading 0..max -> Auszug */
  D.springScale = function (ctx, x, y, o = {}) {
    const c = D.colors();
    const len = o.len || 200, max = o.max || 10, val = D.clamp(o.value || 0, 0, max * 1.05);
    const ext = val / max * (len - 30);
    ctx.save();
    // Haken oben
    ctx.strokeStyle = c.ink; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(x, y - 8, 7, Math.PI * 0.2, Math.PI * 1.8, true); ctx.stroke();
    // Gehäuse
    ctx.fillStyle = c.scale; ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.lineWidth = 2;
    D.roundRect(ctx, x - 16, y, 32, len, 8); ctx.fill(); ctx.stroke();
    // Skala
    ctx.fillStyle = '#1a1a1a'; ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 1.5;
    ctx.font = '600 10px "JetBrains Mono", monospace'; ctx.textAlign = 'right';
    const steps = o.steps || 5;
    for (let i = 0; i <= steps; i++) {
      const yy = y + 15 + (len - 30) * i / steps;
      ctx.beginPath(); ctx.moveTo(x + 4, yy); ctx.lineTo(x + 14, yy); ctx.stroke();
      ctx.fillText(String(Math.round(max * i / steps * 10) / 10), x + 2, yy + 3.5);
    }
    // Zugstange
    ctx.fillStyle = '#e8e8e8'; ctx.strokeStyle = '#555';
    ctx.fillRect(x - 4, y + len - 10, 8, ext + 14); ctx.strokeRect(x - 4, y + len - 10, 8, ext + 14);
    // Markierung (roter Strich) = Ablesung
    ctx.fillStyle = c.force;
    ctx.fillRect(x - 12, y + 13 + ext, 24, 4);
    // Haken unten
    const hy = y + len + ext + 4;
    ctx.strokeStyle = c.ink; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(x, hy); ctx.lineTo(x, hy + 8); ctx.arc(x - 6, hy + 8, 6, 0, Math.PI * 0.9); ctx.stroke();
    ctx.restore();
    if (o.unit !== false) D.text(ctx, 'N', x, y + len - 14, { align: 'center', size: 11, color: '#1a1a1a', weight: 700, font: 'mono' });
    return { hookY: hy + 14 };
  };

  D.pulley = function (ctx, x, y, r, o = {}) {
    const c = D.colors();
    ctx.save();
    ctx.fillStyle = o.fill || c.surface2; ctx.strokeStyle = c.ink; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fillStyle = c.ink; ctx.fill();
    ctx.restore();
  };
  D.rope = function (ctx, pts, o = {}) {
    const c = D.colors();
    ctx.save(); ctx.strokeStyle = o.color || '#a0703a'; ctx.lineWidth = o.lw || 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.stroke(); ctx.restore();
  };

  /* Gewichtsstück (Hakengewicht) */
  D.weight = function (ctx, x, y, o = {}) {
    const c = D.colors();
    const w = o.w || 34, h = o.h || 28;
    ctx.save();
    ctx.strokeStyle = c.ink; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 8); ctx.stroke();
    ctx.fillStyle = o.fill || c.muted;
    D.roundRect(ctx, x - w / 2, y + 8, w, h, 4); ctx.fill();
    ctx.restore();
    if (o.label) D.text(ctx, o.label, x, y + 8 + h / 2 + 5, { align: 'center', size: o.lsize || 12, color: '#fff', weight: 700, font: 'mono' });
    return y + 8 + h;
  };

  D.ruler = function (ctx, x, y1, y2, o = {}) {
    const c = D.colors();
    const pxPerCm = o.pxPerCm || 10;
    ctx.save();
    ctx.fillStyle = c.surface2; ctx.strokeStyle = c.line; ctx.lineWidth = 1;
    ctx.fillRect(x, y1, 34, y2 - y1); ctx.strokeRect(x, y1, 34, y2 - y1);
    ctx.strokeStyle = c.ink; ctx.fillStyle = c.muted; ctx.font = '10px "JetBrains Mono", monospace';
    let i = 0;
    for (let yy = y1; yy <= y2 + 0.1; yy += pxPerCm, i++) {
      const big = i % 5 === 0;
      ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + (big ? 14 : 7), yy); ctx.stroke();
      if (big) ctx.fillText(String(i), x + 17, yy + 4);
    }
    ctx.restore();
  };

  window.KD = D;
})();
