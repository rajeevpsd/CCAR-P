/* CCAR-P Exam Trainer: single-page app reading content/*.json.
   Independent study aid. Practice items are original and not actual Anthropic exam questions. */
"use strict";

const REPO = "https://github.com/rajeevpsd/CCAR-P/blob/main/";
const BLUEPRINT = { items: 63, minutes: 120, passing: "Scaled 720 / 1000" };
const DCOLOR = { D1: "var(--d1)", D2: "var(--d2)", D3: "var(--d3)", D4: "var(--d4)", D5: "var(--d5)", D6: "var(--d6)", D7: "var(--d7)" };
const PREREQ = new Set(["1.1", "1.3", "1.5", "2.1", "2.4", "3.6", "4.2", "5.1"]);
const STORE_KEY = "ccarp-trainer-v1";

let DATA = null;          // {objectives, domains, questions, glossary, episodes, maps}
let S = null;             // persisted state
let timerHandle = null;

/* ---------------- utilities ---------------- */
function h(tag, attrs, ...kids) {
  const e = document.createElement(tag);
  if (attrs) for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false) continue;
    if (k === "class") e.className = v;
    else if (k === "style") e.setAttribute("style", v);
    else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
    else if (k === "html") e.innerHTML = v; // only used with trusted static strings
    else e.setAttribute(k, v === true ? "" : v);
  }
  for (const k of kids.flat(Infinity)) {
    if (k === null || k === undefined || k === false) continue;
    e.appendChild(typeof k === "string" || typeof k === "number" ? document.createTextNode(String(k)) : k);
  }
  return e;
}
const pct = (c, n) => (n ? Math.round((100 * c) / n) : 0);
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const fmtTime = s => { s = Math.max(0, Math.round(s)); const m = Math.floor(s / 60), r = s % 60; return `${m}:${String(r).padStart(2, "0")}`; };
const anchor = t => t.trim().toLowerCase().replace(/[^\w\- ]/g, "").replace(/ /g, "-");
const dom = id => DATA.domains.find(d => d.domain_id === id);
const objOf = id => DATA.maps.obj[id];

/* ---------------- persistence ---------------- */
function blankState() { return { v: 1, answers: {}, learn: {}, mocks: [], session: null, mock: null }; }
function load() {
  try { const raw = localStorage.getItem(STORE_KEY); S = raw ? Object.assign(blankState(), JSON.parse(raw)) : blankState(); }
  catch (e) { S = blankState(); }
}
function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch (e) { /* storage unavailable: keep in memory */ } }
function record(qid, picked, correct, source) {
  (S.answers[qid] = S.answers[qid] || []).push({ t: Date.now(), picked, correct, source });
}

