/* ---------- Sheet rendering: builds the PDF-identical SVG pages ---------- */
const SHEET = (() => {
  const W = 768, H = 1024, M = 36;
  const US_LOGO = 'data:image/png;base64,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';
  const C = {
    ink: '#17212B', muted: '#5B6B7A', faint: '#8C99A6', line: '#D3DBE2', court: '#EEF2F5', court2: '#E3E9EE',
    hi: '#FFC83D', white: '#FFFFFF', prin: '#17212B', sec: '#97A4B0', heat: '#C3CED8', paper: '#FFFFFF'
  };
  const ROLE = {
    5: { k: 'S', label: 'Palleggiatore', col: '#17212B' },
    2: { k: 'OH', label: 'Schiacciatore', col: '#1F5FA8' },
    3: { k: 'OPP', label: 'Opposto', col: '#B4233C' },
    4: { k: 'MB', label: 'Centrale', col: '#1E7A4C' },
    1: { k: 'L', label: 'Libero', col: '#8C6A2F' },
    0: { k: '?', label: 'Ruolo n.d.', col: '#5B6B7A' }
  };
  const ROTS = ['P1', 'P6', 'P5', 'P4', 'P3', 'P2'];

  /* ---------- text measuring ---------- */
  const cv = (typeof document !== 'undefined') ? document.createElement('canvas').getContext('2d') : null;
  const FAM = { BC: 'BarlowC', B: 'Barlow', BT: 'BarlowT' }; // BT: titles and names (Barlow bold)
  function mw(str, f, b, s) {
    if (!cv) return String(str).length * s * 0.5;
    cv.font = `${b ? 700 : 400} ${s}px ${FAM[f]}`;
    return cv.measureText(String(str)).width;
  }
  function wrap(str, f, b, s, maxW, maxLines) {
    const out = [];
    for (const para of String(str || '').split('\n')) {
      const words = para.split(/\s+/).filter(Boolean);
      if (!words.length) { out.push(''); continue; }
      let line = '';
      for (const w of words) {
        const t = line ? line + ' ' + w : w;
        if (mw(t, f, b, s) <= maxW || !line) line = t; else { out.push(line); line = w; }
      }
      out.push(line);
    }
    while (out.length && out[out.length - 1] === '') out.pop();
    if (maxLines && out.length > maxLines) {
      const cut = out.slice(0, maxLines);
      let last = cut[maxLines - 1];
      while (last && mw(last + '…', f, b, s) > maxW) last = last.slice(0, -1);
      cut[maxLines - 1] = last.replace(/\s+$/, '') + '…';
      return cut;
    }
    return out;
  }
  function fit(str, f, b, s, maxW, minS) {
    let size = s;
    while (size > (minS || 8) && mw(str, f, b, size) > maxW) size -= 1;
    return size;
  }

  /* ---------- svg primitives ---------- */
  const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const n2 = v => Math.round(v * 100) / 100;
  // type scale: every text on the sheet uses one of these sizes; a size in between goes down to the step below
  const TSCALE = [10, 11, 13, 15, 18, 22, 30, 50];
  function snapS(s) { let r = TSCALE[0]; for (const t of TSCALE) if (t <= s + 0.01) r = t; return r; }
  function stepDown(s) { const i = TSCALE.indexOf(snapS(s)); return TSCALE[Math.max(0, i - 1)]; }
  function T(x, y, str, o = {}) {
    const f = FAM[o.f || 'B'];
    return `<text x="${n2(x)}" y="${n2(y)}" font-family="${f}" font-weight="${o.b ? 'bold' : 'normal'}" font-size="${snapS(o.s || 14)}" fill="${o.fill || C.ink}"${o.a ? ` text-anchor="${o.a}"` : ''}>${esc(str)}</text>`;
  }
  function R(x, y, w, h, o = {}) {
    return `<rect x="${n2(x)}" y="${n2(y)}" width="${n2(w)}" height="${n2(h)}"${o.r ? ` rx="${o.r}" ry="${o.r}"` : ''} fill="${o.fill || 'none'}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 1}"` : ''}${o.extra || ''}/>`;
  }
  function L(x1, y1, x2, y2, o = {}) {
    return `<line x1="${n2(x1)}" y1="${n2(y1)}" x2="${n2(x2)}" y2="${n2(y2)}" stroke="${o.stroke || C.ink}" stroke-width="${o.sw || 1}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`;
  }
  function P(pts, o = {}) {
    return `<polygon points="${pts.map(p => n2(p[0]) + ',' + n2(p[1])).join(' ')}" fill="${o.fill || C.ink}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 1}" stroke-linejoin="round"` : ''}/>`;
  }
  function arrow(x0, y0, x1, y1, col, o = {}) {
    const cx = o.cx ?? x0, cy = o.cy ?? (y0 + (y1 - y0) * 0.75);
    let dx = x1 - cx, dy = y1 - cy;
    const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d;
    const hl = o.head || 9, hw = (o.head || 9) * 0.55;
    const bx = x1 - dx * hl, by = y1 - dy * hl;
    const path = o.straight
      ? `<line x1="${n2(x0)}" y1="${n2(y0)}" x2="${n2(bx)}" y2="${n2(by)}" stroke="${col}" stroke-width="${o.sw || 2}" stroke-linecap="round"/>`
      : `<path d="M${n2(x0)},${n2(y0)} Q${n2(cx)},${n2(cy)} ${n2(bx)},${n2(by)}" fill="none" stroke="${col}" stroke-width="${o.sw || 2}" stroke-linecap="round"/>`;
    return path + P([[x1, y1], [bx - dy * hw, by + dx * hw], [bx + dy * hw, by - dx * hw]], { fill: col });
  }

  /* ---------- helpers on the sheet model ---------- */
  function player(sh, num) {
    const base = sh.stats?.roster?.[num] || {};
    const ov = sh.roster?.[num] || {};
    const roleCode = ov.role != null && ov.role !== '' ? +ov.role : (base.roleCode || 0);
    return { num, surname: (ov.surname || base.surname || ('N. ' + num)), roleCode, libero: roleCode === 1 || base.libero };
  }
  const pct = (a, b) => b ? Math.round(100 * a / b) : 0;
  const shortName = s => {
    const t = String(s || '').trim();
    if (!t) return '';
    return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase().replace(/(\s|-|')(\w)/g, (m, a, b) => a + b.toUpperCase());
  };
  function setterStats(sh) {
    const st = sh.stats?.bySetter?.[sh.setter];
    return st || null;
  }
  const sumV = o => Object.values(o || {}).reduce((a, b) => a + b, 0);
  function distOf(d, extra = {}) {
    const n = sumV(d);
    const p = k => pct((d || {})[k] || 0, n);
    return { manual: false, n, B: p('B'), C: p('C'), F: p('F'), P: p('P'), S: p('S'), cnt: d || {}, ...extra };
  }
  // sets with a call after our reception, as DataVolley counts them: every K call except the exclamation (KE)
  // and the free-ball code (a free ball coded after a reception is not a reception set)
  function calledDist(sh, st, Pk, inSys) {
    const skip = ['KE', (sh.fbCall || 'KF').toUpperCase(), ...(inSys ? ['KM', 'KP'] : [])], out = {};
    for (const [k, d] of Object.entries(st?.distCall?.[Pk] || {})) if (!skip.includes(k)) for (const [t, v] of Object.entries(d)) out[t] = (out[t] || 0) + v;
    return out;
  }
  // which data the rotation card uses: the most used middle call (K1/K7) when it has enough balls, else all calls
  function rotDist(sh, Pk) {
    const man = sh.rot?.[Pk]?.manual || {};
    if (['B', 'C', 'F', 'P', 'S'].some(k => man[k] !== '' && man[k] != null)) {
      const v = k => parseFloat(man[k]) || 0;
      return { manual: true, n: null, B: v('B'), C: v('C'), F: v('F'), P: v('P'), S: v('S'), base: 'manual' };
    }
    // a moment of the set chosen: that part of the set only, first ball after a # + reception
    if (sh.distPhase) { const d = setterStats(sh)?.ph?.[sh.distPhase]?.distRec?.[Pk] || {}; return distOf(d, { base: 'rec' }); }
    const st = setterStats(sh);
    const mode = sh.distMode || 'auto';
    if (mode === 'auto') {
      const dc = st?.distCall?.[Pk] || {};
      const minCall = +((sh.rules || {}).minCall ?? 10);
      // middle-hitter calls: every call except displaced balls, no-call and free ball (K1, K7, KC, K2…)
      const skip = ['KE', 'KP', 'KM', (sh.fbCall || 'KF').toUpperCase()];
      const c = Object.keys(dc).filter(k => !skip.includes(k)).map(k => [k, sumV(dc[k])]).sort((a, b) => b[1] - a[1]);
      while (c.length < 2) c.push(['', 0]);
      if (c[0][1] >= minCall) {
        const alt = c[1][1] >= Math.max(5, c[0][1] * 2 / 3) ? distOf(dc[c[1][0]], { call: c[1][0] }) : null;
        return distOf(dc[c[0][0]], { base: 'call', call: c[0][0], alt });
      }
      if (sumV(calledDist(sh, st, Pk, true))) return distOf(calledDist(sh, st, Pk, true), { base: 'inSys' });
      if (sumV(st?.distRec?.[Pk])) return distOf(st.distRec[Pk], { base: 'rec' });
      return distOf(st?.distAll?.[Pk], { base: 'all' });
    }
    const d = mode === 'called' || mode === 'inSys' ? calledDist(sh, st, Pk, mode === 'inSys') : (mode === 'all' ? st?.distAll : (st?.distRec || st?.dist))?.[Pk] || {};
    return distOf(d, { base: mode });
  }
  function topCall(sh, Pk) {
    const rc = setterStats(sh)?.rotCalls?.[Pk];
    if (!rc) return null;
    const n = Object.values(rc).reduce((a, b) => a + b, 0);
    const [k, v] = Object.entries(rc).sort((a, b) => b[1] - a[1])[0] || [];
    return k ? { k, p: pct(v, n), n } : null;
  }

  /* ---------- chips ---------- */
  function chip(x, y, label, o = {}) {
    const s = o.s || 12, f = o.f || 'BC', b = o.b !== false;
    const w = mw(label, f, b, s) + (o.padX ?? 8) * 2, h = o.h || s + 9;
    const xx = o.right ? x - w : x;
    return { w, h, svg: R(xx, y, w, h, { fill: o.fill || C.ink, r: o.r ?? 3, stroke: o.stroke }) + T(xx + w / 2, y + h / 2 + s * 0.36, label, { f, b, s, fill: o.color || C.white, a: 'middle' }) };
  }
  function videoChip(x, y, url, ctx, o = {}) {
    if (!url) return { w: 0, svg: '' };
    const s = o.s || 13, h = 24, label = o.label || 'Video';
    const w = 30 + mw(label, 'BC', true, s);
    const xx = o.right ? x - w : x;
    let svg = R(xx, y, w, h, { fill: o.fill || C.ink, r: 12 }) +
      P([[xx + 11, y + 7], [xx + 11, y + 17], [xx + 19, y + 12]], { fill: C.hi }) +
      T(xx + 24, y + 12 + s * 0.36, label, { f: 'BC', b: true, s, fill: C.white });
    if (ctx.screen) svg = `<a href="${esc(url)}" target="_blank" rel="noopener">${svg}</a>`;
    ctx.links.push({ x: xx, y, w, h, url });
    return { w, svg };
  }

  /* ---------- page header & footer ---------- */
  // page 1: logo, team name (condensed, it must stand out), round code and date top right, links under them;
  // other pages: the page title is the big thing, the team name small on the right
  const SEC_HDR_Y = 30 + 36 + 22;
  function roundDate(m) {
    const d = String(m.date || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return [m.code, d ? `${d[3]}-${d[2]}-${d[1]}` : (m.date || '')].filter(Boolean).join(' - ');
  }
  function header(sh, ctx, section) {
    const m = sh.meta || {};
    const col = m.color || '#1F3A5F';
    let s = '';
    const big = !section;
    const logoS = big ? 54 : 36;
    const y0 = 30;
    let x = M;
    if (m.logo) {
      s += R(M, y0, logoS, logoS, { fill: C.white });
      s += `<image x="${M}" y="${y0}" width="${logoS}" height="${logoS}" preserveAspectRatio="xMidYMid meet" href="${m.logo}"/>`;
      x = M + logoS + (big ? 16 : 12);
    }
    const name = (m.opp || 'Avversario').toUpperCase();
    if (big) {
      const extra = (sh.links || []).filter(l => l.url);
      const chips = m.montage ? [{ url: m.montage, label: 'Montaggio' }] : [];
      const inHdr = extra.length + chips.length <= 2;
      if (inHdr) chips.push(...extra.map(l => ({ url: l.url, label: l.label || 'Video' })));
      const cw = chips.map(c => 30 + mw(c.label, 'BC', true, 13));
      const rd = roundDate(m);
      const rightW = Math.max(rd ? mw(rd, 'BT', true, 16) : 0, cw.reduce((a, b) => a + b + 8, 0)) + 14;
      const fs = fit(name, 'BC', true, 50, W - M - x - rightW, 24);
      s += T(x, y0 + logoS / 2 + fs * 0.36, name, { f: 'BC', b: true, s: fs, fill: C.ink });
      if (rd) s += T(W - M, y0 + 16, rd, { f: 'BT', b: true, s: 16, fill: col, a: 'end' });
      let cx = W - M;
      chips.forEach((c, i) => { s += videoChip(cx, y0 + (rd ? 26 : 14), c.url, ctx, { right: true, label: c.label }).svg; cx -= cw[i] + 8; });
      s += R(M, y0 + logoS + 6, W - 2 * M, 5, { fill: col });
      return { svg: s, y: y0 + logoS + 22, linksInHeader: inHdr };
    }
    const sec = section.toUpperCase();
    const sfs = fit(sec, 'BT', true, 30, W - M - x - 200, 18);
    s += T(x, y0 + logoS / 2 + sfs * 0.36, sec, { f: 'BT', b: true, s: sfs, fill: col });
    s += T(W - M, y0 + logoS / 2 + 5, name, { f: 'BT', b: true, s: fit(name, 'BT', true, 15, 190, 10), fill: C.muted, a: 'end' });
    s += R(M, y0 + logoS + 8, W - 2 * M, 4, { fill: col });
    return { svg: s, y: SEC_HDR_Y };
  }
  function footer(sh, i, n, note) {
    const m = sh.meta || {};
    let s = L(M, H - 34, W - M, H - 34, { stroke: C.line });
    if (note && note.startsWith('●')) { // legend with the red dot drawn as on the sheet
      s += `<circle cx="${n2(M + 3.5)}" cy="${n2(H - 43.5)}" r="3.3" fill="#B4233C"/>` + T(M + 11, H - 40, note.slice(1).trim(), { s: 10, fill: C.muted });
    } else if (note) s += T(M, H - 40, note, { s: 10, fill: C.faint });
    const lg = US_LOGO && US_LOGO.length > 30;
    if (lg) s += `<image x="${M}" y="${H - 30}" width="20" height="23" preserveAspectRatio="xMidYMid meet" href="${US_LOGO}"/>`;
    s += T(M + (lg ? 26 : 0), H - 16, [m.us, 'Foglio gara', m.opp].filter(Boolean).join('  ·  '), { s: 11, fill: C.faint });
    const src = sh.stats?.files?.length ? `Scout: ${sh.stats.files.length} ${sh.stats.files.length === 1 ? 'partita' : 'partite'}` : '';
    s += T(W - M, H - 16, [src, `${i}/${n}`].filter(Boolean).join('  ·  '), { s: 11, fill: C.faint, a: 'end' });
    return s;
  }
  function fmtDate(d) {
    if (!d) return '';
    const m = String(d).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return d;
    const dt = new Date(+m[1], +m[2] - 1, +m[3]);
    const g = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'][dt.getDay()];
    return `${g} ${+m[3]}.${m[2]}.${m[1]}`;
  }
  // one title style, one text style everywhere
  const TY = { title: 19, text: 14, small: 10.5 };
  const SRV_COL = { FLOT: '#1F5FA8', SPIN: '#C2410C' };
  // section titles in their own colour (Garlasco green), with a small bar, so they stand out from the text
  const TITLE_COL = '#3E7D14';
  function sectionTitle(x, y, label, col, extra, size) {
    const z = size || TY.title - 2;
    return R(x, y - z + 1, 4, z, { fill: TITLE_COL }) + T(x + 10, y - 1, label.toUpperCase(), { f: 'BT', b: true, s: z, fill: TITLE_COL }) + (extra || '');
  }
  function txt(x, y, str, o = {}) { return T(x, y, str, { f: 'B', b: o.b !== false, s: o.s || TY.text, fill: o.fill || C.ink, a: o.a }); }

  /* ---------- attack court: our half, net at the top ---------- */
  const ZONE_CR = { 4: [0, 0], 3: [1, 0], 2: [2, 0], 7: [0, 1], 8: [1, 1], 9: [2, 1], 5: [0, 2], 6: [1, 2], 1: [2, 2] };
  function originX(sitKey, sz) {
    if (sitKey === 'Q:SETTE') return 0.76;   // between their centre and their zone 4: the straight ball lands in cone 2
    if (sitKey === 'Q:DIETRO') return 0.18;
    const z = Object.entries(sz || {}).sort((a, b) => b[1] - a[1])[0]?.[0];
    const map = { '4': 0.88, '3': 0.5, '2': 0.12, '9': 0.18, '8': 0.5, '7': 0.82, '1': 0.18, '6': 0.5, '5': 0.82 };
    if (z && map[z] != null) return map[z];
    if (sitKey.startsWith('4')) return 0.88;
    if (sitKey.startsWith('2')) return 0.12;
    return 0.5;
  }
  function sitZones(sit, st) {
    const ez = st?.ez || {};
    const n = Object.values(ez).reduce((a, b) => a + b, 0);
    const share = {};
    for (let z = 1; z <= 9; z++) share[z] = n ? (ez[z] || 0) / n : 0;
    let marks = {};
    const man = sit.manual || {};
    if (Object.keys(man).length) marks = { ...man };
    else if (n) {
      const ranked = Object.entries(share).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
      ranked.forEach(([z, v], i) => {
        if (i < 2 && v >= 0.22) marks[z] = 'p';
        else if (i < 4 && v >= 0.12) marks[z] = 's';
      });
    }
    return { n, share, marks };
  }
  function mix(a, b, t) {
    const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
    const A = p(a), B = p(b);
    return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('');
  }

  /* ---------- rules that turn the distribution into one or two words ---------- */
  const FEW_N = 5; // red dot: fewer balls than this
  const PHASE_LAB = { 1: 'Inizio set (fino a 8)', 2: 'Metà set (8-15)', 3: 'Finale set (da 16)' };
  const DEF_RULES = { opz: 60, valOpz: 45, lett: 20, palla: 50, stretta: 15, avanti: 20, dietro: 20, minN: 8, few: 70, minCall: 10, over: 66, badMin: 5, aceHigh: 10 };
  const FRONT = ['P4', 'P3', 'P2'];
  const rules = sh => ({ ...DEF_RULES, ...(sh.rules || {}) });
  // { list, weak }: below minN balls the phrase shows only if one zone is above "few" (and is drawn as weak)
  function phraseInfo(sh, Pk, d) {
    const man = (sh.rot?.[Pk]?.phrase || '').trim();
    if (man) return { list: [man], weak: false };
    const Rr = rules(sh);
    let weak = false;
    if (!d.manual) {
      if (!d.n) return { list: [], weak: false };
      if (d.n < Rr.minN) {
        if (Math.max(d.B || 0, d.C || 0, d.F || 0, d.P || 0) <= Rr.few) return { list: [], weak: false };
        weak = true;
      }
    }
    const front = FRONT.includes(Pk);
    const out = [];
    if (d.F >= Rr.palla) out.push('Palla in 4');
    else if (d.B >= Rr.palla) out.push(front ? 'Palla in 1' : 'Palla in 2');
    if (d.C >= Rr.opz) out.push('Opzione');
    else if (d.C >= Rr.valOpz) out.push('Valutare opzione');
    else if (d.C < Rr.lett) out.push('Lettura');
    if (!out.some(t => t.startsWith('Palla'))) {
      if (front && d.B < Rr.stretta) out.push('Partenza stretta');
      else if (d.B < Rr.avanti) out.push('2/3 avanti');
      else if (d.F < Rr.dietro) out.push('2/3 dietro');
    }
    return { list: out.slice(0, 2), weak };
  }
  const phrases = (sh, Pk, d) => phraseInfo(sh, Pk, d).list;
  const WHERE = (k, front) => ({ F: 'in 4', C: 'al centro', B: front ? 'in 1' : 'in 2', P: 'pipe', S: 'pallonetto' })[k] || k;
  const ZLAB = (k, front) => ({ F: '4', C: 'C', B: front ? '1' : '2', P: 'pipe', S: 'pall.' })[k] || k;
  // overload with poor reception (! -) in this rotation
  function badNote(sh, Pk) {
    const d0 = setterStats(sh)?.distBad?.[Pk] || {};
    const d = Object.fromEntries(Object.entries(d0).filter(([k]) => 'FCBPS'.includes(k)));
    const n = sumV(d), Rr = rules(sh);
    if (n < Rr.badMin) return '';
    const [k, v] = Object.entries(d).sort((a, b) => b[1] - a[1])[0];
    const p = pct(v, n);
    const where = ({ F: 'in posto 4', C: 'al centro', B: FRONT.includes(Pk) ? 'in posto 1' : 'in posto 2', P: 'in pipe', S: 'di pallonetto' })[k] || k;
    return p >= Rr.over ? `Rice negativa: ${p}% ${where}` : '';
  }

  /* ---------- distribution boxes: zones at the net (net line under them), pipe as a tab behind the centre,
     small box for the setter dump between 1/2 and centre; only zones >= 50% are dark ---------- */
  const PIPE_H = 18;
  const PAIR_COL = '#4A6378'; // two zones that together take most of the balls
  function distBoxes(x, y, w, h, d, o = {}) {
    let s = '';
    const hasP = (d.P || 0) > 0, hasS = (d.S || 0) > 0;
    const gp = o.gap || 4;
    const sw = hasS ? Math.max(30, w * 0.12) : 0;
    const bw = (w - sw - 2 * gp - (hasS ? gp : 0)) / 3;
    const box = (bx, by, bwid, bh, v, lab, cnt, vs, key) => {
      const dark = v >= 50 || (o.pair || []).includes(key);
      let t = R(bx, by, bwid, bh, { fill: v >= 50 ? C.ink : dark ? PAIR_COL : C.white, stroke: C.ink, sw: 1.4, r: 4 });
      t += T(bx + bwid / 2, by + bh / 2 + vs * 0.36 + 3, v ? `${v}%` : '–', { f: 'BC', b: true, s: vs, fill: dark ? C.white : (o.dim ? C.muted : C.ink), a: 'middle' });
      t += T(bx + 4, by + 11, lab, { f: 'BC', b: true, s: 10, fill: dark ? C.white : C.muted });
      return t;
    };
    const vs = o.vs || 22, small = Math.min(vs, 15);
    let xx = x;
    const cnt = k => d.cnt ? (d.cnt[k] || 0) : null;
    const lb = o.labels || { B: o.front ? '1' : '2', C: 'C', F: '4' };
    if (hasP && o.splitP) { // three columns: back, centre balls (pipe above, centre below, nearer the net), front
      const hh = (h - 3) / 2, hv = Math.min(vs, 13.5);
      const half = (bx, by, v, lab, key) => {
        const dark = v >= 50 || (o.pair || []).includes(key);
        return R(bx, by, bw, hh, { fill: v >= 50 ? C.ink : dark ? PAIR_COL : C.white, stroke: C.ink, sw: 1.4, r: 3 })
          + T(bx + 4, by + hh / 2 + 3.5, lab, { f: 'BC', b: true, s: 10, fill: dark ? C.white : C.muted })
          + T(bx + bw / 2 + 5, by + hh / 2 + hv * 0.36, v ? `${v}%` : '–', { f: 'BC', b: true, s: hv, fill: dark ? C.white : (o.dim ? C.muted : C.ink), a: 'middle' });
      };
      s += box(xx, y, bw, h, d.B || 0, lb.B, cnt('B'), vs, 'B'); xx += bw + gp;
      if (hasS) { s += box(xx, y + Math.max(0, h - 34), sw, Math.min(h, 34), d.S, 'pall.', null, small); xx += sw + gp; }
      s += half(xx, y, d.P || 0, 'P', 'P') + half(xx, y + hh + 3, d.C || 0, lb.C, 'C'); xx += bw + gp;
      s += box(xx, y, bw, h, d.F || 0, lb.F, cnt('F'), vs, 'F');
      if (!o.noNet) s += L(x, y + h + 4, x + w, y + h + 4, { stroke: C.ink, sw: 3 });
      return s;
    }
    s += box(xx, y, bw, h, d.B || 0, lb.B, cnt('B'), vs, 'B'); xx += bw + gp;
    if (hasS) { s += box(xx, y + Math.max(0, h - 34), sw, Math.min(h, 34), d.S, 'pall.', null, small); xx += sw + gp; }
    const cx = xx;
    { s += box(xx, y, bw, h, d.C || 0, lb.C, cnt('C'), vs, 'C'); xx += bw + gp; }
    s += box(xx, y, bw, h, d.F || 0, lb.F, cnt('F'), vs, 'F');
    if (hasP && !o.noPipe && !o.splitP) { // pipe: behind the centre, further from the net
      const pw = Math.min(bw * 0.8, 74), px = cx + (bw - pw) / 2, py = y - PIPE_H;
      const dark = d.P >= 50;
      s += R(px, py, pw, PIPE_H - 4, { fill: dark ? C.ink : C.white, stroke: C.ink, sw: 1.2, r: 3 });
      s += T(px + 4, py + 10.5, pw < 56 ? 'P' : 'pipe', { f: 'BC', b: true, s: 9.5, fill: dark ? C.white : C.muted });
      s += T(px + pw - 4, py + 11.5, `${d.P}%`, { f: 'BC', b: true, s: 12.5, fill: dark ? C.white : C.ink, a: 'end' });
    }
    if (!o.noNet) s += L(x, y + h + 4, x + w, y + h + 4, { stroke: C.ink, sw: 3 });
    return s;
  }
  /* ---------- rotation card ---------- */
  const POS_XY = { 1: [0.18, 0.24], 6: [0.5, 0.24], 5: [0.82, 0.24], 2: [0.18, 0.74], 3: [0.5, 0.74], 4: [0.82, 0.74] };
  const LANE_XY = { '4': [0.84, 1], '3': [0.5, 1], '2': [0.16, 1], 'P': [0.5, 0.56], '1': [0.18, 0.56], '5': [0.82, 0.56] };
  const LANES = ['', '4', '3', '2', 'P', '1', '5'];
  function rotationPlayers(sh, Pk) {
    const lu = setterStats(sh)?.lineups?.[Pk];
    const rot = sh.rot?.[Pk] || {};
    const libero = Object.keys(sh.stats?.roster || {}).map(n => player(sh, n)).filter(p => p.libero)[0];
    const res = [];
    if (lu) lu.forEach((num, i) => {
      const pos = i + 1;
      let p = player(sh, num);
      if ([5, 6, 1].includes(pos) && p.roleCode === 4 && libero) p = libero;
      res.push({ ...p, pos });
    });
    // role on court from the place in the rotation: opposite the setter = opposite, whatever the roster says
    const sZone = res.find(p => p.roleCode === 5)?.pos || parseInt(Pk.slice(1), 10);
    return res.map(p => {
      const lane = rot.lanes?.[p.num] || '';
      const base = FORM_DEF?.[Pk]?.[p.pos];
      const xy = rot.pos?.[p.num] || base || receptionXY(sh, Pk, p, lane) || POS_XY[p.pos] || [0.5, 0.45];
      const d = ((p.pos - sZone) % 6 + 6) % 6;
      const frole = [1, 5].includes(p.roleCode) ? p.roleCode : d === 3 ? 3 : p.roleCode === 3 ? 2 : p.roleCode;
      return { ...p, x: xy[0], y: xy[1], lane, frole };
    });
  }
  let FORM_DEF = null; // the team's base reception positions: { P1: { <zone>: [x, y] } }, set by build()
  // where a player stands when they receive, as a start of his run-up: the passers where the scout says they pass
  // (at least 3 passes in that rotation), the attackers who do not pass at the start of their run-up towards their lane,
  // the others near their place; without scout data the outside hitters and the libero form the passing line
  function receptionXY(sh, Pk, p, lane) {
    const rp = sh.stats?.analysis?.recPos?.[Pk]?.[p.num];
    const front = [2, 3, 4].includes(p.pos), baseX = POS_XY[p.pos]?.[0] ?? 0.5;
    if (rp && rp.n >= 3) return [rp.x / rp.n, Math.min(0.62, rp.y / rp.n)];
    const hasRec = !!sh.stats?.analysis?.recPos?.[Pk];
    if (!hasRec && (p.roleCode === 2 || p.roleCode === 1) && !(front && lane === '3')) return [baseX, 0.45];
    if (p.roleCode === 5) return front ? [baseX, 0.86] : [baseX, 0.55]; // setter: at the net, or ready to go in
    if (lane && LANE_XY[lane]) {
      const [lx, ly] = LANE_XY[lane];
      if (ly < 1) return [lx, 0.15];                         // back-row attack: from behind
      return [lx, lane === '3' ? 0.74 : 0.6];                // front row: the middle close, the others back for the run-up
    }
    return front ? [baseX, 0.84] : [baseX, 0.18];
  }
  const ROLE_FILL = { 5: C.hi, 2: '#1F5FA8', 3: '#B4233C', 4: '#1E7A4C', 1: C.white, 0: C.ink };
  // small lines under the boxes: data base, the other middle call, poor-reception overload, hand note
  const rs = () => Math.max(11, stepDown(P1.t));
  function rotLines(sh, Pk, d) {
    const front = FRONT.includes(Pk);
    const out = [];
    if (d.alt && d.alt.n) {
      const z = ['B', 'S', 'C', 'F', 'P'].filter(k => d.alt[k] >= 10).map(k => `${ZLAB(k, front)} ${d.alt[k]}%`).join(' · ');
      out.push({ t: `Su ${d.alt.call}: ${z}`, s: rs(), b: true, fill: C.ink });
    }
    const bn = badNote(sh, Pk);
    if (bn) out.push({ t: bn, s: rs(), b: true, fill: '#B4233C' });
    const note = (sh.rot?.[Pk]?.note || '').trim();
    if (note && !sh.showFormation) out.push({ t: note, s: rs(), b: true, fill: C.ink, wrap: 2 });
    return out;
  }
  const ROT_GRID = [['P4', 'P3', 'P2'], ['P5', 'P6', 'P1']]; // as the setter's position on court, net at the top
  const ROT_TOP = 26, ROT_BOX = 36, ROT_DIV = '#C9CED6';
  const P1 = { t: TY.text }; // page-1 text size, chosen by page1() as large as the content allows
  function rotCardH(sh, Pk, w, box = ROT_BOX, pipe = 0) {
    if (sh.showFormation) return null;
    const ls = rotLines(sh, Pk, rotDist(sh, Pk));
    let h = ROT_TOP + pipe + box + 10;
    for (const l of ls) h += (l.wrap ? Math.min(l.wrap, wrap(l.t, 'B', !!l.b, l.s, w, l.wrap).length) : 1) * (l.s + 3);
    return h;
  }
  // the call the setter uses most in a rotation, among the calls with the setter in position (K1, K7, KC, K2)
  function inSysCalls(sh, Pk) {
    const dc = setterStats(sh)?.distCall?.[Pk] || {};
    const c = ['K1', 'K7', 'KC', 'K2'].map(k => [k, sumV(dc[k])]).filter(([, v]) => v).sort((a, b) => b[1] - a[1]);
    const n = c.reduce((t, [, v]) => t + v, 0);
    return c.length ? { k: c[0][0], v: c[0][1], n } : null;
  }
  // lines under the boxes with the courts on: smaller, so they do not eat the courts
  const FORM_LINE = 11;
  function formLines(sh, Pk) {
    const out = rotLines(sh, Pk, rotDist(sh, Pk)).map(l => ({ ...l, s: FORM_LINE, wrap: 0 }));
    const note = (sh.rot?.[Pk]?.note || '').trim();
    if (note) out.push({ t: note, s: FORM_LINE, b: true, fill: C.ink });
    return out;
  }
  const FORM_EXTRA = n => Math.max(0, n - 1) * (FORM_LINE + 3); // the first line sits in the gap under the boxes
  function rotationCard(sh, Pk, x, y, w, h, ctx) {
    let s = '';
    const tc = topCall(sh, Pk);
    const d = rotDist(sh, Pk);
    const front = FRONT.includes(Pk);
    s += T(x, y + 19, Pk, { f: 'BT', b: true, s: 21 });
    if (d.n != null && d.n < FEW_N) s += `<circle cx="${n2(x + mw(Pk, 'BT', true, 21) + 5)}" cy="${n2(y + 5)}" r="3.6" fill="#B4233C"/>`;
    const ic = inSysCalls(sh, Pk);
    const ph = phraseInfo(sh, Pk, d);
    const phTxt = ph.list.join(' · ').toUpperCase();
    const phMin = phTxt ? mw(phTxt, 'BT', true, 11) + 10 : 0;
    // the call he uses most there: "chiama K1 3 su 5", shortened to "K1 3/5" when the phrase needs the room
    const chipTxt = '', chipW = 0; // nothing in the corner: the coach writes it in the notes if it matters
    if (phTxt) {
      const z = snapS(fit(phTxt, 'BT', true, 14, w - 44 - chipW, 10));
      s += T(x + 40, y + 19, wrap(phTxt, 'BT', true, z, w - 44 - chipW, 1)[0], { f: 'BT', b: true, s: z, fill: ph.weak ? C.muted : C.ink });
    }
    if (sh.showFormation) {
      const fl = formLines(sh, Pk), flH = FORM_EXTRA(fl.length);
      const boxH = 40, boxY = y + h - boxH - 16 - flH;
      const note = (sh.rot?.[Pk]?.note || '').trim();
      const cy0 = y + 32, ch = boxY - 8 - cy0;
      s += R(x, cy0, w, ch, { fill: C.court });
      const ps = rotationPlayers(sh, Pk);
      const sx = v => x + v * w, sy = v => cy0 + v * ch;
      // tokens in the role colours; tokens that would overlap are pushed apart sideways
      // numbers only in role-coloured discs: the names are on the attacker pages, here they would crowd the court
      const fs = 13, th = 22;
      const tk = ps.map(p => { const lab = `${p.num}`, tw = 22; return { p, lab, tw, cx: sx(p.x), ty: Math.max(cy0 + 1, Math.min(cy0 + ch - th - 1, sy(p.y) - th / 2)) }; });
      for (let it = 0; it < 12; it++) {
        let moved = false;
        for (let i = 0; i < tk.length; i++) for (let j = i + 1; j < tk.length; j++) {
          const A = tk[i], B = tk[j];
          if (Math.abs(A.ty - B.ty) >= th + 2) continue;
          const need = (A.tw + B.tw) / 2 + 4, d = B.cx - A.cx;
          if (Math.abs(d) >= need) continue;
          const push = (need - Math.abs(d)) / 2 + 0.5, sg = d >= 0 ? 1 : -1;
          A.cx -= sg * push; B.cx += sg * push; moved = true;
        }
        for (const t0 of tk) t0.cx = Math.max(x + 1 + t0.tw / 2, Math.min(x + w - 1 - t0.tw / 2, t0.cx));
        if (!moved) break;
      }
      for (const t0 of tk) { // run-ups: from the token to the lane
        const p = t0.p;
        if (!p.lane || !LANE_XY[p.lane]) continue;
        const [tx, ty] = LANE_XY[p.lane];
        const x0 = t0.cx, y0 = t0.ty + th / 2, x1 = sx(tx), y1 = sy(ty) - (ty === 1 ? 2 : 0);
        const fr = [2, 3, 4].includes(p.pos); // front row: out sideways first, then towards the net
        s += arrow(x0, y0, x1, y1, C.ink, { sw: 1.8, head: 8, cx: x0 + (x1 - x0) * (fr ? 0.85 : 0.15), cy: y0 + (y1 - y0) * (fr ? 0.2 : 0.8) });
      }
      for (const t0 of tk) {
        const p = t0.p, tx = t0.cx - t0.tw / 2, ty = t0.ty;
        const isL = p.frole === 1, light = isL || p.frole === 5;
        const tok = R(tx, ty, t0.tw, th, { fill: ROLE_FILL[p.frole] || C.ink, r: 11, stroke: light ? C.ink : C.white, sw: 1.3 }) +
          T(tx + t0.tw / 2, ty + th / 2 + fs * 0.36, t0.lab, { f: 'BC', b: true, s: fs, fill: light ? C.ink : C.white, a: 'middle' });
        s += ctx.screen ? `<g class="hit tok" data-act="tok" data-rot="${Pk}" data-num="${esc(p.num)}">${tok}</g>` : tok;
      }
      ctx.courts[Pk] = { x, y: cy0, w, h: ch };
      s += distBoxes(x, boxY - 6, w, boxH, d, { front, vs: 19, gap: 10, dim: d.n != null && d.n < FEW_N, splitP: true });
      let fy = boxY - 6 + boxH + 8;
      for (const l of fl) { fy += FORM_LINE + 3; s += T(x, fy - 3, wrap(l.t, 'B', !!l.b, FORM_LINE, w, 1)[0] || '', { s: FORM_LINE, b: !!l.b, fill: l.fill }); }
      return s;
    }
    const box = ctx.rotBox || ROT_BOX, po = ctx.pipeRow || 0;
    s += distBoxes(x, y + ROT_TOP + po, w, box, d, { front, gap: 10, vs: Math.min(28, 21 + (box - ROT_BOX) * 0.35), dim: d.n != null && d.n < FEW_N });
    let ly = y + ROT_TOP + po + box + 10;
    for (const l of rotLines(sh, Pk, d)) {
      const lines = l.wrap ? wrap(l.t, 'B', !!l.b, l.s, w, l.wrap) : [wrap(l.t, 'B', !!l.b, l.s, w, 1)[0] || ''];
      for (const ln of lines) { ly += l.s + 3; s += T(x, ly - 3, ln, { s: l.s, b: !!l.b, fill: l.fill }); }
    }
    return s;
  }

  /* ---------- "palle spostate": where the setter is, and where the ball goes ---------- */
  const SETTER_AREA = { KM: [0.03, 0.08, 0.30, 0.46], KP: [0.42, 0.08, 0.30, 0.46], FB: [0.13, 0.42, 0.22, 0.58], K7: [0.13, 0.42, 0.22, 0.58] };
  const SPOST_H = 20 + 40 + 4 + 24 + 6; // title, boxes, setter strip, net
  const SPT = { head: 22, row: 40, cell: 50, gap: 3 };
  function spostTableH(cards) { return SPT.head + cards.length * (cards.length > 5 ? ((P1.lv || 0) >= 2 ? 32 : 36) : SPT.row) + 4; }
  function spostTable(x, y, w, cards, noLabel) {
    let s = '';
    const cw = SPT.cell, c0 = x + w - 3 * cw - 2 * SPT.gap, nameW = c0 - x - 8;
    ['DIETRO', 'CENTRO', 'AVANTI'].forEach((h, j) => { s += T(c0 + j * (cw + SPT.gap) + cw / 2, y + 15, h, { f: 'BC', b: true, s: 10, fill: C.muted, a: 'middle' }); });
    let ry = y + SPT.head;
    const RH = cards.length > 5 ? ((P1.lv || 0) >= 2 ? 32 : 36) : SPT.row;
    const tf = Math.min(...cards.map(c => fit(c.title, 'BT', true, 15, nameW - 8, 11)));
    for (const c of cards) {
      const cnt = c.cnt || {}, n = sumV(cnt);
      const pc = k => pct(cnt[k] || 0, n);
      const v = { B: pc('B'), C: pc('C'), F: pc('F'), P: pc('P'), S: pc('S') };
      const top2 = ['B', 'C', 'F'].sort((p, q) => (cnt[q] || 0) - (cnt[p] || 0)).slice(0, 2);
      const pairV = n ? Math.round(100 * ((cnt[top2[0]] || 0) + (cnt[top2[1]] || 0)) / n) : 0;
      const pair = n && pairV >= 66 && Math.max(v.B, v.C, v.F) < 50 ? top2 : [];
      const WORD = { B: 'dietro', C: 'centro', F: 'avanti' };
      const subs = [];
      if (c.sub && !(pair.length && /^\d+ palle$/.test(c.sub))) subs.push(c.sub); // a bare count gives way to the pair
      if (pair.length) subs.push(`${['B', 'C', 'F'].filter(k => pair.includes(k)).map(k => WORD[k]).join(' + ')} ${pairV}%`);
      if (v.P) subs.push(`pipe ${v.P}%`);
      if (v.S) subs.push(`pallonetto ${v.S}%`);
      const ttl = c.title;
      s += T(x, ry + (subs.length ? RH / 2 - 3 : RH / 2 + 3), ttl, { f: 'BT', b: true, s: tf });
      if (n < 5 && !c.manual) s += `<circle cx="${n2(x + mw(ttl, 'BT', true, snapS(tf)) + 6)}" cy="${n2(ry + (subs.length ? RH / 2 - 12 : RH / 2 - 6))}" r="3.3" fill="#B4233C"/>`;
      if (subs.length) { const st = subs.join(' · '), z = fit(st, 'B', true, 11, nameW, 10); s += T(x, ry + RH - 9, wrap(st, 'B', true, snapS(z), nameW, 1)[0], { f: 'B', b: true, s: z, fill: C.muted }); }
      ['B', 'C', 'F'].forEach((k, j) => {
        const val = v[k], dark = val >= 50, pr = pair.includes(k), bx = c0 + j * (cw + SPT.gap);
        s += R(bx, ry + 2, cw, RH - 6, { fill: dark ? C.ink : pr ? PAIR_COL : C.white, stroke: C.ink, sw: 1.3, r: 4 });
        s += T(bx + cw / 2, ry + 2 + (RH - 6) / 2 + 6.5, val ? `${val}%` : '–', { f: 'BC', b: true, s: 18, fill: dark || pr ? C.white : (n < 5 && !c.manual ? C.muted : C.ink), a: 'middle' });
      });
      ry += RH;
    }
    return { svg: s, h: ry - y + 4 };
  }
  function spostCard(x, y, w, kind, cnt, title, sub, o = {}) {
    // as on the paper sheets: the zones, then the setter right at the net, then the net
    let s = '';
    const n = sumV(cnt);
    const d0 = { B: pct(cnt?.B || 0, n), C: pct(cnt?.C || 0, n), F: pct(cnt?.F || 0, n), P: pct(cnt?.P || 0, n), S: pct(cnt?.S || 0, n), cnt: cnt || {} };
    const top2 = ['B', 'C', 'F'].sort((p, q) => (cnt?.[q] || 0) - (cnt?.[p] || 0)).slice(0, 2);
    const pairV = n ? Math.round(100 * ((cnt?.[top2[0]] || 0) + (cnt?.[top2[1]] || 0)) / n) : 0;
    if (n && pairV >= 66 && Math.max(d0.B, d0.C, d0.F) < 50) {
      d0.pair = top2;
      const lab = k => k; // B / C / F: with the setter out of place there is no fixed line
      const order = ['B', 'C', 'F'].filter(k => top2.includes(k));
      if (!sub) sub = `${order.map(lab).join('+')}: ${pairV}%`;
    }
    const tf = fit(title, 'BT', true, 13, w, 10);
    s += T(x, y + 13, title, { f: 'BT', b: true, s: tf });
    if (n < 5 && !o.manual) s += `<circle cx="${n2(x + mw(title, 'BT', true, tf) + 5)}" cy="${n2(y + 3)}" r="3.3" fill="#B4233C"/>`; // few balls, as in the rotations
    if (sub) { const sx = x + mw(title, 'BT', true, tf) + (n < 5 ? 12 : 6), sw2 = x + w - sx; if (sw2 > 30) s += T(sx, y + 13, sub, { f: 'B', s: fit(sub, 'B', false, 11.5, sw2, 9), fill: C.muted }); }
    const netY = y + (o.h || SPOST_H) - 6, sh0 = 24, bh = 40, by = netY - 4 - sh0 - bh;
    s += R(x, by + bh + 2, w, netY - (by + bh + 2), { fill: C.court });
    const hasS = d0.S > 0, sw0 = hasS ? Math.max(30, w * 0.12) : 0, bw0 = (w - sw0 - 8 - (hasS ? 4 : 0)) / 3;
    const cL = x + bw0 + 4 + (hasS ? sw0 + 4 : 0), cx0 = cL + bw0 / 2; // centre box, centre of the net
    const zw = Math.min(bw0, w * 0.3), zh = sh0 - 5;
    const zx = kind === 'KM' ? x + 2 : kind === 'KP' ? cx0 + bw0 * 0.12 : cx0 - bw0 * 0.12 - zw; // spostata in 2 / verso 4 / palla perfetta
    s += R(zx, netY - zh - 1, zw, zh, { fill: '#FFE7A3', stroke: C.hi, sw: 1.2, r: 3 });
    s += L(cx0, netY - 9, cx0, netY, { stroke: C.ink, sw: 1.4 });
    s += distBoxes(x, by, w, bh, d0, { vs: 16, dim: n < 5 && !o.manual, front: o.front, noNet: true, pair: d0.pair, splitP: true, labels: { B: 'B', C: 'C', F: 'F' } });
    if (kind === 'K7') { // the 7: attacked straight, at the net between 3 and 4
      const ax = cL + bw0 + 2 + bw0 * 0.18;
      s += arrow(ax, by + bh + 3, ax, netY - 2, '#2E7DBF', { sw: 3, head: 8, straight: true });
    }
    s += L(x, netY, x + w, netY, { stroke: C.ink, sw: 3 });
    return s;
  }
  // the coach's own situations (the old single "situazione libera" is the first of the list)
  function customSits(sh) {
    const l = Array.isArray(sh.customSits) ? sh.customSits.slice() : [];
    if (sh.freeSit && (sh.freeSit.title || '').trim() && !l.length) l.push(sh.freeSit);
    return l;
  }
  // calls of the middle (K1, K7, KC, K2), balls with the setter in position: one row per call, or two when the
  // opposite's line changes what the setter does (setter in the back row = opposite in the front row)
  const OPP_FRONT = ['P1', 'P6', 'P5'], OPP_BACK = ['P4', 'P3', 'P2'];
  // every row the scout can give for the calls table, with the coach's choice (sh.callSel) or a suggestion:
  // each middle call whole and split by the opposite's line, the displaced balls and the free ball
  function callCandidates(sh) {
    const st = setterStats(sh);
    if (!st) return [];
    const add = (acc, d) => { for (const [k, v] of Object.entries(d || {})) acc[k] = (acc[k] || 0) + v; return acc; };
    const grp = (code, Ps) => Ps.reduce((acc, P) => add(acc, st.distCall?.[P]?.[code]), {});
    const allIn = Ps => Ps.reduce((t, P) => t + ['K1', 'K7', 'KC', 'K2'].reduce((u, k) => u + sumV(st.distCall?.[P]?.[k]), 0), 0);
    const tvd = (a, b) => { const na = sumV(a), nb = sumV(b); return ['B', 'C', 'F', 'P'].reduce((t, k) => t + Math.abs((a[k] || 0) / na - (b[k] || 0) / nb), 0) / 2; };
    const desc = sh.stats?.callDesc || {};
    const sel = sh.callSel || {}, old = sh.spost || {};
    const out = [];
    const push = (id, c, suggest, oldKey) => {
      const n = sumV(c.cnt);
      if (!n) return;
      const choice = sel[id] != null ? sel[id] : old[oldKey || id] === 'off' ? false : old[oldKey || id] === 'on' ? true : null;
      out.push({ id, ...c, n, suggest, on: choice != null ? !!choice : suggest });
    };
    for (const code of ['K1', 'K7', 'KC', 'K2']) {
      const A = grp(code, OPP_FRONT), Bk = grp(code, OPP_BACK), tot = add(add({}, A), Bk);
      const nA = sumV(A), nB = sumV(Bk);
      const differs = nA >= 2 && nB >= 2 && tvd(A, Bk) >= 0.3;
      const share = (n, Ps) => { const d = allIn(Ps); return d ? Math.round(100 * n / d) : 0; };
      push(code, { kind: code, cnt: tot, title: code + (desc[code] ? ' · ' + shortName(desc[code]) : ''), sub: `${nA + nB} palle` }, !differs && nA + nB >= 5, code === 'K7' ? 'K7' : null);
      push(code + ':OA', { kind: code, cnt: A, title: `${code} · opposto avanti`, sub: `P1-6-5 · ${nA} palle (${share(nA, OPP_FRONT)}%)` }, differs, code === 'K7' ? 'K7' : null);
      push(code + ':OD', { kind: code, cnt: Bk, title: `${code} · opposto dietro`, sub: `P4-3-2 · ${nB} palle (${share(nB, OPP_BACK)}%)` }, differs, code === 'K7' ? 'K7' : null);
    }
    for (const [code, def] of [['KM', 'Spostata in 2'], ['KP', 'Spostata verso 4']]) {
      const cnt = st.calls?.[code] || {};
      push(code, { kind: code, cnt, title: desc[code] || def }, sumV(cnt) >= 5);
    }
    // free ball: the first set after our free-ball pass; the call code only if the scout has no free-ball passes
    const fbCnt = sumV(st.fbDist) >= 5 ? st.fbDist : st.calls?.[(sh.fbCall || 'KF').toUpperCase()] || {};
    push('FB', { kind: 'FB', cnt: fbCnt, title: 'Free ball' }, sumV(fbCnt) >= 5);
    // optional rows, never suggested: balls in position by zone of the pass (1 or 5)
    const rz = sh.stats?.analysis?.recZBy?.[sh.setter] || {};
    ['1', '5'].forEach(z => push('RZ' + z, { kind: 'RZ', cnt: rz[z] || {}, title: `Rice da ${z}`, sub: `zone ${z === '1' ? '1-9' : '5-7'} · ricezione # + · ${sumV(rz[z])} palle` }, false));
    return out;
  }
  function callRows(sh) {
    const st = setterStats(sh);
    if (!st?.distCall) return [];
    const add = (acc, d) => { for (const [k, v] of Object.entries(d || {})) acc[k] = (acc[k] || 0) + v; return acc; };
    const grp = (code, Ps) => Ps.reduce((acc, P) => add(acc, st.distCall[P]?.[code]), {});
    const allIn = Ps => Ps.reduce((t, P) => t + ['K1', 'K7', 'KC', 'K2'].reduce((u, k) => u + sumV(st.distCall[P]?.[k]), 0), 0);
    const tvd = (a, b) => { const na = sumV(a), nb = sumV(b); return ['B', 'C', 'F', 'P'].reduce((t, k) => t + Math.abs((a[k] || 0) / na - (b[k] || 0) / nb), 0) / 2; };
    const desc = sh.stats?.callDesc || {};
    const out = [];
    for (const code of ['K1', 'K7', 'KC', 'K2']) {
      const mode = sh.spost?.[code] || 'auto';
      const A = grp(code, OPP_FRONT), Bk = grp(code, OPP_BACK), tot = add(add({}, A), Bk);
      if (mode === 'off' || sumV(tot) < (mode === 'on' ? 1 : 5)) continue;
      const nA = sumV(A), nB = sumV(Bk);
      const share = (n, Ps) => { const d = allIn(Ps); return d ? Math.round(100 * n / d) : 0; };
      const name = code + (desc[code] ? ' · ' + shortName(desc[code]) : '');
      if (nA >= 2 && nB >= 2 && tvd(A, Bk) >= 0.3) {
        out.push({ kind: code, cnt: A, title: `${code} · opposto avanti`, sub: `P1-6-5 · ${nA} palle (${share(nA, OPP_FRONT)}%)` });
        out.push({ kind: code, cnt: Bk, title: `${code} · opposto dietro`, sub: `P4-3-2 · ${nB} palle (${share(nB, OPP_BACK)}%)` });
      } else out.push({ kind: code, cnt: tot, title: name, sub: `${nA + nB} palle` });
    }
    return out;
  }
  // K7: one card for all rotations, or two when the opposite's line changes the pattern (old cards, kept for reference)
  function k7Cards(sh) {
    const st = setterStats(sh);
    if (!st) return [];
    const add = (acc, d) => { for (const [k, v] of Object.entries(d || {})) acc[k] = (acc[k] || 0) + v; return acc; };
    const grp = Ps => Ps.reduce((acc, P) => add(acc, st.distCall?.[P]?.K7), {});
    const tot = st.distCall ? grp(ROTS) : (st.calls?.K7 || {});
    const mode = sh.spost?.K7 || 'auto';
    if (mode === 'off' || sumV(tot) < (mode === 'on' ? 1 : 5)) return [];
    const back = d => { const b = d.B || 0, f = d.F || 0; return b + f >= 3 ? b / (b + f) : null; };
    const word = d => { const n = sumV(d); if ((d.C || 0) / n >= 0.75) return 'centro'; const b = back(d); return b == null ? '' : b >= 0.65 ? 'centro / dietro' : b <= 0.35 ? 'centro / avanti' : ''; };
    const A = grp(FRONT), Bk = grp(['P1', 'P5', 'P6']);
    const bA = back(A), bB = back(Bk);
    if (st.distCall && sumV(A) >= 5 && sumV(Bk) >= 5 && bA != null && bB != null && Math.abs(bA - bB) >= 0.3) {
      return [
        { cnt: A, title: 'K7 P2-3-4', sub: word(A), front: true },
        { cnt: Bk, title: 'K7 P1-5-6', sub: word(Bk), front: false }
      ];
    }
    return [{ cnt: tot, title: 'K7', sub: word(tot), front: false }];
  }

  /* ---------- small figures for players on the court ---------- */
  function figure(cx, cy, size, fill, stroke) {
    const r = size * 0.27, sw = Math.max(1.1, size * 0.1);
    const top = cy - size * 0.05;
    const body = `<path d="M${n2(cx - size * 0.46)},${n2(cy + size * 0.48)} Q${n2(cx - size * 0.46)},${n2(top)} ${n2(cx)},${n2(top)} Q${n2(cx + size * 0.46)},${n2(top)} ${n2(cx + size * 0.46)},${n2(cy + size * 0.48)} Z" fill="${fill}" stroke="${stroke}" stroke-width="${n2(sw)}" stroke-linejoin="round"/>`;
    return body + `<circle cx="${n2(cx)}" cy="${n2(cy - size * 0.33)}" r="${n2(r)}" fill="${fill}" stroke="${stroke}" stroke-width="${n2(sw)}"/>`;
  }

  /* ---------- attack: cones to the most used directions + our defence ---------- */
  function sitStats(sh, num, sit) {
    const st = sh.stats?.attacks?.[num] || {};
    const out = { n: 0, kill: 0, err: 0, ez: {}, ec: {}, sz: {}, hitN: 0, tip: 0 };
    for (const k of sit.keys || [sit.key]) {
      const v = st[k]; if (!v) continue;
      out.n += v.n; out.kill += v.kill; out.err += v.err; out.hitN += v.hitN || 0; out.tip += v.tip || 0;
      for (const [z, c] of Object.entries(v.ez || {})) out.ez[z] = (out.ez[z] || 0) + c;
      for (const [z, c] of Object.entries(v.ec || {})) out.ec[z] = (out.ec[z] || 0) + c;
      for (const [z, c] of Object.entries(v.sz || {})) out.sz[z] = (out.sz[z] || 0) + c;
    }
    return out;
  }
  /* ---------- our block (moves with the call) and defence (from the team's system) ---------- */
  // free space left on the line, as a share of court width at the net: 1 closes it, each step opens about one ball more
  const CALL_OPEN = { '1': -0.02, 'M-1': 0.015, 'M': 0.035, '5': 0.035, 'M-2': 0.05, '2': 0.07 };
  function normCall(c) {
    let t = String(c || '').toUpperCase().replace(/\s+/g, '').replace(/[–—]/g, '-');
    const pr = t.match(/^([12])-M$/); // "1-M": priority 1, then M
    if (pr) t = pr[1];
    return CALL_OPEN[t] != null ? (t === '5' ? 'M' : t) : null;
  }
  // "pallonetti" signal: forced on/off by hand, else automatic when tips are scouted (>= 20% of coded hits)
  function tipOn(sit, st) {
    if (sit.tip === true || sit.tip === false) return sit.tip;
    return !!(st && st.hitN >= 8 && st.tip / st.hitN >= 0.2);
  }
  function layoutOf(sit) {
    const keys = sit.keys || [sit.key];
    if (keys.some(k => k.startsWith('Q:') || k.startsWith('3:'))) return 'quick';
    if (keys.some(k => k.startsWith('BR'))) return 'back';
    if (keys.some(k => k.endsWith(':H'))) return 'alta';
    return 'spinta';
  }
  // coordinates for an attack coming from OUR RIGHT (their zone 4); mirrored for the other side
  const DEF_R = {
    alta: { def: [[0.45, 0.2], [0.17, 0.62], [0.92, 0.63], [0.7, 0.89]], line: 2, lineClosed: [0.8, 0.45] },   // terzo di rete, fuori muro, parallela, 6 in lettura
    spinta: { def: [[0.12, 0.25], [0.2, 0.6], [0.91, 0.6], [0.58, 0.84]], line: 2, lineClosed: [0.82, 0.47] }, // 2-0-4
    back: { def: [[0.45, 0.22], [0.15, 0.6], [0.92, 0.6], [0.5, 0.88]], line: 2, lineClosed: [0.82, 0.47] }
  };
  const QUICK_DEF = [[0.17, 0.53], [0.86, 0.53], [0.58, 0.82]]; // quick balls: only the defenders behind the block
  function defence(layout, ox, callRaw, base) {
    const call = normCall(callRaw) || 'M';
    if (layout === 'quick') {
      const c = ox + (base?.blk || 0);
      return { block: [[c - 0.06, c + 0.06]], def: (base?.def || QUICK_DEF).filter(p => p[1] > 0.15).map(p => p.slice()) }; // saved defaults may still hold the two at the net
    }
    const side = ox >= 0.6 ? 'R' : ox <= 0.4 ? 'L' : 'C';
    if (side === 'C') return { block: [[0.38, 0.495], [0.505, 0.62]], def: [[0.5, 0.22], [0.1, 0.6], [0.9, 0.6], [0.5, 0.88]] };
    const L0 = DEF_R[layout] || DEF_R.alta;
    const def = base?.def ? base.def.map(p => p.slice()) : L0.def.map((p, i) => (i === L0.line && call === '1') ? L0.lineClosed : p);
    const oxR = side === 'R' ? ox : 1 - ox;
    const e = base?.blk != null ? oxR + base.blk + 0.1175 : Math.min(0.995, oxR - CALL_OPEN[call]);
    let block = [[e - 0.115, e], [e - 0.235, e - 0.12]];
    let dd = def;
    if (side === 'L') { block = block.map(([a, b]) => [1 - b, 1 - a]); dd = def.map(([x, y]) => [1 - x, y]); }
    return { block, def: dd };
  }
  // team defaults: one setting per kind of ball + side + call, each independent ("alta|R|M-2", "quick")
  // stored as if the attack came from our right: { def, blk } with blk = centre of our block minus the attacker
  function baseKey(lay, side, call) { return lay === 'quick' ? 'quick' : `${lay}|${side}|${normCall(call) || 'M'}`; }
  function baseFor(defaults, lay, ox, call) {
    if (!defaults) return null;
    return defaults[baseKey(lay, ox <= 0.4 ? 'L' : 'R', call)] || null;
  }
  const FAKE = {
    alta: { R: ['4:H', '4'], L: ['2:H', '2'] }, spinta: { R: ['4:T', '4'], L: ['2:T', '2'] },
    back: { R: ['BR:T', '5'], L: ['BR:T', '1'] }, quick: { R: ['Q:UNO', '3'], L: ['Q:UNO', '3'] }
  };
  // big court for the "difese base" editor: the team default for a kind of ball and a side, or one hitter's ball
  function bigCourt(sh, t, size, defaults) {
    const ctx = { screen: true, links: [], courts: {}, clip: 900, defaults, showBlock: true };
    let sit, st, key0;
    if (t.num) {
      const a = (sh.attackers || []).find(x => x.num === t.num);
      sit = a?.sits.find(x => sitKey(x) === t.key);
      if (!sit) return null;
      st = sitStats(sh, a.num, sit); key0 = (sit.keys || [sit.key])[0];
    } else {
      const [k, z] = FAKE[t.lay][t.side || 'R'];
      sit = { keys: [k], block: t.call || 'M', manual: {} }; st = { n: 0, ez: {}, sz: { [z]: 1 } }; key0 = k;
    }
    const x = 26, y = 34;
    const svgIn = attackCourt(x, y, size, key0, sit, st, ctx, 'OV').svg;
    const geo = ctx.courts['AOV'];
    const ox = originX(key0, st.sz);
    return { svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n2(size + 52)} ${n2(size + 50)}" width="100%">${R(0, 0, size + 52, size + 50, { fill: C.white })}${svgIn}</svg>`, geo: { ...geo, ox }, sit };
  }
  // big court for the "difese base" editor: attack from our right (from the middle for the quick ball)
  const DEMO_OX = { alta: 0.88, spinta: 0.88, quick: 0.5, back: 0.82 };
  function defenceDemo(layout, call, base, size) {
    const w = size, h = size, x = 30, y = 40;
    let s = R(0, 0, w + 60, h + 70, { fill: C.white });
    s += R(x, y, w, h, { fill: C.court });
    const cw = w / 3;
    for (let i = 1; i < 3; i++) { s += L(x + i * cw, y, x + i * cw, y + h, { stroke: C.white, sw: 1.5, dash: '5 5' }); s += L(x, y + i * cw, x + w, y + i * cw, { stroke: C.white, sw: 1.5, dash: '5 5' }); }
    s += L(x, y + h / 3, x + w, y + h / 3, { stroke: C.white, sw: 4 });
    const ox = DEMO_OX[layout] ?? 0.88;
    const df = defence(layout, ox, call, base);
    const fs = size * 0.075;
    for (const [a, b] of df.block) s += R(x + a * w, y + 3, (b - a) * w, 9, { fill: C.ink, r: 3 });
    df.def.forEach(([dx, dy]) => { s += figure(x + dx * w, y + dy * h, fs, C.white, C.ink); });
    s += L(x - 6, y, x + w + 6, y, { stroke: C.ink, sw: 5 });
    const px = x + ox * w;
    s += P([[px - 11, y - 22], [px + 11, y - 22], [px, y - 3]], { fill: C.ink });
    // handles
    const a = df.block[0][0], b = df.block[df.block.length - 1][1];
    s += `<rect class="dh" data-act="blk" x="${n2(x + a * w - 6)}" y="${n2(y - 8)}" width="${n2((b - a) * w + 12)}" height="26" fill="transparent"/>`;
    df.def.forEach(([dx, dy], i) => { s += `<circle class="dh" data-act="def" data-i="${i}" cx="${n2(x + dx * w)}" cy="${n2(y + dy * h)}" r="${n2(fs * 0.7)}" fill="transparent"/>`; });
    return { svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n2(w + 60)} ${n2(h + 70)}" width="100%">${s}</svg>`, geo: { x, y, w, h, ox, def: df.def, block: df.block } };
  }
  /* ---------- side attacks: 7 direction cones, from the line (1) to the sharp cross (7), as in DataVolley ---------- */
  // angle from the line, in degrees: 1 lungolinea, 2 parallela interna, 3 prima metà campo interna, 4 metà campo lunga,
  // 5 angolo lungo, 6 diagonale fuori muro, 7 diagonale stretta
  const CONE_DEG = [[0, 5], [5, 12], [12, 22], [22, 35], [35, 52], [52, 66], [66, 82]];
  // used when the scout codes attack directions as cones (DataVolley match setting "C"): the arrival field holds the
  // cone number. Side balls: 1-7 from the line to the sharp cross, 8 = pallonetto. Middle balls and pipe: 8 equal
  // cones from our right to our left. Files scouted with zones keep the zone drawing.
  const TIP_CONE = { r: 0.34, a0: 8, a1: 82 }; // side cone 8 drawn as a short fan in front of the attacker
  // middle balls (the 1 and the 7): 5 deep cones from the attacker's left (our right) to his right, 3 = straight;
  // short ones: 9 to the attacker's left, 8 in the middle, 7 to his right
  const MID_DEEP = { 1: [-60, -36], 2: [-36, -12], 3: [-12, 12], 4: [12, 36], 5: [36, 60] };
  const MID_SHORT = { 9: [-85, -20], 8: [-20, 20], 7: [20, 85] }, SHORT_R = 0.42;
  function coneKind(sit, oxr) { return layoutOf(sit) === 'quick' || (oxr > 0.3 && oxr < 0.7) ? 'C' : oxr >= 0.7 ? 'R' : 'L'; }
  function useCones(sit, st, ctx) { return ctx.dirMode !== 'zone' && (Object.keys(st?.ec || {}).length > 0 || Object.keys(sit.cmanual || {}).length > 0); }
  function coneData(sit, st) {
    const ec = st?.ec || {};
    const cnt = {};
    for (const [z, v] of Object.entries(ec)) if (+z >= 1 && +z <= 9) cnt[z] = (cnt[z] || 0) + v; // the scout's cone numbers
    const n = Object.values(cnt).reduce((a, b) => a + b, 0);
    const share = {};
    for (let k = 1; k <= 9; k++) share[k] = n ? (cnt[k] || 0) / n : 0;
    let marks = {};
    const man = sit.cmanual || {};
    if (Object.keys(man).length) marks = { ...man };
    else if (n) Object.entries(share).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).forEach(([k, v], i) => { if (i < 2 && v >= 0.22) marks[k] = 'p'; else if (i < 4 && v >= 0.12) marks[k] = 's'; });
    return { n, cnt, share, marks };
  }
  // percentages on the court: off by default once the zones or cones were corrected by hand (they no longer match)
  const manualDir = sit => Object.keys(sit.manual || {}).length > 0 || Object.keys(sit.cmanual || {}).length > 0;
  const showPct = sit => sit.pct === 'show' ? true : sit.pct === 'hide' ? false : !manualDir(sit);
  function attackCourt(x, y, w, sitKey, sit, st, ctx, hitId) {
    let s = '';
    const h = w;
    s += R(x, y, w, h, { fill: C.court });
    const cw = w / 3, chh = h / 3;
    for (let i = 1; i < 3; i++) {
      s += L(x + i * cw, y, x + i * cw, y + h, { stroke: C.white, sw: 1, dash: '3 3' });
      s += L(x, y + i * chh, x + w, y + i * chh, { stroke: C.white, sw: 1, dash: '3 3' });
    }
    s += L(x, y + h / 3, x + w, y + h / 3, { stroke: C.white, sw: 2.5 });
    const zn = sitZones(sit, st);
    let { n, share, marks } = zn;
    const oxr = originX(sitKey, st?.sz);
    const kind = useCones(sit, st, ctx) ? coneKind(sit, oxr) : null, side = kind === 'R' || kind === 'L' ? kind : null;
    // side attacks start from the corner, so the line cone runs along the sideline
    const ox = side ? x + (side === 'R' ? 0.985 : 0.015) * w : x + oxr * w, oy = y - 1;
    // back-row attacks (from 1, pipe, from 5): the lines start behind their 3 m line, so they enter our court already open
    const back = layoutOf(sit) === 'back', oyA = back ? y - 0.36 * w : oy;
    const id = 'cl' + (ctx.clip = (ctx.clip || 0) + 1);
    let cones = '', coneLabels = '', coneHits = '';
    if (kind) {
      const cd = coneData(sit, st);
      n = cd.n;
      const isC = kind === 'C', degOf = k => isC ? (MID_DEEP[k] || MID_SHORT[k]) : CONE_DEG[k - 1];
      const isShort = k => isC ? !!MID_SHORT[k] : k === 8; // short fans: drawn on top, near the attacker
      const fan = (a0, a1, r) => { const pts = []; for (let a = a0; a <= a1 + 0.01; a += Math.max(2, (a1 - a0) / 10)) { const [dx, dy] = dir(a); pts.push(`${n2(ox + r * dx)},${n2(oy + r * dy)}`); } return `M${n2(ox)},${n2(oy)} L${pts.join(' L')} Z`; };
      const dir = deg => { const r = deg * Math.PI / 180; return [(side === 'L' ? 1 : -1) * Math.sin(r), Math.cos(r)]; };
      const far = 4 * w, gap = 0.7;
      const reach = deg => { const [dx, dy] = dir(deg); const tx = dx > 0 ? (x + w - ox) / dx : dx < 0 ? (x - ox) / dx : 1e9; const ty = (y + h - oy) / dy; return Math.min(tx, ty); };
      // middle deep cones end where they end for the 1 (attacked in front of the centre); from the 7, further out, the
      // same landing points give other slopes, so the straight ball falls in cone 2
      const fromRef = deg => { const rx = isC ? x + 0.5 * w : ox, [dx, dy] = dir(deg); const tx = dx > 0 ? (x + w - rx) / dx : dx < 0 ? (x - rx) / dx : 1e9, t = Math.min(tx, (y + h - oy) / dy); return [rx + t * dx, oy + t * dy]; };
      const ray = deg => { const [qx, qy] = fromRef(deg), vx = qx - ox, vy = qy - oyA, l = Math.hypot(vx, vy) || 1; return [ox + far * vx / l, oyA + far * vy / l]; };
      const deepPts = (a0, a1, g) => [[ox, oyA], ray(a0 + g), ray(a1 - g)];
      const order = Object.entries(cd.marks).filter(([k]) => degOf(+k) && !isShort(+k)).sort((a, b) => (a[1] === 'p' ? 1 : 0) - (b[1] === 'p' ? 1 : 0));
      for (const [k, m] of order) {
        const [a0, a1] = degOf(+k);
        const p0 = dir(a0 + gap), p1 = dir(a1 - gap);
        const pts = isC || back ? deepPts(a0, a1, gap) : [[ox, oy], [ox + far * p0[0], oy + far * p0[1]], [ox + far * p1[0], oy + far * p1[1]]];
        cones += P(pts, { fill: m === 'p' ? C.prin : C.sec, stroke: C.white, sw: 1 });
      }
      // cone 8, pallonetto: a short fan just behind the block, on top of the others, dashed edge
      const tipPath = () => { const r = TIP_CONE.r * w, pts = []; for (let a = TIP_CONE.a0; a <= TIP_CONE.a1; a += 6) { const [dx, dy] = dir(a); pts.push(`${n2(ox + r * dx)},${n2(oy + r * dy)}`); } return `M${n2(ox)},${n2(oy)} L${pts.join(' L')} Z`; };
      if (!isC && cd.marks[8]) cones += `<path d="${tipPath()}" fill="${cd.marks[8] === 'p' ? C.prin : C.sec}" stroke="${C.hi}" stroke-width="2" stroke-dasharray="4 3"/>`;
      if (isC) for (const k of [9, 8, 7]) if (cd.marks[k]) { const [a0, a1] = MID_SHORT[k]; cones += `<path d="${fan(a0 + gap, a1 - gap, SHORT_R * w)}" fill="${cd.marks[k] === 'p' ? C.prin : C.sec}" stroke="${C.white}" stroke-width="1.5"/>`; }
      for (let k = 1; k <= 9; k++) {
        const tipK = !isC && k === 8;
        if (!tipK && !degOf(k)) continue;
        const [a0, a1] = tipK ? [TIP_CONE.a0, TIP_CONE.a1] : degOf(k), mid = (a0 + a1) / 2;
        const v = Math.round((cd.share[k] || 0) * 100);
        if (n && v >= 30 && showPct(sit)) { // the cones that matter, as for the zones
          let t = tipK ? TIP_CONE.r * w * 0.6 : isShort(k) ? SHORT_R * w * 0.62 : reach(mid) * 0.74, [dx, dy] = dir(mid);
          let oyL = oy;
          if ((isC || back) && !isShort(k) && !tipK) { const [q0x, q0y] = fromRef(a0), [q1x, q1y] = fromRef(a1), mx = (q0x + q1x) / 2 - ox, my = (q0y + q1y) / 2 - oyA, l = Math.hypot(mx, my) || 1; dx = mx / l; dy = my / l; t = l * (back ? 0.8 : 0.74); oyL = oyA; }
          const fsz = w < 110 ? 11 : 13, lab = `${v}%`, tw = mw(lab, 'BC', true, fsz) + 6;
          const lx = Math.max(x + 1, Math.min(x + w - tw - 1, ox + t * dx - tw / 2)), ly = Math.min(y + h - fsz - 5, oyL + t * dy - 7);
          coneLabels += R(lx, ly, tw, fsz + 4, { fill: C.white, r: 3 }) + T(lx + tw / 2, ly + fsz, lab, { f: 'BC', b: true, s: fsz, a: 'middle' });
        }
        if (ctx.screen && hitId && !isShort(k)) { const q0 = dir(a0), q1 = dir(a1); const pp = isC || back ? deepPts(a0, a1, 0) : [[ox, oy], [ox + far * q0[0], oy + far * q0[1]], [ox + far * q1[0], oy + far * q1[1]]]; coneHits += `<path class="hit zone" data-act="acone" data-id="${hitId}" data-z="${k}" d="M${pp.map(q => `${n2(q[0])},${n2(q[1])}`).join(' L')} Z" fill="transparent"/>`; }
      }
      // the pallonetto fan is tapped last, on top of the start of the other cones
      if (ctx.screen && hitId && !isC) coneHits += `<path class="hit zone" data-act="acone" data-id="${hitId}" data-z="8" d="${tipPath()}" fill="transparent"/>`;
      if (ctx.screen && hitId && isC) for (const k of [9, 8, 7]) { const [a0, a1] = MID_SHORT[k]; coneHits += `<path class="hit zone" data-act="acone" data-id="${hitId}" data-z="${k}" d="${fan(a0, a1, SHORT_R * w)}" fill="transparent"/>`; }
    } else {
      // middle balls: cones to the far edge of each chosen zone
      const order = Object.entries(marks).filter(([z]) => ZONE_CR[z]).sort((a, b) => (a[1] === 'p' ? 1 : 0) - (b[1] === 'p' ? 1 : 0));
      for (const [z, m] of order) {
        const [c, r] = ZONE_CR[z];
        const bx0 = x + c * cw + cw * 0.03, bx1 = x + (c + 1) * cw - cw * 0.03, by = y + (r + 1) * chh;
        cones += P([[ox, oyA], [bx0, by - 1], [bx1, by - 1]], { fill: m === 'p' ? C.prin : C.sec, stroke: C.white, sw: 1 });
      }
    }
    s += `<clipPath id="${id}"><rect x="${n2(x)}" y="${n2(y)}" width="${n2(w)}" height="${n2(h)}"/></clipPath><g clip-path="url(#${id})">${cones}</g>`;
    // our defence
    const lay = layoutOf(sit);
    const df = defence(lay, oxr, sit.block, baseFor(ctx.defaults, lay, oxr, sit.block));
    if (sit.blk != null && df.block.length) { // block moved by hand: keep its width, move its centre
      const c0 = (df.block[0][0] + df.block[df.block.length - 1][1]) / 2, d = sit.blk - c0;
      df.block = df.block.map(([a, b]) => [a + d, b + d]);
    }
    const sdef = Array.isArray(sit.def) && lay === 'quick' ? sit.def.filter(p => p[1] > 0.15) : sit.def;
    if (Array.isArray(sdef) && sdef.length === df.def.length) df.def = sdef.map(p => p.slice());
    const fs = Math.max(11, w * 0.085);
    if (ctx.showBlock) for (const [a, b] of df.block) s += R(x + Math.max(0, a) * w, y + 2, Math.max(2, (Math.min(1, b) - Math.max(0, a)) * w), 5, { fill: C.ink, r: 1.5 }); // only in the defence editor
    for (const [dx, dy] of df.def) s += figure(x + dx * w, y + dy * h, fs, C.white, C.ink);
    // percentages on the zones (middle balls) or cones (side balls) that matter
    s += coneLabels;
    if (n && !kind && showPct(sit)) for (let z = 1; z <= 9; z++) {
      const v = Math.round(share[z] * 100);
      if (v < 30) continue; // only the zones that matter
      const [c, r] = ZONE_CR[z];
      const lab = `${v}%`, fsz = w < 110 ? 11 : 13;
      const tw = mw(lab, 'BC', true, fsz) + 6;
      const lx = x + c * cw + cw / 2 - tw / 2, ly = y + r * chh + chh / 2 - 7;
      s += R(lx, ly, tw, fsz + 4, { fill: C.white, r: 3 }) + T(lx + tw / 2, ly + fsz, lab, { f: 'BC', b: true, s: fsz, a: 'middle' });
    }
    let tipHit = '';
    if (tipOn(sit, st)) {
      const bc = df.block.length ? (df.block[0][0] + df.block[df.block.length - 1][1]) / 2 : oxr;
      const [px, py] = Array.isArray(sit.tipXY) ? sit.tipXY : [Math.max(0.12, Math.min(0.88, bc + (oxr > 0.5 ? -0.08 : oxr < 0.5 ? 0.08 : 0))), 0.17];
      s += tipArc(ox, oy + 2, x + px * w, y + py * h, y, h, Math.max(7, w * 0.055));
      if (ctx.screen && hitId) tipHit = `<circle class="hit tipd" data-act="tip" data-id="${hitId}" cx="${n2(x + px * w)}" cy="${n2(y + py * h)}" r="${n2(Math.max(11, w * 0.08))}" fill="transparent"/>`;
    }
    s += L(x - 3, y, x + w + 3, y, { stroke: C.ink, sw: 3 });
    if (back) { // from behind the 3 m line: open triangle
      s += P([[ox - 6, oy - 12], [ox + 6, oy - 12], [ox, oy - 1.5]], { fill: C.white, stroke: C.ink, sw: 1.8 });
    } else s += P([[ox - 6, oy - 11], [ox + 6, oy - 11], [ox, oy - 1]], { fill: C.ink });
    if (ctx.screen && hitId) {
      if (kind) s += `<g clip-path="url(#${id})">${coneHits}</g>`;
      else for (let z = 1; z <= 9; z++) {
        const [c, r] = ZONE_CR[z];
        s += `<rect class="hit zone" data-act="azone" data-id="${hitId}" data-z="${z}" x="${n2(x + c * cw)}" y="${n2(y + r * chh)}" width="${n2(cw)}" height="${n2(chh)}" fill="transparent"/>`;
      }
      // drag handles above the zones: our block (sideways) and each defender
      if (df.block.length && ctx.showBlock) {
        const a = Math.max(0, df.block[0][0]), b = Math.min(1, df.block[df.block.length - 1][1]);
        s += `<rect class="hit blk" data-act="blk" data-id="${hitId}" x="${n2(x + a * w - 4)}" y="${n2(y - 4)}" width="${n2((b - a) * w + 8)}" height="16" fill="transparent"/>`;
      }
      df.def.forEach(([dx, dy], i) => { s += `<circle class="hit dfd" data-act="def" data-id="${hitId}" data-i="${i}" cx="${n2(x + dx * w)}" cy="${n2(y + dy * h)}" r="${n2(fs * 0.62)}" fill="transparent"/>`; });
      s += tipHit;
      ctx.courts['A' + hitId] = { x, y, w, h, def: df.def.map(p => p.slice()), block: df.block.map(p => p.slice()), lay, side: oxr >= 0.6 ? 'R' : oxr <= 0.4 ? 'L' : 'C' };
    }
    return { svg: s, h, n };
  }

  // yellow dashed arc with a dark edge, landing on a target: tips of the attackers, short serves
  function tipArc(x0, y0, tx, ty, top, h, rr, side = 0) {
    // side: sideways bulge (short serves, which start right above the landing point; a tip dragged straight down)
    if (!side && Math.abs(tx - x0) < h * 0.2 && ty - y0 > h * 0.25) side = tx >= x0 ? -0.2 : 0.2;
    const cx = (x0 + tx) / 2 + side * h, cy = side ? (y0 + ty) / 2 - h * 0.04 : Math.min(y0, ty) - h * 0.12;
    const arc = `M${n2(x0)},${n2(y0)} Q${n2(cx)},${n2(cy)} ${n2(tx)},${n2(ty)}`;
    return `<path d="${arc}" fill="none" stroke="${C.ink}" stroke-width="6.5" stroke-linecap="round"/>` // dark edge: readable on any cone
      + `<path d="${arc}" fill="none" stroke="${C.hi}" stroke-width="3.5" stroke-dasharray="5 3"/>`
      + `<circle cx="${n2(tx)}" cy="${n2(ty)}" r="${n2(rr)}" fill="${C.hi}" stroke="${C.ink}" stroke-width="2"/>`
      + `<circle cx="${n2(tx)}" cy="${n2(ty)}" r="${n2(rr * 0.38)}" fill="${C.ink}"/>`;
  }
  /* ---------- page 1 ---------- */
  /* ---------- our block calls: only outside hitters and opposite, "spinta" balls, fixed places as on the paper sheets ---------- */
  function slotsOf(sh) {
    const on = (sh.attackers || []).filter(a => a.on);
    const by = sl => on.find(a => a.slot === sl);
    let S1 = by('S1'), S2 = by('S2'), O = by('O');
    const oh = on.filter(a => player(sh, a.num).roleCode === 2 && a !== S1 && a !== S2);
    if (!S1) S1 = oh.shift();
    if (!S2) S2 = oh.shift();
    if (!O) O = on.find(a => player(sh, a.num).roleCode === 3);
    return { S1, S2, O };
  }
  const BLOCK_SLOTS = [ // side, row from the net (0 = at the net), back row?, who, which ball
    ['L', 0, false, 'O', '2:T'], ['L', 1, false, 'S1', '2:T'], ['L', 0, true, 'O', 'BR:T'],
    ['R', 0, false, 'S1', '4:T'], ['R', 1, false, 'S2', '4:T'], ['R', 2, false, 'O', '4:T']
  ];
  function blockEntries(sh) {
    const sl = slotsOf(sh);
    const out = [];
    for (const [side, row, back, who, key] of BLOCK_SLOTS) {
      const a = sl[who]; if (!a) continue;
      // S1 in posto 2: the "palla in 2" (X6 spinta or V6 alta), shown when he attacks it or a call is written
      const keys = who === 'S1' && side === 'L' ? ['2:T', '2:H'] : [key];
      const sits = (a.sits || []).filter(x => (x.keys || [x.key]).some(k => keys.includes(k)));
      const sit = sits.find(x => (x.block || '').trim()) || sits[0];
      if (!sit) continue;
      if (keys.length > 1 && !(sit.block || '').trim()) {
        const at = sh.stats?.attacks?.[a.num] || {};
        if (keys.reduce((t, k) => t + (at[k]?.n || 0), 0) < 3) continue;
      }
      out.push({ num: a.num, call: (sit.block || '').trim(), side, row, back, who });
    }
    return out;
  }
  function blockDiagram(sh, x, y, w, ctx) {
    let s = '';
    const rows = blockEntries(sh).filter(r => r.call || ctx.screen);
    const callW = 50, x0 = x + callW, cw = w - 2 * callW, rh = ctx.blockRh || 25;
    const nb = rows.some(r => r.back) ? 1 : 0;
    const nf = Math.max(1, ...rows.filter(r => !r.back).map(r => r.row + 1));
    const backH = nb * rh + 10, frontH = nf * rh + 10, h = backH + frontH;
    s += R(x0, y, cw, h, { fill: C.court });
    s += L(x0, y + backH, x0 + cw, y + backH, { stroke: C.white, sw: 2.5 });
    s += L(x0 - 4, y + h, x0 + cw + 4, y + h, { stroke: C.ink, sw: 3 });
    if (!rows.length) s += T(x0 + cw / 2, y + h / 2 + 4, ctx.screen ? 'Scrivi le chiamate sulle spinte degli attaccanti' : '', { s: 11, fill: C.faint, a: 'middle' });
    for (const r of rows) {
      const p = player(sh, r.num);
      const lab = `${p.num}-${shortName(p.surname).toUpperCase()}`;
      const fs = Math.max(13, stepDown(P1.t)), th = rh - 5;
      const tw = Math.min(cw / 2 - 8, mw(lab, 'BT', true, fs) + 14);
      const ty = r.back ? y + 6 : y + h - 6 - th - r.row * rh;
      const callTxt = r.call || '?';
      const cwid = Math.max(30, mw(callTxt, 'BC', true, fs) + 14);
      const tx = r.side === 'L' ? x0 + 4 : x0 + cw - 4 - tw;
      const ccx = r.side === 'L' ? x0 - 5 - cwid : x0 + cw + 5;
      s += R(tx, ty, tw, th, { fill: C.white, stroke: C.ink, sw: 1, r: 3 });
      if (ctx.attPage && ctx.attPage[r.num]) ctx.links.push({ x: tx, y: ty, w: tw, h: th, page: ctx.attPage[r.num] });
      s += T(tx + 6, ty + th / 2 + fs * 0.36, lab, { f: 'BT', b: true, s: fit(lab, 'BT', true, fs, tw - 10, 10) });
      s += r.call ? R(ccx, ty, cwid, th, { fill: C.hi, r: 3 }) + T(ccx + cwid / 2, ty + th / 2 + fs * 0.36, callTxt, { f: 'BC', b: true, s: fs, a: 'middle' })
        : R(ccx, ty, cwid, th, { fill: C.white, stroke: '#E8B04A', r: 3 }) + T(ccx + cwid / 2, ty + th / 2 + fs * 0.36, '?', { f: 'BC', b: true, s: fs, fill: '#A66A00', a: 'middle' });
    }
    return { svg: s, h: h + 8 };
  }
  function bullets(text, x, y, w, size, maxLines, col) {
    let s = '', used = 0, yy = y;
    for (const b of String(text || '').split('\n').map(t => t.trim()).filter(Boolean)) {
      if (used >= maxLines) break;
      const lines = wrap(b, 'B', true, size, w - 14, maxLines - used);
      s += `<circle cx="${n2(x + 4)}" cy="${n2(yy + size * 0.62)}" r="3" fill="${col}"/>`;
      lines.forEach((ln, j) => { s += txt(x + 14, yy + size + j * (size + 4), ln, { s: size }); });
      yy += lines.length * (size + 4) + 4; used += lines.length;
    }
    return { svg: s, h: yy - y };
  }
  // page 1 tries progressively more compact layouts until everything fits
  function page1(sh, ctx) {
    let r;
    const steps = [[18, 0], [18, 1], [18, 2], [15, 1], [15, 2], [15, 3], [13, 3], [13, 4], [11, 4]]; // sizes from the type scale
    for (const [t, lv] of steps) {
      ctx.links = []; ctx.courts = {}; ctx.footNote = null; ctx.rotBox = null; ctx.pipeRow = 0;
      P1.t = t; P1.lv = lv;
      r = page1Body(sh, ctx, lv);
      if (r.bottom <= H - 50) break;
    }
    FIT.p1 = { t: P1.t, over: r.bottom > H - 50 };
    P1.t = TY.text;
    return r.svg;
  }
  function page1Body(sh, ctx, lv) {
    const col = sh.meta?.color || '#1F3A5F';
    const tS = P1.t, tT = Math.max(TY.title - 2, tS + 2); // text, section titles
    ctx.blockRh = lv >= 4 ? tS + 5 : tS + 8;
    const sTitle = (x, yy, lab) => sectionTitle(x, yy, lab, col, '', tT);
    const hd = header(sh, ctx, null);
    let s = hd.svg;
    let y = hd.y - 4;
    const fullW = W - 2 * M;
    const extra = (sh.links || []).filter(l => l.url);
    if (extra.length && !hd.linksInHeader) {
      let xx = M;
      for (const l of extra.slice(0, 4)) { const v = videoChip(xx, y - 4, l.url, ctx, { label: l.label || 'Video', s: 12 }); s += v.svg; xx += v.w + 8; }
      y += 26;
    }
    /* 1 · keys + general notes + serve */
    const keys = (sh.keys || []).map(k => (k || '').trim()).filter(Boolean).slice(0, 3);
    if (keys.length) {
      const gap = 12, kw = (fullW - gap * (keys.length - 1)) / keys.length;
      const lines = keys.map(k => wrap(k, 'B', true, tS, kw - 22, 4));
      const kh = Math.max(...lines.map(l => l.length)) * (tS + 4) + 13;
      keys.forEach((k, i) => {
        const kx = M + i * (kw + gap);
        s += R(kx, y, kw, kh, { fill: '#FFF3D1', r: 4 }) + R(kx, y, 5, kh, { fill: C.hi });
        lines[i].forEach((ln, j) => { s += txt(kx + 14, y + 6 + tS + j * (tS + 4), ln, { s: tS }); });
      });
      y += kh + (lv >= 2 ? 8 : 12);
    }
    // serve: FLOT / SPIN on one line if they fit, else one per line
    const sv = sh.serve || {};
    const srv = [['FLOT', sv.flot], ['SPIN', sv.spin]].filter(([, t]) => (t || '').trim());
    if (srv.length) {
      const items = srv.map(([lab, t]) => { const c = chip(0, 0, lab, { s: tS - 2, h: tS + 9, padX: 10 }); return { lab, t: t.trim(), cw: c.w, tw: mw(t.trim(), 'B', true, tS + 1) }; });
      const oneRow = items.reduce((a, it) => a + it.cw + 10 + it.tw, 0) + 30 * (items.length - 1) <= fullW;
      let xx = M;
      items.forEach((it, i) => {
        if (!oneRow && i) { xx = M; y += tS + (lv >= 2 ? 14 : 17); }
        s += chip(xx, y, it.lab, { s: tS - 2, h: tS + 9, padX: 10, fill: SRV_COL[it.lab] }).svg;
        const room = fullW - (xx - M) - it.cw - 10;
        s += txt(xx + it.cw + 10, y + (tS + 9) / 2 + (tS + 1) * 0.36, wrap(it.t, 'B', true, tS + 1, room, 1)[0], { s: tS + 1 });
        xx += it.cw + 10 + it.tw + 30;
      });
      y += tS + (lv >= 2 ? 15 : 19);
    }
    const gen = (sh.generalNotes || '').trim();
    if (gen) { const b = bullets(gen, M, y - 2, fullW, tS, 4, col); s += b.svg; y += b.h + 2; }
    /* 2 · setter: notes + displaced balls / K7 (only if there is something) */
    const st = setterStats(sh);
    const desc = sh.stats?.callDesc || {};
    const fbCode = (sh.fbCall || 'KF').toUpperCase();
    // the rows the coach switched on (or, until he chooses, the suggested ones), then his own situations
    const cards = callCandidates(sh).filter(c => c.on);
    for (const fs0 of customSits(sh)) {
      const fcnt = { B: +fs0.B || 0, C: +fs0.C || 0, F: +fs0.F || 0, P: +fs0.P || 0 };
      if (fs0.on !== false && (fs0.title || '').trim() && sumV(fcnt) > 0) cards.push({ kind: 'FB', cnt: fcnt, title: fs0.title.trim(), manual: true, sub: (fs0.sub || '').trim() });
    }
    // the cards keep room for the pipe tab only when one of them has it
    const spH = SPOST_H;
    const notes = String(sh.setterNotes || '').trim();
    const setter = sh.setter ? player(sh, sh.setter) : null;
    const top0 = hd.y - 4;
    const rule = () => { if (y > top0 + 4) { s += L(M, y + 2, W - M, y + 2, { stroke: C.line, sw: 1.5 }); y += lv >= 2 ? 8 : 12; } };
    if (notes || cards.length || sh.setterVideo) {
      rule();
      s += sTitle(M, y + 16, 'Palleggio' + (setter ? `  ·  ${setter.num}-${shortName(setter.surname)}` : ''));
      const titleY = y;
      s += videoChip(W - M, y - 1, sh.setterVideo, ctx, { right: true }).svg;
      y += 26;
      // calls as a table: one row per call or situation, the same three columns for all (behind / centre / in front).
      // Two arrangements, the lower one wins: beside the setter notes, or under them in two halves
      // (calls of the middle on the left, displaced balls and own situations on the right)
      const TBW = 262, nwT = fullW - TBW - 22;
      const isCall = c => /^K[1-9C]$/.test(c.kind || '');
      const left = cards.filter(isCall), right = cards.filter(c => !isCall(c));
      const halves = left.length && right.length;
      const tbl2H = cards.length ? (halves ? spostTableH(left.length > right.length ? left : right) : spostTableH(cards)) + 30 : 0;
      const besideH = notes && cards.length ? Math.max(bullets(notes, M, 0, nwT, tS, 20, col).h, spostTableH(cards)) : 1e9;
      const stackH = (notes ? bullets(notes, M, 0, fullW, tS, 20, col).h + 6 : 0) + tbl2H;
      if (besideH <= stackH) {
        const b = bullets(notes, M, y, nwT, tS, 20, col); s += b.svg;
        s += sTitle(W - M - TBW, titleY + 16, 'Chiamate');
        s += L(W - M - TBW - 11, y - 4, W - M - TBW - 11, y + besideH - 4, { stroke: C.line, sw: 1.5 });
        const t0 = spostTable(W - M - TBW, y - 4, TBW, cards, true); s += t0.svg;
        y += besideH;
      } else {
        if (notes) { const b = bullets(notes, M, y, fullW, tS, 20, col); s += b.svg; y += b.h + 6; }
        if (cards.length) {
          s += sTitle(M, y + 16, 'Chiamate'); y += 26;
          if (halves) {
            const hw = (fullW - 30) / 2;
            const a = spostTable(M, y, hw, left), bb = spostTable(M + hw + 30, y, hw, right);
            s += a.svg + bb.svg + L(M + hw + 15, y + 2, M + hw + 15, y + Math.max(a.h, bb.h) - 4, { stroke: C.line, sw: 1.5 });
            y += Math.max(a.h, bb.h);
          } else { const t0 = spostTable(M, y, Math.min(fullW, 420), cards, true); s += t0.svg; y += t0.h; }
        }
      }
      y += 4;
    }
    /* 3 · distribution */
    rule();
    s += sTitle(M, y + 16, 'Distribuzione' + (PHASE_LAB[sh.distPhase] ? '  ·  ' + PHASE_LAB[sh.distPhase] : ''));
    const dm = sh.distMode || 'auto';
    const BASE_TXT = { auto: `% sulla chiamata del centrale più usata da ${rules(sh).minCall} palloni, se no sulle palle in posizione (K1, K7, KC, K2)`, inSys: 'palle in posizione dopo ricezione (K1, K7, KC, K2, senza spostate)', called: 'tutte le chiamate dopo ricezione, spostate comprese', rec: 'prima palla dopo ricezione # +', all: 'tutte le alzate' };
    ctx.footNote = `● meno di ${FEW_N} palloni: dato poco affidabile  ·  Distribuzione: ${PHASE_LAB[sh.distPhase] ? 'prima palla dopo ricezione # +, ' + PHASE_LAB[sh.distPhase].toLowerCase() : BASE_TXT[dm] || BASE_TXT.auto}`;
    y += 26;
    const cg = 18, cw = (fullW - 2 * cg) / 3;
    if (sh.showFormation) {
      // the courts take the room left above the block section, between 170 and 250 pt per row
      const bdH0 = blockDiagram(sh, M, 0, 330, { ...ctx, links: [], attPage: null }).h;
      const ntL0 = Math.min(8, wrap((sh.notes || '').trim(), 'B', true, tS, W - M - (M + 330 + 30), 20).length);
      const need40 = 34 + Math.max(bdH0, ntL0 * (tS + 4) + 12) + 20;
      const exAll = [0, 1].reduce((t, r) => t + Math.max(...ROT_GRID[r].map(P => FORM_EXTRA(formLines(sh, P).length))), 0);
      const ch = Math.max([170, 160, 150, 140, 130][lv] || 130, Math.min(250, ((H - 52) - y - need40 - 22 - exAll) / 2 - 6)); // smaller courts before smaller text
      const ex = [0, 1].map(r => Math.max(...ROT_GRID[r].map(P => FORM_EXTRA(formLines(sh, P).length))));
      const rh = [ch + ex[0], ch + ex[1]];
      ROT_GRID.forEach((Ps, r) => Ps.forEach((Pk, c) => { s += rotationCard(sh, Pk, M + c * (cw + cg), y + (r ? rh[0] + 12 : 0), cw, rh[r], ctx); }));
      s += L(M, y + rh[0] + 6, W - M, y + rh[0] + 6, { stroke: ROT_DIV, sw: 1 });
      [1, 2].forEach(c => { const lx = M + c * (cw + cg) - cg / 2; s += L(lx, y, lx, y + rh[0] + rh[1] + 12, { stroke: ROT_DIV, sw: 1 }); });
      y += rh[0] + rh[1] + 12 + 10;
    } else {
      // grow the boxes into the free space left after the block section
      const bdH = blockDiagram(sh, M, 0, 330, { ...ctx, links: [], attPage: null }).h;
      const ntL = Math.min(8, wrap((sh.notes || '').trim(), 'B', true, tS, W - M - (M + 330 + 30), 20).length);
      const need4 = 34 + Math.max(bdH, ntL * (tS + 4) + 12);
      const pipeOf = r => ROT_GRID[r].some(P => (rotDist(sh, P).P || 0) > 0) ? PIPE_H : 0;
      const base = [0, 1].map(r => Math.max(...ROT_GRID[r].map(P => rotCardH(sh, P, cw, ROT_BOX, pipeOf(r)))));
      const free = (H - 52) - y - (base[0] + base[1] + 26) - need4;
      ctx.rotBox = ROT_BOX - (lv >= 2 ? 6 : 0) + Math.max(0, Math.min(lv ? 0 : 6, free / 4)); // fixed size: free space goes to the text
      const gy0 = y; // thin dividers between the six rotations
      for (let r = 0; r < 2; r++) {
        const Ps = ROT_GRID[r];
        ctx.pipeRow = pipeOf(r);
        const rh = Math.max(...Ps.map(P => rotCardH(sh, P, cw, ctx.rotBox, ctx.pipeRow)));
        Ps.forEach((Pk, c) => { s += rotationCard(sh, Pk, M + c * (cw + cg), y, cw, rh, ctx); });
        y += rh + 8;
        if (r === 0) { s += L(M, y, W - M, y, { stroke: ROT_DIV, sw: 1 }); y += 8; }
      }
      [1, 2].forEach(c => { const lx = M + c * (cw + cg) - cg / 2; s += L(lx, gy0, lx, y - 8, { stroke: ROT_DIV, sw: 1 }); });
      y += 2 + Math.max(0, Math.min(16, ((H - 52) - y - need4) * 0.25));
    }
    /* 4 · our block calls + other notes */
    const bw = 330, nx = M + bw + 30, nw = W - M - nx;
    rule();
    s += sTitle(M, y + 16, 'Chiamate di muro');
    s += sTitle(nx, y + 16, 'Muro e altre note');
    if (sh.blockVideo) s += videoChip(W - M, y - 2, sh.blockVideo, ctx, { right: true, label: 'Muro', s: 12 }).svg;
    y += 26;
    const bd = blockDiagram(sh, M, y, bw, ctx);
    s += bd.svg;
    const bottom = y + bd.h;
    const nt = (sh.notes || '').trim();
    const lh = tS + 4, maxL = Math.max(2, Math.floor((H - 52 - y) / lh));
    if (nt) wrap(nt, 'B', true, tS, nw, maxL).forEach((ln, j) => {
      const head = /^[A-ZÀ-Ú ]{3,}:?$/.test(ln.trim());
      s += txt(nx, y + tS - 1 + j * lh, ln, { s: tS, fill: head ? TITLE_COL : C.ink });
    });
    else if (ctx.screen) s += T(nx, y + 12, 'Muro avversario, riserve, altro…', { s: 12, fill: C.faint });
    return { svg: s, bottom: Math.max(bottom, y + (nt ? wrap(nt, 'B', true, tS, nw, 40).length : 0) * (tS + 4)) };
  }

  /* ---------- page 2: attackers (as on the paper sheets: courts on the left, one text block per player) ---------- */
  const SIT_SHORT = { '4:T': 'Spinta 4', '4:H': 'Alta 4', '2:T': 'Spinta 2', '2:H': 'Alta 2', 'BR:T': '2ª linea spinta', 'BR:H': '2ª linea alta', 'Q:UNO': 'Uno', 'Q:SETTE': 'Sette', 'Q:DIETRO': 'Dietro', '3:T': 'Centro', '3:H': 'Alta centro' };
  const MERGED = { '4:T+4:H': 'Palla in 4', '2:T+2:H': 'Palla in 2', 'BR:T+BR:H': 'Seconda linea' };
  function sitKey(sit) { return (sit.keys || [sit.key]).slice().sort().join('+'); }
  function sitLabel(sit, short) {
    if (sit.label) return sit.label;
    const keys = sit.keys || [sit.key];
    const k = keys.slice().sort((a, b) => DVW.SIT_ORDER.indexOf(a) - DVW.SIT_ORDER.indexOf(b)).join('+');
    if (MERGED[k]) return MERGED[k];
    return keys.map(x => short ? (SIT_SHORT[x] || x) : (DVW.SIT_LABEL[x] || x)).join(' + ');
  }
  // wrap with a shorter first line (room for a bold label in front)
  function wrapIndent(str, s, firstW, restW, maxLines) {
    const words = String(str || '').split(/\s+/).filter(Boolean);
    const out = []; let line = '';
    for (const w of words) {
      const lim = out.length ? restW : firstW;
      const t = line ? line + ' ' + w : w;
      if (mw(t, 'B', true, s) <= lim || !line) line = t; else { out.push(line); line = w; if (out.length >= maxLines) break; }
    }
    if (line && out.length < maxLines) out.push(line);
    return out;
  }
  const SLOT_ORD = { S1: 0, S2: 1, O: 2, C1: 3, C2: 4, S3: 5, S4: 6, O2: 7, C3: 8, C4: 9 };
  const SLOT_LAB = { S1: 'Schiacciatore 1', S2: 'Schiacciatore 2', O: 'Opposto', C1: 'Centrale 1', C2: 'Centrale 2' };
  function attOrder(sh) {
    const on = (sh.attackers || []).filter(a => a.on);
    return on.map((a, i) => ({ a, i })).sort((x, y) => ((SLOT_ORD[x.a.slot] ?? 9) - (SLOT_ORD[y.a.slot] ?? 9)) || (x.i - y.i)).map(x => x.a);
  }
  const isMid = (sh, a) => /^C[1-4]$/.test(a.slot || '') || (!a.slot && player(sh, a.num).roleCode === 4);
  // name line: a light band in the role colour, the place in the lineup in a filled tag, then "11-DESTRO"
  const NAME_FS = 22;
  function headParts(sh, a, w) {
    const p = player(sh, a.num);
    const tag = a.slot || ({ 2: 'S', 3: 'O', 4: 'C' })[p.roleCode] || '';
    const nm = `${p.num}-${p.surname.toUpperCase()}`;
    const fs = fit(nm, 'BT', true, NAME_FS, w * 0.55, 14);
    const tw = tag ? mw(tag, 'BT', true, 17) + 14 : 0;
    const tot = Object.values(sh.stats?.attacks?.[a.num] || {}).reduce((acc, v) => acc + v.n, 0);
    return { p, tag, nm, fs, tw, tot, nx: 6 + (tag ? tw + 10 : 4) };
  }
  // where the name line ends (tag, number and name, attacks count), from the left of the block
  function headEnd(sh, a, w) {
    const h = headParts(sh, a, w);
    return h.nx + mw(h.nm, 'BT', true, h.fs) + 10 + (h.tot ? mw(`${h.tot} attacchi`, 'B', false, TY.small + 1) : 0);
  }
  // the player's general note, followed by the balls he wants as text only (no court)
  function genText(a) {
    const extra = (a.sits || []).filter(x => x.on && x.textOnly && (x.note || '').trim()).map(x => `${sitLabel(x, true)}: ${x.note.trim()}`);
    return [(a.note || '').trim(), ...extra].filter(Boolean).join('\n');
  }
  const roleCol = (sh, a) => (/^O2?$/.test(a.slot || '') ? ROLE[3].col : ROLE[player(sh, a.num).roleCode]?.col) || C.ink;
  function playerHead(sh, a, x, y, w, ctx, cont) {
    let s = '';
    const h = headParts(sh, a, w);
    const rc = roleCol(sh, a);
    s += R(x, y, w, 30, { fill: mix(rc, '#FFFFFF', 0.88), r: 4 });
    if (h.tag) {
      s += R(x + 6, y + 4, h.tw, 22, { fill: rc, r: 4 });
      s += T(x + 6 + h.tw / 2, y + 21.5, h.tag, { f: 'BT', b: true, s: 17, fill: C.white, a: 'middle' });
    }
    s += T(x + h.nx, y + 23, h.nm, { f: 'BT', b: true, s: h.fs });
    const sub = cont ? 'continua' : (h.tot ? `${h.tot} attacchi` : '');
    s += T(x + h.nx + mw(h.nm, 'BT', true, h.fs) + 10, y + 21, sub, { s: TY.small + 1, fill: C.muted });
    if (a.video && !cont) s += videoChip(x + w - 4, y + 3, a.video, ctx, { right: true, s: 12 }).svg;
    return s;
  }
  // one court with its label above; block call, tips and video of that ball on the same line, on the right
  function sitCourt(sh, a, sit, x, y, cs, ctx) {
    let s = '';
    const p = player(sh, a.num);
    const sst = sitStats(sh, a.num, sit);
    const lab = sitLabel(sit, true).toUpperCase();
    const top = y + 33, cy0 = y + 10; // chips above, the attack triangle (11 pt over the court) below them
    let rx = x + cs; // right group, from the right edge
    if (sit.video) {
      const r = 9, cx0 = rx - r;
      let v = `<circle cx="${n2(cx0)}" cy="${n2(cy0)}" r="${r}" fill="${C.ink}"/>` + P([[cx0 - 3, cy0 - 4.5], [cx0 - 3, cy0 + 4.5], [cx0 + 4.5, cy0]], { fill: C.hi });
      if (ctx.screen) v = `<a href="${esc(sit.video)}" target="_blank" rel="noopener">${v}</a>`;
      ctx.links.push({ x: cx0 - r, y: cy0 - r, w: 2 * r, h: 2 * r, url: sit.video });
      s += v; rx -= 2 * r + 5;
    }
    const call = (sit.block || '').trim();
    const wantsCall = p.roleCode !== 4 && layoutOf(sit) !== 'quick';
    if (call || (ctx.screen && wantsCall)) {
      const cwid = Math.max(24, mw(call || '?', 'BC', true, 13) + 12), bx = rx - cwid, by = cy0 - 9;
      s += call ? R(bx, by, cwid, 18, { fill: C.hi, r: 4 }) + T(bx + cwid / 2, by + 13.5, call, { f: 'BC', b: true, s: 13, a: 'middle' })
        : R(bx, by, cwid, 18, { fill: C.white, stroke: '#E8B04A', r: 4 }) + T(bx + cwid / 2, by + 13.5, '?', { f: 'BC', b: true, s: 13, fill: '#A66A00', a: 'middle' });
      rx = bx - 5;
    }
    s += T(x, y + 14, lab, { f: 'BT', b: true, s: fit(lab, 'BT', true, 14, Math.max(30, rx - x - 2), 8) });
    s += attackCourt(x, top, cs, (sit.keys || [sit.key])[0], sit, sst, ctx, ctx.screen ? `${a.num}|${sitKey(sit)}` : null).svg;
    if (!sst.n && !Object.keys(sit.manual || {}).length && !Object.keys(sit.cmanual || {}).length) { if (ctx.screen) s += T(x + cs / 2, top + cs / 2, 'tocca le zone', { s: 10.5, fill: C.faint, a: 'middle' }); }
    else if (sst.n && !Object.keys(sst.ez).length && !Object.keys(sst.ec || {}).length && !Object.keys(sit.manual || {}).length && !Object.keys(sit.cmanual || {}).length) s += T(x + cs / 2, top + cs * 0.2, 'arrivi non scoutati', { s: 10.5, fill: C.muted, a: 'middle' });
    return s;
  }
  // where a ball comes from, seen from our court: R = their zone 4, L = their zone 2 / 1, C = middle
  function sitSide(sh, a, sit) {
    const ox = originX((sit.keys || [sit.key])[0], sitStats(sh, a.num, sit).sz);
    return ox >= 0.6 ? 'R' : ox <= 0.4 ? 'L' : 'C';
  }
  /* ---------- attacker pages, classic scheme ----------
     starters in fixed places: S1 (3 courts), opposite on two rows (spinta / alta in 2, then spinta / alta from 1 and the
     ball in 4), S2 (2 courts + text), the two middles side by side (2 courts each). A missing ball leaves its place empty,
     a ball beyond the scheme goes on an extra row. Reserves: only the active players and balls, packed. */
  const HEAD_H = 36, CHIP_H = 39, GAP = 14, CS_MAX = 170, BAND_SEP = 14, CS_FIX_MIN = 132;
  const COLW = (W - 2 * M - 2 * GAP) / 3;
  const roleOf = (sh, a) => {
    const sl = a.slot || '';
    if (/^S/.test(sl)) return 'S'; if (/^O/.test(sl)) return 'O'; if (/^C/.test(sl)) return 'C';
    return ({ 2: 'S', 3: 'O', 4: 'C' })[player(sh, a.num).roleCode] || 'S';
  };
  const activeSits = a => (a.sits || []).filter(x => x.on && !x.textOnly);
  const sitN = (sh, a, s0) => sitStats(sh, a.num, s0).n || 0;
  const keysOf = s0 => s0.keys || [s0.key];
  const allH = s0 => keysOf(s0).every(k => k.endsWith(':H'));
  const allPre = (s0, p) => keysOf(s0).every(k => k.startsWith(p));
  // fixed places of a starter: rows of slots, each slot { sit } | { gen } | { empty: label }
  const mixedTH = s0 => keysOf(s0).some(k => k.endsWith(':H')) && keysOf(s0).some(k => !k.endsWith(':H')); // spinta and alta together
  function starterRows(sh, a, role) {
    const sits = activeSits(a).slice().sort((p, q) => sitN(sh, a, q) - sitN(sh, a, p));
    const used = new Set();
    const take = (lab, test) => { const s0 = sits.find(x => !used.has(x) && test(x)); if (s0) { used.add(s0); return { sit: s0 }; } return { empty: lab }; };
    // the alta place when the spinta court already holds both
    const alta = (sp, lab, test) => sp.sit && mixedTH(sp.sit) && !sits.some(x => !used.has(x) && test(x)) ? { empty: lab, same: true } : take(lab, test);
    let rows;
    if (role === 'O') {
      const sp2 = take('Spinta 2', x => allPre(x, '2') && !allH(x));
      const sp1 = take('Spinta da 1', x => allPre(x, 'BR') && !allH(x) && sitSide(sh, a, x) === 'L');
      rows = [[sp2, alta(sp2, 'Alta 2', x => allPre(x, '2') && allH(x)), { gen: true }],
        [sp1, alta(sp1, 'Alta da 1', x => allPre(x, 'BR') && allH(x) && sitSide(sh, a, x) === 'L'), take('Palla in 4', x => allPre(x, '4'))]];
      if (rows[1].every(sl => sl.empty)) rows.pop(); // nothing from the back row and nothing in 4
    } else if (role === 'C') { // standard: the 1 and the 7
      rows = [[take('Uno', x => keysOf(x).includes('Q:UNO')), take('Sette', x => keysOf(x).includes('Q:SETTE'))]];
    } else { // outside hitters: spinta and alta in 4, then (S1) the ball in 2, or (S2) the text
      const sp4 = take('Spinta 4', x => allPre(x, '4') && !allH(x));
      const r0 = [sp4, alta(sp4, 'Alta 4', x => allPre(x, '4') && allH(x))];
      r0.push(a.slot === 'S1' ? take('Palla in 2', x => allPre(x, '2')) : { gen: true });
      rows = [r0];
    }
    const per = role === 'C' ? 2 : 3;
    const rest = sits.filter(x => !used.has(x));
    for (let i = 0; i < rest.length; i += per) rows.push(rest.slice(i, i + per).map(s0 => ({ sit: s0 })));
    return rows;
  }
  // a reserve: its balls in rows of 3, the text in the first free slot (or on the name line)
  const RES_ORD = {
    O: [x => allPre(x, '2') && !allH(x), x => allPre(x, '2') && allH(x), x => allPre(x, 'BR') && !allH(x), x => allPre(x, 'BR') && allH(x)],
    S: [x => allPre(x, '4') && !allH(x), x => allPre(x, '4') && allH(x), x => allPre(x, '2')],
    C: [x => keysOf(x).includes('Q:UNO'), x => keysOf(x).includes('Q:SETTE')]
  };
  function reserveRows(sh, a) {
    const ord = RES_ORD[roleOf(sh, a)] || [];
    const rank = x => { const i = ord.findIndex(f => f(x)); return i < 0 ? 99 : i; };
    const sits = activeSits(a).slice().sort((p, q) => rank(p) - rank(q) || sitN(sh, a, q) - sitN(sh, a, p));
    const rows = [];
    for (let i = 0; i < sits.length; i += 3) rows.push(sits.slice(i, i + 3).map(s0 => ({ sit: s0 })));
    if (genText(a) && (!rows.length || rows[rows.length - 1].length < 3)) { if (!rows.length) rows.push([]); rows[rows.length - 1].push({ gen: true }); }
    return rows;
  }
  // a band: players side by side over the page width; item = { a, x, w, cols, colW, rows, headGen, genBelow }
  function bandOf(items) { return { items }; }
  function fullItem(sh, a, rows) {
    const hasGenSlot = rows.some(r => r.some(sl => sl.gen));
    return { a, x: M, w: W - 2 * M, cols: 3, colW: COLW, rows, headGen: !hasGenSlot && !!genText(a) };
  }
  function startersBands(sh, list) {
    const by = {};
    for (const a of list) { const k = a.slot || ''; if (!by[k]) by[k] = a; }
    const extra = list.filter(a => !['S1', 'O', 'S2', 'C1', 'C2'].includes(a.slot || ''));
    const bands = [];
    const add = a => bands.push(bandOf([fullItem(sh, a, starterRows(sh, a, roleOf(sh, a)))]));
    if (by.S1) add(by.S1);
    if (by.O) add(by.O);
    if (by.S2) add(by.S2);
    const mids = [by.C1, by.C2].filter(Boolean);
    if (mids.length) {
      const hw = (W - 2 * M - 24) / 2, cw = (hw - GAP) / 2;
      bands.push(bandOf([by.C1, by.C2].map((a, i) => a ? { a, x: M + i * (hw + 24), w: hw, cols: 2, colW: cw, rows: starterRows(sh, a, 'C'), genBelow: !!genText(a) } : null).filter(Boolean)));
    }
    // starters without a place (no lineup): treated as reserves after the others
    return { bands, extra };
  }
  function reserveBands(sh, list) {
    const bands = [];
    let cur = [], units = 0;
    const flush = () => { if (cur.length) bands.push(bandOf(cur)); cur = []; units = 0; };
    for (const a of list) {
      const rows = reserveRows(sh, a);
      const u = rows.length > 1 ? 3 : Math.max(1, rows[0]?.length || 0);
      if (units + u > 3) flush();
      const x = M + units * (COLW + GAP), w = u * COLW + (u - 1) * GAP;
      cur.push({ a, x, w, cols: u, colW: COLW, rows: rows.length ? rows : [[]], headGen: !rows.some(r => r.some(sl => sl.gen)) && !!genText(a) });
      units += u;
      if (u === 3) flush();
    }
    flush();
    return bands;
  }
  // heights at text size fs: the head (with the text on the name line), each row's notes, the text under the middles
  function headGenLines(sh, it, fs) {
    if (!it.headGen) return [];
    const wHead = it.w - headEnd(sh, it.a, it.w) - 14 - (it.a.video ? 100 : 0);
    // a narrow name line still takes a short text (e.g. "Mancino") when it fits on one line
    if (wHead < 120) return wHead > 40 && !genText(it.a).includes('\n') && mw(genText(it.a), 'B', true, fs) <= wHead ? [genText(it.a)] : null;
    return wrap(genText(it.a), 'B', true, fs, wHead, 99);
  }
  function bandGeo(sh, band, fs, csRef = 150) {
    const lh = Math.round(fs * 1.25), glh = Math.round((fs) * 1.28);
    let head = HEAD_H;
    let bad = false;
    for (const it of band.items) { const gl = headGenLines(sh, it, fs); if (gl === null) it.genBelow = true; else { if (gl.length > 3) bad = true; if (gl.length > 1) head = Math.max(head, HEAD_H + (Math.min(3, gl.length) - 1) * glh); } }
    const nRows = Math.max(...band.items.map(it => it.rows.length));
    const noteH = [];
    for (let r = 0; r < nRows; r++) {
      let n = 0;
      for (const it of band.items) for (const sl of it.rows[r] || []) if (sl.sit && (sl.sit.note || '').trim()) n = Math.max(n, wrap(sl.sit.note.trim(), 'B', true, fs, it.colW - 8, 99).length);
      let need = n ? n * lh + 6 : 8;
      for (const it of band.items) if ((it.rows[r] || []).some(sl => sl.gen) && genText(it.a)) need = Math.max(need, wrap(genText(it.a), 'B', true, fs, it.colW - 4, 99).length * glh + 34 - CHIP_H - csRef);
      noteH.push(need);
    }
    // a general text that goes under the courts: in the free room under the player's own notes when it fits there
    const ownH = (it, r) => { let n = 0; for (const sl of it.rows[r] || []) if (sl.sit && (sl.sit.note || '').trim()) n = Math.max(n, wrap(sl.sit.note.trim(), 'B', true, fs, it.colW - 8, 99).length); return n ? n * lh + 6 : 4; };
    for (const it of band.items) {
      it.genIn = null;
      if (!it.genBelow || !nRows) continue;
      const r = it.rows.length - 1, gh = wrap(genText(it.a), 'B', true, fs, it.w, 99).length * glh + 6;
      if (r >= 0 && noteH[r] - ownH(it, r) >= gh) it.genIn = { r, off: ownH(it, r) };
    }
    const below = Math.max(0, ...band.items.map(it => it.genBelow && !it.genIn ? wrap(genText(it.a), 'B', true, fs, it.w, 99).length * glh + 8 : 0));
    return { bad, head, noteH, below, nRows, fixed: head + noteH.reduce((p, v) => p + v, 0) + nRows * CHIP_H + below };
  }
  const ATT_AVAIL = () => H - 52 - (SEC_HDR_Y - 6);
  function pageCs(sh, bands, fs) {
    const geos = bands.map(b => bandGeo(sh, b, fs));
    const fixed = geos.reduce((p, g) => p + g.fixed, 0) + (bands.length - 1) * BAND_SEP;
    const rows = geos.reduce((p, g, i) => p + g.nRows * (bands[i].scale || 1), 0);
    const widthCap = Math.min(...bands.flatMap(b => b.items.map(it => it.colW / (b.scale || 1))));
    if (geos.some(g => g.bad)) return -1;
    return Math.min(CS_MAX, widthCap, (ATT_AVAIL() - fixed) / Math.max(1, rows));
  }
  const PLAN_FS = 13; // pages and court size are planned at this text size, then the text steps up or down
  function splitPages(sh, bands, prefer) {
    if (!bands.length) return [];
    if (pageCs(sh, bands, PLAN_FS) >= 140) return [bands];
    if (prefer && prefer > 0 && prefer < bands.length) {
      const A = bands.slice(0, prefer), B = bands.slice(prefer);
      if (pageCs(sh, A, PLAN_FS) >= 115 && pageCs(sh, B, PLAN_FS) >= 115) return [A, B];
    }
    const pages = []; let cur = [];
    for (const b of bands) { if (cur.length && pageCs(sh, [...cur, b], PLAN_FS) < 115) { pages.push(cur); cur = [b]; } else cur.push(b); }
    if (cur.length) pages.push(cur);
    return pages;
  }
  function attPages(sh) {
    const list = attOrder(sh);
    const starters = list.filter(a => ['S1', 'O', 'S2', 'C1', 'C2'].includes(a.slot || ''));
    const others = list.filter(a => !starters.includes(a));
    const { bands } = startersBands(sh, starters);
    let others2 = others;
    // S3 with one court: in the free third place of S2 (no extra row of S2; its general text moves to the name line).
    // S3 with 2-3 courts: on its own row under S2, on the same page, unless that needs one more page
    const s3 = others.find(a => a.slot === 'S3'), b2 = bands.find(b => b.items[0].a.slot === 'S2');
    if (s3 && b2) {
      const it2 = b2.items[0], n3 = activeSits(s3).length;
      if (n3 === 1 && it2.rows.length === 1 && it2.rows[0][2]?.gen) {
        it2.rows = [it2.rows[0].slice(0, 2)]; it2.cols = 2; it2.w = 2 * COLW + GAP; it2.headGen = !!genText(it2.a);
        b2.items.push({ a: s3, x: M + 2 * (COLW + GAP), w: COLW, cols: 1, colW: COLW, rows: [[{ sit: activeSits(s3)[0] }]], headGen: !!genText(s3) });
        others2 = others2.filter(a => a !== s3);
      } else if (n3 >= 2 && n3 <= 3) {
        const lead0 = bands.filter(b => ['S1', 'O'].includes(b.items[0].a.slot || '')).length;
        const before = splitPages(sh, bands, lead0).length;
        const rows = reserveRows(sh, s3);
        const band3 = bandOf([{ a: s3, x: M, w: W - 2 * M, cols: 3, colW: COLW, rows, headGen: !rows.some(r => r.some(sl => sl.gen)) && !!genText(s3) }]);
        const withS3 = bands.slice(); withS3.splice(bands.indexOf(b2) + 1, 0, band3);
        if (splitPages(sh, withS3, lead0).length <= before) { bands.splice(bands.indexOf(b2) + 1, 0, band3); others2 = others2.filter(a => a !== s3); }
      }
    }
    // C3: small, under the two middles
    const c3 = others.find(a => a.slot === 'C3'), bm = bands.find(b => ['C1', 'C2'].includes(b.items[0].a.slot || ''));
    if (c3 && bm && activeSits(c3).length) {
      const sc = 0.72, hw = (W - 2 * M - 24) / 2, cw = (hw - GAP) / 2 * sc;
      const rows = []; const ss = activeSits(c3); for (let i = 0; i < ss.length; i += 2) rows.push(ss.slice(i, i + 2).map(s0 => ({ sit: s0 })));
      bands.push(Object.assign(bandOf([{ a: c3, x: M, w: hw, cols: 2, colW: cw, rows, headGen: !!genText(c3) }]), { scale: sc }));
      others2 = others2.filter(a => a !== c3);
    }
    const lead = bands.filter(b => ['S1', 'O'].includes(b.items[0].a.slot || '')).length; // page A: S1 and opposite
    const sp = splitPages(sh, bands, lead);
    // the same text size and court size on every starters page: the largest text that keeps the courts readable
    const plan = pgs => {
      if (!pgs.length) return { fs: 14, cs: CS_MAX };
      for (const fs of [15, 13]) { const c = Math.min(...pgs.map(p => pageCs(sh, p, fs))); if (c >= CS_FIX_MIN) return { fs, cs: c }; }
      return { fs: 11, cs: Math.max(90, Math.min(...pgs.map(p => pageCs(sh, p, 11)))) };
    };
    const ps = plan(sp);
    const rp = splitPages(sh, reserveBands(sh, others2), 0);
    const mk = (p, res, pl) => ({ bands: p, res, cs: pl.cs, fs: pl.fs, blocks: p.flatMap(b => b.items.map(it => ({ a: it.a }))) });
    return [...sp.map(p => mk(p, false, ps)), ...rp.map(p => mk(p, true, plan([p])))];
  }
  const ATT = { fs: 12, over: false }; // attacker pages: text size for the page, and whether something did not fit
  // justified text: lines wrapped paragraph by paragraph, the last line of each paragraph left as it is;
  // a line that would open gaps wider than three spaces stays left-aligned
  function justLines(t, fs, w) {
    const out = [];
    for (const para of String(t || '').split('\n')) {
      const ls = wrap(para, 'B', true, fs, w, 99);
      if (!ls.length) { out.push({ ln: '', last: true }); continue; }
      // the line before a very short last line (one short word) stays left-aligned too, or it opens wide gaps
      const shortLast = ls.length > 1 && mw(ls[ls.length - 1], 'B', true, fs) < w * 0.25;
      ls.forEach((ln, j) => out.push({ ln, last: j === ls.length - 1 || (shortLast && j === ls.length - 2) }));
    }
    while (out.length && out[out.length - 1].ln === '') out.pop();
    return out;
  }
  function jtxt(x, y, l, w, o) {
    const words = l.ln.split(' ').filter(Boolean);
    if (l.last || words.length < 2) return txt(x, y, l.ln, o);
    const z = snapS(o.s), ww = words.map(t => mw(t, 'B', true, z)), sp = mw(' ', 'B', true, z);
    const gap = (w - ww.reduce((a, b) => a + b, 0)) / (words.length - 1);
    if (gap > sp * 3 || gap < sp * 0.5) return txt(x, y, l.ln, o);
    let xx = x, out = '';
    words.forEach((t, i) => { out += txt(xx, y, t, o); xx += ww[i] + gap; });
    return out;
  }
  function noteBox(text, x, y, w, h, bar) {
    const t = String(text || '').trim();
    if (!t) return '';
    const fs = ATT.fs, lh = Math.round(fs * 1.25);
    const maxL = Math.max(1, Math.floor((h - 4) / lh));
    const all = justLines(t, fs, w - 8), lines = all.slice(0, maxL);
    if (all.length > maxL) { ATT.over = true; lines[maxL - 1] = { ln: wrap(lines[maxL - 1].ln + ' …', 'B', true, fs, w - 8, 1)[0], last: true }; }
    let s = R(x, y, 3, lines.length * lh + 2, { fill: bar || C.line });
    lines.forEach((l, j) => { s += jtxt(x + 8, y + fs + j * lh, l, w - 8, { s: fs }); });
    return s;
  }
  // the text starts large and steps down until every note on the page fits
  function page2(sh, ctx, part = 0) {
    let out = '';
    const f0 = attPages(sh)[part]?.fs || 15;
    for (const fs of [15, 13, 11].filter(f => f <= f0)) {
      ctx.links = []; ctx.courts = {}; ATT.fs = fs; ATT.over = false;
      out = page2Body(sh, ctx, part);
      if (!ATT.over) break;
    }
    FIT.att[part] = { fs: ATT.fs, over: ATT.over };
    ATT.fs = 11;
    return out;
  }
  function genNote(gen, x, y, w, h, col) { // general note of a player, in the free space of the block
    const fs = ATT.fs, lh = Math.round(fs * 1.28), maxL = Math.max(1, Math.floor(h / lh));
    const all = justLines(gen, fs, w);
    if (all.length > maxL) ATT.over = true;
    return all.slice(0, maxL).map((l, j) => jtxt(x, y + j * lh, l, w, { s: fs, fill: col })).join('');
  }
  function page2Body(sh, ctx, part = 0) {
    const col = sh.meta?.color || '#1F3A5F';
    const pg = attPages(sh)[part];
    const hd = header(sh, ctx, pg?.res ? 'Attaccanti · riserve' : 'Attaccanti');
    let s = hd.svg; let y = hd.y - 6;
    if (!pg) { s += T(M, y + 20, 'Nessun attaccante selezionato.', { s: 15, fill: C.faint }); return s; }
    const fs = ATT.fs, cs = pg.cs;
    const geos = pg.bands.map(b => bandGeo(sh, b, fs));
    const used = geos.reduce((p, g, i) => p + g.fixed + g.nRows * cs * (pg.bands[i].scale || 1), 0) + (pg.bands.length - 1) * BAND_SEP;
    const avail = H - 52 - y;
    if (used > avail + 1) ATT.over = true;
    const rowsAll = geos.reduce((p, g) => p + g.nRows, 0);
    const spare = Math.min(30, Math.max(0, (avail - used) / Math.max(1, rowsAll))); // a little more room for the notes
    pg.bands.forEach((band, k) => {
      const g = geos[k], cs = pg.cs * (band.scale || 1);
      for (const it of band.items) {
        const a = it.a;
        s += playerHead(sh, a, it.x, y, it.w, ctx);
        if (it.headGen && !it.genBelow) { // text on the name line, wrapping under it if long
          const hx = it.x + headEnd(sh, a, it.w) + 14;
          s += genNote(genText(a), hx, y + 21, it.x + it.w - hx - (a.video ? 100 : 0), g.head - 8, col);
        }
        let ry = y + g.head;
        for (let r = 0; r < g.nRows; r++) {
          const rowH = CHIP_H + cs + g.noteH[r] + spare;
          (it.rows[r] || []).forEach((sl, c) => {
            const cx = it.x + c * (it.colW + GAP);
            if (sl.sit) { s += sitCourt(sh, a, sl.sit, cx, ry, cs, ctx); s += noteBox(sl.sit.note, cx, ry + cs + CHIP_H, it.colW, (it.genIn && it.genIn.r === r ? it.genIn.off : g.noteH[r] + spare), roleCol(sh, a)); }
            else if (sl.gen) { const gt = genText(a); if (gt) s += genNote(gt, cx + 4, ry + 30, it.colW - 4, rowH - 34, col); }
            else if (sl.same) s += T(cx, ry + 14, sl.empty.toUpperCase() + ' · come la spinta', { f: 'BT', b: true, s: 13, fill: C.muted });
            else if (sl.empty && ctx.screen) s += T(cx, ry + 14, sl.empty.toUpperCase() + ' · nessuna', { f: 'BT', b: true, s: 12, fill: C.faint });
          });
          if (it.genIn && it.genIn.r === r) s += genNote(genText(a), it.x, ry + CHIP_H + cs + it.genIn.off + fs + 2, it.w, g.noteH[r] + spare - it.genIn.off, col);
          ry += rowH;
        }
        if (it.genBelow && !it.genIn) s += genNote(genText(a), it.x, ry + 4 + fs, it.w, g.below, col);
      }
      const bh = g.fixed + g.nRows * (cs + spare);
      // players side by side (the middles): a vertical line between them; between bands the name band is enough
      for (let q = 1; q < band.items.length; q++) { const lx = (band.items[q - 1].x + band.items[q - 1].w + band.items[q].x) / 2; s += L(lx, y + 4, lx, y + bh - 4, { stroke: '#7A8794', sw: 2.2 }); }
      y += bh;
      if (k < pg.bands.length - 1) y += BAND_SEP;
    });
    return s;
  }

  /* ---------- page 3: servers ---------- */
  const SRV_X = { '1': 0.17, '9': 0.33, '6': 0.5, '7': 0.67, '5': 0.83 };
  const PRESS = [0.17, 0.26];
  const REC_DEF = [[0.2, 0.62], [0.5, 0.74], [0.8, 0.62]];
  // pressure dots: the coach's choice for this server wins over the scout
  function svPressure(st, sh, sv) {
    if (sv && ['1', '2', '3'].includes(String(sv.press || ''))) return { tier: +sv.press - 1, manual: true };
    return pressure(st, sh);
  }
  function pressure(st, sh) {
    if (!st || !st.inn) return null;
    const v = st.w / st.inn;
    let tier = v < PRESS[0] ? 0 : v < PRESS[1] ? 1 : 2;
    const aceP = st.n ? 100 * st.ace / st.n : 0;
    if (aceP >= rules(sh || {}).aceHigh) tier = 2;
    return { v, tier, ace: aceP };
  }
  // serve types of a server, most used first: ['SPIN'], ['FLOT'] or both when the second one is real (from 25% and 3 serves)
  function srvKinds(sh, sv) {
    if (sv.kind === 'spin') return ['SPIN'];
    if (sv.kind === 'flot') return ['FLOT'];
    const st = sh.stats?.serves?.[sv.num];
    if (!st) return sv.kind === 'both' ? ['SPIN', 'FLOT'] : (/spin/i.test(sv.type || '') ? ['SPIN'] : sv.type ? ['FLOT'] : []);
    const sp = st.type.Q || 0, fl = (st.type.M || 0) + (st.type.H || 0), tot = sp + fl;
    if (!tot) return [];
    const order = sp >= fl ? ['SPIN', 'FLOT'] : ['FLOT', 'SPIN'];
    const minor = Math.min(sp, fl);
    return sv.kind === 'both' || (minor >= 3 && minor / tot >= 0.25) ? order : [order[0]];
  }
  // where each serve type goes: set by hand per type (sv.tSpin / sv.tFlot), else the old hand-set zones for the main
  // type, else the scout; both types are drawn with their own sign (spin fan, flot arrows)
  const autoT = (ez, min) => { const en = Object.values(ez || {}).reduce((a, b) => a + b, 0); return en >= min ? Object.entries(ez).filter(([, v]) => v / en >= 0.18).map(([z]) => z) : []; };
  function serveTargets(sh, sv) {
    const st = sh.stats?.serves?.[sv.num];
    const kinds = srvKinds(sh, sv);
    const both = kinds.length > 1;
    const out = { kinds, SPIN: [], FLOT: [], manual: { SPIN: Array.isArray(sv.tSpin), FLOT: Array.isArray(sv.tFlot) } };
    const main = kinds[0] || (isSpin(sh, sv) ? 'SPIN' : 'FLOT');
    for (const k of both ? kinds : [main]) {
      const own = k === 'SPIN' ? sv.tSpin : sv.tFlot;
      let t = Array.isArray(own) ? own.map(String) : null;
      if (!t && k === main && (sv.targets || []).length) t = sv.targets.map(String);
      if (!t) t = both ? autoT(st?.ezT?.[k === 'SPIN' ? 'spin' : 'flot'], 3) : autoT(st?.ez, 5);
      out[k] = t.filter(z => ZONE_CR[z]);
    }
    return out;
  }
  // starting zones: the most used, plus a second one with at least a quarter of the serves (and 3 of them); by hand: sv.from
  function serveStarts(sh, sv) {
    const sz = sh.stats?.serves?.[sv.num]?.sz || {};
    if (sv.from) return String(sv.from).split('+').filter(z => SRV_X[z] != null);
    const e = Object.entries(sz).filter(([z]) => SRV_X[z] != null).sort((a, b) => b[1] - a[1]);
    const n = e.reduce((t, [, v]) => t + v, 0);
    if (!e.length) return ['1'];
    return e[1] && e[1][1] >= 3 && e[1][1] / n >= 0.25 ? [e[0][0], e[1][0]] : [e[0][0]];
  }
  function isSpin(sh, sv) {
    const st = sh.stats?.serves?.[sv.num];
    if (st) { const t = Object.entries(st.type).sort((a, b) => b[1] - a[1])[0]?.[0]; return t === 'Q'; }
    return /spin/i.test(sv.type || '');
  }
  function dots(x, y, tier) {
    let s = '';
    for (let i = 0; i < 3; i++) s += `<circle cx="${n2(x + i * 12)}" cy="${n2(y)}" r="4.3" fill="${i <= tier ? C.ink : C.white}" stroke="${C.ink}" stroke-width="1.2"/>`;
    return s;
  }
  function serveCourt(x, y, w, sv, st, sh, ctx) {
    let s = '';
    const band = 16;
    s += R(x, y, w, band, { fill: C.court2 });
    const cy = y + band + 4;
    s += R(x, cy, w, w, { fill: C.court });
    const cw = w / 3;
    for (let i = 1; i < 3; i++) {
      s += L(x + i * cw, cy, x + i * cw, cy + w, { stroke: C.white, sw: 1, dash: '3 3' });
      s += L(x, cy + i * cw, x + w, cy + i * cw, { stroke: C.white, sw: 1, dash: '3 3' });
    }
    s += L(x, cy + w / 3, x + w, cy + w / 3, { stroke: C.white, sw: 2.5 });
    s += L(x - 3, cy, x + w + 3, cy, { stroke: C.ink, sw: 3 });
    const tg = serveTargets(sh, sv), starts = serveStarts(sh, sv);
    const targets = [...new Set([...tg.SPIN, ...tg.FLOT])];
    const fy = y + band / 2;
    const pr = svPressure(st, sh, sv);
    const tier = pr ? pr.tier : 1;
    // with two starting zones and a scout that has enough serves from one of them, that one gets its own zones
    const perStart = (z, list, k) => {
      if (starts.length < 2 || tg.manual[k] || !st?.ezSz) return list;
      const ez = {}; for (const [key, v] of Object.entries(st.ezSz)) { const [a, b] = key.split('>'); if (a === z) ez[b] = (ez[b] || 0) + v; }
      const own = autoT(ez, 4);
      return own.length ? own.filter(t => list.includes(t)).length ? own : list : list;
    };
    const fan = (fx, tl, col) => {
      const xs = [], ys = [];
      for (const t of tl) { const [c, r] = ZONE_CR[t]; xs.push(x + c * cw, x + (c + 1) * cw); ys.push(cy + (r + 1) * cw); }
      return P([[fx, fy + 3], [Math.min(...xs) + 2, Math.max(...ys) - 2], [Math.max(...xs) - 2, Math.max(...ys) - 2]], { fill: col, stroke: C.white, sw: 1 });
    };
    const arrows = (fx, tl, col, k = 1) => tl.map(t => { const [c, r] = ZONE_CR[t]; return arrow(fx, fy + 3, x + c * cw + cw / 2, cy + r * cw + cw / 2, col, { straight: true, sw: [2, 3.6, 5.6][tier] * k, head: [8, 11, 14][tier] * (0.6 + 0.4 * k) }); }).join('');
    // spin = fan, flot = arrows, same colours also when he uses both; the fans go underneath
    const fanCol = mix(C.court, C.ink, [0.38, 0.6, 0.82][tier] - (starts.length > 1 ? 0.12 : 0));
    for (const z of starts) { const l = perStart(z, tg.SPIN, 'SPIN'); if (l.length) s += fan(x + SRV_X[z] * w, l, fanCol); }
    // the second starting zone (less used) in grey and thinner, under the main one
    starts.slice().reverse().forEach((z, i) => { const sec = starts.length > 1 && i === 0; const l = perStart(z, tg.FLOT, 'FLOT'); if (l.length) s += arrows(x + SRV_X[z] * w, l, sec ? '#7D8B98' : C.ink, sec ? 0.7 : 1); });
    if (sv.short) { const [px, py] = Array.isArray(sv.shortXY) ? sv.shortXY : [0.5, 0.15]; const sx = x + SRV_X[starts[0]] * w; s += tipArc(sx, fy + 3, x + px * w, cy + py * w, cy, w, Math.max(7, w * 0.055), x + px * w >= sx - 2 ? 0.22 : -0.22); }
    for (const z of starts) s += `<circle cx="${n2(x + SRV_X[z] * w)}" cy="${n2(fy)}" r="5.5" fill="${C.hi}" stroke="${C.ink}" stroke-width="1.5"/>`;
    // our receivers (figures, no role: draggable on screen)
    const rec = (sv.rec && sv.rec.length ? sv.rec : REC_DEF);
    const fsz = Math.max(14, w * 0.11);
    rec.forEach(([rx, ry], i) => {
      const f = figure(x + rx * w, cy + ry * w, fsz, C.white, C.ink);
      s += ctx.screen ? `<g class="hit rec" data-act="rec" data-id="${esc(sv.num)}" data-i="${i}">${f}</g>` : f;
    });
    if (ctx.screen) {
      for (let z = 1; z <= 9; z++) {
        const [c, r] = ZONE_CR[z];
        s += `<rect class="hit zone" data-act="szone" data-id="${esc(sv.num)}" data-z="${z}" x="${n2(x + c * cw)}" y="${n2(cy + r * cw)}" width="${n2(cw)}" height="${n2(cw)}" fill="transparent"/>`;
      }
      // receivers above the zones so they can be dragged
      rec.forEach(([rx, ry], i) => { s += `<circle class="hit rec" data-act="rec" data-id="${esc(sv.num)}" data-i="${i}" cx="${n2(x + rx * w)}" cy="${n2(cy + ry * w)}" r="${n2(fsz * 0.6)}" fill="transparent"/>`; });
      if (sv.short) { const [px, py] = Array.isArray(sv.shortXY) ? sv.shortXY : [0.5, 0.15]; s += `<circle class="hit tipd" data-act="sshort" data-id="${esc(sv.num)}" cx="${n2(x + px * w)}" cy="${n2(cy + py * w)}" r="${n2(Math.max(11, w * 0.08))}" fill="transparent"/>`; }
      if (!targets.length) s += T(x + w / 2, cy + w * 0.2, 'tocca le zone', { s: 10.5, fill: C.faint, a: 'middle' });
      ctx.courts['S' + sv.num] = { x, y: cy, w, h: w };
    }
    return { svg: s, h: band + 4 + w };
  }
  const SRV_TYPE = { Q: 'Salto spin', M: 'Salto flot', H: 'Flot', T: 'Tesa', O: 'Altro', N: 'Ibrida' };
  const PRESS_LAB = ['bassa', 'media', 'alta'];
  function page3(sh, ctx) {
    const col = sh.meta?.color || '#1F3A5F';
    const hd = header(sh, ctx, 'Battute');
    let s = hd.svg; let y0 = hd.y;
    ctx.footNote = `Pallini = pressione della battuta: 1 bassa, 2 media, 3 alta (alta anche con ace da ${rules(sh).aceHigh}%)  ·  freccia = flot, ventaglio = spin`;
    y0 -= 4;
    // fixed places as the lineup: top row setter, S1, C1; middle row opposite, S2, C2;
    // bottom row the others with the most serves (most on the left)
    const on = (sh.servers || []).filter(a => a.on);
    const sl = slotsOf(sh), bySlot = k => (sh.attackers || []).find(a => a.on && a.slot === k)?.num;
    const fixedNums = [sh.setter, sl.S1?.num, bySlot('C1'), sl.O?.num, sl.S2?.num, bySlot('C2')];
    let cells = fixedNums.map(n => (n && on.find(v => v.num === n)) || null);
    const nServ = v => sh.stats?.serves?.[v.num]?.n || 0;
    const rest = on.filter(v => !cells.includes(v)).sort((a, b) => nServ(b) - nServ(a));
    if (cells.every(c => !c)) cells = on.slice(0, 9); // no lineup known: as they come
    else cells = [...cells, ...rest.slice(0, 3)];
    const list = cells.filter(Boolean);
    if (!list.length) { s += T(M, y0 + 20, 'Nessun battitore selezionato.', { s: 15, fill: C.faint }); return s; }
    const g = 18, cw = (W - 2 * M - 2 * g) / 3;
    // other notes (rare): text only, they take room from the bottom row, never a new page
    const extra = (sh.serveNotes || '').trim(), xfs = 14, xlh = 19;
    const xLines = extra ? wrap(extra, 'B', true, xfs, W - 2 * M, 8) : [];
    const xH = xLines.length ? xLines.length * xlh + 14 : 0;
    const avail = H - 52 - y0, rowH0 = avail / 3;
    const hasRow3 = cells.slice(6).some(Boolean);
    const rowH = [rowH0, rowH0, hasRow3 ? rowH0 - xH : 0];
    const nfs = [15, 14, 13, 12.5].find(f => list.every(sv => wrap((sv.note || '').trim(), 'B', true, f, cw, 99).length <= 3)) || 12.5;
    const nlh = Math.round(nfs * 1.28);
    if (xLines.length) xLines.forEach((ln, j) => { s += txt(M, H - 52 - xH + 14 + xfs + j * xlh - 4, ln, { s: xfs }); });
    cells.forEach((sv, k) => {
      if (!sv) return;
      const r = Math.floor(k / 3), chh = rowH[r];
      const cx = M + (k % 3) * (cw + g), cy = y0 + rowH0 * r;
      const p = player(sh, sv.num);
      const st = sh.stats?.serves?.[sv.num];
      const pr = svPressure(st, sh, sv);
      const nm = `${p.num}-${p.surname.toUpperCase()}`;
      let tcode = '';
      if (st) tcode = Object.entries(st.type).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
      const typeLab = tcode === 'Q' ? 'SPIN' : (tcode === 'M' || tcode === 'H') ? 'FLOT' : (tcode ? (SRV_TYPE[tcode] || tcode).toUpperCase() : (isSpin(sh, sv) ? 'SPIN' : (sv.type ? 'FLOT' : '')));
      const rc = ROLE[p.roleCode]?.col || C.ink; // light band in the role colour, as on the attacker pages
      s += R(cx, cy, cw, 27, { fill: mix(rc, '#FFFFFF', 0.88), r: 4 });
      s += T(cx + 8, cy + 20.5, nm, { f: 'BT', b: true, s: fit(nm, 'BT', true, 20, cw - 16, 13) });
      let rx = cx;
      const kinds = srvKinds(sh, sv);
      const labs = kinds.length ? kinds : (typeLab ? [typeLab] : []);
      for (const lb of labs) { const c = chip(rx, cy + 30, lb, { s: 12.5, fill: SRV_COL[lb] || C.muted, h: 20, padX: 8 }); s += c.svg; rx += c.w + 6; }
      if (labs.length) rx += 4;
      if (pr) { s += dots(rx + 4, cy + 40, pr.tier); rx += 44; }
      if (sv.video) {
        const r = 10, vx = cx + cw - r, vy = cy + 40;
        let v = `<circle cx="${n2(vx)}" cy="${n2(vy)}" r="${r}" fill="${C.ink}"/>` + P([[vx - 3.5, vy - 5], [vx - 3.5, vy + 5], [vx + 5, vy]], { fill: C.hi });
        if (ctx.screen) v = `<a href="${esc(sv.video)}" target="_blank" rel="noopener">${v}</a>`;
        ctx.links.push({ x: vx - r, y: vy - r, w: 2 * r, h: 2 * r, url: sv.video });
        s += v;
      }
      const nLines = Math.max(...list.map(x => wrap((x.note || '').trim(), 'B', true, nfs, cw, 3).length), 1);
      const noteH = nLines * nlh;
      const cs = Math.min(cw, chh - 56 - 20 - noteH - 12);
      const court = serveCourt(cx + (cw - cs) / 2, cy + 56, cs, sv, st, sh, ctx);
      s += court.svg;
      const ty = cy + 56 + court.h + 8;
      const nx = cx;
      const nt = (sv.note || '').trim();
      if (nt) wrap(nt, 'B', true, nfs, cx + cw - nx, 3).forEach((ln, q) => { s += txt(nx, ty + nfs + q * nlh, ln, { s: nfs }); });
    });
    return s;
  }

  /* ---------- build: page 1, attackers (2 per page), servers ---------- */
  const FIT = { p1: null, att: {} }; // how the last build came out
  function build(sh, opts = {}) {
    FORM_DEF = opts.formDefaults || null;
    FIT.p1 = null; FIT.att = {};
    const ap = attPages(sh), np = Math.max(1, ap.length);
    const pages = [page1];
    for (let i = 0; i < np; i++) pages.push((s2, c) => page2(s2, c, i));
    pages.push(page3);
    // page of each attacker (1-based), for the links from the block calls
    const attPage = {};
    ap.forEach((p, i) => p.blocks.forEach(b => (b.pair || [b.a]).forEach(a => { if (a && !attPage[a.num]) attPage[a.num] = i + 2; })));
    const titles = ['Piano gara', ...Array.from({ length: np }, (_, i) => ap[i]?.res ? 'Attaccanti · riserve' : np > 1 ? `Attaccanti ${i + 1}` : 'Attaccanti'), 'Battute'];
    return pages.map((fn, i) => {
      const ctx = { screen: !!opts.screen, links: [], courts: {}, clip: i * 100, defaults: opts.defaults || null, attPage: opts.screen ? null : attPage, dirMode: sh.dirMode || 'auto' };
      const body0 = fn(sh, ctx);
      // touch areas at least 40 x 40 pt around small buttons (phones), the drawing does not change
      if (!opts.screen) ctx.links = ctx.links.map(l => {
        const w2 = Math.max(l.w, 40), h2 = Math.max(l.h, 40);
        const x2 = Math.max(0, Math.min(W - w2, l.x - (w2 - l.w) / 2)), y2 = Math.max(0, Math.min(H - h2, l.y - (h2 - l.h) / 2));
        return { ...l, x: x2, y: y2, w: w2, h: h2 };
      });
      const body = body0 + footer(sh, i + 1, pages.length, ctx.footNote);
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${R(0, 0, W, H, { fill: C.paper })}${body}</svg>`;
      return { svg, links: ctx.links, courts: ctx.courts, index: i, title: titles[i] };
    });
  }

  return { coneData, coneKind, originX, build, layoutOf, tipOn, defenceDemo, defence, DEMO_OX, bigCourt, sitSide, CALL_OPEN, baseKey, normCall, W, H, ROLE, ROTS, LANES, POS_XY, LANE_XY, player, rotationPlayers, SRV_TYPE, shortName, pressure, PRESS_LAB, DEF_RULES, phrases, phraseInfo, badNote, k7Cards, rotDist, callCandidates, customSits, showPct, srvKinds, serveTargets, serveStarts, fitInfo: () => FIT, attPages, isMid, normCall, sitStats, sitLabel, sitKey, REC_DEF };
})();
if (typeof module !== 'undefined') module.exports = SHEET;

