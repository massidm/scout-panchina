<script>
/* ---------- DataVolley .dvw parser + aggregation (pure, no DOM) ---------- */
const DVW = (() => {
  const SECTION = /^\[3([A-Z\-]+)\]\s*$/;

  function parse(text) {
    const lines = text.replace(/\r/g, '').split('\n');
    const sec = {};
    let cur = null;
    for (const l of lines) {
      const m = l.match(SECTION);
      if (m) { cur = m[1]; sec[cur] = []; continue; }
      if (cur && l.trim() !== '') sec[cur].push(l);
    }
    const teams = (sec.TEAMS || []).slice(0, 2).map(l => {
      const f = l.split(';');
      return { code: (f[0] || '').trim(), name: (f[1] || f[0] || '').trim() };
    });
    const parsePlayers = arr => (arr || []).map(l => {
      const f = l.split(';');
      return {
        num: String(parseInt(f[1], 10)),
        surname: (f[9] || '').trim(),
        name: (f[10] || '').trim(),
        libero: (f[12] || '').trim().toUpperCase() === 'L',
        roleCode: parseInt(f[13], 10) || 0,
        start: [f[3], f[4], f[5], f[6], f[7]].map(x => (x || '').trim())
      };
    }).filter(p => p.num !== 'NaN');
    const combos = {};
    for (const l of (sec.ATTACKCOMBINATION || [])) {
      const f = l.split(';');
      if (f[0]) combos[f[0].trim()] = { zone: f[1], tempo: f[3], desc: (f[4] || '').trim() };
    }
    const calls = {};
    for (const l of (sec.SETTERCALL || [])) {
      const f = l.split(';');
      if (f[0]) calls[f[0].trim()] = (f[2] || '').trim();
    }
    const date = ((sec.MATCH || [])[0] || '').split(';')[0] || '';
    // attack directions scouted as cones (C) or as landing zones (Z): field 11 of the match line
    const cones = ((((sec.MATCH || [])[0] || '').split(';')[10]) || '').trim().toUpperCase() === 'C';
    const rows = (sec.SCOUT || []).map(l => l.split(';'));
    // final score of each set played ("25-19"), and who made the scout
    const sets = (sec.SET || []).map(l => l.split(';')).filter(f => /true/i.test(f[0] || '') && (f[4] || '').trim()).map(f => f[4].replace(/\s/g, ''));
    const author = ((sec.DATAVOLLEYSCOUT || []).find(l => /^GENERATOR-NAM:/.test(l)) || '').replace(/^GENERATOR-NAM:\s*/, '').trim();
    return { teams, players: { '*': parsePlayers(sec['PLAYERS-H']), a: parsePlayers(sec['PLAYERS-V']) }, combos, calls, rows, date, cones, sets, author };
  }

  // Decode one scout code into fields (DataVolley 4 layout)
  function code(c) {
    if (!c || c.length < 4) return null;
    const team = c[0];
    if (team !== '*' && team !== 'a') return null;
    const num = c.slice(1, 3);
    if (!/^\d\d$/.test(num) && num !== '$$') return null;
    const skill = c[3];
    if (!'SREABDF'.includes(skill)) return null;
    return {
      team, num: num === '$$' ? null : String(parseInt(num, 10)), skill,
      type: c[4] || '', ev: c[5] || '',
      combo: (c.slice(6, 8) || '').replace(/~/g, ''),
      target: (c[8] && c[8] !== '~') ? c[8] : '',
      sz: (c[9] && /\d/.test(c[9])) ? c[9] : '',
      ez: (c[10] && /\d/.test(c[10])) ? c[10] : '',
      sub: (c[11] && /[A-D]/.test(c[11])) ? c[11] : '',
      hit: (c[12] && /[HPT]/.test(c[12])) ? c[12] : '',
      blk: (c[13] && /[0-4]/.test(c[13])) ? c[13] : ''
    };
  }

  // Which side ('*' home, 'a' visitor) a team name belongs to in a parsed file
  function sideOf(p, teamName) {
    const t = (teamName || '').trim().toLowerCase();
    if (!t) return null;
    const hit = i => {
      const n = (p.teams[i]?.name || '').toLowerCase(), c = (p.teams[i]?.code || '').toLowerCase();
      return n === t || c === t || n.includes(t) || t.includes(n) || (c && t.includes(c));
    };
    if (hit(0) && !hit(1)) return '*';
    if (hit(1) && !hit(0)) return 'a';
    return null;
  }

  // Guess the common opponent across several files
  function commonTeam(parsed) {
    if (parsed.length < 2) return null;
    const names = parsed.map(p => p.teams.map(t => t.name.toLowerCase()));
    for (const n of names[0]) if (names.every(arr => arr.includes(n))) return parsed[0].teams.find(t => t.name.toLowerCase() === n).name;
    return null;
  }

  function attackSituation(c, combos, roleCode) {
    const t = c.type;
    const comboDesc = (combos[c.combo]?.desc || '').toLowerCase();
    if (t === 'Q' || t === 'N' || (roleCode === 4 && c.sz === '3')) {
      let g = 'UNO';
      if (/sette|\b7\b|^7|gun/.test(comboDesc) || c.combo === 'X7' || c.combo === 'XG') g = 'SETTE';
      else if (/dietro|\b2\b|fast|slide/.test(comboDesc) || c.combo === 'X2' || c.combo === 'XS') g = 'DIETRO';
      return 'Q:' + g;
    }
    const zg = ({ '4': '4', '3': '3', '2': '2' })[c.sz] || (c.sz ? 'BR' : '?');
    if (zg === 'BR') return 'BR:' + (t === 'H' ? 'H' : 'T');
    return zg + ':' + (t === 'H' ? 'H' : 'T');
  }

  const SIT_LABEL = {
    '4:T': 'Spinta in 4', '4:H': 'Alta in 4', '2:T': 'Spinta in 2', '2:H': 'Alta in 2',
    '3:T': 'Centro', '3:H': 'Alta al centro', 'BR': 'Seconda linea', 'BR:T': 'Seconda linea spinta', 'BR:H': 'Seconda linea alta', '?:T': 'Altro', '?:H': 'Alta',
    'Q:UNO': 'Uno', 'Q:SETTE': 'Sette', 'Q:DIETRO': 'Dietro'
  };
  const SIT_ORDER = ['4:T', '4:H', '2:T', '2:H', 'BR:T', 'BR:H', 'Q:UNO', 'Q:SETTE', 'Q:DIETRO', '3:T', '3:H', '?:T', '?:H'];

  /**
   * Aggregate opponent data across files.
   * files: [{p: parsed, side: '*'|'a', label}]
   */
  function aggregate(files) {
    const S = {
      matches: [], roster: {}, setterCount: {},
      bySetter: {},
      attacks: {}, serves: {}, totals: { sets: 0, setsCalled: 0, attacks: 0, serves: 0, attEnd: 0, srvEnd: 0 }
    };
    const inc = (o, k, n = 1) => { o[k] = (o[k] || 0) + n; };
    const deep = (o, k) => (o[k] = o[k] || {});
    const ST = n => S.bySetter[n] || (S.bySetter[n] = { sets: 0, setsCalled: 0, setsRec: 0, dist: {}, distAll: {}, distRec: {}, distBad: {}, distCall: {}, rotCalls: {}, calls: {}, lineups: {}, lanes: {}, presence: {}, frontP1: {}, entry: { n: 0, sets: 0, tgt: {}, combo: {} } });

    // calls of the setter: from the corrected files only, when there are some (the league files are not corrected)
    const anyCorr = files.some(f => f.corr);
    S.starts = [];
    for (const { p, side, label, w: w0, corr } of files) {
      const w = w0 || 1, callsOK = !anyCorr || !!corr;
      const opp = side === '*' ? 1 : 0;
      S.matches.push({ label, opponentOf: p.teams[opp]?.name || '', date: p.date });
      for (const pl of p.players[side]) {
        const r = S.roster[pl.num] || (S.roster[pl.num] = { num: pl.num, surname: pl.surname, name: pl.name, roleCode: pl.roleCode, libero: pl.libero, att: 0, srv: 0, sets: 0 });
        if (!r.roleCode && pl.roleCode) r.roleCode = pl.roleCode;
        r.libero = r.libero || pl.libero;
      }
      const roleOf = n => S.roster[n]?.roleCode || 0;
      const spIdx = side === '*' ? 9 : 10;
      const posBase = side === '*' ? 14 : 20;

      // setter entering mid-set: track his first sets
      let curSet = null, lastSetter = null, entering = null;
      // score before the rally, for the phase of the set (up to 8 / 8-15 / from 16; tie-break scaled to 15)
      let curScore = [0, 0], scoreSet = null;
      const phOf = () => { const m = Math.max(curScore[0], curScore[1]) * 25 / (+scoreSet >= 5 ? 15 : 25); return m < 8 ? '1' : m < 16 ? '2' : '3'; };
      const PHS = st => { const ph = st.ph || (st.ph = {}); const k = phOf(); return ph[k] || (ph[k] = { dist: {}, distAll: {}, distRec: {}, distCall: {} }); };
      // walk rallies
      let rally = [];
      const flush = () => {
        let rec = false, firstAttackDone = false, lastSet = null, recGood = false, recBad = false, firstSet = false, afterFree = false;
        for (const { c, row } of rally) {
          if (c.team !== side) continue;
          const P = 'P' + (row[spIdx] || '').trim();
          if (c.skill === 'R') { rec = true; firstAttackDone = false; recGood = c.ev === '#' || c.ev === '+'; recBad = c.ev === '!' || c.ev === '-'; firstSet = true; continue; }
          if (c.skill === 'F') { afterFree = true; continue; }
          if (c.skill === 'D') { afterFree = false; }
          if (c.skill === 'E') {
            if (afterFree && c.num) { const st0 = ST(c.num); st0.fbN = (st0.fbN || 0) + 1; inc(st0.fbDist || (st0.fbDist = {}), c.target || '-'); }
            afterFree = false;
            lastSet = { c, P, so: rec && !firstAttackDone };
            if (firstSet && recGood && c.num) { const st = ST(c.num); st.setsRec++; inc(deep(st.distRec, P), c.target || '-'); inc(deep(PHS(st).distRec, P), c.target || '-'); }
            if (firstSet && recBad && c.num && c.target) inc(deep(ST(c.num).distBad, P), c.target);
            // distribution by call: only the first ball after OUR reception (calls coded on free balls or digs are left out)
            if (callsOK && firstSet && c.num && c.combo && c.combo[0] === 'K' && c.combo !== 'KE') {
              const st = ST(c.num), tgt = c.target || '-';
              inc(deep(st.dist, P), tgt);
              inc(deep(st.rotCalls, P), c.combo);
              inc(deep(deep(st.distCall, P), c.combo), tgt);
              const ps = PHS(st); inc(deep(ps.dist, P), tgt); inc(deep(deep(ps.distCall, P), c.combo), tgt);
            }
            firstSet = false;
            continue;
          }
          if (c.skill === 'A') {
            const so = rec && !firstAttackDone;
            firstAttackDone = true;
            if (so && c.num && c.sz) {
              const lane = ({ '4': '4', '3': '3', '2': '2', '8': 'P', '9': '1', '1': '1', '7': '5', '5': '5', '6': 'P' })[c.sz];
              const pn = parseInt(P.slice(1), 10);
              const sOn = pn >= 1 && pn <= 6 ? String(parseInt(row[posBase + pn - 1], 10)) : '';
              if (lane && sOn && sOn !== 'NaN') inc(deep(deep(ST(sOn).lanes, P), c.num), lane);
            }
          }
        }
      };

      let startSet = null;
      for (const row of p.rows) {
        const raw = row[0] || '';
        if (/^[*a]p\d/.test(raw)) { flush(); rally = []; const m = raw.match(/^[*a]p(\d+):(\d+)/); if (m) curScore = [+m[1], +m[2]]; continue; }
        const c = code(raw);
        if (!c) continue;
        if (row[8] && row[8] !== scoreSet) { scoreSet = row[8]; curScore = [0, 0]; }
        // lineup at the start of each set: rotation (setter position), the six on court, whether they served first
        if (row[8] && row[8] !== startSet) {
          const P0 = parseInt(row[spIdx], 10), lu0 = []; for (let i = 0; i < 6; i++) lu0.push(String(parseInt(row[posBase + i], 10)));
          if (P0 >= 1 && P0 <= 6 && lu0.every(x => x !== 'NaN')) { startSet = row[8]; S.starts.push({ date: p.date, label, w, set: row[8], P: 'P' + P0, lu: lu0, setter: lu0[P0 - 1], served: c.skill === 'S' ? c.team === side : null }); }
        }
        rally.push({ c, row });
        if (c.team !== side) continue;
        const P = 'P' + (row[spIdx] || '').trim();
        // lineup per rotation (most frequent)
        if (/^P[1-6]$/.test(P)) {
          const lu = [];
          for (let i = 0; i < 6; i++) lu.push(String(parseInt(row[posBase + i], 10)));
          const sOn = lu[parseInt(P.slice(1), 10) - 1];
          if (lu.every(x => x !== 'NaN')) {
            const st0 = ST(sOn);
            inc(deep(st0.lineups, P), lu.join(','), w);
            for (const n of lu) inc(st0.presence, n, w);
            if (P === 'P1') for (const i of [1, 2, 3]) inc(st0.frontP1, lu[i], w);
            const si = lu.indexOf(sOn);
            if (si >= 0) inc(st0.oppOf || (st0.oppOf = {}), lu[(si + 3) % 6], w);
          }
        }
        if (c.skill === 'E' && c.num) {
          const sN = row[8];
          if (sN !== curSet) { curSet = sN; lastSetter = null; entering = null; }
          if (lastSetter && lastSetter !== c.num && roleOf(c.num) === 5) { entering = { num: c.num, left: 3 }; ST(c.num).entry.n++; }
          if (roleOf(c.num) === 5) lastSetter = c.num;
          if (entering && entering.num === c.num && entering.left > 0) {
            entering.left--; const en = ST(c.num).entry; en.sets++;
            if (c.target) inc(en.tgt, c.target);
            if (c.combo && c.combo[0] === 'K') inc(en.combo, c.combo);
          }
          inc(S.setterCount, c.num);
          S.totals.sets++;
          const tgt = c.target || '-';
          const st = ST(c.num); st.sets++;
          inc(deep(st.distAll, P), tgt); inc(deep(PHS(st).distAll, P), tgt);
          if (callsOK && c.combo && c.combo[0] === 'K' && c.combo !== 'KE') {
            S.totals.setsCalled++; st.setsCalled++;
            inc(deep(st.calls, c.combo), tgt);
          }
          if (callsOK && c.combo === 'KE') inc(deep(st.calls, 'KE'), tgt);
        }
        if (c.skill === 'A' && c.num) {
          S.totals.attacks++;
          const key = attackSituation(c, p.combos, roleOf(c.num));
          const a = deep(S.attacks, c.num);
          const s = a[key] || (a[key] = { n: 0, kill: 0, err: 0, ez: {}, sz: {}, hitN: 0, tip: 0 });
          s.n++;
          if (c.hit) { s.hitN = (s.hitN || 0) + 1; if (c.hit === 'T') s.tip = (s.tip || 0) + 1; }
          if (c.ev === '#') s.kill++;
          if (c.ev === '=' || c.ev === '/') s.err++;
          if (c.sz) inc(s.sz, c.sz);
          if (c.ez) { if (p.cones) inc(s.ec || (s.ec = {}), c.ez); else inc(s.ez, c.ez); S.totals.attEnd++; } // cones and zones kept apart
          if (S.roster[c.num]) S.roster[c.num].att++;
        }
        if (c.skill === 'S' && c.num) {
          S.totals.serves++;
          const s = S.serves[c.num] || (S.serves[c.num] = { n: 0, ace: 0, err: 0, type: {}, sz: {}, ez: {}, ezT: { spin: {}, flot: {} }, w: 0, inn: 0 });
          s.n++;
          if (SRV_W[c.ev] != null) { s.w += SRV_W[c.ev]; s.inn++; }
          if (c.ev === '#') s.ace++;
          if (c.ev === '=') s.err++;
          inc(s.type, c.type || '?');
          if (c.sz) inc(s.sz, c.sz);
          if (c.ez && c.sz) inc(s.ezSz || (s.ezSz = {}), c.sz + '>' + c.ez);
          if (c.ez) { inc(s.ez, c.ez); S.totals.srvEnd++; const k = c.type === 'Q' ? 'spin' : (c.type === 'M' || c.type === 'H') ? 'flot' : null; if (k) inc(s.ezT[k], c.ez); }
          if (S.roster[c.num]) S.roster[c.num].srv++;
        }
      }
      flush();
    }
    // roster without roles (it happens for the team the scout does not follow): guess them from what each player does
    for (const r of Object.values(S.roster)) {
      if (r.roleCode || r.libero) { if (r.libero && !r.roleCode) r.roleCode = 1; continue; }
      const sets = S.setterCount[r.num] || 0;
      const att = S.attacks[r.num] || {};
      const nAtt = Object.values(att).reduce((p, v) => p + v.n, 0);
      const nQ = Object.entries(att).filter(([k]) => k.startsWith('Q:')).reduce((p, [, v]) => p + v.n, 0);
      if (sets >= 10 && sets > nAtt) r.roleCode = 5;
      else if (nAtt && nQ / nAtt >= 0.5) r.roleCode = 4;
      else if (nAtt) r.roleCode = 2;
      if (r.roleCode) r.roleGuess = true;
    }
    // setters ranked by number of sets; reduce lineups to the most frequent per rotation
    S.setters = Object.entries(S.setterCount).sort((a, b) => b[1] - a[1]).map(([n]) => n).filter(n => (S.bySetter[n]?.sets || 0) >= 10);
    S.setter = S.setters[0] || Object.keys(S.setterCount)[0] || '';
    const ws = {}; for (const x of S.starts) ws[x.setter] = (ws[x.setter] || 0) + x.w;
    const ss = Object.entries(ws).sort((a, b) => b[1] - a[1])[0]?.[0];
    if (ss && S.setters.includes(ss)) S.setter = ss;
    S.calledFrom = anyCorr ? 'corr' : 'all';
    for (const st of Object.values(S.bySetter)) {
      const lu = {};
      for (const [P, m] of Object.entries(st.lineups)) lu[P] = Object.entries(m).sort((a, b) => b[1] - a[1])[0][0].split(',');
      st.lineups = lu;
    }
    S.analysis = analyze(files, n => S.roster[n]?.roleCode || 0, anyCorr);
    return S;
  }

  // serve "pressione": quality of the serves that went in (errors excluded)
  const SRV_W = { '#': 1, '/': 0.75, '+': 0.5, '!': 0.25, '-': 0 };

  /* Rally-level analyses for the opponent side: sequences, score context, reception */
  function analyze(files, roleOf, anyCorr = false) {
    const inc = (o, k, n = 1) => { o[k] = (o[k] || 0) + n; };
    const deep = (o, k) => (o[k] = o[k] || {});
    const A = {
      rep: { afterKill: { n: 0, same: 0 }, afterCont: { n: 0, same: 0 }, afterErr: { n: 0, same: 0 } },
      repBy: {},
      recDist: { good: {}, bad: {} },
      firstAtt: {}, laterAtt: {}, allAtt: {}, clutch: {}, rest: {},
      rec: {}, recRot: {}, recPos: {}, so: {},
      srvAfterErr: { n: 0, typeChange: 0, errAgain: 0 }, srvBase: { n: 0, err: 0 },
      dump: { n: 0, byP: {} }, rallies: 0, clutchRallies: 0,
      // setter on a pass from zone 1; hitter efficiency on the first attack after his own pass
      recZ1: { good: {}, bad: {}, goodCall: {} }, recGoodCall: {}, eff: {}, ownRec: {}, othRec: {},
      // per setter: repetition on the same hitter (A same rally, B after his error or block, C after his point),
      // balls in position by phase of the set, and by zone of the pass
      rep2: {}, phaseBy: {}, recZBy: {}
    };
    for (const { p, side, corr } of files) {
      const callsOK = !anyCorr || !!corr;
      const spIdx = side === '*' ? 9 : 10;
      let rally = [], set = null, score = [0, 0];
      const attSeq = [], srvSeq = {};
      let pend = null; // the last set of the previous rally, waiting for the first set of this one
      const repRec = (k, setter, from, to) => {
        const R = A.rep2[setter] || (A.rep2[setter] = { tot: {}, by: {} });
        const t = R.tot[k] || (R.tot[k] = { n: 0, same: 0 }), b = deep(R.by, from); const bb = b[k] || (b[k] = { n: 0, same: 0 });
        t.n++; bb.n++; if (from === to) { t.same++; bb.same++; }
      };
      const flush = (winner, after) => {
        if (!rally.length) { if (after) score = after; return; }
        A.rallies++;
        const first = rally[0].row;
        const P = 'P' + String(first[spIdx] || '').trim();
        const setN = parseInt(first[8], 10) || 1;
        // our sets, each with the attack that follows it (dumps and replayed balls, combination PR, left out)
        const pairs = []; { let last = null; for (const { c } of rally) { if (c.team !== side) continue; if (c.skill === 'E' && c.num) last = c; else if (c.skill === 'A' && c.num && last) { pairs.push({ s: last.num, a: c.num, ev: c.ev, pr: c.combo === 'PR' }); last = null; } } }
        if (pend && pend.setN === setN && pairs[0] && !pairs[0].pr && pairs[0].s === pend.s) repRec(pend.k, pend.s, pend.a, pairs[0].a);
        pend = null;
        pairs.forEach((x, j) => {
          if (x.pr) return;
          if (x.ev === '#') { pend = { k: 'C', s: x.s, a: x.a, setN }; return; }
          if (x.ev === '=' || x.ev === '/') { pend = { k: 'B', s: x.s, a: x.a, setN }; return; }
          const y = pairs[j + 1];
          if (y) { if (!y.pr && y.s === x.s) repRec('A', x.s, x.a, y.a); } else pend = { k: 'A', s: x.s, a: x.a, setN };
        });
        const lim = setN >= 5 ? 10 : 20;
        const clutch = Math.max(score[0], score[1]) >= lim && Math.abs(score[0] - score[1]) <= 3;
        if (clutch) A.clutchRallies++;
        const srv = rally.find(x => x.c.skill === 'S');
        const receiving = srv && srv.c.team !== side;
        if (receiving && /^P[1-6]$/.test(P)) { const so = deep(A.so, P); inc(so, 'n'); if (winner === side) inc(so, 'won'); }
        let recQ = null, firstSetDone = false, attIdx = 0, recNum = null, recZ = '';
        for (const { c, row } of rally) {
          if (c.team !== side) continue;
          if (c.skill === 'R' && c.num) {
            const r = deep(A.rec, c.num); inc(r, 'n');
            if (c.ev === '#' || c.ev === '+') inc(r, 'pos');
            else if (c.ev === '=') inc(r, 'err');
            else if (c.ev === '-' || c.ev === '/') inc(r, 'neg');
            if (/^P[1-6]$/.test(P)) inc(deep(A.recRot, P), c.num);
            // where he passes: zone of the pass, as x (our left = their zone 1 side) and depth (0 = their end line, 1 = net)
            const ZP = { 1: [0.17, 0.17], 6: [0.5, 0.17], 5: [0.83, 0.17], 9: [0.17, 0.5], 8: [0.5, 0.5], 7: [0.83, 0.5], 2: [0.17, 0.83], 3: [0.5, 0.83], 4: [0.83, 0.83] };
            if (/^P[1-6]$/.test(P) && ZP[c.ez]) { const q = deep(deep(A.recPos, P), c.num); q.n = (q.n || 0) + 1; q.x = (q.x || 0) + ZP[c.ez][0]; q.y = (q.y || 0) + ZP[c.ez][1]; }
            recQ = (c.ev === '#' || c.ev === '+') ? 'good' : (c.ev === '=' ? null : 'bad');
            recNum = c.num; recZ = c.ez || '';
          }
          if (c.skill === 'E' && recQ && !firstSetDone) {
            firstSetDone = true;
            if (c.target) inc(A.recDist[recQ], c.target);
            const call = callsOK && c.combo && c.combo[0] === 'K' ? c.combo : '';
            if (recQ === 'good' && call) inc(A.recGoodCall, call);
            if (recZ === '1') { if (c.target) inc(A.recZ1[recQ], c.target); if (recQ === 'good' && call) inc(A.recZ1.goodCall, call); }
            // balls in position (calls of the middle) by phase of the set and by zone of the pass
            const corr = { 1: '1', 9: '1', 5: '5', 7: '5' }[recZ];
            if (c.num && c.target && recQ === 'good' && corr) inc(deep(deep(A.recZBy, c.num), corr), c.target);
          }
          if (c.skill === 'A' && c.num) {
            attIdx++;
            inc(A.allAtt, c.num);
            const ef = o => { inc(o, 'n'); if (c.ev === '#') inc(o, 'k'); if (c.ev === '=' || c.ev === '/') inc(o, 'e'); };
            ef(deep(A.eff, c.num));
            if (receiving && attIdx === 1 && recNum) ef(deep(c.num === recNum ? A.ownRec : A.othRec, c.num));
            if (receiving && attIdx === 1) inc(A.firstAtt, c.num);
            if (attIdx >= 3) inc(A.laterAtt, c.num);
            inc(clutch ? A.clutch : A.rest, c.num);
            attSeq.push({ num: c.num, ev: c.ev });
            if (roleOf(c.num) === 5 || c.combo === 'PP') { A.dump.n++; if (/^P[1-6]$/.test(P)) inc(A.dump.byP, P); }
          }
          if (c.skill === 'S' && c.num) (srvSeq[c.num] = srvSeq[c.num] || []).push({ type: c.type, ev: c.ev });
        }
        if (after) score = after;
      };
      for (const row of p.rows) {
        const raw = row[0] || '';
        const pm = raw.match(/^([*a])p(\d+):(\d+)/);
        if (pm) { flush(pm[1], [parseInt(pm[2], 10), parseInt(pm[3], 10)]); rally = []; continue; }
        const c = code(raw);
        if (!c) continue;
        const sN = row[8];
        if (sN && sN !== set) { if (set !== null) score = [0, 0]; set = sN; }
        rally.push({ c, row });
      }
      // setter: same attacker again after the previous attack?
      for (let i = 0; i < attSeq.length - 1; i++) {
        const a = attSeq[i], b = attSeq[i + 1];
        const k = a.ev === '#' ? 'afterKill' : (a.ev === '=' || a.ev === '/') ? 'afterErr' : 'afterCont';
        A.rep[k].n++; if (a.num === b.num) A.rep[k].same++;
        const pb = deep(A.repBy, a.num);
        const pk = a.ev === '#' ? 'kill' : 'nokill';
        inc(pb, pk + 'N'); if (a.num === b.num) inc(pb, pk + 'Same');
      }
      // server after his own error
      for (const seq of Object.values(srvSeq)) {
        for (let i = 0; i < seq.length; i++) {
          A.srvBase.n++; if (seq[i].ev === '=') A.srvBase.err++;
          if (seq[i].ev === '=' && seq[i + 1]) {
            A.srvAfterErr.n++;
            if (seq[i + 1].type !== seq[i].type) A.srvAfterErr.typeChange++;
            if (seq[i + 1].ev === '=') A.srvAfterErr.errAgain++;
          }
        }
      }
    }
    return A;
  }

  /* One team in one match, for the league table: side-out and break point, attack by phase, serve, pass, block,
     and the lineup at the start of each set. Attack efficiency as DataVolley: (points - errors - blocked) / attacks. */
  function teamStats(p, side) {
    const T = { so: { n: 0, won: 0, pts: 0 }, bp: { n: 0, won: 0, pts: 0 }, att: { all: {}, good: {}, bad: {}, tr: {} }, srv: { n: 0, ace: 0, err: 0 },
      rec: { n: 0, pos: 0, perf: 0, err: 0 }, blk: 0, sets: p.sets?.length || 0, starts: [],
      // for the standard questions (and the girone baseline): pass by serve type and zone, team and per player;
      // their attacks by situation (blocked); the attacks against them (their block) by their rotation;
      // side-out and break point after a time-out and from 20 on; serve per player
      recCell: {}, recP: {}, attSit: {}, against: { all: {}, byP: {}, byZ: {} }, attP: {}, attRot: {}, blkP: {}, frontN: {}, soRot: {}, bpRot: {}, phase: { so: { base: {}, to: {}, toBase: {}, late: {} }, bp: { base: {}, to: {}, toBase: {}, late: {} } }, srvP: {} };
    const roleOf = {}; for (const pl of p.players?.[side] || []) roleOf[pl.num] = pl.roleCode;
    const recZone = z => ({ 1: 'Z1', 9: 'Z1', 6: 'Z6', 8: 'Z6', 5: 'Z5', 7: 'Z5', 2: 'corta', 3: 'corta', 4: 'corta' })[z] || '';
    const recCnt = (o, ev) => { o.n = (o.n || 0) + 1; if (ev === '#' || ev === '+') o.g = (o.g || 0) + 1; if (ev === '=' || ev === '/') o.b = (o.b || 0) + 1; };
    let score = [0, 0], afterTO = false;
    const hasTO = p.rows.some(r => /^[*a]T/.test(r[0] || '')); // some scouts do not code the time-outs
    const ae = (o, ev) => { o.n = (o.n || 0) + 1; if (ev === '#') o.k = (o.k || 0) + 1; else if (ev === '=') o.e = (o.e || 0) + 1; else if (ev === '/') o.b = (o.b || 0) + 1; };
    const spIdx = side === '*' ? 9 : 10, posBase = side === '*' ? 14 : 20;
    let rally = [], startSet = null;
    const flush = winner => {
      const srv = rally.find(c => c.skill === 'S');
      if (srv && winner) {
        const lim = T.sets && score[0] + score[1] >= 0 && Math.max(score[0], score[1]) >= (setNo >= 5 ? 10 : 20) ? 'late' : null;
        const ph = T.phase[srv.team === side ? 'bp' : 'so'];
        for (const k of ['base', afterTO ? 'to' : null, hasTO ? 'toBase' : null, lim].filter(Boolean)) { ph[k].n = (ph[k].n || 0) + 1; if (winner === side) ph[k].won = (ph[k].won || 0) + 1; }
        const o = srv.team === side ? T.bp : T.so; o.n++;
        if (rallyP) { const r = (srv.team === side ? T.bpRot : T.soRot), x = r[rallyP] || (r[rallyP] = { n: 0, won: 0 }); x.n++; if (winner === side) x.won++; }
        if (winner === side) { o.won++; const last = [...rally].reverse().find(c => c.team === side && 'SAB'.includes(c.skill)); if (last && last.ev === '#') o.pts++; } // own points only (DataVolley), no opponent errors
      }
      let recQ = null, first = true;
      for (const c of rally) {
        if (c.team !== side) {
          // the attacks of the other team: how their block (and defence) holds, by their rotation and the attack zone
          if (c.skill === 'A') { ae(T.against.all, c.ev); if (c.P) ae(T.against.byP[c.P] || (T.against.byP[c.P] = {}), c.ev); const z = ({ 4: '4', 3: '3', 2: '2' })[c.sz] || (c.sz ? 'BR' : ''); if (z) ae(T.against.byZ[z] || (T.against.byZ[z] = {}), c.ev); }
          continue;
        }
        if (c.skill === 'R') { recQ = (c.ev === '#' || c.ev === '+') ? 'good' : c.ev === '=' ? null : 'bad'; continue; }
        if (c.skill === 'A') {
          ae(T.att.all, c.ev); ae(recQ && first ? T.att[recQ] : T.att.tr, c.ev); first = false;
          const sit = attackSituation(c, p.combos || {}, roleOf[c.num] || 0);
          ae(T.attSit[sit] || (T.attSit[sit] = {}), c.ev);
          if (c.num) { ae(T.attP[c.num] || (T.attP[c.num] = {}), c.ev); if (c.Pown) { const r = T.attRot[c.Pown] || (T.attRot[c.Pown] = {}); ae(r[c.num] || (r[c.num] = {}), c.ev); } }
        }
      }
      afterTO = false; frontDone = false; rallyP = null;
    };
    let frontDone = false, rallyP = null;
    let setNo = 1, lastSum = 0;
    for (const row of p.rows) {
      const raw = row[0] || '';
      const pm = raw.match(/^([*a])p(\d+):(\d+)/);
      if (pm) { flush(pm[1]); rally = []; const h = +pm[2], a = +pm[3]; if (h + a < lastSum) setNo++; lastSum = h + a; score = side === '*' ? [h, a] : [a, h]; continue; }
      if (/^[*a]T/.test(raw)) { afterTO = true; continue; }
      if (/^\*\*\d+set/.test(raw)) { score = [0, 0]; lastSum = 0; setNo = +raw.match(/^\*\*(\d+)/)[1] + 1; continue; }
      const c = code(raw);
      if (!c) continue;
      { const op = parseInt(row[spIdx], 10); if (op >= 1 && op <= 6) { if (c.team !== side) c.P = 'P' + op; else c.Pown = 'P' + op; } }
      if (!frontDone) { frontDone = true; { const op = parseInt(row[spIdx], 10); rallyP = op >= 1 && op <= 6 ? 'P' + op : null; } for (const i of [1, 2, 3]) { const n = String(parseInt(row[posBase + i], 10)); if (n !== 'NaN') T.frontN[n] = (T.frontN[n] || 0) + 1; } }
      if (row[8] && row[8] !== startSet) {
        const P0 = parseInt(row[spIdx], 10), lu = []; for (let i = 0; i < 6; i++) lu.push(String(parseInt(row[posBase + i], 10)));
        if (P0 >= 1 && P0 <= 6 && lu.every(x => x !== 'NaN')) { startSet = row[8]; T.starts.push({ set: row[8], P: 'P' + P0, lu, setter: lu[P0 - 1], served: c.skill === 'S' ? c.team === side : null }); }
      }
      rally.push(c);
      if (c.team !== side) continue;
      if (c.skill === 'S') {
        T.srv.n++; if (c.ev === '#') T.srv.ace++; if (c.ev === '=') T.srv.err++;
        const sp = T.srvP[c.num] || (T.srvP[c.num] = { n: 0, ace: 0, err: 0, spin: 0, w: 0, inn: 0 }); sp.n++; if (c.ev === '#') sp.ace++; if (c.ev === '=') sp.err++; if (c.type === 'Q') sp.spin++;
        if (SRV_W[c.ev] != null) { sp.w += SRV_W[c.ev]; sp.inn++; }
        const sz = recZone(c.ez); if (sz) { sp.z = sp.z || {}; sp.z[sz] = (sp.z[sz] || 0) + 1; }
      }
      if (c.skill === 'R') {
        T.rec.n++; if (c.ev === '#' || c.ev === '+') T.rec.pos++; if (c.ev === '#') T.rec.perf++; if (c.ev === '=') T.rec.err++;
        const z = recZone(c.ez), ty = c.type === 'Q' ? 'spin' : 'float';
        for (const k of [ty + '|tot', z ? ty + '|' + z : null].filter(Boolean)) {
          recCnt(T.recCell[k] || (T.recCell[k] = {}), c.ev);
          if (c.num) { const pp = T.recP[c.num] || (T.recP[c.num] = {}); recCnt(pp[k] || (pp[k] = {}), c.ev); }
        }
      }
      if (c.skill === 'B' && c.ev === '#') { T.blk++; if (c.num) T.blkP[c.num] = (T.blkP[c.num] || 0) + 1; }
    }
    return T;
  }
  // how complete a scout is, both teams together: attack landing points, calls on the sets, pass zones, sets coded
  function fileQuality(p) {
    const n = { A: 0, Aez: 0, E: 0, K: 0, R: 0, Rez: 0, Rpos: 0 };
    for (const row of p.rows) {
      const c = code(row[0] || '');
      if (!c || !c.num) continue;
      if (c.skill === 'A') { n.A++; if (c.ez) n.Aez++; }
      if (c.skill === 'E') { n.E++; if (c.combo && c.combo[0] === 'K') n.K++; }
      if (c.skill === 'R') { n.R++; if (c.ez) n.Rez++; if (c.ev === '#' || c.ev === '+') n.Rpos++; }
    }
    const r = (a, b) => b ? a / b : 0;
    const q = Math.round(40 * r(n.Aez, n.A) + 30 * r(n.K, n.E) + 20 * r(n.Rez, n.R) + 10 * Math.min(1, r(n.E, n.A * 0.9)));
    return { q, aez: Math.round(100 * r(n.Aez, n.A)), calls: Math.round(100 * r(n.K, n.E)), rez: Math.round(100 * r(n.Rez, n.R)), sets: Math.round(100 * Math.min(1, r(n.E, n.A))), recPos: Math.round(100 * r(n.Rpos, n.R)), n };
  }

  // which situation a DataVolley combination code belongs to (for video file names like "A01 X5")
  const COMBO_DEF = { X5: ['4', 'T'], V5: ['4', 'H'], X6: ['2', 'T'], V6: ['2', 'H'], X8: ['9', 'T'], V8: ['9', 'H'], X0: ['7', 'T'], V0: ['7', 'H'],
    XP: ['8', 'M'], VP: ['8', 'H'], XB: ['8', 'M'], XR: ['8', 'M'], X1: ['3', 'Q'], XM: ['3', 'Q'], X7: ['4', 'Q', 'sette'], X2: ['2', 'Q', 'dietro'], XS: ['2', 'Q', 'sette dietro'] };
  function comboKey(code, combos, roleCode) {
    const t = combos?.[code] || (COMBO_DEF[code] ? { zone: COMBO_DEF[code][0], tempo: COMBO_DEF[code][1], desc: COMBO_DEF[code][2] || '' } : null);
    if (!t) return null;
    const tempo = t.tempo === 'Q' ? 'Q' : t.tempo === 'H' ? 'H' : 'T';
    const cmb = { [code]: { desc: t.desc || '' } };
    return attackSituation({ type: tempo, sz: String(t.zone || ''), combo: code }, cmb, roleCode);
  }
  return { parse, code, aggregate, sideOf, commonTeam, comboKey, teamStats, fileQuality, SIT_LABEL, SIT_ORDER, SRV_W };
})();
if (typeof module !== 'undefined') module.exports = DVW;