/* ---------------- scoring & readiness ---------------- */
function isCorrect(q, picked) {
  const a = [...q.correct_answer].sort().join(","), p = [...picked].sort().join(",");
  return a === p;
}
function statusOf(acc, n) { return n === 0 ? "NOT STARTED" : acc >= 75 ? "READY" : acc >= 70 ? "REVIEW" : "REPAIR"; }
function statusClass(s) { return s === "NOT STARTED" ? "NOT" : s; }
function actionFor(s, label) {
  return { "READY": `Maintain: mixed practice and the mock exam`, "REVIEW": `Revise ${label} traps, then retest`,
    "REPAIR": `Learn ${label} again, then targeted practice`, "NOT STARTED": `Start with the Learn episode for ${label}` }[s];
}
function computeStats() {
  const byD = {}, byO = {};
  for (const d of DATA.domains) byD[d.domain_id] = { n: 0, c: 0, seen: 0, total: 0 };
  for (const o of DATA.objectives) byO[o.objective_id] = { n: 0, c: 0, seen: 0, total: 0 };
  let n = 0, c = 0, seen = 0;
  const latestWrong = new Set();
  for (const q of DATA.questions) {
    byD[q.domain_id].total++; byO[q.objective_id].total++;
    const att = S.answers[q.question_id] || [];
    if (att.length) { seen++; byD[q.domain_id].seen++; byO[q.objective_id].seen++; if (!att[att.length - 1].correct) latestWrong.add(q.question_id); }
    for (const a of att) { n++; byD[q.domain_id].n++; byO[q.objective_id].n++; if (a.correct) { c++; byD[q.domain_id].c++; byO[q.objective_id].c++; } }
  }
  for (const k in byD) { const x = byD[k]; x.acc = pct(x.c, x.n); x.status = statusOf(x.acc, x.n); }
  for (const k in byO) { const x = byO[k]; x.acc = pct(x.c, x.n); x.status = statusOf(x.acc, x.n); }
  const learnDone = DATA.objectives.filter(o => S.learn[o.objective_id] && S.learn[o.objective_id].done).length;
  return { n, c, acc: pct(c, n), seen, byD, byO, latestWrong, learnDone };
}
function repairFirst(objStats, limit = 8) {
  const sev = { "REPAIR": 3, "REVIEW": 2, "NOT STARTED": 2, "READY": 0 };
  return DATA.objectives.map(o => {
    const st = objStats[o.objective_id]; const d = dom(o.domain_id);
    const score = sev[st.status] * (d.weight / 10) * (PREREQ.has(o.objective_id) ? 1.3 : 1);
    return { o, st, score };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score || a.st.acc - b.st.acc).slice(0, limit);
}

/* ---------------- question selection ---------------- */
function allocate(n, domainIds) {
  const ws = domainIds.map(id => dom(id).weight), tot = ws.reduce((a, b) => a + b, 0);
  const raw = ws.map(w => (n * w) / tot), base = raw.map(Math.floor);
  let rem = n - base.reduce((a, b) => a + b, 0);
  raw.map((r, i) => [r - base[i], i]).sort((a, b) => b[0] - a[0]).slice(0, rem).forEach(([, i]) => base[i]++);
  return Object.fromEntries(domainIds.map((id, i) => [id, base[i]]));
}
function pickPractice({ domains, objectives, n, difficulty, mode }) {
  const st = computeStats();
  let pool = DATA.questions.filter(q => (!domains.length || domains.includes(q.domain_id)) &&
    (!objectives.length || objectives.includes(q.objective_id)) && (difficulty === "All" || q.difficulty === difficulty));
  const unseen = q => !(S.answers[q.question_id] || []).length;
  const weakObj = q => ["REPAIR", "REVIEW"].includes(st.byO[q.objective_id].status);
  if (mode === "new") pool = pool.filter(unseen);
  if (mode === "incorrect") pool = pool.filter(q => st.latestWrong.has(q.question_id));
  if (mode === "weak") pool = pool.filter(q => weakObj(q) || st.latestWrong.has(q.question_id))
    .sort((a, b) => st.byO[a.objective_id].acc - st.byO[b.objective_id].acc);
  if (!pool.length) return [];
  if (mode === "weak") return pool.slice(0, n).map(q => q.question_id);
  if (mode === "domain") { const ds = [...new Set(pool.map(q => q.domain_id))].sort(); return ds.flatMap(d => shuffle(pool.filter(q => q.domain_id === d))).slice(0, n).map(q => q.question_id); }
  if (mode === "smart") {
    const ds = [...new Set(pool.map(q => q.domain_id))].sort(), alloc = allocate(n, ds), out = [];
    for (const d of ds) {
      const p = pool.filter(q => q.domain_id === d);
      const order = [...shuffle(p.filter(unseen)), ...shuffle(p.filter(q => !unseen(q) && (weakObj(q) || st.latestWrong.has(q.question_id)))),
        ...shuffle(p.filter(q => !unseen(q) && !weakObj(q) && !st.latestWrong.has(q.question_id)))];
      out.push(...order.slice(0, alloc[d]));
    }
    if (out.length < n) out.push(...shuffle(pool.filter(q => !out.includes(q))).slice(0, n - out.length));
    return shuffle(out).map(q => q.question_id);
  }
  return shuffle(pool).slice(0, n).map(q => q.question_id); // new / incorrect / objective focus
}
function drawMock(scope) {
  const ds = DATA.domains.map(d => d.domain_id).filter(id => !scope || scope.includes(id));
  const n = scope ? 32 : BLUEPRINT.items; // half mock: 32 items across the scoped domains
  const alloc = allocate(n, ds), used = new Set(S.mocks.flatMap(m => m.items.map(i => i.qid)));
  const out = [];
  for (const d of ds) {
    const p = DATA.questions.filter(q => q.domain_id === d);
    const fresh = shuffle(p.filter(q => !used.has(q.question_id))), old = shuffle(p.filter(q => used.has(q.question_id)));
    // spread across objectives first, then fill
    const pick = [], byObj = {};
    for (const q of [...fresh, ...old]) (byObj[q.objective_id] = byObj[q.objective_id] || []).push(q);
    const lanes = Object.values(byObj);
    while (pick.length < alloc[d] && lanes.some(l => l.length)) for (const l of lanes) { if (l.length && pick.length < alloc[d]) pick.push(l.shift()); }
    out.push(...pick);
  }
  return { ids: shuffle(out).map(q => q.question_id), alloc };
}

/* ---------------- shared question renderer ---------------- */
function renderQuestion(q, opts) {
  // opts: {picked:Set, locked:bool, reveal:bool, onPick(k), index, total, flagged, onFlag}
  const d = dom(q.domain_id), o = objOf(q.objective_id);
  const wrap = h("div", { class: "card", style: `--dc:${DCOLOR[q.domain_id]}` });
  wrap.append(h("div", { class: "q-head" },
    h("div", { class: "row" }, h("span", { class: "pill d" }, `${q.domain_id} · ${d.name}`), h("span", { class: "pill" }, `Obj ${q.objective_id}`), h("span", { class: "pill" }, q.difficulty)),
    h("div", { class: "row small" }, opts.total ? `Question ${opts.index + 1} of ${opts.total}` : "", opts.onFlag ? h("button", { class: "btn small ghost", onclick: opts.onFlag }, opts.flagged ? "★ Flagged" : "☆ Flag for review") : null)));
  wrap.append(h("div", { class: "scenario" }, q.scenario), h("div", { class: "qtext" }, q.question.replace(/\s*\(Select \d+\)\s*$/, "")),
    h("div", { class: "selhint" }, q.select > 1 ? `Select ${q.select} answers.` : "Select 1 answer."));
  for (const [k, text] of Object.entries(q.answer_options)) {
    let cls = "opt";
    if (opts.picked.has(k)) cls += " sel";
    if (opts.reveal) { if (q.correct_answer.includes(k)) cls += " correct"; else if (opts.picked.has(k)) cls += " wrong"; }
    wrap.append(h("button", { class: cls, disabled: opts.locked ? true : null, "aria-pressed": opts.picked.has(k) ? "true" : "false", onclick: () => opts.onPick && opts.onPick(k) },
      h("span", { class: "k" }, k), h("span", null, text)));
  }
  if (opts.reveal) wrap.append(renderFeedback(q, opts.picked));
  return wrap;
}
function renderFeedback(q, picked) {
  const ok = isCorrect(q, [...picked]), o = objOf(q.objective_id);
  const ans = q.correct_answer.join(" and ");
  return h("div", { class: "feedback " + (ok ? "ok" : "no"), role: "status", "aria-live": "polite" },
    h("h3", null, ok ? "✓ Correct" : `✗ Incorrect. Best answer: ${ans}`),
    h("div", null, h("b", null, "Why the best answer is best: "), q.correct_answer.map(k => q.option_explanations[k].replace(/^Correct( \(inferred[^)]*\))?\.\s*/, m => m.includes("inferred") ? "(Inferred) " : "")).join(" ")),
    h("div", { class: "small", style: "margin-top:10px" }, h("b", null, "Why each alternative is weaker:")),
    h("ul", { class: "why" }, Object.keys(q.answer_options).filter(k => !q.correct_answer.includes(k)).map(k => h("li", null, h("b", null, k), q.option_explanations[k]))),
    h("div", { class: "lesson" }, h("b", null, "Architecture decision: "), `${q.objective_id} – ${o.official_wording}`),
    h("div", { class: "lesson" }, h("b", null, "KEY EXAM LESSON: "), q.exam_lesson),
    h("div", { class: "small", style: "margin-top:8px" }, "Source: ", q.source_reference, " · ",
      h("a", { href: `#/learn/${q.objective_id}` }, `Learn ${q.objective_id}`), " · ",
      h("a", { href: guideUrl(q.objective_id), target: "_blank", rel: "noopener" }, "Guide section ↗")));
}
function guideUrl(oid) {
  const o = objOf(oid), d = dom(o.domain_id);
  return REPO + d.source_file + "#" + anchor(`Objective ${oid} – ${o.official_wording}`);
}
function domBar(acc, n, color) {
  return h("div", { class: "bar target", style: `--dc:${color}` }, h("i", { style: `width:${n ? acc : 0}%` }), h("span", { class: "line", title: "75% study target" }));
}
function statusTag(s) { return h("span", { class: "status " + statusClass(s) }, s); }

/* ---------------- views ---------------- */
function viewHome() {
  const st = computeStats(), nextPart = DATA.objectives.find(o => !(S.learn[o.objective_id] || {}).done);
  const els = [];
  els.push(h("div", { class: "hero" },
    h("div", { class: "eyebrow" }, "Claude Certified Architect · Professional"),
    h("h1", null, "Prepare for the CCAR-P exam"),
    h("p", { class: "lede" }, "The exam tests architectural judgement across solution design, models and context, integration, evaluation, governance, stakeholder lifecycle and team enablement. This trainer builds that judgement with blueprint-weighted scenario practice and coaching, a narrated course with one episode per domain, a glossary, and readiness tracking."),
    h("div", { class: "row" },
      h("a", { class: "btn primary", href: "#/practice" }, "Start practising"),
      h("a", { class: "btn", href: nextPart ? `#/learn/${nextPart.objective_id}` : "#/learn" }, "Continue learning"),
      h("a", { class: "btn", href: "#/mock" }, "Take mock exam"),
      h("a", { class: "btn", href: "#/practice?mode=weak" }, "Review weak areas"))));
  if (st.n || S.session) els.push(h("div", { class: "card", style: "border-left:4px solid var(--d3)" },
    h("div", { class: "eyebrow" }, "Welcome back"),
    h("p", null, `You have seen ${st.seen} of ${DATA.questions.length} questions, with ${st.acc}% of answers correct. Learn parts completed: ${st.learnDone} of ${DATA.objectives.length}.`),
    h("div", { class: "row" }, S.session ? h("a", { class: "btn primary", href: "#/practice/run" }, "Resume practice") : null, h("a", { class: "btn", href: "#/progress" }, "See your progress"))));
  els.push(h("div", { class: "stats" },
    stat("Items", BLUEPRINT.items), stat("Time", BLUEPRINT.minutes + " min"), stat("Pass mark", "720 / 1000"),
    stat("Domains", DATA.domains.length), stat("Objectives", DATA.objectives.length)));
  els.push(h("p", { class: "small" }, "Exam format: multiple-choice and multiple-response items, each stating how many responses to select. Proctored by Pearson VUE. Pass/fail is based on the total scaled score. Domain percentages on the score report are informational."));
  const rd = h("div", { class: "card" }, h("h2", { style: "margin-top:0" }, "Domain readiness"),
    h("p", { class: "small" }, "Accuracy against a 75% study target. The 720 scaled pass mark can't be converted exactly from a raw score."));
  for (const d of DATA.domains) { const x = st.byD[d.domain_id];
    rd.append(h("div", { class: "dom-row" }, h("div", null, h("b", null, `Domain ${d.domain_id.slice(1)} · ${d.weight}%`), h("div", { class: "small" }, d.name)), domBar(x.acc, x.n, DCOLOR[d.domain_id]), h("div", { class: "pct" }, x.n ? x.acc + "%" : "–"))); }
  els.push(rd);
  els.push(h("h2", null, "What's inside"), h("div", { class: "grid g3" },
    inside(`${DATA.questions.length} questions`, "Practice", "Pick domains, objectives and difficulty, with coaching on every answer that explains why each wrong option is weaker.", "#/practice"),
    inside(`${BLUEPRINT.items} items · ${BLUEPRINT.minutes} min`, "Mock exam", "A timed run weighted to the official blueprint, scored at the end with a breakdown by domain and objective.", "#/mock"),
    inside(`${DATA.episodes.length} episodes · ${DATA.objectives.length} parts`, "Learn", "One narrated episode per domain and one part per objective, with read-along and a 3-question check.", "#/learn"),
    inside(`${DATA.glossary.length} terms`, "Glossary", "Every key term in plain English, by topic or A–Z, searchable and filterable.", "#/glossary"),
    inside("By domain and objective", "Progress", "Accuracy against the 75% target, a Repair-First list, and a progress file you can move to another computer.", "#/progress")));
  return els;
}
const stat = (k, v) => h("div", null, h("span", null, k), h("b", null, v));
const inside = (k, t, d, href) => h("a", { class: "card", href, style: "text-decoration:none;color:inherit" }, h("div", { class: "kicker" }, k), h("h3", { style: "margin-top:8px;text-transform:uppercase" }, t), h("p", { class: "small", style: "color:var(--ink)" }, d));

