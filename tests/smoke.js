// Run: npm install --prefix tests && node tests/smoke.js
// Smoke and flow tests for the CCAR-P trainer, using jsdom.
const fs = require("fs"), path = require("path");
const { JSDOM } = require("jsdom");
const REPO = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(REPO, "site/index.html"), "utf8").replace('<script src="app.js"></script>', "");
const app = fs.readFileSync(path.join(REPO, "site/app.js"), "utf8");
let failures = 0;
const ok = (c, m) => { if (!c) { failures++; console.log("FAIL:", m); } else console.log("ok  ", m); };

const dom = new JSDOM(html, { url: "https://example.test/CCAR-P/", runScripts: "outside-only", pretendToBeVisual: true });
const w = dom.window;
w.fetch = async u => { const f = path.join(REPO, "content", String(u).replace(/^content\//, "").replace(/\?.*$/, "")); return { ok: fs.existsSync(f), status: 200, json: async () => JSON.parse(fs.readFileSync(f, "utf8")) }; };
w.scrollTo = () => {}; w.HTMLElement.prototype.scrollIntoView = () => {};
w.eval(app.replace('"use strict";', "") + "\nwindow.__t = { get S(){ return S; }, get DATA(){ return DATA; } };");

const tick = (ms = 30) => new Promise(r => setTimeout(r, ms));
const go = async h => { w.location.hash = h; await tick(); };
const $ = s => w.document.querySelector(s), $$ = s => [...w.document.querySelectorAll(s)];
const txt = () => $("#app").textContent;
const clickText = (sel, t) => { const b = $$(sel).find(x => x.textContent.includes(t)); if (!b) throw new Error("no button " + t); b.click(); return b; };

(async () => {
  await tick(100);
  ok(txt().includes("Prepare for the CCAR-P exam"), "home renders");
  ok(txt().includes("63") && txt().includes("720 / 1000"), "home shows exam facts");
  ok($$(".dom-row").length === 7, "home domain readiness has 7 rows");

  for (const r of ["#/practice", "#/mock", "#/learn", "#/glossary", "#/progress", "#/learn/3.6"]) { await go(r); ok(!txt().includes("Something went wrong") && txt().length > 200, "route renders " + r); }

  // Practice flow: select D3, 5 questions, smart mix
  await go("#/practice");
  ok($$(".dcard").length === 7, "practice shows 7 domain cards");
  $$(".dcard")[2].click(); await tick();
  ok($$(".dcard")[2].classList.contains("on"), "domain card toggles on");
  const sel = $$("select")[0]; sel.value = "5"; sel.dispatchEvent(new w.Event("change"));
  clickText("button", "Start practice"); await tick();
  ok(w.location.hash === "#/practice/run", "practice session starts");
  let answered = 0, correct = 0;
  for (let i = 0; i < 5; i++) {
    const card = txt();
    ok(/Question \d+ of 5/.test(card), `practice q${i + 1} header`);
    ok(card.includes("D3"), `practice q${i + 1} is from D3`);
    const need = card.includes("Select 2") ? 2 : 1;
    for (let k = 0; k < need; k++) { $$(".opt:not(.sel)")[0].click(); await tick(); }
    clickText("button", "Submit answer"); await tick();
    ok($(".feedback") && txt().includes("KEY EXAM LESSON") && txt().includes("Why each alternative is weaker"), `feedback shown q${i + 1}`);
    answered++; if (txt().includes("✓ Correct")) correct++;
    clickText("button", i < 4 ? "Next question" : "Finish session"); await tick();
  }
  ok(txt().includes("Session complete"), "practice summary shown");
  const st = w.eval("computeStats()");
  ok(st.n === 5 && st.seen === 5 && st.byD.D3.n === 5, "stats recorded 5 answers in D3");

  // Mode filters
  const inc = w.eval(`pickPractice({domains:[],objectives:[],n:50,difficulty:"All",mode:"incorrect"})`);
  ok(inc.length === 5 - correct, `incorrect-previously pool = ${inc.length} (expected ${5 - correct})`);
  const nw = w.eval(`pickPractice({domains:[],objectives:[],n:500,difficulty:"All",mode:"new"})`), totalQ = w.__t.DATA.questions.length;
  ok(nw.length === totalQ - 5, `new-questions pool excludes seen (${totalQ - 5})`);
  const smart = w.eval(`pickPractice({domains:[],objectives:[],n:21,difficulty:"All",mode:"smart"})`);
  const dist = {}; smart.forEach(id => { const d = id.slice(0, 2); dist[d] = (dist[d] || 0) + 1; });
  ok(smart.length === 21 && dist.D3 >= 3 && dist.D7 >= 1, "smart mix 21 is weighted across domains " + JSON.stringify(dist));
  const hard = w.eval(`pickPractice({domains:["D5"],objectives:[],n:50,difficulty:"Hard",mode:"domain"})`);
  ok(hard.length > 0 && hard.every(id => id.startsWith("D5")), "domain focus + difficulty filter");

  // Mock: blueprint draw
  const draw = w.eval("drawMock(null)");
  ok(draw.ids.length === 63, "mock draws 63 items");
  const md = {}; draw.ids.forEach(id => { const d = id.slice(0, 2); md[d] = (md[d] || 0) + 1; });
  ok(JSON.stringify(md, Object.keys(md).sort()) === JSON.stringify({ D1: 11, D2: 8, D3: 12, D4: 10, D5: 9, D6: 9, D7: 4 }), "mock blueprint 11/8/12/10/9/9/4 " + JSON.stringify(md));
  ok(new Set(draw.ids).size === 63, "mock has no duplicates");
  const half = w.eval(`drawMock(["D1","D2","D3","D4"])`);
  ok(half.ids.length === 32 && half.ids.every(id => /^D[1-4]/.test(id)), "half mock 32 items from D1–D4");

  // Run an exam-mode mock: answer 10, submit
  await go("#/mock");
  clickText("button", "Start a new mock"); await tick();
  ok(w.location.hash === "#/mock/run" && $("#timer"), "mock run with timer");
  ok(!$(".feedback"), "exam mode shows no feedback");
  for (let i = 0; i < 10; i++) {
    const need = txt().includes("Select 2") ? 2 : 1;
    for (let k = 0; k < need; k++) { $$(".opt:not(.sel)")[0].click(); await tick(); }
    ok(!$(".feedback"), `no feedback after answering q${i + 1} in exam mode`);
    clickText("button", "Next →"); await tick();
  }
  clickText("button", "Flag for review"); await tick();
  ok($$(".navgrid button.flag").length === 1, "flagging works");
  clickText("button", "Submit exam"); await tick();
  ok(txt().includes("unanswered"), "submit confirmation shows unanswered count");
  clickText("button", "Yes"); await tick(60);
  ok(w.location.hash.startsWith("#/mock/result/"), "mock result route");
  ok(txt().includes("Performance by domain") && txt().includes("Performance by objective") && txt().includes("Repair First") && txt().includes("Incorrect or unanswered"), "mock result sections");
  ok(txt().includes("not a conversion"), "study-target disclaimer on result");
  const mocks = w.__t.S.mocks;
  ok(mocks.length === 1 && mocks[0].items.length === 63, "mock recorded");

  // Coach-mode mock reveals feedback after Check
  await go("#/mock");
  const coach = $$("input[type=checkbox]")[1]; coach.checked = true; coach.dispatchEvent(new w.Event("change"));
  clickText("button", "Start a new mock"); await tick();
  const need = txt().includes("Select 2") ? 2 : 1;
  for (let k = 0; k < need; k++) { $$(".opt:not(.sel)")[0].click(); await tick(); }
  clickText("button", "Check answer"); await tick();
  ok($(".feedback"), "coach mode shows feedback after Check answer");
  await go("#/mock"); ok(txt().includes("Mock exam in progress"), "mock can be paused and resumed");

  // Learn part + knowledge check
  await go("#/learn");
  ok($$(".ep").length === 7 && $$(".part").length === 38, "learn: 7 episodes, 38 parts");
  await go("#/learn/1.3");
  ok(txt().includes("Select appropriate architectural patterns") && $$(".narr p").length >= 4, "learn part shows objective + narration paragraphs");
  ok($$(".narr h3").length >= 3 && $$(".toc a").length === $$(".narr h3").length, "learn part shows section headings and an in-part contents list");
  ok(txt().includes("Architecture decision") && txt().includes("Sources:") && txt().includes("[MODULE 1]"), "learn part shows architecture decision and sources");
  ok(txt().includes("Read-aloud isn't available") || $(".player"), "player or fallback shown");
  for (let i = 0; i < 3; i++) { const groups = $$(".card .qtext").length; const opts = $$(".card .opt:not([disabled])"); opts[0].click(); await tick(); }
  ok(w.__t.S.learn["1.3"].done === true, "learn part completes after 3 checks");
  ok($$(".feedback").length === 3, "3 check feedbacks shown");
  // Focus tab: no report yet, then a report, a ranked list, a plan and a focus mock
  if (w.__t.S.mock) w.__t.S.mock = null;
  w.__t.S.report = null; await go("#/home"); await go("#/focus");
  ok(txt().includes("Import score-report file") && txt().includes("Enter scores manually"), "focus: prompts for a score report when none is stored");
  w.__t.S.report = {"exam": "CCAR-P", "date": "2026-01-01", "score": 600, "passing": 720, "objectives": {"1.3": 10, "1.4": 25, "1.5": 40, "1.6": 55, "2.1": 80, "2.3": 90, "2.4": 10, "3.1": 25, "3.2": 40, "3.4": 55, "3.5": 80, "3.6": 90, "3.7": 10, "3.8": 25, "4.1": 40, "4.2": 55, "4.3": 80, "4.5": 90, "4.6": 100, "5.1": 100, "5.2": 100, "5.3": 100, "5.4": 100, "6.1": 100, "6.2": 100, "6.3": 100, "6.4": 100, "7.1": 100, "7.2": 100, "7.3": 100, "2.5": 0, "1.2": 67}}; // synthetic test data
  await go("#/home"); await go("#/focus");
  ok(txt().includes("Objectives below 100% (20)") && txt().includes("Not on your report (6)"), "focus: 20 weak and 6 unreported objectives listed");
  ok(txt().includes("Focus plan · 7 study days"), "focus: plan groups weak objectives into days");
  ok($$(".card h3")[0] && txt().indexOf("2.5 Implement prompt reuse") < txt().indexOf("1.2 Design end-to-end"), "focus: 0% objectives rank above 67% ones");
  clickText("button", "Start focus mock"); await tick();
  const fm = w.__t.S.mock, weakIds = new Set(Object.entries(w.__t.S.report.objectives).filter(([, v]) => v < 100).map(([k]) => k));
  ok(fm && fm.scope === "focus" && fm.ids.length === 30 && fm.ids.every(id => weakIds.has(w.__t.DATA.maps.q[id].objective_id)), "focus mock: 30 items, all from weak objectives");
  ok(new Set(fm.ids).size === fm.ids.length && fm.limit === 58 * 60, "focus mock: no duplicates; 58-minute limit");
  ok(txt().includes("Focus mock · Exam mode"), "focus mock runs in exam mode");
  w.__t.S.mock = null;

  // Test me on this → auto-start practice on objective
  await go("#/practice?obj=4.4&start=1"); await tick();
  ok(w.location.hash === "#/practice/run" && txt().includes("Obj 4.4"), "Test-me starts an objective session");

  // Glossary
  await go("#/glossary");
  ok($$("details.term").length === 124, "glossary renders 124 terms");
  const s = $("input[type=search]"); s.value = "reciprocal"; s.dispatchEvent(new w.Event("input")); await tick();
  ok($$("details.term").length >= 1 && $$("details.term").length <= 3 && txt().includes("Reciprocal rank fusion"), "glossary search narrows results (" + $$("details.term").length + ")");
  s.value = ""; s.dispatchEvent(new w.Event("input")); await tick();
  clickText(".chip", "Domain 3"); await tick();
  ok($$("details.term").length === 21, "glossary filter Domain 3 = 21 terms");
  const view = $$("select")[0]; view.value = "az"; view.dispatchEvent(new w.Event("change")); await tick();
  ok($$("details.term").length === 21, "A–Z view keeps filter");

  // Progress
  await go("#/progress");
  ok(txt().includes("Repair First") && txt().includes("Domain readiness") && txt().includes("Objective readiness"), "progress sections");
  ok(txt().includes("Move progress to another computer") && txt().includes("Export progress"), "export/import offered");
  ok($$("table")[0].querySelectorAll("tr").length === 8, "domain readiness table has 7 rows");

  // Persistence round trip
  const saved = JSON.parse(w.localStorage.getItem("ccarp-trainer-v1"));
  ok(saved && Object.keys(saved.answers).length > 5 && saved.mocks.length === 1, "state persisted to localStorage");

  // Mobile nav toggle exists
  ok($("#menuToggle"), "mobile menu toggle present");

  console.log(failures ? `\n${failures} FAILURE(S)` : "\nALL TESTS PASSED");
  process.exit(failures ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
