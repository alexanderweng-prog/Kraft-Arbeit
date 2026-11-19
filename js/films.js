/* Erklärfilme: Szenen mit Sprechtext (wird vorgelesen und als Untertitel gezeigt) und Canvas-Animation.
   draw(ctx, t, p, c): t = Sekunden seit Szenenbeginn, p = Fortschritt 0..1, c = Farben */
(function () {
  const D = KD;
  const F = {};
  const T = (ctx, s, x, y, o) => D.text(ctx, s, x, y, o);
  const title = (ctx, s, c) => T(ctx, s, 400, 52, { align: 'center', font: 'display', size: 30, weight: 800, color: c.ink });

  /* ===== Film 1: Was Kräfte bewirken ===== */
  F.f1 = {
    id: 'f1', title: 'Was Kräfte bewirken', scenes: [
      { say: 'Kräfte kann man nicht sehen. Wir erkennen sie nur an ihrer Wirkung. Schauen wir genau hin!',
        draw(ctx, t, p, c) {
          title(ctx, 'Kräfte sind unsichtbar …', c);
          D.ground(ctx, 360);
          D.ball(ctx, 400, 322, 38, { rot: 0 });
          const a = 0.5 + 0.5 * Math.sin(t * 3);
          T(ctx, '?', 330, 260, { font: 'display', size: 60, color: c.force, alpha: a, weight: 800 });
          T(ctx, '?', 470, 240, { font: 'display', size: 44, color: c.accent, alpha: 1 - a, weight: 800 });
          T(ctx, '… aber ihre Wirkungen sieht man.', 400, 420, { align: 'center', size: 20, color: c.muted, alpha: D.seg(p, .4, .7) });
        } },
      { say: 'Wirkung 1: Eine Kraft kann einen Körper in Bewegung setzen oder schneller machen. Beim Anspiel wirkt die Kraft der Hand auf den Ball.',
        draw(ctx, t, p, c) {
          title(ctx, '1 · schneller machen', c);
          D.ground(ctx, 380);
          const hit = 1.2;
          const bx = t < hit ? 220 : 220 + (t - hit) * (t - hit) * 60 + (t - hit) * 120;
          const by = t < hit ? 300 : 300 - Math.sin(Math.min(1, (t - hit) / 3) * Math.PI) * 120;
          const handX = t < hit ? 120 + t * 70 : 204;
          D.person(ctx, handX - 60, 380, { armR: t < hit ? 20 : -5, s: 1 });
          D.ball(ctx, Math.min(bx, 760), by, 26, { rot: t * 4 });
          if (t > hit - 0.2 && t < hit + 0.8) D.arrow(ctx, 230, 300, 320, 270, { label: 'F', alpha: 1 - Math.max(0, t - hit) / 0.8 });
          T(ctx, 'Die Geschwindigkeit nimmt zu.', 400, 430, { align: 'center', size: 18, color: c.muted });
        } },
      { say: 'Wirkung 2: Eine Kraft kann einen Körper abbremsen oder anhalten. Der Block fängt den Ball ab.',
        draw(ctx, t, p, c) {
          title(ctx, '2 · langsamer machen, anhalten', c);
          D.ground(ctx, 380);
          const stop = 2;
          const bx = t < stop ? 80 + t * 220 : 520 - Math.min(1, (t - stop)) * 20;
          D.ball(ctx, bx, 352, 26, { rot: t < stop ? t * 6 : stop * 6 });
          ctx.save(); ctx.fillStyle = c.muted; ctx.fillRect(560, 230, 20, 150); ctx.restore();
          if (t > stop - .1 && t < stop + 1.2) D.arrow(ctx, 545, 352, 470, 352, { label: 'F' });
          T(ctx, 'Die Kraft wirkt gegen die Bewegungsrichtung.', 400, 430, { align: 'center', size: 18, color: c.muted });
        } },
      { say: 'Wirkung 3: Eine Kraft kann die Bewegungsrichtung ändern. Ein Magnet lenkt die Stahlkugel zur Seite ab.',
        draw(ctx, t, p, c) {
          title(ctx, '3 · Richtung ändern', c);
          // Magnet
          ctx.save(); ctx.fillStyle = c.force; ctx.fillRect(500, 330, 60, 40); ctx.fillStyle = c.accent; ctx.fillRect(560, 330, 60, 40); ctx.restore();
          T(ctx, 'N', 530, 357, { align: 'center', color: '#fff', weight: 700 }); T(ctx, 'S', 590, 357, { align: 'center', color: '#fff', weight: 700 });
          // Bahn: geradeaus, dann Kurve
          const s = Math.min(t, 4.5) / 4.5;
          const pts = [];
          for (let i = 0; i <= 60; i++) { const u = i / 60; pts.push(path(u)); }
          function path(u) { const x = 60 + u * 520; const y = 160 + (u > .5 ? Math.pow((u - .5) * 2, 2) * 140 : 0); return [x, y]; }
          ctx.save(); ctx.setLineDash([6, 6]); ctx.strokeStyle = c.line; ctx.lineWidth = 2; ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.stroke(); ctx.restore();
          const [x, y] = path(s);
          ctx.save(); ctx.fillStyle = c.muted; ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI * 2); ctx.fill(); ctx.restore();
          if (s > .5) D.arrow(ctx, x, y, x + 10, y + 60, { label: 'F', lx: x + 30 });
          T(ctx, 'Die Kugel wird aus ihrer Bahn abgelenkt.', 400, 430, { align: 'center', size: 18, color: c.muted });
        } },
      { say: 'Wirkung 4: Eine Kraft kann einen Körper verformen. Eine Feder geht danach wieder in die alte Form zurück: Das ist elastische Verformung. Knete bleibt verformt: Das ist plastische Verformung.',
        draw(ctx, t, p, c) {
          title(ctx, '4 · verformen', c);
          D.ground(ctx, 360, 60, 740);
          const press = Math.max(0, Math.sin(Math.min(t, 6) / 6 * Math.PI * 2));
          // Feder links
          const top = 200 + press * 80;
          D.spring(ctx, 230, top, 360, { coils: 9, w: 22 });
          ctx.save(); ctx.fillStyle = c.accent; ctx.fillRect(190, top - 14, 80, 14); ctx.restore();
          if (press > .1) D.arrow(ctx, 230, top - 90, 230, top - 18, { label: 'F', lx: 260 });
          T(ctx, 'elastisch', 230, 400, { align: 'center', font: 'display', size: 22 });
          T(ctx, 'geht zurück', 230, 424, { align: 'center', size: 15, color: c.muted });
          // Knete rechts: wird flach, bleibt flach
          const flat = D.seg(t / 6, 0, .25);
          const kh = 90 - flat * 55, kw = 90 + flat * 80;
          ctx.save(); ctx.fillStyle = c.work; D.roundRect(ctx, 560 - kw / 2, 360 - kh, kw, kh, 18 - flat * 8); ctx.fill(); ctx.restore();
          if (t / 6 < .3) D.arrow(ctx, 560, 360 - kh - 80, 560, 360 - kh - 6, { label: 'F', lx: 590 });
          T(ctx, 'plastisch', 560, 400, { align: 'center', font: 'display', size: 22 });
          T(ctx, 'bleibt verformt', 560, 424, { align: 'center', size: 15, color: c.muted });
        } },
      { say: 'Die Einheit der Kraft ist das Newton, abgekürzt N, benannt nach Isaac Newton. Eine Tafel Schokolade von 100 Gramm drückt mit ungefähr 1 N auf deine Hand.',
        draw(ctx, t, p, c) {
          title(ctx, 'Einheit: 1 Newton (1 N)', c);
          // Hand (Fläche)
          ctx.save(); ctx.fillStyle = c.surface2; ctx.strokeStyle = c.muted; ctx.lineWidth = 2;
          D.roundRect(ctx, 260, 300, 280, 40, 20); ctx.fill(); ctx.stroke(); ctx.restore();
          T(ctx, 'Hand', 400, 326, { align: 'center', color: c.muted, size: 16 });
          const drop = D.seg(p, 0, .25);
          const y = D.lerp(120, 262, drop);
          ctx.save(); ctx.fillStyle = '#6b3e1f'; D.roundRect(ctx, 320, y, 160, 38, 4); ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 2; for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(320 + i * 40, y); ctx.lineTo(320 + i * 40, y + 38); ctx.stroke(); } ctx.restore();
          T(ctx, '100 g', 400, y + 26, { align: 'center', color: '#fff', weight: 700, font: 'mono' });
          if (drop >= 1) D.arrow(ctx, 400, 300, 400, 300 + 80 * D.seg(p, .3, .5), { label: '≈ 1 N', lx: 450, ly: 380 });
          T(ctx, 'Isaac Newton (1643–1727), englischer Physiker', 400, 430, { align: 'center', size: 16, color: c.muted, alpha: D.seg(p, .5, .7) });
        } }
    ]
  };

  /* ===== Film 2: Der Kraftpfeil ===== */
  F.f2 = {
    id: 'f2', title: 'Der Kraftpfeil', scenes: [
      { say: 'Weil man Kräfte nicht sehen kann, zeichnen wir sie als Pfeil. Ein Kraftpfeil verrät drei Dinge auf einen Blick.',
        draw(ctx, t, p, c) {
          title(ctx, 'Kräfte zeichnet man als Pfeil', c);
          D.ground(ctx, 330);
          D.box(ctx, 300, 250, 80, 80, { crate: true });
          D.arrow(ctx, 380, 290, 380 + 200 * D.seg(p, .1, .5), 290, { width: 6, label: p > .5 ? 'F = 40 N' : '', ly: 275 });
        } },
      { say: 'Erstens: der Angriffspunkt. Dort beginnt der Pfeil, genau da, wo die Kraft am Körper angreift.',
        draw(ctx, t, p, c) {
          title(ctx, '1 · Angriffspunkt', c);
          D.ground(ctx, 330);
          D.box(ctx, 300, 250, 80, 80, { crate: true });
          D.arrow(ctx, 380, 290, 580, 290, { width: 6 });
          const r = 14 + 6 * Math.sin(t * 5);
          ctx.save(); ctx.strokeStyle = c.scale; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(380, 290, r, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
          T(ctx, 'Angriffspunkt', 380, 220, { align: 'center', weight: 700, color: c.ink });
        } },
      { say: 'Zweitens: die Richtung. Die Pfeilspitze zeigt, wohin die Kraft wirkt: nach rechts, nach oben, schräg, …',
        draw(ctx, t, p, c) {
          title(ctx, '2 · Richtung', c);
          const ang = t * 0.9;
          D.box(ctx, 360, 185, 80, 80, { crate: true });
          D.arrow(ctx, 400, 225, 400 + Math.cos(ang) * 150, 225 - Math.sin(ang) * 150, { width: 6 });
          T(ctx, 'Die Pfeilspitze zeigt die Wirkrichtung.', 400, 430, { align: 'center', size: 18, color: c.muted });
        } },
      { say: 'Drittens: der Betrag. Je länger der Pfeil, desto grösser die Kraft. Dazu brauchen wir einen Massstab, zum Beispiel: 1 Zentimeter entspricht 10 Newton. Ein Pfeil von 4 Zentimetern bedeutet dann 40 Newton.',
        draw(ctx, t, p, c) {
          title(ctx, '3 · Betrag (Länge)', c);
          const PX = 50;
          T(ctx, 'Massstab: 1 cm ≙ 10 N', 60, 110, { font: 'mono', size: 18, color: c.muted });
          const n = Math.min(4, Math.floor(t / 1.2) + 1);
          D.box(ctx, 120, 200, 70, 70, { crate: true });
          D.arrow(ctx, 190, 235, 190 + n * PX, 235, { width: 6, label: `${n * 10} N`, ly: 215 });
          // Lineal
          ctx.save(); ctx.strokeStyle = c.ink; ctx.lineWidth = 2;
          for (let i = 0; i <= 8; i++) { ctx.beginPath(); ctx.moveTo(190 + i * PX, 290); ctx.lineTo(190 + i * PX, 305); ctx.stroke(); T(ctx, i + ' cm', 190 + i * PX, 325, { align: 'center', size: 13, color: c.muted, font: 'mono' }); }
          ctx.beginPath(); ctx.moveTo(190, 297); ctx.lineTo(190 + 8 * PX, 297); ctx.stroke(); ctx.restore();
          T(ctx, `${n} cm  ·  10 N/cm  =  ${n * 10} N`, 400, 400, { align: 'center', font: 'mono', size: 22, color: c.force, weight: 700 });
        } },
      { say: 'Im Alltag begegnen dir viele Kraftarten: die Gewichtskraft, die alles nach unten zieht, die Muskelkraft, die Reibungskraft, die Federkraft und die Magnetkraft.',
        draw(ctx, t, p, c) {
          title(ctx, 'Kraftarten', c);
          const show = (i) => D.seg(p, i * .15, i * .15 + .15);
          // Gewichtskraft: Apfel
          ctx.save(); ctx.globalAlpha = show(0); ctx.fillStyle = c.bad; ctx.beginPath(); ctx.arc(110, 180, 26, 0, Math.PI * 2); ctx.fill(); ctx.restore();
          if (show(0) > .5) D.arrow(ctx, 110, 180, 110, 270, { label: 'F_G', lx: 140 });
          T(ctx, 'Gewichtskraft', 110, 320, { align: 'center', weight: 700, alpha: show(0) });
          // Muskelkraft
          if (show(1) > 0) { D.person(ctx, 250, 270, { s: .8, armR: -60, armL: -50 }); }
          T(ctx, 'Muskelkraft', 260, 320, { align: 'center', weight: 700, alpha: show(1) });
          // Reibung
          if (show(2) > 0) { D.ground(ctx, 270, 360, 470); D.box(ctx, 385, 225, 50, 45, {}); D.arrow(ctx, 435, 250, 470, 250, { width: 4 }); D.arrow(ctx, 385, 265, 350, 265, { color: c.work, width: 4, label: 'F_R', ly: 296, lx: 365 }); }
          T(ctx, 'Reibungskraft', 415, 320, { align: 'center', weight: 700, alpha: show(2) });
          // Feder
          if (show(3) > 0) { D.ceiling(ctx, 530, 600, 150); D.spring(ctx, 565, 150, 230 + 10 * Math.sin(t * 4), { coils: 7, w: 12 }); D.weight(ctx, 565, 230 + 10 * Math.sin(t * 4), { w: 30, h: 24 }); }
          T(ctx, 'Federkraft', 565, 320, { align: 'center', weight: 700, alpha: show(3) });
          // Magnet
          if (show(4) > 0) { ctx.save(); ctx.fillStyle = c.force; ctx.fillRect(660, 230, 30, 30); ctx.fillStyle = c.accent; ctx.fillRect(690, 230, 30, 30); ctx.restore();
            const nx = 760 - 10 * Math.abs(Math.sin(t * 2)); ctx.save(); ctx.fillStyle = c.muted; ctx.fillRect(nx - 4, 220, 8, 50); ctx.restore(); D.arrow(ctx, nx, 245, nx - 30, 245, { width: 3, head: 10 }); }
          T(ctx, 'Magnetkraft', 700, 320, { align: 'center', weight: 700, alpha: show(4) });
          T(ctx, 'Kontaktkräfte brauchen Berührung – Gewichts- und Magnetkraft wirken auch auf Distanz.', 400, 400, { align: 'center', size: 16, color: c.muted, alpha: D.seg(p, .8, .95) });
        } }
    ]
  };

  /* ===== Film 3: Masse und Gewichtskraft ===== */
  function planetScene(name, g, colorKey, sayIntro) {
    return {
      say: sayIntro,
      draw(ctx, t, p, c) {
        title(ctx, name, c);
        // Boden-Bogen
        ctx.save(); ctx.fillStyle = c[colorKey]; ctx.globalAlpha = .25; ctx.beginPath(); ctx.ellipse(400, 760, 600, 360, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        D.ceiling(ctx, 280, 380, 90);
        const F = 20 * g;
        const r = D.springScale(ctx, 330, 100, { len: 160, max: 250, value: F * D.seg(p, 0, .3), steps: 5 });
        // Rucksack
        ctx.save(); ctx.fillStyle = c.accent; D.roundRect(ctx, 300, r.hookY, 60, 70, 10); ctx.fill(); ctx.restore();
        T(ctx, '20 kg', 330, r.hookY + 42, { align: 'center', color: '#fff', weight: 700, font: 'mono', size: 15 });
        T(ctx, 'Masse m = 20 kg', 460, 170, { font: 'mono', size: 20, weight: 700 });
        T(ctx, 'bleibt überall gleich', 460, 196, { size: 16, color: c.muted });
        T(ctx, `Gewichtskraft F_G ≈ ${KA.fmt(F, 0)} N`, 460, 260, { font: 'mono', size: 20, weight: 700, color: c.force, alpha: D.seg(p, .3, .5) });
        T(ctx, `g = ${KA.fmt(g, 2)} N/kg`, 460, 290, { font: 'mono', size: 16, color: c.muted, alpha: D.seg(p, .3, .5) });
      }
    };
  }
  F.f3 = {
    id: 'f3', title: 'Masse oder Gewichtskraft?', scenes: [
      { say: 'Masse und Gewichtskraft werden im Alltag oft verwechselt. Die Masse sagt, wie viel Stoff ein Körper hat. Sie wird in Kilogramm gemessen.',
        draw(ctx, t, p, c) {
          title(ctx, 'Masse  ≠  Gewichtskraft', c);
          // Balkenwaage
          const tilt = Math.sin(t * 1.5) * 0.06 * (1 - D.seg(p, .2, .6));
          ctx.save(); ctx.translate(400, 200); ctx.rotate(tilt);
          ctx.strokeStyle = c.ink; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-180, 0); ctx.lineTo(180, 0); ctx.stroke();
          ctx.lineWidth = 2; [-170, 170].forEach(x => { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x - 40, 90); ctx.moveTo(x, 0); ctx.lineTo(x + 40, 90); ctx.stroke(); ctx.fillStyle = c.muted; ctx.fillRect(x - 50, 90, 100, 6); });
          ctx.fillStyle = c.accent; ctx.fillRect(-200, 50, 60, 40); ctx.fillStyle = c.work; ctx.fillRect(140, 50, 60, 40);
          ctx.restore();
          T(ctx, '1 kg', 230, 280, { align: 'center', font: 'mono', weight: 700 });
          T(ctx, '1 kg', 570, 280, { align: 'center', font: 'mono', weight: 700 });
          ctx.save(); ctx.fillStyle = c.ink; ctx.beginPath(); ctx.moveTo(400, 200); ctx.lineTo(380, 360); ctx.lineTo(420, 360); ctx.closePath(); ctx.fill(); ctx.restore();
          T(ctx, 'Masse m · Einheit kg · gemessen mit der Balkenwaage', 400, 410, { align: 'center', size: 18, color: c.muted });
        } },
      planetScene('Erde', 9.81, 'accent', 'Die Gewichtskraft ist die Kraft, mit der ein Körper von der Erde angezogen wird. Sie wird in Newton gemessen, mit dem Federkraftmesser. Auf der Erde zieht sie an 20 Kilogramm mit rund 196 Newton.'),
      planetScene('Mond', 1.62, 'muted', 'Auf dem Mond ist die Masse des Rucksacks immer noch 20 Kilogramm. Aber der Mond zieht viel schwächer: Die Gewichtskraft beträgt nur noch etwa 32 Newton.'),
      planetScene('Jupiter', 24.79, 'scale', 'Auf dem Jupiter wäre derselbe Rucksack eine echte Last: Die Gewichtskraft beträgt fast 500 Newton.'),
      { say: 'Darum gilt: Gewichtskraft gleich Masse mal Ortsfaktor. Der Ortsfaktor g sagt, wie stark ein Himmelskörper an jedem Kilogramm zieht. Auf der Erde sind das 9,81 Newton pro Kilogramm.',
        draw(ctx, t, p, c) {
          title(ctx, 'Die Formel', c);
          T(ctx, 'F_G = m · g', 400, 170, { align: 'center', font: 'mono', size: 54, weight: 600, color: c.force });
          const rows = [['F_G', 'Gewichtskraft', 'N'], ['m', 'Masse', 'kg'], ['g', 'Ortsfaktor', 'N/kg']];
          rows.forEach((r, i) => {
            const a = D.seg(p, .15 + i * .12, .3 + i * .12);
            T(ctx, r[0], 250, 250 + i * 44, { font: 'mono', size: 22, weight: 700, alpha: a });
            T(ctx, r[1], 330, 250 + i * 44, { size: 22, alpha: a });
            T(ctx, 'in ' + r[2], 560, 250 + i * 44, { size: 20, color: c.muted, alpha: a, font: 'mono' });
          });
          T(ctx, 'Beispiel: 20 kg · 9,81 N/kg = 196,2 N', 400, 410, { align: 'center', font: 'mono', size: 20, alpha: D.seg(p, .6, .8) });
        } },
      { say: 'Vergleich der Ortsfaktoren: Mond 1,62, Mars 3,71, Erde 9,81 und Jupiter 24,8 Newton pro Kilogramm.',
        draw(ctx, t, p, c) {
          title(ctx, 'Ortsfaktor g in N/kg', c);
          const data = [['Mond', 1.62, c.muted], ['Mars', 3.71, c.bad], ['Erde', 9.81, c.accent], ['Jupiter', 24.79, c.scale]];
          data.forEach((d, i) => {
            const y = 120 + i * 70;
            const w = d[1] / 25 * 520 * D.seg(p, i * .1, i * .1 + .35);
            T(ctx, d[0], 140, y + 26, { align: 'right', size: 20, weight: 700 });
            ctx.save(); ctx.fillStyle = d[2]; D.roundRect(ctx, 160, y, Math.max(2, w), 36, 6); ctx.fill(); ctx.restore();
            T(ctx, KA.fmt(d[1], 2), 170 + w, y + 25, { font: 'mono', size: 18, color: c.ink });
          });
        } }
    ]
  };

  /* ===== Film 4: Federn ===== */
  F.f4 = {
    id: 'f4', title: 'Federn und Federkraftmesser', scenes: [
      { say: 'Wir hängen Gewichtsstücke an eine Feder. Jedes Stück hat eine Gewichtskraft von 1 Newton. Beobachte, wie stark sich die Feder verlängert.',
        draw(ctx, t, p, c) {
          title(ctx, 'Feder-Versuch', c);
          D.ceiling(ctx, 200, 340, 90);
          const n = Math.min(4, Math.floor(t / 1.6));
          const ext = n * 40;
          const yEnd = 180 + ext;
          D.spring(ctx, 270, 90, yEnd, { coils: 12, w: 14 });
          let y = yEnd; for (let i = 0; i < n; i++) y = D.weight(ctx, 270, y, { w: 40, h: 20, label: '1 N', lsize: 11 });
          D.ruler(ctx, 360, 180, 380, { pxPerCm: 10 });
          ctx.save(); ctx.strokeStyle = c.force; ctx.setLineDash([4, 4]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(280, yEnd); ctx.lineTo(360, yEnd); ctx.stroke(); ctx.restore();
          T(ctx, `F = ${n} N`, 470, 200, { font: 'mono', size: 24, weight: 700, color: c.force });
          T(ctx, `s = ${n * 4} cm`, 470, 240, { font: 'mono', size: 24, weight: 700, color: c.accent });
        } },
      { say: 'Doppelte Kraft, doppelte Verlängerung. Dreifache Kraft, dreifache Verlängerung. Kraft und Verlängerung sind proportional. Im Diagramm ergibt das eine Gerade durch den Nullpunkt.',
        draw(ctx, t, p, c) {
          title(ctx, 'F und s sind proportional', c);
          const ox = 180, oy = 380, sx = 100, sy = 60;
          ctx.save(); ctx.strokeStyle = c.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + 480, oy); ctx.moveTo(ox, oy); ctx.lineTo(ox, 90); ctx.stroke(); ctx.restore();
          T(ctx, 's in cm', ox + 480, oy + 30, { align: 'right', font: 'mono', size: 15 });
          T(ctx, 'F in N', ox - 10, 86, { align: 'right', font: 'mono', size: 15 });
          for (let i = 1; i <= 4; i++) { T(ctx, String(i * 4), ox + i * sx, oy + 20, { align: 'center', font: 'mono', size: 13, color: c.muted }); T(ctx, String(i), ox - 12, oy - i * sy + 5, { align: 'right', font: 'mono', size: 13, color: c.muted }); }
          const k = D.seg(p, 0, .7) * 4.4;
          ctx.save(); ctx.strokeStyle = c.force; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + k * sx, oy - k * sy); ctx.stroke(); ctx.restore();
          for (let i = 1; i <= Math.floor(k); i++) { ctx.save(); ctx.fillStyle = c.accent; ctx.beginPath(); ctx.arc(ox + i * sx, oy - i * sy, 6, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
        } },
      { say: 'Das ist das Hookesche Gesetz: Federkraft gleich Federkonstante mal Verlängerung. Die Federkonstante D sagt, wie hart eine Feder ist. Unsere Feder hat D gleich 0,25 Newton pro Zentimeter.',
        draw(ctx, t, p, c) {
          title(ctx, 'Hookesches Gesetz', c);
          T(ctx, 'F = D · s', 400, 170, { align: 'center', font: 'mono', size: 56, weight: 600, color: c.force });
          T(ctx, 'D = F : s = 1 N : 4 cm = 0,25 N/cm', 400, 250, { align: 'center', font: 'mono', size: 22, alpha: D.seg(p, .3, .5) });
          T(ctx, 'harte Feder → grosses D  ·  weiche Feder → kleines D', 400, 320, { align: 'center', size: 19, color: c.muted, alpha: D.seg(p, .5, .7) });
          T(ctx, 'Robert Hooke (1635–1703)', 400, 410, { align: 'center', size: 16, color: c.muted, alpha: D.seg(p, .6, .8) });
        } },
      { say: 'Achtung: Zieht man zu stark, wird die Feder überdehnt. Sie geht nicht mehr ganz zurück, sie ist plastisch verformt. Ab da gilt das Hookesche Gesetz nicht mehr.',
        draw(ctx, t, p, c) {
          title(ctx, 'Überdehnt!', c);
          D.ceiling(ctx, 300, 500, 90);
          const pull = Math.sin(D.seg(p, 0, .6) * Math.PI);
          const rest = D.seg(p, .3, .6) * 60;
          const yEnd = 200 + pull * 160 + rest;
          D.spring(ctx, 400, 90, yEnd, { coils: 12, w: 14 - pull * 6, color: p > .3 ? c.bad : c.ink });
          if (pull > .1) D.arrow(ctx, 400, yEnd + 4, 400, yEnd + 4 + pull * 70, { label: 'F', lx: 430 });
          ctx.save(); ctx.strokeStyle = c.muted; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.moveTo(340, 200); ctx.lineTo(460, 200); ctx.stroke(); ctx.restore();
          T(ctx, 'ursprüngliche Länge', 470, 205, { size: 14, color: c.muted });
          if (p > .65) T(ctx, 'bleibt länger → plastisch verformt', 400, 420, { align: 'center', size: 20, color: c.bad, weight: 700 });
        } },
      { say: 'Genau das nutzt der Federkraftmesser: Eine Feder mit Skala. Die Verlängerung zeigt direkt die Kraft in Newton an. Wähle immer einen Messbereich, der zur Kraft passt.',
        draw(ctx, t, p, c) {
          title(ctx, 'Der Federkraftmesser', c);
          D.ceiling(ctx, 200, 600, 80);
          const v1 = 3 + Math.sin(t * 2) * 0.3;
          const r1 = D.springScale(ctx, 300, 90, { len: 200, max: 5, value: v1 * D.seg(p, 0, .3), steps: 5 });
          D.weight(ctx, 300, r1.hookY - 6, { label: '300 g', w: 40, h: 30, lsize: 11 });
          T(ctx, 'Messbereich 0–5 N: passt', 300, 420, { align: 'center', size: 16, color: c.ok, weight: 700 });
          const r2 = D.springScale(ctx, 520, 90, { len: 200, max: 100, value: v1 * D.seg(p, 0, .3), steps: 5 });
          D.weight(ctx, 520, r2.hookY - 6, { label: '300 g', w: 40, h: 30, lsize: 11 });
          T(ctx, '0–100 N: kaum ablesbar', 520, 420, { align: 'center', size: 16, color: c.bad, weight: 700 });
        } }
    ]
  };

  /* ===== Film 5: Kräfte zusammensetzen, Wechselwirkung ===== */
  F.f5 = {
    id: 'f5', title: 'Kräfte im Team', scenes: [
      { say: 'Beim Tauziehen ziehen beide Teams mit 600 Newton. Die Kräfte sind gleich gross und entgegengesetzt. Sie heben sich auf: Kräftegleichgewicht. Das Seil bewegt sich nicht.',
        draw(ctx, t, p, c) {
          title(ctx, 'Kräftegleichgewicht', c);
          D.ground(ctx, 360);
          const wob = Math.sin(t * 4) * 3;
          D.rope(ctx, [[180, 290], [620, 290]]);
          D.person(ctx, 150 + wob, 360, { dir: -1, lean: 18, armR: 0, armL: 5 });
          D.person(ctx, 650 + wob, 360, { dir: 1, lean: 18, armR: 0, armL: 5 });
          ctx.save(); ctx.fillStyle = c.force; ctx.fillRect(397 + wob, 280, 6, 20); ctx.restore();
          D.arrow(ctx, 400, 230, 250, 230, { label: '600 N', ly: 215 });
          D.arrow(ctx, 400, 230, 550, 230, { label: '600 N', ly: 215, color: c.accent });
          T(ctx, 'Resultierende Kraft = 0 N', 400, 420, { align: 'center', font: 'mono', size: 20, weight: 700 });
        } },
      { say: 'Zieht ein Team stärker, zum Beispiel 800 gegen 600 Newton, bleibt eine resultierende Kraft von 200 Newton übrig. Das Seil bewegt sich in Richtung der grösseren Kraft.',
        draw(ctx, t, p, c) {
          title(ctx, 'Entgegengesetzt: subtrahieren', c);
          D.ground(ctx, 360);
          const shift = Math.min(1, D.seg(p, .2, 1)) * 60;
          D.rope(ctx, [[180 + shift, 290], [620 + shift, 290]]);
          D.person(ctx, 150 + shift, 360, { dir: -1, lean: 10, armR: 0, step: 4 });
          D.person(ctx, 650 + shift, 360, { dir: 1, lean: 25, armR: 0 });
          D.arrow(ctx, 400, 210, 280, 210, { label: '600 N', ly: 195 });
          D.arrow(ctx, 400, 210, 560, 210, { label: '800 N', ly: 195, color: c.accent });
          D.arrow(ctx, 400, 250, 440, 250, { label: '200 N', ly: 275, color: c.work, width: 6 });
          T(ctx, '800 N − 600 N = 200 N nach rechts', 400, 420, { align: 'center', font: 'mono', size: 20, weight: 700 });
        } },
      { say: 'Wirken zwei Kräfte in die gleiche Richtung, werden sie addiert. Zwei Personen schieben ein Auto mit je 300 Newton: Zusammen sind das 600 Newton.',
        draw(ctx, t, p, c) {
          title(ctx, 'Gleiche Richtung: addieren', c);
          D.ground(ctx, 360);
          const x = 420 + D.seg(p, .3, 1) * 80;
          ctx.save(); ctx.fillStyle = c.accent; D.roundRect(ctx, x, 270, 220, 60, 12); ctx.fill(); D.roundRect(ctx, x + 40, 230, 130, 50, 12); ctx.fill();
          ctx.fillStyle = c.ink; ctx.beginPath(); ctx.arc(x + 50, 335, 22, 0, Math.PI * 2); ctx.arc(x + 175, 335, 22, 0, Math.PI * 2); ctx.fill(); ctx.restore();
          D.person(ctx, x - 50, 360, { lean: 25, armR: -5, armL: 0 });
          D.person(ctx, x - 110, 360, { lean: 25, armR: -5, armL: 0, color: c.muted });
          D.arrow(ctx, 120, 170, 270, 170, { label: '300 N', ly: 155 });
          D.arrow(ctx, 270, 170, 420, 170, { label: '300 N', ly: 155, color: c.accent });
          D.arrow(ctx, 120, 210, 420, 210, { label: '600 N', ly: 236, color: c.work, width: 6 });
        } },
      { say: 'Kräfte treten immer paarweise auf. Stösst du dich auf dem Skateboard von einer Freundin ab, rollt ihr beide auseinander. Kraft und Gegenkraft sind gleich gross und entgegengesetzt. Das ist das Wechselwirkungsprinzip.',
        draw(ctx, t, p, c) {
          title(ctx, 'Kraft = Gegenkraft', c);
          D.ground(ctx, 380);
          const s = D.seg(p, .2, 1) * 180;
          const touch = p < .25;
          [[-1, 360 - s], [1, 440 + s]].forEach(([d, x]) => {
            ctx.save(); ctx.fillStyle = c.muted; D.roundRect(ctx, x - 40, 352, 80, 10, 4); ctx.fill(); ctx.fillStyle = c.ink; ctx.beginPath(); ctx.arc(x - 25, 368, 8, 0, 7); ctx.arc(x + 25, 368, 8, 0, 7); ctx.fill(); ctx.restore();
            D.person(ctx, x, 350, { dir: -d, armR: touch ? 0 : 60, color: d < 0 ? c.ink : c.accent });
          });
          if (touch || p < .5) {
            D.arrow(ctx, 400, 200, 300, 200, { label: 'F₁', ly: 185 });
            D.arrow(ctx, 400, 200, 500, 200, { label: 'F₂', ly: 185, color: c.accent });
          }
          T(ctx, 'actio = reactio', 400, 430, { align: 'center', font: 'mono', size: 20, color: c.muted });
        } },
      { say: 'Auch beim Volleyball: Beim Pritschen drücken deine Finger auf den Ball, und der Ball drückt genauso stark zurück auf deine Finger. Darum spürst du den Ball.',
        draw(ctx, t, p, c) {
          title(ctx, 'Wechselwirkung beim Pritschen', c);
          const contact = p > .25 && p < .55;
          const by = p < .25 ? D.lerp(80, 200, p / .25) : p < .55 ? 200 + Math.sin((p - .25) / .3 * Math.PI) * 14 : D.lerp(200, 60, (p - .55) / .45);
          D.person(ctx, 400, 400, { armR: -80, armL: -100, s: 1.15 });
          D.ball(ctx, 400, by - 30, 30, { rot: t });
          if (contact) {
            D.arrow(ctx, 430, by - 10, 430, by - 80, { label: 'Finger → Ball', lalign: 'left', lx: 445, ly: by - 50 });
            D.arrow(ctx, 370, by - 50, 370, by + 20, { label: 'Ball → Finger', lalign: 'right', lx: 355, ly: by, color: c.accent });
          }
        } },
      { say: 'Eine Drohne schwebt, wenn die Schubkraft der Propeller genau so gross ist wie ihre Gewichtskraft. Gibst du mehr Gas, ist die Schubkraft grösser und die Drohne steigt.',
        draw(ctx, t, p, c) {
          title(ctx, 'Schweben = Gleichgewicht', c);
          const up = p > .55;
          const y = up ? 250 - D.seg(p, .55, 1) * 120 : 250 + Math.sin(t * 3) * 3;
          // Drohne
          ctx.save(); ctx.fillStyle = c.ink; D.roundRect(ctx, 360, y - 10, 80, 20, 6); ctx.fill();
          ctx.strokeStyle = c.ink; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(330, y - 14); ctx.lineTo(470, y - 14); ctx.stroke();
          ctx.fillStyle = c.muted; const spin = Math.abs(Math.sin(t * 30)) * 30 + 6;
          ctx.fillRect(330 - spin / 2, y - 20, spin, 4); ctx.fillRect(470 - spin / 2, y - 20, spin, 4); ctx.restore();
          const thrust = up ? 120 : 80;
          D.arrow(ctx, 400, y - 22, 400, y - 22 - thrust, { label: up ? 'Schub > F_G' : 'Schub', lx: 470, ly: y - 60, color: c.accent });
          D.arrow(ctx, 400, y + 12, 400, y + 92, { label: 'F_G', lx: 440, ly: y + 70 });
          T(ctx, up ? 'mehr Gas → steigt' : 'Schub = Gewichtskraft → schwebt', 400, 430, { align: 'center', size: 20, weight: 700, color: up ? c.work : c.ink });
        } },
      { say: 'Zum Schluss die Trägheit: Jeder Körper will seinen Bewegungszustand beibehalten. Bremst der Bus, bewegen sich die Fahrgäste weiter nach vorne. Deshalb tragen wir Sicherheitsgurte.',
        draw(ctx, t, p, c) {
          title(ctx, 'Trägheit', c);
          D.ground(ctx, 380);
          const brake = p > .35;
          const bx = brake ? 260 + D.seg(p, .35, .6) * 60 : 60 + p / .35 * 200;
          ctx.save(); ctx.fillStyle = c.scale; D.roundRect(ctx, bx, 220, 320, 130, 14); ctx.fill(); ctx.fillStyle = c.surface; ctx.fillRect(bx + 20, 240, 280, 50);
          ctx.fillStyle = c.ink; ctx.beginPath(); ctx.arc(bx + 60, 355, 22, 0, 7); ctx.arc(bx + 260, 355, 22, 0, 7); ctx.fill(); ctx.restore();
          const lean = brake ? Math.sin(D.seg(p, .35, .55) * Math.PI) * 30 : 0;
          D.person(ctx, bx + 160, 330, { s: .6, lean, armR: 80 });
          if (brake && p < .7) { D.arrow(ctx, bx + 170, 200, bx + 250, 200, { label: 'will weiter', ly: 186 }); }
          T(ctx, brake ? 'Bus bremst – Körper bewegt sich weiter' : 'Bus fährt', 400, 430, { align: 'center', size: 18, color: c.muted });
        } }
    ]
  };

  /* ===== Film 6: Reibung ===== */
  F.f6 = {
    id: 'f6', title: 'Reibung', scenes: [
      { say: 'Unter der Lupe sind auch glatte Flächen rau. Die kleinen Unebenheiten verhaken sich ineinander. Das ist die Ursache der Reibung.',
        draw(ctx, t, p, c) {
          title(ctx, 'Unter der Lupe', c);
          const off = Math.sin(t * 2) * 6;
          ctx.save(); ctx.fillStyle = c.accent; ctx.beginPath(); ctx.moveTo(150 + off, 120); ctx.lineTo(650 + off, 120);
          for (let x = 650; x >= 150; x -= 25) ctx.lineTo(x + off, 230 + ((x / 25) % 2 ? 14 : 0)); ctx.closePath(); ctx.fill();
          ctx.fillStyle = c.muted; ctx.beginPath(); ctx.moveTo(100, 360); ctx.lineTo(700, 360);
          for (let x = 700; x >= 100; x -= 25) ctx.lineTo(x, 248 - ((x / 25) % 2 ? 0 : 16)); ctx.closePath(); ctx.fill(); ctx.restore();
          T(ctx, 'Körper', 400, 175, { align: 'center', color: '#fff', weight: 700 });
          T(ctx, 'Unterlage', 400, 320, { align: 'center', color: '#fff', weight: 700 });
          T(ctx, 'Unebenheiten verhaken sich', 400, 410, { align: 'center', size: 18, color: c.muted });
        } },
      { say: 'Haftreibung: Du ziehst an einer Kiste, aber sie bleibt liegen. Die Haftreibung hält dagegen, gleich gross wie deine Zugkraft, bis zu einem Höchstwert.',
        draw(ctx, t, p, c) {
          title(ctx, 'Haftreibung', c);
          D.ground(ctx, 340);
          const F = Math.min(1, p * 1.2) * 60;
          D.box(ctx, 300, 250, 100, 90, { crate: true });
          D.rope(ctx, [[400, 300], [520, 300]]);
          D.person(ctx, 600, 340, { dir: -1, lean: 15, armR: 10 });
          D.arrow(ctx, 400, 280, 400 + F * 2, 280, { label: `${Math.round(F)} N`, ly: 268 });
          D.arrow(ctx, 300, 334, 300 - F * 2, 334, { label: `${Math.round(F)} N`, ly: 322, color: c.work });
          T(ctx, 'Zugkraft = Haftreibung → Kiste bleibt in Ruhe', 400, 410, { align: 'center', size: 18, color: c.muted });
        } },
      { say: 'Wird die Zugkraft grösser als die maximale Haftreibung, reisst die Kiste los. Jetzt wirkt die Gleitreibung. Sie ist kleiner als die Haftreibung. Darum ist Anschieben schwerer als Weiterschieben.',
        draw(ctx, t, p, c) {
          title(ctx, 'Gleitreibung', c);
          D.ground(ctx, 340);
          const move = D.seg(p, .25, 1) * 200;
          D.box(ctx, 200 + move, 250, 100, 90, { crate: true });
          D.person(ctx, 420 + move, 340, { dir: -1, lean: 15, armR: 10 });
          D.rope(ctx, [[300 + move, 300], [380 + move, 300]]);
          const F = p < .25 ? 72 : 45;
          D.arrow(ctx, 300 + move, 280, 300 + move + F * 2, 280, { label: `${F} N`, ly: 268 });
          D.arrow(ctx, 200 + move, 334, 200 + move - 90, 334, { label: '45 N', ly: 322, color: c.work });
          T(ctx, 'Haftreibung (max. 72 N)  >  Gleitreibung (45 N)', 400, 410, { align: 'center', size: 18, font: 'mono' });
        } },
      { say: 'Am kleinsten ist die Rollreibung. Mit Rädern oder Rollen braucht es nur noch einen Bruchteil der Kraft. Darum war das Rad eine der wichtigsten Erfindungen.',
        draw(ctx, t, p, c) {
          title(ctx, 'Rollreibung', c);
          D.ground(ctx, 360);
          const x = 160 + D.seg(p, .1, 1) * 280;
          D.box(ctx, x, 260, 100, 80, { crate: true });
          ctx.save(); ctx.fillStyle = c.ink; ctx.beginPath(); ctx.arc(x + 20, 350, 10, 0, 7); ctx.arc(x + 80, 350, 10, 0, 7); ctx.fill(); ctx.restore();
          D.arrow(ctx, x + 100, 300, x + 140, 300, { label: '5 N', ly: 288 });
          const bars = [['Haftreibung', 72], ['Gleitreibung', 45], ['Rollreibung', 5]];
          bars.forEach((b, i) => { T(ctx, b[0], 600, 130 + i * 40, { align: 'right', size: 15 }); ctx.save(); ctx.fillStyle = c.work; ctx.fillRect(610, 116 + i * 40, b[1] * 2 * D.seg(p, .3, .7), 18); ctx.restore(); });
        } },
      { say: 'Reibung ist oft nützlich: Ohne Reibung könntest du nicht gehen, nicht bremsen und in der Turnhalle nicht stoppen. Sie kann aber auch schaden: Sie erzeugt Wärme und Abnützung, zum Beispiel an Bremsen oder Lagern.',
        draw(ctx, t, p, c) {
          title(ctx, 'Nützlich oder schädlich?', c);
          ctx.save(); ctx.fillStyle = c.ok; ctx.globalAlpha = .12; ctx.fillRect(40, 90, 350, 320); ctx.fillStyle = c.bad; ctx.fillRect(410, 90, 350, 320); ctx.restore();
          T(ctx, 'nützlich', 215, 125, { align: 'center', font: 'display', size: 26, color: c.ok });
          T(ctx, 'schädlich', 585, 125, { align: 'center', font: 'display', size: 26, color: c.bad });
          ['Gehen und Laufen', 'Bremsen am Velo', 'Hallenschuhe im Volleyball', 'Schrauben halten', 'Streichholz anzünden'].forEach((s, i) => T(ctx, '+ ' + s, 70, 180 + i * 40, { size: 18, alpha: D.seg(p, i * .08, i * .08 + .1) }));
          ['Abnützung der Reifen', 'Wärme im Motor', 'Bremsbeläge verschleissen', 'Schlitten wird langsamer'].forEach((s, i) => T(ctx, '– ' + s, 440, 180 + i * 40, { size: 18, alpha: D.seg(p, .4 + i * .08, .5 + i * .08) }));
        } }
    ]
  };

  /* ===== Film 7: Arbeit ===== */
  F.f7 = {
    id: 'f7', title: 'Arbeit = Kraft mal Weg', scenes: [
      { say: 'In der Physik bedeutet Arbeit etwas Genaues: Arbeit wird verrichtet, wenn eine Kraft einen Körper entlang eines Weges bewegt. Kraft und Weg müssen in die gleiche Richtung zeigen.',
        draw(ctx, t, p, c) {
          title(ctx, 'Was ist physikalische Arbeit?', c);
          D.ground(ctx, 380);
          const h = D.seg(p, .1, .8) * 150;
          ctx.save(); ctx.fillStyle = c.surface2; ctx.fillRect(500, 220, 200, 160); ctx.restore();
          T(ctx, 'Regal', 600, 360, { align: 'center', color: c.muted });
          D.person(ctx, 300, 380, { armR: -90 + (1 - h / 150) * 120, armL: -80 + (1 - h / 150) * 120 });
          D.box(ctx, 330, 300 - h, 60, 60, { crate: true, fill: c.accent });
          D.arrow(ctx, 360, 300 - h, 360, 220 - h, { label: 'F', lx: 385 });
          D.arrow(ctx, 430, 360, 430, 360 - Math.max(10, h), { color: c.work, width: 4, label: 's', lx: 450, ly: 360 - h / 2 });
        } },
      { say: 'Die Formel: Arbeit gleich Kraft mal Weg. Die Einheit ist das Joule. 1 Joule ist die Arbeit, wenn eine Kraft von 1 Newton einen Körper 1 Meter weit bewegt.',
        draw(ctx, t, p, c) {
          title(ctx, 'Die Formel', c);
          T(ctx, 'W = F · s', 400, 170, { align: 'center', font: 'mono', size: 56, weight: 600, color: c.work });
          T(ctx, '1 J = 1 N · 1 m = 1 Nm', 400, 250, { align: 'center', font: 'mono', size: 28, alpha: D.seg(p, .2, .4) });
          T(ctx, 'W: Arbeit (Joule)   F: Kraft (Newton)   s: Weg (Meter)', 400, 310, { align: 'center', size: 18, color: c.muted, alpha: D.seg(p, .4, .6) });
          T(ctx, 'James Prescott Joule (1818–1889)', 400, 410, { align: 'center', size: 16, color: c.muted, alpha: D.seg(p, .6, .8) });
        } },
      { say: 'Im Kraft-Weg-Diagramm ist die Arbeit die Fläche unter der Linie. 100 Newton über 3 Meter ergeben 300 Joule.',
        draw(ctx, t, p, c) {
          title(ctx, 'Arbeit = Fläche im F-s-Diagramm', c);
          const ox = 180, oy = 370, sx = 120, sy = 2;
          ctx.save(); ctx.strokeStyle = c.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + 460, oy); ctx.moveTo(ox, oy); ctx.lineTo(ox, 100); ctx.stroke(); ctx.restore();
          for (let i = 1; i <= 3; i++) T(ctx, i + ' m', ox + i * sx, oy + 22, { align: 'center', font: 'mono', size: 13, color: c.muted });
          T(ctx, '100 N', ox - 8, oy - 100 * sy + 5, { align: 'right', font: 'mono', size: 13, color: c.muted });
          const w = D.seg(p, .1, .7) * 3 * sx;
          ctx.save(); ctx.fillStyle = c.work; ctx.globalAlpha = .3; ctx.fillRect(ox, oy - 100 * sy, w, 100 * sy); ctx.globalAlpha = 1;
          ctx.strokeStyle = c.force; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ox, oy - 100 * sy); ctx.lineTo(ox + 3 * sx, oy - 100 * sy); ctx.stroke(); ctx.restore();
          T(ctx, `W = 100 N · ${KA.fmt(w / sx, 1)} m = ${Math.round(100 * w / sx)} J`, ox + 180, oy - 90, { align: 'center', font: 'mono', size: 20, weight: 700, color: c.work });
          T(ctx, 's', ox + 470, oy + 5, { font: 'mono' }); T(ctx, 'F', ox - 5, 92, { font: 'mono', align: 'right' });
        } },
      { say: 'Keine Arbeit im physikalischen Sinn: Du drückst mit aller Kraft gegen eine Wand. Du wirst müde, aber die Wand bewegt sich nicht. Der Weg ist null, also ist auch die Arbeit null.',
        draw(ctx, t, p, c) {
          title(ctx, 's = 0  →  W = 0', c);
          D.ground(ctx, 380);
          ctx.save(); ctx.fillStyle = c.muted; ctx.fillRect(520, 140, 60, 240); ctx.restore();
          const shake = Math.sin(t * 20) * 1.5;
          D.person(ctx, 440 + shake, 380, { dir: 1, lean: 22, armR: -10, armL: -5 });
          D.arrow(ctx, 490, 250, 520, 250, { label: 'F', ly: 238, origin: false });
          T(ctx, 'W = F · 0 m = 0 J', 400, 430, { align: 'center', font: 'mono', size: 22, weight: 700 });
        } },
      { say: 'Auch wenn du eine Tasche auf gleicher Höhe trägst, verrichtest du keine Hubarbeit an der Tasche: Deine Kraft zeigt nach oben, der Weg verläuft waagrecht. Kraft und Weg stehen senkrecht zueinander.',
        draw(ctx, t, p, c) {
          title(ctx, 'Kraft senkrecht zum Weg → W = 0', c);
          D.ground(ctx, 380);
          const x = 160 + D.seg(p, .05, .9) * 420;
          D.person(ctx, x, 380, { armR: 70, step: Math.sin(t * 6) * 6 });
          D.box(ctx, x + 6, 300, 44, 40, { fill: c.work });
          D.arrow(ctx, x + 28, 300, x + 28, 230, { label: 'F', lx: x + 50 });
          D.arrow(ctx, 160, 420, x + 28, 420, { color: c.work, width: 4, label: 's', ly: 410 });
        } },
      { say: 'Je nach Situation sprechen wir von verschiedenen Arbeitsformen: Hubarbeit beim Heben, Reibungsarbeit beim Schieben gegen die Reibung, Spannarbeit beim Spannen einer Feder und Beschleunigungsarbeit beim Schnellermachen.',
        draw(ctx, t, p, c) {
          title(ctx, 'Arbeitsformen', c);
          const items = [['Hubarbeit', 'W = F_G · h'], ['Reibungsarbeit', 'W = F_R · s'], ['Spannarbeit', 'Feder spannen'], ['Beschleunigungsarbeit', 'schneller machen']];
          items.forEach((it, i) => {
            const x = 110 + (i % 2) * 330, y = 130 + Math.floor(i / 2) * 150;
            const a = D.seg(p, i * .15, i * .15 + .2);
            ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = c.work; ctx.lineWidth = 2; D.roundRect(ctx, x, y, 300, 110, 12); ctx.stroke(); ctx.restore();
            T(ctx, it[0], x + 20, y + 45, { font: 'display', size: 24, alpha: a });
            T(ctx, it[1], x + 20, y + 82, { font: 'mono', size: 18, color: c.work, alpha: a });
          });
        } }
    ]
  };

  /* ===== Film 8: Goldene Regel der Mechanik ===== */
  F.f8 = {
    id: 'f8', title: 'Die Goldene Regel der Mechanik', scenes: [
      { say: 'Eine Kiste mit einer Gewichtskraft von 600 Newton soll 1 Meter hoch auf eine Rampe. Direkt hochheben braucht 600 Newton. Die Arbeit beträgt 600 Newton mal 1 Meter, also 600 Joule.',
        draw(ctx, t, p, c) {
          title(ctx, 'Direkt heben', c);
          D.ground(ctx, 380, 0, 800);
          ctx.save(); ctx.fillStyle = c.surface2; ctx.fillRect(450, 260, 300, 120); ctx.strokeStyle = c.line; ctx.strokeRect(450, 260, 300, 120); ctx.restore();
          T(ctx, '1 m', 770, 325, { font: 'mono', color: c.muted });
          const h = D.seg(p, .1, .7) * 120;
          D.box(ctx, 360, 320 - h, 60, 60, { crate: true, label: '600 N', lsize: 12 });
          D.arrow(ctx, 390, 320 - h, 390, 220 - h, { label: '600 N', lx: 440 });
          T(ctx, 'W = 600 N · 1 m = 600 J', 400, 430, { align: 'center', font: 'mono', size: 22, weight: 700, color: c.work });
        } },
      { say: 'Mit einer 3 Meter langen schiefen Ebene braucht es nur noch 200 Newton, ein Drittel der Kraft. Dafür ist der Weg dreimal so lang. Die Arbeit: 200 Newton mal 3 Meter, wieder 600 Joule.',
        draw(ctx, t, p, c) {
          title(ctx, 'Schiefe Ebene', c);
          D.ground(ctx, 380, 0, 800);
          const x0 = 150, x1 = 600, y0 = 380, y1 = 260;
          ctx.save(); ctx.fillStyle = c.surface2; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.lineTo(x1, y0); ctx.closePath(); ctx.fill(); ctx.fillRect(x1, y1, 160, 120); ctx.restore();
          const u = D.seg(p, .1, .8);
          const ang = Math.atan2(y1 - y0, x1 - x0);
          const bx = D.lerp(x0 + 20, x1 - 30, u), by = D.lerp(y0, y1, (bx - x0) / (x1 - x0));
          ctx.save(); ctx.translate(bx, by); ctx.rotate(ang); D.box(ctx, -30, -55, 60, 55, { crate: true }); ctx.restore();
          D.arrow(ctx, bx + 25, by - 30, bx + 25 + Math.cos(ang) * 80, by - 30 + Math.sin(ang) * 80, { label: '200 N', ly: by - 70 });
          T(ctx, 's = 3 m', 360, 350, { font: 'mono', color: c.muted });
          T(ctx, 'W = 200 N · 3 m = 600 J', 400, 430, { align: 'center', font: 'mono', size: 22, weight: 700, color: c.work });
        } },
      { say: 'Eine lose Rolle verteilt die Last auf zwei Seilstücke. Man braucht nur noch die halbe Kraft, 300 Newton, muss aber doppelt so viel Seil ziehen: 2 Meter.',
        draw(ctx, t, p, c) {
          title(ctx, 'Lose Rolle', c);
          D.ceiling(ctx, 250, 550, 70);
          const u = D.seg(p, .1, .8);
          const h = u * 100;
          const py = 280 - h;
          D.pulley(ctx, 450, 110, 22);
          D.pulley(ctx, 380, py, 26);
          D.rope(ctx, [[354, 70], [354, py]]);
          D.rope(ctx, [[406, py], [428, 110]]);
          D.rope(ctx, [[472, 110], [472, 230 + u * 200 > 420 ? 420 : 230 + u * 200]]);
          D.box(ctx, 345, py + 40, 70, 60, { crate: true, label: '600 N', lsize: 12 });
          ctx.save(); ctx.strokeStyle = c.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(380, py + 26); ctx.lineTo(380, py + 40); ctx.stroke(); ctx.restore();
          D.arrow(ctx, 472, 250, 472, 330, { label: '300 N', lx: 525 });
          T(ctx, 'Seilweg 2 m · Hubhöhe 1 m', 640, 200, { align: 'center', font: 'mono', size: 15, color: c.muted });
          T(ctx, 'W = 300 N · 2 m = 600 J', 400, 430, { align: 'center', font: 'mono', size: 22, weight: 700, color: c.work });
        } },
      { say: 'Ein Flaschenzug mit 4 tragenden Seilstücken: Ein Viertel der Kraft, 150 Newton, dafür 4 Meter Seil. Die Arbeit bleibt 600 Joule.',
        draw(ctx, t, p, c) {
          title(ctx, 'Flaschenzug (4 Seilstücke)', c);
          D.ceiling(ctx, 280, 520, 70);
          const u = D.seg(p, .1, .8);
          const yTop = 120, yBot = 270 - u * 80;
          ctx.save(); ctx.strokeStyle = c.ink; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(400, 70); ctx.lineTo(400, yTop); ctx.stroke(); ctx.restore();
          D.rope(ctx, [[350, yTop], [350, yBot]]); D.rope(ctx, [[390, yTop], [390, yBot]]);
          D.rope(ctx, [[410, yTop], [410, yBot]]); D.rope(ctx, [[450, yTop], [450, yBot]]);
          D.rope(ctx, [[430, yTop - 20], [480, yTop - 6], [490, 250 + u * 160]]);
          D.pulley(ctx, 370, yTop, 20); D.pulley(ctx, 430, yTop, 20);
          D.pulley(ctx, 370, yBot, 20); D.pulley(ctx, 430, yBot, 20);
          ctx.save(); ctx.strokeStyle = c.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(400, yBot); ctx.lineTo(400, yBot + 34); ctx.stroke(); ctx.restore();
          D.box(ctx, 365, yBot + 34, 70, 55, { crate: true, label: '600 N', lsize: 12 });
          D.arrow(ctx, 490, 250 + u * 160, 490, Math.min(420, 320 + u * 160), { label: '150 N', lx: 545 });
          ['1', '2', '3', '4'].forEach((n, i) => T(ctx, n, [350, 390, 410, 450][i] + (i < 2 ? -12 : 12), (yTop + yBot) / 2, { align: 'center', size: 14, color: c.force, weight: 700 }));
          T(ctx, 'W = 150 N · 4 m = 600 J', 400, 430, { align: 'center', font: 'mono', size: 22, weight: 700, color: c.work });
        } },
      { say: 'Ein Hebel: Drückst du am langen Ende, brauchst du weniger Kraft. Dafür bewegt sich dein Ende um einen längeren Weg als die Last.',
        draw(ctx, t, p, c) {
          title(ctx, 'Hebel', c);
          D.ground(ctx, 380);
          const a = -0.18 + D.seg(p, .15, .8) * 0.36;
          ctx.save(); ctx.fillStyle = c.ink; ctx.beginPath(); ctx.moveTo(300, 330); ctx.lineTo(280, 380); ctx.lineTo(320, 380); ctx.closePath(); ctx.fill(); ctx.restore();
          ctx.save(); ctx.translate(300, 330); ctx.rotate(a);
          ctx.fillStyle = c.scale; ctx.fillRect(-120, -8, 480, 12);
          ctx.restore();
          const lx = 300 - 110 * Math.cos(a), ly = 330 - 110 * Math.sin(a);
          const rx = 300 + 350 * Math.cos(a), ry = 330 + 350 * Math.sin(a);
          D.box(ctx, lx - 30, ly - 62, 60, 54, { crate: true, label: '600 N', lsize: 12 });
          D.arrow(ctx, rx - 10, ry - 90, rx - 10, ry - 12, { label: '≈ 190 N', lx: rx + 40, ly: ry - 50 });
          T(ctx, 'kurzer Arm', 230, 420, { align: 'center', size: 16, color: c.muted });
          T(ctx, 'langer Arm', 480, 420, { align: 'center', size: 16, color: c.muted });
        } },
      { say: 'Das ist die Goldene Regel der Mechanik: Was man an Kraft spart, muss man an Weg zusetzen. Die Arbeit bleibt gleich. Kraftwandler sparen Kraft, aber nie Arbeit.',
        draw(ctx, t, p, c) {
          title(ctx, 'Goldene Regel der Mechanik', c);
          T(ctx, '«Was man an Kraft spart,', 400, 150, { align: 'center', font: 'display', size: 34, color: c.scale, weight: 800 });
          T(ctx, 'muss man an Weg zusetzen.»', 400, 195, { align: 'center', font: 'display', size: 34, color: c.scale, weight: 800 });
          const rows = [['direkt', '600 N', '1 m'], ['schiefe Ebene', '200 N', '3 m'], ['lose Rolle', '300 N', '2 m'], ['Flaschenzug', '150 N', '4 m']];
          rows.forEach((r, i) => {
            const a = D.seg(p, .2 + i * .1, .3 + i * .1), y = 260 + i * 36;
            T(ctx, r[0], 230, y, { size: 19, alpha: a });
            T(ctx, r[1] + ' · ' + r[2], 470, y, { align: 'center', font: 'mono', size: 19, alpha: a });
            T(ctx, '= 600 J', 620, y, { font: 'mono', size: 19, color: c.work, weight: 700, alpha: a });
          });
        } }
    ]
  };

  window.KFILMS = F;
})();