/* ---- Practice ---- */
const PSET = { domains: [], objectives: [], n: 10, difficulty: "All", mode: "smart" };
const MODES = [["smart", "Smart Mix (new, then weak)"], ["new", "New questions"], ["weak", "Weak areas"], ["incorrect", "Incorrect previously"], ["domain", "Domain focus"], ["objective", "Objective focus"]];
function viewPractice(params) {
  if (params.get("mode")) PSET.mode = params.get("mode");
  if (params.get("obj") && objOf(params.get("obj"))) { PSET.objectives = [params.get("obj")]; PSET.domains = [objOf(params.get("obj")).domain_id]; PSET.mode = "objective"; }
  if (params.toString()) {
    history.replaceState(null, "", "#/practice");
    if (params.get("start")) { const ids = pickPractice({ ...PSET, n: Math.min(PSET.n, 10) }); if (ids.length) { S.session = { ids, i: 0, answers: {}, started: Date.now(), mode: PSET.mode }; save(); location.hash = "#/practice/run"; return []; } }
  }
  const st = computeStats(), els = [];
  if (S.session) els.push(h("div", { class: "card", style: "border-left:4px solid var(--d3)" }, h("div", { class: "row", style: "justify-content:space-between" },
    h("div", null, h("b", null, "Practice session in progress"), h("div", { class: "small" }, `${Object.keys(S.session.answers).length} of ${S.session.ids.length} answered · ${Object.values(S.session.answers).filter(a => a.correct).length} correct`)),
    h("div", { class: "row" }, h("a", { class: "btn primary", href: "#/practice/run" }, "Resume"), h("button", { class: "btn ghost", onclick: () => { S.session = null; save(); route(); } }, "Discard")))));
  els.push(h("h1", null, "Practice by domain"), h("p", { class: "lede" }, "Pick one or more domains (none selected means all). Every answer is marked on the spot, with coaching that explains the best answer and why each alternative is weaker."));
  const grid = h("div", { class: "grid g2" });
  for (const d of DATA.domains) {
    const x = st.byD[d.domain_id], on = PSET.domains.includes(d.domain_id);
    grid.append(h("button", { class: "dcard" + (on ? " on" : ""), style: `--dc:${DCOLOR[d.domain_id]}`, "aria-pressed": on ? "true" : "false",
      onclick: () => { PSET.domains = on ? PSET.domains.filter(z => z !== d.domain_id) : [...PSET.domains, d.domain_id]; PSET.objectives = PSET.objectives.filter(o => PSET.domains.includes(objOf(o).domain_id)); route(); } },
      h("span", { class: "tick" }, on ? "✓" : ""), h("div", { class: "eyebrow" }, `Domain ${d.domain_id.slice(1)} · ${d.weight}%`), h("h3", null, d.name),
      h("div", { class: "bar", style: `--dc:${DCOLOR[d.domain_id]}` }, h("i", { style: `width:${pct(x.seen, x.total)}%` })),
      h("div", { class: "meta" }, h("span", null, `${x.seen} of ${x.total} seen`), h("span", null, x.n ? `${x.acc}% correct` : "no attempts yet"))));
  }
  els.push(grid);
  const objs = DATA.objectives.filter(o => !PSET.domains.length || PSET.domains.includes(o.domain_id));
  const objSel = h("select", { multiple: true, size: Math.min(8, objs.length), "aria-label": "Objectives", onchange: e => { PSET.objectives = [...e.target.selectedOptions].map(x => x.value); } },
    objs.map(o => h("option", { value: o.objective_id, selected: PSET.objectives.includes(o.objective_id) ? true : null }, `${o.objective_id} ${o.official_wording}`)));
  const msg = h("div", { class: "small", role: "status" });
  els.push(h("div", { class: "card", style: "margin-top:18px" }, h("div", { class: "grid g3" },
    h("div", null, h("label", { class: "f" }, "Questions"), h("select", { onchange: e => PSET.n = +e.target.value }, [5, 10, 15, 20, 30, 50].map(n => h("option", { value: n, selected: PSET.n === n ? true : null }, n)))),
    h("div", null, h("label", { class: "f" }, "Focus"), h("select", { onchange: e => { PSET.mode = e.target.value; } }, MODES.map(([v, t]) => h("option", { value: v, selected: PSET.mode === v ? true : null }, t)))),
    h("div", null, h("label", { class: "f" }, "Difficulty"), h("select", { onchange: e => PSET.difficulty = e.target.value }, ["All", "Easy", "Medium", "Hard"].map(v => h("option", { value: v, selected: PSET.difficulty === v ? true : null }, v))))),
    h("div", { style: "margin-top:14px" }, h("label", { class: "f" }, "Objectives (optional: Ctrl/Cmd-click to pick several)"), objSel,
      h("div", { class: "row", style: "margin-top:6px" }, h("button", { class: "linkbtn", onclick: () => { PSET.objectives = []; route(); } }, "Clear objectives"))),
    h("div", { class: "row", style: "margin-top:16px" }, h("button", { class: "btn primary", onclick: () => {
      if (PSET.mode === "domain" && !PSET.domains.length) { msg.textContent = "Domain focus needs at least one domain selected."; return; }
      if (PSET.mode === "objective" && !PSET.objectives.length) { msg.textContent = "Objective focus needs at least one objective selected."; return; }
      const ids = pickPractice(PSET);
      if (!ids.length) { msg.textContent = "No questions match this selection. Try another mode or widen the filters."; return; }
      S.session = { ids, i: 0, answers: {}, started: Date.now(), mode: PSET.mode }; save(); location.hash = "#/practice/run";
    } }, "Start practice"), msg)));
  return els;
}
function viewPracticeRun() {
  const s = S.session;
  if (!s) { location.hash = "#/practice"; return []; }
  if (s.i >= s.ids.length) return practiceSummary(s);
  const q = DATA.maps.q[s.ids[s.i]], ans = s.answers[q.question_id];
  const picked = new Set(ans ? ans.picked : (s.draft || []));
  const card = renderQuestion(q, { picked, locked: !!ans, reveal: !!ans, index: s.i, total: s.ids.length,
    onPick: k => { if (q.select === 1) s.draft = [k]; else { const p = new Set(s.draft || []); p.has(k) ? p.delete(k) : p.size < q.select && p.add(k); s.draft = [...p]; } save(); route(); } });
  const ctl = h("div", { class: "row", style: "margin-top:14px" });
  if (!ans) ctl.append(h("button", { class: "btn primary", disabled: picked.size === q.select ? null : true, onclick: () => {
    const p = [...picked], ok = isCorrect(q, p); s.answers[q.question_id] = { picked: p, correct: ok }; record(q.question_id, p, ok, "practice"); s.draft = null; save(); route(); } }, "Submit answer"));
  else ctl.append(h("button", { class: "btn primary", onclick: () => { s.i++; save(); route(); window.scrollTo(0, 0); } }, s.i + 1 < s.ids.length ? "Next question →" : "Finish session"));
  ctl.append(h("a", { class: "btn ghost", href: "#/practice" }, "Pause"));
  return [h("div", { class: "eyebrow", style: "margin-bottom:8px" }, `Practice · ${MODES.find(m => m[0] === s.mode)[1]}`), card, ctl];
}
function practiceSummary(s) {
  const qs = s.ids.map(id => DATA.maps.q[id]), c = qs.filter(q => s.answers[q.question_id] && s.answers[q.question_id].correct).length;
  const wrong = qs.filter(q => s.answers[q.question_id] && !s.answers[q.question_id].correct);
  return [h("h1", null, "Session complete"), h("div", { class: "stats" }, stat("Answered", Object.keys(s.answers).length), stat("Correct", c), stat("Accuracy", pct(c, qs.length) + "%")),
    wrong.length ? h("div", { class: "card" }, h("h3", null, "Review these"), h("ul", null, wrong.map(q => h("li", null, `${q.question_id} (Obj ${q.objective_id}): ${q.exam_lesson} `, h("a", { href: `#/learn/${q.objective_id}` }, "Learn"))))) : h("p", null, "No misses this session. Nice work."),
    h("div", { class: "row", style: "margin-top:16px" }, h("button", { class: "btn primary", onclick: () => { S.session = null; save(); location.hash = "#/practice"; } }, "New session"), h("a", { class: "btn", href: "#/progress" }, "See progress"))];
}

/* ---- Mock exam ---- */
const MSET = { timed: true, coach: false, scope: "full" };
function viewMock() {
  const full = drawMock(null).alloc, els = [];
  if (S.mock) els.push(h("div", { class: "card", style: "border-left:4px solid var(--d3)" }, h("div", { class: "row", style: "justify-content:space-between" },
    h("div", null, h("b", null, "Mock exam in progress"), h("div", { class: "small" }, `${S.mock.ids.filter(id => (S.mock.picked[id] || []).length).length} of ${S.mock.ids.length} answered${S.mock.timed ? " · " + fmtTime(S.mock.remaining) + " left" : ""}`)),
    h("div", { class: "row" }, h("a", { class: "btn primary", href: "#/mock/run" }, "Resume"), confirmBtn("Abandon", () => { S.mock = null; save(); route(); })))));
  els.push(h("h1", null, "Full mock exam"),
    h("p", { class: "lede" }, `${BLUEPRINT.items} items drawn to the official blueprint weights: ${Object.entries(full).map(([d, n]) => `${n} from ${d}`).join(", ")}. Questions you haven't seen in earlier mocks come first. In timed mode the clock runs only while the exam is open; pausing saves your place.`));
  const scopeSel = h("select", { onchange: e => MSET.scope = e.target.value }, [["full", `Full mock: ${BLUEPRINT.items} items, ${BLUEPRINT.minutes} min`], ["half", "Half mock: D1–D4, 32 items, 60 min"]].map(([v, t]) => h("option", { value: v, selected: MSET.scope === v ? true : null }, t)));
  els.push(h("div", { class: "card" },
    h("div", { class: "grid g3" }, h("div", null, h("label", { class: "f" }, "Format"), scopeSel),
      h("label", { class: "row" }, h("input", { type: "checkbox", checked: MSET.timed ? true : null, onchange: e => MSET.timed = e.target.checked }), "Timed mode"),
      h("label", { class: "row" }, h("input", { type: "checkbox", checked: MSET.coach ? true : null, onchange: e => MSET.coach = e.target.checked }), "Coach me as I go (feedback after each answer)")),
    h("p", { class: "small" }, "Turn coaching off for exam conditions: no feedback until you finish, then a full review of every miss. Untimed mode records the time you use."),
    h("button", { class: "btn primary", onclick: () => {
      const scope = MSET.scope === "half" ? ["D1", "D2", "D3", "D4"] : null, { ids } = drawMock(scope);
      const minutes = scope ? 60 : BLUEPRINT.minutes;
      S.mock = { ids, picked: {}, flags: {}, revealed: {}, i: 0, timed: MSET.timed, coach: MSET.coach, scope: MSET.scope, remaining: minutes * 60, limit: minutes * 60, elapsed: 0, started: Date.now() };
      save(); location.hash = "#/mock/run";
    } }, S.mock ? "Start a new mock (replaces current)" : "Start a new mock")));
  const wt = h("div", { class: "card" }, h("div", { class: "eyebrow", style: "margin-bottom:10px" }, "Weights and item counts"));
  for (const d of DATA.domains) wt.append(h("div", { class: "dom-row" }, h("div", null, h("b", null, `Domain ${d.domain_id.slice(1)}`), h("div", { class: "small" }, d.name)),
    h("div", { class: "bar", style: `--dc:${DCOLOR[d.domain_id]}` }, h("i", { style: `width:${d.weight * 4}%` })), h("div", { class: "pct" }, `${d.weight}% · ${full[d.domain_id]}`)));
  els.push(wt);
  if (S.mocks.length) els.push(h("div", { class: "card" }, h("h3", null, "Previous mocks"), h("table", null, h("tr", null, h("th", null, "Date"), h("th", null, "Format"), h("th", null, "Score"), h("th", null, "Time"), h("th", null, "")),
    S.mocks.map((m, i) => h("tr", null, h("td", null, new Date(m.date).toLocaleString()), h("td", null, `${m.items.length} items${m.coach ? " · coached" : ""}`), h("td", null, `${m.score}%`), h("td", null, fmtTime(m.timeUsed)), h("td", null, h("a", { href: `#/mock/result/${i}` }, "Review")))).reverse())));
  return els;
}
function viewMockRun() {
  const m = S.mock;
  if (!m) { location.hash = "#/mock"; return []; }
  const q = DATA.maps.q[m.ids[m.i]], picked = new Set(m.picked[q.question_id] || []), revealed = m.coach && m.revealed[q.question_id];
  const timerEl = h("span", { class: "timer", id: "timer" }, m.timed ? fmtTime(m.remaining) : fmtTime(m.elapsed));
  startTimer();
  const card = renderQuestion(q, { picked, locked: !!revealed, reveal: !!revealed, index: m.i, total: m.ids.length, flagged: !!m.flags[q.question_id],
    onFlag: () => { m.flags[q.question_id] = !m.flags[q.question_id]; save(); route(); },
    onPick: k => { let p = new Set(m.picked[q.question_id] || []); if (q.select === 1) p = new Set([k]); else { p.has(k) ? p.delete(k) : p.size < q.select && p.add(k); } m.picked[q.question_id] = [...p]; save(); route(); } });
  const ctl = h("div", { class: "row", style: "margin-top:14px" },
    h("button", { class: "btn", disabled: m.i === 0 ? true : null, onclick: () => { m.i--; save(); route(); } }, "← Previous"),
    m.coach && !revealed ? h("button", { class: "btn primary", disabled: picked.size === q.select ? null : true, onclick: () => { m.revealed[q.question_id] = true; save(); route(); } }, "Check answer") : null,
    h("button", { class: "btn" + (m.coach && !revealed ? "" : " primary"), disabled: m.i === m.ids.length - 1 ? true : null, onclick: () => { m.i++; save(); route(); window.scrollTo(0, 0); } }, "Next →"),
    h("a", { class: "btn ghost", href: "#/mock" }, "Pause"),
    confirmBtn("Submit exam", submitMock, `Submit? ${m.ids.filter(id => !(m.picked[id] || []).length).length} unanswered.`));
  const grid = h("div", { class: "navgrid", "aria-label": "Question navigator" }, m.ids.map((id, i) => h("button", { class: [(m.picked[id] || []).length ? "ans" : "", i === m.i ? "cur" : "", m.flags[id] ? "flag" : ""].join(" "), title: `Question ${i + 1}`, onclick: () => { m.i = i; save(); route(); } }, i + 1)));
  return [h("div", { class: "row", style: "justify-content:space-between;margin-bottom:10px" }, h("div", { class: "eyebrow" }, `Mock exam · ${m.coach ? "Coach mode" : "Exam mode"}`), h("div", null, m.timed ? "Time left " : "Elapsed ", timerEl)),
    card, ctl, h("div", { class: "card", style: "margin-top:16px" }, h("div", { class: "small" }, `Answered ${Object.keys(m.picked).filter(k => m.picked[k].length).length}/${m.ids.length} · ★ flagged ${Object.values(m.flags).filter(Boolean).length}`), grid)];
}
function startTimer() {
  if (timerHandle) return;
  timerHandle = setInterval(() => {
    const m = S.mock;
    if (!m || !location.hash.startsWith("#/mock/run")) { clearInterval(timerHandle); timerHandle = null; return; }
    m.elapsed++; if (m.timed) m.remaining--;
    const t = document.getElementById("timer");
    if (t) { t.textContent = fmtTime(m.timed ? m.remaining : m.elapsed); t.classList.toggle("low", m.timed && m.remaining < 600); }
    if (m.elapsed % 5 === 0) save();
    if (m.timed && m.remaining <= 0) submitMock();
  }, 1000);
}
function submitMock() {
  const m = S.mock; if (!m) return;
  const items = m.ids.map(id => { const q = DATA.maps.q[id], p = m.picked[id] || [], ok = p.length ? isCorrect(q, p) : false; if (p.length) record(id, p, ok, "mock"); return { qid: id, picked: p, correct: ok }; });
  const c = items.filter(i => i.correct).length;
  S.mocks.push({ date: Date.now(), items, score: pct(c, items.length), timeUsed: m.timed ? m.limit - Math.max(0, m.remaining) : m.elapsed, coach: m.coach, timed: m.timed, scope: m.scope });
  S.mock = null; save(); clearInterval(timerHandle); timerHandle = null;
  location.hash = `#/mock/result/${S.mocks.length - 1}`;
}
function viewMockResult(i) {
  const m = S.mocks[i]; if (!m) { location.hash = "#/mock"; return []; }
  const byD = {}, byO = {};
  for (const it of m.items) { const q = DATA.maps.q[it.qid]; for (const [k, map] of [[q.domain_id, byD], [q.objective_id, byO]]) { map[k] = map[k] || { n: 0, c: 0 }; map[k].n++; if (it.correct) map[k].c++; } }
  const c = m.items.filter(x => x.correct).length, overall = statusOf(m.score, m.items.length);
  const objStats = Object.fromEntries(DATA.objectives.map(o => { const x = byO[o.objective_id]; return [o.objective_id, x ? { acc: pct(x.c, x.n), n: x.n, status: statusOf(pct(x.c, x.n), x.n) } : { acc: 0, n: 0, status: "READY" }]; }));
  const rep = repairFirst(objStats, 6);
  const els = [h("h1", null, "Mock exam result"), h("p", { class: "small" }, new Date(m.date).toLocaleString(), m.coach ? " · coached run" : " · exam conditions"),
    h("div", { class: "stats" }, stat("Score", m.score + "%"), stat("Correct", `${c} / ${m.items.length}`), stat("Time used", fmtTime(m.timeUsed)), h("div", null, h("span", null, "Study status"), statusTag(overall))),
    h("p", { class: "notice" }, "Study targets: 75%+ Ready · 70–74% Review · under 70% Repair. These are preparation thresholds, not a conversion to the official scaled score (720/1000).")];
  const dc = h("div", { class: "card" }, h("h2", { style: "margin-top:0" }, "Performance by domain"));
  for (const d of DATA.domains) { const x = byD[d.domain_id]; if (!x) continue; const a = pct(x.c, x.n);
    dc.append(h("div", { class: "dom-row" }, h("div", null, h("b", null, `${d.domain_id} · ${d.name}`), h("div", { class: "small" }, `${x.c}/${x.n} · `, statusTag(statusOf(a, x.n)))), domBar(a, x.n, DCOLOR[d.domain_id]), h("div", { class: "pct" }, a + "%"))); }
  els.push(dc);
  els.push(h("div", { class: "card" }, h("h2", { style: "margin-top:0" }, "Performance by objective"), h("table", null, h("tr", null, h("th", null, "Objective"), h("th", null, "Correct"), h("th", null, "Status")),
    DATA.objectives.filter(o => byO[o.objective_id]).map(o => { const x = byO[o.objective_id]; return h("tr", null, h("td", null, `${o.objective_id} ${o.official_wording}`), h("td", null, `${x.c}/${x.n}`), h("td", null, statusTag(statusOf(pct(x.c, x.n), x.n)))); }))));
  els.push(h("div", { class: "card" }, h("h2", { style: "margin-top:0" }, "Recommended remediation (Repair First)"),
    rep.length ? h("ol", null, rep.map(r => h("li", null, `${r.o.objective_id} ${r.o.official_wording} `, statusTag(r.st.status), " ", h("a", { href: `#/learn/${r.o.objective_id}` }, "Learn"), " · ", h("a", { href: `#/practice?obj=${r.o.objective_id}&start=1` }, "Practise")))) : h("p", null, "No objectives below target in this mock."),
    h("p", { class: "small" }, "Ranked by severity × domain weight × prerequisite importance.")));
  const wrong = m.items.filter(x => !x.correct);
  const wl = h("div", { class: "card" }, h("h2", { style: "margin-top:0" }, `Incorrect or unanswered (${wrong.length})`));
  for (const it of wrong) { const q = DATA.maps.q[it.qid];
    wl.append(h("details", { class: "term" }, h("summary", null, h("span", null, `${q.question_id} · Obj ${q.objective_id}: ${q.question}`), h("span", { class: "small" }, it.picked.length ? `you: ${it.picked.join(",")}` : "unanswered")),
      renderQuestion(q, { picked: new Set(it.picked), locked: true, reveal: true }))); }
  els.push(wl, h("div", { class: "row" }, h("a", { class: "btn primary", href: "#/mock" }, "Back to mock exams"), h("a", { class: "btn", href: "#/progress" }, "Progress")));
  return els;
}
function confirmBtn(label, fn, prompt) {
  const wrap = h("span", { class: "confirm" });
  const btn = h("button", { class: "btn ghost", onclick: () => { wrap.replaceChildren(h("span", { class: "small" }, prompt || "Are you sure?"), h("button", { class: "btn small primary", onclick: fn }, "Yes"), h("button", { class: "btn small ghost", onclick: () => wrap.replaceChildren(btn) }, "Cancel")); } }, label);
  wrap.append(btn); return wrap;
}

/* ---- Learn ---- */
function viewLearn() {
  const els = [h("h1", null, "Learn"), h("p", { class: "lede" }, "One episode per domain, with one part per official objective, about six hours in all. Each part has sectioned read-along narration drawn from the training modules (your browser reads it aloud), key concepts, an architecture example, the architecture decision, the exam takeaway, its sources and a 3-question knowledge check.")];
  for (const e of DATA.episodes) {
    const d = dom(e.domain_id), mins = e.parts.reduce((a, p) => a + p.minutes, 0), done = e.parts.filter(p => (S.learn[p.objective_id] || {}).done).length;
    els.push(h("div", { class: "card ep", style: `--dc:${DCOLOR[e.domain_id]}` },
      h("div", { class: "row", style: "justify-content:space-between" }, h("div", null, h("span", { class: "pill d", style: `--dc:${DCOLOR[e.domain_id]}` }, `Domain ${e.domain_id.slice(1)} · ${d.weight}%`), " ", h("b", null, d.name)), h("span", { class: "small" }, `${e.parts.length} parts · ~${mins} min · ${done}/${e.parts.length} done`)),
      h("p", { class: "small", style: "margin:10px 0 4px" }, e.intro),
      e.parts.map(p => h("div", { class: "part" }, h("div", { class: "t" }, h("span", { class: (S.learn[p.objective_id] || {}).done ? "done" : "small" }, (S.learn[p.objective_id] || {}).done ? "✓" : "○"), h("a", { href: `#/learn/${p.objective_id}` }, `${p.objective_id} ${p.title}`)),
        h("div", { class: "row" }, h("span", { class: "small" }, `${p.minutes} min`), h("a", { class: "btn small", href: `#/practice?obj=${p.objective_id}&start=1` }, "Test me on this"))))));
  }
  return els;
}
function viewLearnPart(oid) {
  const p = DATA.maps.part[oid]; if (!p) { location.hash = "#/learn"; return []; }
  const o = objOf(oid), d = dom(o.domain_id), flat = DATA.episodes.flatMap(e => e.parts), idx = flat.findIndex(x => x.objective_id === oid);
  const L = S.learn[oid] = S.learn[oid] || { done: false, checks: {} };
  const raw = p.narration.split(/\n\s*\n/).map(t => t.replace(/\s+/g, " ").trim()).filter(Boolean);
  const paras = raw.map(t => t.replace(/^###\s*/, ""));
  const narr = h("div", { class: "narr" }, raw.map((t, i) => /^###/.test(t) ? h("h3", { "data-i": i }, paras[i]) : h("p", { "data-i": i }, t)));
  const sections = raw.map((t, i) => [t, i]).filter(([t]) => /^###/.test(t));
  const toc = sections.length ? h("div", { class: "toc" }, h("span", { class: "small" }, "In this part: "), sections.map(([t, i]) => h("a", { href: "#", onclick: e => { e.preventDefault(); narr.querySelector(`[data-i="${i}"]`).scrollIntoView({ behavior: "smooth", block: "start" }); } }, paras[i]))) : null;
  const els = [h("a", { href: "#/learn", class: "small" }, "← All episodes"),
    h("div", { class: "eyebrow", style: "margin-top:12px" }, `Domain ${d.domain_id.slice(1)} · ${d.name}`), h("h1", null, `${oid} ${p.title}`),
    h("p", { class: "lede" }, h("b", null, "Objective: "), o.official_wording, ` · about ${p.minutes} min`),
    h("div", { class: "card", style: `--dc:${DCOLOR[d.domain_id]}` }, player(paras, narr), toc, h("div", { style: "margin-top:12px" }, narr),
      h("p", { class: "small", style: "margin-top:12px" }, h("b", null, "Sources: "), p.sources)),
    h("div", { class: "grid g2", style: "margin-top:16px" },
      h("div", { class: "card" }, h("div", { class: "eyebrow" }, "Key concepts"), h("div", { class: "chips", style: "margin-top:10px" }, p.key_concepts.map(c => h("span", { class: "chip" }, c)))),
      h("div", { class: "card" }, h("div", { class: "eyebrow" }, "Architecture example"), h("p", null, p.architecture_example))),
    h("div", { class: "card", style: "border-left:4px solid var(--d3);margin-top:16px" }, h("div", { class: "eyebrow" }, "Architecture decision"), h("p", null, p.architecture_decision)),
    h("div", { class: "card", style: "border-left:4px solid var(--accent)" }, h("div", { class: "eyebrow" }, "Exam takeaway"), h("p", { style: "font-weight:600" }, p.exam_takeaway),
      h("a", { href: guideUrl(oid), target: "_blank", rel: "noopener", class: "small" }, "Open the full guide section (decision framework, traps, must-remember) ↗"))];
  const kc = h("div", { class: "card" });
  const drawKC = () => {
    kc.replaceChildren(h("h2", { style: "margin-top:0" }, "Knowledge check"));
    p.knowledge_check.forEach((c, i) => {
      const got = L.checks[i];
      kc.append(h("div", { style: "margin:14px 0" }, h("div", { class: "qtext" }, `${i + 1}. ${c.question}`),
        Object.entries(c.options).map(([k, t]) => { let cls = "opt"; if (got) { if (k === c.answer) cls += " correct"; else if (k === got) cls += " wrong"; }
          return h("button", { class: cls, disabled: got ? true : null, onclick: () => { L.checks[i] = k; if (Object.keys(L.checks).length === p.knowledge_check.length) L.done = true; save(); drawKC(); } }, h("span", { class: "k" }, k), h("span", null, t)); }),
        got ? h("div", { class: "feedback " + (got === c.answer ? "ok" : "no") }, h("b", null, got === c.answer ? "✓ Correct. " : `✗ Answer: ${c.answer}. `), c.why) : null));
    });
    kc.append(h("div", { class: "row" }, h("button", { class: "btn", onclick: () => { L.done = !L.done; save(); drawKC(); } }, L.done ? "✓ Completed (undo)" : "Mark part complete"),
      h("button", { class: "btn ghost", onclick: () => { L.checks = {}; L.done = false; save(); drawKC(); } }, "Retake check"), h("a", { class: "btn", href: `#/practice?obj=${oid}&start=1` }, "Test me on this objective")));
  };
  drawKC();
  els.push(kc, h("div", { class: "row", style: "justify-content:space-between;margin-top:16px" },
    idx > 0 ? h("a", { class: "btn ghost", href: `#/learn/${flat[idx - 1].objective_id}` }, `← ${flat[idx - 1].objective_id}`) : h("span"),
    idx < flat.length - 1 ? h("a", { class: "btn primary", href: `#/learn/${flat[idx + 1].objective_id}` }, `Next: ${flat[idx + 1].objective_id} →`) : h("a", { class: "btn primary", href: "#/mock" }, "Take the mock exam →")));
  save();
  return els;
}
function player(paras, narr) {
  const synth = window.speechSynthesis;
  if (!synth || typeof SpeechSynthesisUtterance === "undefined") return h("div", { class: "notice" }, "Read-aloud isn't available in this browser. Read along below.");
  let i = 0, playing = false, paused = false;
  const rate = h("select", { "aria-label": "Speed" }, [0.75, 1, 1.15, 1.3, 1.5].map(r => h("option", { value: r, selected: r === 1 ? true : null }, r + "×")));
  const voiceSel = h("select", { "aria-label": "Voice" });
  const fillVoices = () => { const vs = synth.getVoices().filter(v => /^en/i.test(v.lang)); voiceSel.replaceChildren(...vs.map(v => h("option", { value: v.name }, `${v.name} (${v.lang})`))); };
  fillVoices(); if (synth.onvoiceschanged !== undefined) synth.onvoiceschanged = fillVoices;
  const mark = k => narr.querySelectorAll("[data-i]").forEach(pp => pp.classList.toggle("speaking", +pp.dataset.i === k));
  const playBtn = h("button", { class: "btn small primary" }, "▶ Play");
  const speak = () => {
    if (i >= paras.length) { stop(); return; }
    const u = new SpeechSynthesisUtterance(paras[i]); u.rate = +rate.value;
    const v = synth.getVoices().find(x => x.name === voiceSel.value); if (v) u.voice = v;
    u.onstart = () => mark(i); u.onend = () => { if (!playing) return; i++; speak(); };
    synth.speak(u);
  };
  const stop = () => { playing = false; paused = false; synth.cancel(); i = 0; mark(-1); playBtn.textContent = "▶ Play"; };
  playBtn.onclick = () => {
    if (!playing) { playing = true; paused = false; synth.cancel(); speak(); playBtn.textContent = "❚❚ Pause"; }
    else if (!paused) { synth.pause(); paused = true; playBtn.textContent = "▶ Resume"; }
    else { synth.resume(); paused = false; playBtn.textContent = "❚❚ Pause"; }
  };
  narr.addEventListener("click", e => { const el = e.target.closest("[data-i]"); if (!el) return; synth.cancel(); i = +el.dataset.i; playing = true; paused = false; playBtn.textContent = "❚❚ Pause"; speak(); });
  window.addEventListener("hashchange", () => synth.cancel(), { once: true });
  return h("div", { class: "player" }, playBtn, h("button", { class: "btn small ghost", onclick: stop }, "■ Stop"), h("span", { class: "small" }, "Speed"), rate, h("span", { class: "small" }, "Voice"), voiceSel,
    h("span", { class: "small" }, "Click any paragraph to read from there. Narration uses your browser's speech engine; quality depends on your device."));
}

/* ---- Glossary ---- */
const GSET = { q: "", view: "topic", group: "All", obj: "" };
function viewGlossary() {
  const els = [h("h1", null, "Glossary"), h("p", { class: "lede" }, "Every key term in plain English. Terms used in three or more domains come first as course-wide vocabulary; the rest sit under the domain and objective where they matter most. Switch to A–Z for one alphabetical list, or search either view.")];
  const list = h("div");
  const render = () => {
    const q = GSET.q.toLowerCase();
    let terms = DATA.glossary.filter(t => (GSET.group === "All" || t.group === GSET.group) && (!GSET.obj || t.objectives.includes(GSET.obj)) &&
      (!q || [t.term, t.definition, t.architect_significance, t.exam_relevance, t.common_confusion, t.related.join(" ")].join(" ").toLowerCase().includes(q)));
    list.replaceChildren();
    if (!terms.length) { list.append(h("p", { class: "empty" }, "No terms match.")); return; }
    if (GSET.view === "az") { list.append(h("div", { class: "card" }, terms.slice().sort((a, b) => a.term.localeCompare(b.term)).map(termEl))); return; }
    const groups = ["Cross-domain", ...DATA.domains.map(d => d.domain_id)];
    for (const g of groups) {
      const ts = terms.filter(t => t.group === g); if (!ts.length) continue;
      const card = h("div", { class: "card", style: g === "Cross-domain" ? "border-left:4px solid var(--d3)" : `border-left:4px solid ${DCOLOR[g]}` },
        h("h2", { style: "margin-top:0" }, g === "Cross-domain" ? "Used across the course" : `Domain ${g.slice(1)} · ${dom(g).name}`), h("div", { class: "small" }, `${ts.length} terms`));
      if (g === "Cross-domain") card.append(...ts.map(termEl));
      else for (const o of DATA.objectives.filter(o => o.domain_id === g)) {
        const os = ts.filter(t => t.objectives[0] === o.objective_id); if (!os.length) continue;
        card.append(h("h3", { style: "margin-top:16px" }, `${o.objective_id} ${o.official_wording}`, h("span", { class: "small" }, ` · ${os.length} terms`)), ...os.map(termEl));
      }
      list.append(card);
    }
  };
  const search = h("input", { type: "search", placeholder: "Search terms and definitions", value: GSET.q, "aria-label": "Search glossary", oninput: e => { GSET.q = e.target.value; render(); } });
  const chips = h("div", { class: "chips", style: "margin-top:12px" }, ["All", "Cross-domain", ...DATA.domains.map(d => d.domain_id)].map(g =>
    h("button", { class: "chip" + (GSET.group === g ? " on" : ""), onclick: () => { GSET.group = g; route(); } }, g === "All" ? "All" : g === "Cross-domain" ? "Across the course" : `Domain ${g.slice(1)}`)));
  els.push(h("div", { class: "card" }, h("div", { class: "row" }, h("div", { style: "flex:1;min-width:240px" }, search),
    h("select", { "aria-label": "View", onchange: e => { GSET.view = e.target.value; render(); } }, [["topic", "By topic"], ["az", "A–Z"]].map(([v, t]) => h("option", { value: v, selected: GSET.view === v ? true : null }, t))),
    h("select", { "aria-label": "Objective", onchange: e => { GSET.obj = e.target.value; render(); } }, h("option", { value: "" }, "All objectives"), DATA.objectives.map(o => h("option", { value: o.objective_id, selected: GSET.obj === o.objective_id ? true : null }, `${o.objective_id} ${o.official_wording.slice(0, 48)}`))),
    h("span", { class: "small" }, `${DATA.glossary.length} terms`)), chips), list);
  render();
  return els;
}
function termEl(t) {
  return h("details", { class: "term" }, h("summary", null, h("span", null, t.term), h("span", { class: "small" }, t.objectives.join(", "))),
    h("dl", null, h("dt", null, "Definition"), h("dd", null, t.definition), h("dt", null, "Why architects need it"), h("dd", null, t.architect_significance),
      h("dt", null, "Exam relevance"), h("dd", null, t.exam_relevance), h("dt", null, "Common confusion"), h("dd", null, t.common_confusion),
      h("dt", null, "Related"), h("dd", null, t.related.length ? t.related.map(r => h("button", { class: "linkbtn", onclick: () => { GSET.q = r; GSET.group = "All"; route(); } }, r)) : "–"),
      h("dt", null, "Objectives"), h("dd", null, t.objectives.map(o => h("a", { href: `#/learn/${o}`, style: "margin-right:8px" }, o))),
      t.source ? [h("dt", null, "Source"), h("dd", { class: "small" }, t.source)] : null));
}

/* ---- Progress ---- */
function viewProgress(params) {
  const st = computeStats(), last = S.mocks[S.mocks.length - 1];
  const els = [h("h1", null, "Your progress"), h("p", { class: "lede" }, "Accuracy by domain against a 75% line. The pass mark is a scaled 720, which can't be converted exactly from a raw score, so treat 75% correct per domain as the working target. Any domain under 70% is a repair target whatever your total."),
    h("div", { class: "stats" }, stat("Questions seen", `${st.seen} / ${DATA.questions.length}`), stat("Answers given", st.n), stat("Accuracy", st.n ? st.acc + "%" : "–"),
      stat("Learn parts", `${st.learnDone} / ${DATA.objectives.length}`), stat("Mocks", S.mocks.length), stat("Last mock", last ? last.score + "%" : "none yet"))];
  const dc = h("div", { class: "card" }, h("div", { class: "eyebrow", style: "margin-bottom:8px" }, "By domain"));
  for (const d of DATA.domains) { const x = st.byD[d.domain_id];
    dc.append(h("div", { class: "dom-row" }, h("div", null, h("b", null, `Domain ${d.domain_id.slice(1)}`), h("div", { class: "small" }, d.name)), domBar(x.acc, x.n, DCOLOR[d.domain_id]), h("div", { class: "pct" }, x.n ? x.acc + "%" : "–"))); }
  els.push(dc);
  els.push(h("div", { class: "card" }, h("h2", { style: "margin-top:0" }, "Domain readiness"), h("table", null,
    h("tr", null, ["Domain", "Weight", "Coverage", "Accuracy", "Status", "Recommended action"].map(t => h("th", null, t))),
    DATA.domains.map(d => { const x = st.byD[d.domain_id]; return h("tr", null, h("td", null, `${d.domain_id} ${d.name}`), h("td", null, d.weight + "%"), h("td", null, `${x.seen}/${x.total} (${pct(x.seen, x.total)}%)`), h("td", null, x.n ? `${x.acc}% (${x.c}/${x.n})` : "–"), h("td", null, statusTag(x.status)), h("td", { class: "small" }, actionFor(x.status, d.domain_id))); }))));
  const rep = repairFirst(st.byO);
  els.push(h("div", { class: "card", style: "border-left:4px solid var(--bad)" }, h("h2", { style: "margin-top:0" }, "Repair First"),
    h("p", { class: "small" }, "Ranked by severity of weakness × exam weight × prerequisite importance. Not-started objectives count as weaknesses until you attempt them."),
    rep.length ? h("ol", null, rep.map(r => h("li", { style: "margin:6px 0" }, `${r.o.objective_id} ${r.o.official_wording} `, statusTag(r.st.status), r.st.n ? ` ${r.st.acc}%` : "", " · ",
      h("a", { href: `#/learn/${r.o.objective_id}` }, "Learn"), " · ", h("a", { href: `#/practice?obj=${r.o.objective_id}&start=1` }, "Practise")))) : h("p", null, "Everything is at READY. Keep it there with mixed practice and mocks.")));
  els.push(h("div", { class: "card" }, h("h2", { style: "margin-top:0" }, "Objective readiness"), h("table", null,
    h("tr", null, ["Objective", "Seen", "Accuracy", "Learn", "Status"].map(t => h("th", null, t))),
    DATA.objectives.map(o => { const x = st.byO[o.objective_id]; return h("tr", null, h("td", null, h("a", { href: `#/learn/${o.objective_id}` }, o.objective_id), " ", o.official_wording), h("td", null, `${x.seen}/${x.total}`), h("td", null, x.n ? x.acc + "%" : "–"), h("td", null, (S.learn[o.objective_id] || {}).done ? "✓" : ""), h("td", null, statusTag(x.status))); }))));
  const fileIn = h("input", { type: "file", accept: "application/json", "aria-label": "Import progress file" });
  const msg = h("div", { class: "small", role: "status" });
  fileIn.onchange = () => { const f = fileIn.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => {
    try { const d = JSON.parse(r.result); if (!d || typeof d.answers !== "object" || !Array.isArray(d.mocks)) throw new Error("not a trainer progress file"); S = Object.assign(blankState(), d); save(); msg.textContent = "Progress imported."; route(); }
    catch (e) { msg.textContent = "Import failed: " + e.message; } }; r.readAsText(f); };
  const xfer = h("div", { class: "card", id: "transfer" }, h("h2", { style: "margin-top:0" }, "Move progress to another computer"),
    h("p", { class: "small" }, "Progress is saved only in this browser. Export a file here, then import it in the trainer on another computer or browser."),
    h("div", { class: "row" }, h("button", { class: "btn primary", onclick: () => {
      const blob = new Blob([JSON.stringify(S, null, 1)], { type: "application/json" }), a = h("a", { href: URL.createObjectURL(blob), download: `ccarp-progress-${new Date().toISOString().slice(0, 10)}.json` });
      document.body.append(a); a.click(); a.remove(); } }, "Export progress"), h("label", { class: "btn" }, "Import progress", h("span", { style: "display:none" }, fileIn)),
      confirmBtn("Reset all progress", () => { S = blankState(); save(); route(); }, "Erase everything?")), msg);
  els.push(xfer);
  if (params.get("transfer")) setTimeout(() => xfer.scrollIntoView({ behavior: "smooth" }), 50);
  return els;
}

/* ---------------- router ---------------- */
function route() {
  const app = document.getElementById("app");
  const [path, qs] = (location.hash.slice(1) || "/home").split("?");
  const params = new URLSearchParams(qs || ""), parts = path.split("/").filter(Boolean), top = parts[0] || "home";
  document.querySelectorAll(".nav a").forEach(a => a.classList.toggle("active", a.dataset.route === top));
  document.getElementById("nav").classList.remove("open");
  let view;
  try {
    if (top === "practice") view = parts[1] === "run" ? viewPracticeRun() : viewPractice(params);
    else if (top === "mock") view = parts[1] === "run" ? viewMockRun() : parts[1] === "result" ? viewMockResult(+parts[2]) : viewMock();
    else if (top === "learn") view = parts[1] ? viewLearnPart(parts[1]) : viewLearn();
    else if (top === "glossary") view = viewGlossary();
    else if (top === "progress") view = viewProgress(params);
    else view = viewHome();
  } catch (e) { console.error(e); view = [h("div", { class: "notice" }, "Something went wrong rendering this page: " + e.message)]; }
  const y = window.scrollY;
  app.replaceChildren(...view);
  if (window.__keepScroll) window.scrollTo(0, y);
}
window.addEventListener("hashchange", () => { window.__keepScroll = false; route(); window.scrollTo(0, 0); });

async function boot() {
  try {
    const get = f => fetch("content/" + f).then(r => { if (!r.ok) throw new Error(f + " " + r.status); return r.json(); });
    const [o, q, g, l] = await Promise.all([get("objectives.json"), get("questions.json"), get("glossary.json"), get("learn.json")]);
    DATA = { objectives: o.objectives, domains: o.domains, questions: q.questions, glossary: g.terms, episodes: l.episodes, maps: { obj: {}, q: {}, part: {} } };
    o.objectives.forEach(x => DATA.maps.obj[x.objective_id] = x);
    q.questions.forEach(x => DATA.maps.q[x.question_id] = x);
    l.episodes.forEach(e => e.parts.forEach(p => DATA.maps.part[p.objective_id] = p));
  } catch (e) {
    document.getElementById("app").replaceChildren(h("div", { class: "notice" }, "Couldn't load content: " + e.message));
    return;
  }
  load();
  // drop references to questions that no longer exist (content updates)
  if (S.session) S.session.ids = S.session.ids.filter(id => DATA.maps.q[id]);
  if (S.mock) S.mock.ids = S.mock.ids.filter(id => DATA.maps.q[id]);
  document.getElementById("menuToggle").onclick = () => document.getElementById("nav").classList.toggle("open");
  // re-render keeps scroll position for in-page interactions
  window.__keepScroll = true;
  route();
}
document.addEventListener("click", e => { if (e.target.closest("button")) window.__keepScroll = true; }, true);
boot();
