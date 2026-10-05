import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

/**
 * 客户端行为测试（1.1.5 补齐）。
 * 抽真实的函数源码，用替身 DOM / fetch / 定时器把四条最容易被静默改坏的路径跑通：
 *   applyVars           —— 面板/窗口/模糊/压暗这些 CSS 变量的钳位与兜底
 *   applyAutoInk        —— 深浅字自动切换与「同一状态不重复写」
 *   classifyTile        —— 缩略图深浅判定的排队与去重
 *   syncBlurFromState   —— 从宿主拉持久化的模糊值
 *   auditSelectors      —— 1.1.5 新增：DSH 选择器静默失效告警
 *   modeAfterPick       —— 1.1.6 新增：手选壁纸不关掉自动轮换
 */
const SOURCE = readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8');

function slice(startMarker, endMarker) {
  const startAt = SOURCE.indexOf(startMarker);
  if (startAt < 0) throw new Error('找不到起点：' + startMarker.slice(0, 40));
  const endAt = SOURCE.indexOf(endMarker, startAt + startMarker.length);
  if (endAt < 0) throw new Error('找不到终点：' + endMarker.slice(0, 40));
  return SOURCE.slice(startAt, endAt);
}

const APPLYVARS_BLOCK = slice('\n\t\tfunction applyVars(config) {', '\n\t\tvar CONTROL_ID = "dsh-wp-blur-pill";');
const INK_BLOCK = slice('\n\t\tvar AUTO_LIGHT = [', '\n\t\tfunction cleanupCodeInk() {');
const SYNCBLUR_BLOCK = slice('\n\t\tfunction syncBlurFromState() {', '\n\t\t/** Settings');
const CLASSIFY_BLOCK = slice('\n\t\t\t\tvar inkQueue = [];', '\n\t\t\t\tfunction inkBadge(kind, name) {');
const AUDIT_BLOCK = slice('\n\t\tvar UI_SELECTORS = [', '\n\t\tfunction collect() {');
const MODEPICK_BLOCK = slice('\n\t\t\tfunction modeAfterPick(', '\n\t\t\tfunction nextIndex(');

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

/* ---------- applyVars ---------- */

function makeApplyVars() {
  const props = {};
  const control = { values: [], setValue(value) { this.values.push(value); } };
  const body = {
    style: {
      setProperty: (key, value) => { props[key] = value; },
      removeProperty: (key) => { delete props[key]; },
    },
  };
  const factory = new Function('document', 'blurControl', APPLYVARS_BLOCK + '\nreturn applyVars;');
  return { props, control, applyVars: factory({ body }, control) };
}

test('applyVars：缺省配置用 0.22 / 0.94 / 0.45 兜底，不写 position', () => {
  const h = makeApplyVars();
  h.applyVars({});
  assert.equal(h.props['--dsh-wp-panel'], '22%');
  assert.equal(h.props['--dsh-wp-panel-strong'], '48%');
  assert.equal(h.props['--dsh-wp-blur'], '0px');
  assert.equal(h.props['--dsh-wp-blur-scale'], '1');
  assert.equal(h.props['--dsh-wp-window'], '94%');
  assert.equal(h.props['--dsh-wp-dim'], '0.45');
  assert.equal('--dsh-wp-position' in h.props, false);
});

test('applyVars：正常配置逐项换算，并把 blur 同步给滑块', () => {
  const h = makeApplyVars();
  h.applyVars({ panelOpacity: 0.5, blur: 8, windowOpacity: 0.96, dim: 0, position: 'center' });
  assert.equal(h.props['--dsh-wp-panel'], '50%');
  assert.equal(h.props['--dsh-wp-panel-strong'], '76%');
  assert.equal(h.props['--dsh-wp-blur'], '8px');
  assert.equal(h.props['--dsh-wp-blur-scale'], String(1 + 8 / 150));
  assert.equal(h.props['--dsh-wp-window'], '96%');
  assert.equal(h.props['--dsh-wp-dim'], '0');
  assert.equal(h.props['--dsh-wp-position'], 'center');
  assert.deepEqual(h.control.values, [8], '滑块必须跟着配置走');
});

test('applyVars：越界与非法值全部钳到合法区间', () => {
  const h = makeApplyVars();
  h.applyVars({ panelOpacity: 5, blur: -3, windowOpacity: -1, dim: 9 });
  assert.equal(h.props['--dsh-wp-panel'], '100%');
  assert.equal(h.props['--dsh-wp-blur'], '0px');
  assert.equal(h.props['--dsh-wp-window'], '0%');
  assert.equal(h.props['--dsh-wp-dim'], '1');

  h.applyVars({ panelOpacity: 'nope', blur: 900, windowOpacity: 'nope', dim: 'nope' });
  assert.equal(h.props['--dsh-wp-panel'], '22%');
  assert.equal(h.props['--dsh-wp-blur'], '60px');
  assert.equal(h.props['--dsh-wp-window'], '94%');
  assert.equal(h.props['--dsh-wp-dim'], '0.45');
});

/* ---------- applyAutoInk ---------- */

function makeAutoInk(luma) {
  const writes = [];
  const el = {
    dataset: {},
    bg: 'rgb(10, 10, 10)',
    style: {
      setProperty: (key, value) => { writes.push(key + '=' + value); el.props[key] = value; },
      removeProperty: (key) => { delete el.props[key]; },
    },
    props: {},
  };
  const body = { dataset: {}, hasAttribute: () => false };
  const factory = new Function('document', 'getComputedStyle', 'effectiveLuma', INK_BLOCK + '\nreturn applyAutoInk;');
  const applyAutoInk = factory({ body }, (node) => ({ backgroundColor: node.bg }), () => luma);
  return { el, writes, applyAutoInk };
}

test('applyAutoInk：亮背景切深字、暗背景切浅字，并打上 ink 标记', () => {
  const bright = makeAutoInk(200);
  assert.equal(bright.applyAutoInk(bright.el), 200);
  assert.equal(bright.el.dataset.dshWpAutoInk, 'dark');
  assert.equal(bright.el.dataset.dshWpInk, 'dark');
  assert.equal(bright.el.props.color, '#0f1115');
  assert.equal(bright.el.props['--dsw-alias-label-primary'], 'var(--dsw-static-neutral-bluish-1000)');

  const dark = makeAutoInk(20);
  assert.equal(dark.applyAutoInk(dark.el), 20);
  assert.equal(dark.el.dataset.dshWpAutoInk, 'light');
  assert.equal(dark.el.dataset.dshWpInk, 'light');
  assert.equal(dark.el.props.color, '#ffffff');
  assert.equal(dark.el.props['--dsw-alias-label-primary'], 'var(--dsw-static-neutral-bluish-50)');
});

test('applyAutoInk：同一状态第二次调用直接返回，不重复写样式', () => {
  const h = makeAutoInk(30);
  h.applyAutoInk(h.el);
  const before = h.writes.length;
  assert.equal(h.applyAutoInk(h.el), undefined, '状态没变就不该再写一遍');
  assert.equal(h.writes.length, before);
});

test('applyAutoInk：取不到亮度时保持沉默（不写坏任何标记）', () => {
  const h = makeAutoInk(undefined);
  assert.equal(h.applyAutoInk(h.el), undefined);
  assert.equal('dshWpAutoInk' in h.el.dataset, false);
  assert.equal('color' in h.el.props, false);
});

/* ---------- classifyTile ---------- */

function makeClassify() {
  const calls = [];
  const pending = [];
  const inkCache = {};
  const inkPending = {};
  let mode = 'sync';
  const factory = new Function('classifySource', 'inkCache', 'inkPending', 'rememberInk', CLASSIFY_BLOCK + '\nreturn classifyTile;');
  const classifyTile = factory(
    (src, done) => { calls.push(src); if (mode === 'sync') done('light'); else pending.push(done); },
    inkCache,
    inkPending,
    (key, value) => { if (value !== undefined) inkCache[key] = value; },
  );
  return { classifyTile, calls, inkCache, inkPending, pending, setMode: (value) => { mode = value; } };
}

test('classifyTile：判定结果入缓存，同一张图不再重复采样', async () => {
  const h = makeClassify();
  h.classifyTile('image', 'a.png', '/wallpaper/file/a.png');
  await flush();
  assert.equal(h.inkCache['image:a.png'], 'light');
  assert.equal(h.inkCache['image:a.png'] === undefined, false);
  h.classifyTile('image', 'a.png', '/wallpaper/file/a.png');
  await flush();
  assert.equal(h.calls.length, 1, '缓存命中就不该再抽一次缩略图');
});

test('classifyTile：排队期间重复点击只入队一次，完成后才缓存', async () => {
  const h = makeClassify();
  h.setMode('manual');
  h.classifyTile('video', 'b.mp4', '/wallpaper/file/b.mp4');
  h.classifyTile('video', 'b.mp4', '/wallpaper/file/b.mp4');
  assert.equal(h.inkPending['video:b.mp4'], true);
  assert.equal(h.calls.length, 1, '在途任务必须去重');
  assert.equal(h.inkCache['video:b.mp4'], undefined);
  h.pending[0]('dark');
  await flush();
  assert.equal(h.inkCache['video:b.mp4'], 'dark');
  assert.equal(h.inkPending['video:b.mp4'], undefined);
});

/* ---------- syncBlurFromState ---------- */

function makeSyncBlur(blurControl, response) {
  const applied = [];
  let fetches = 0;
  let reports = 0;
  const fetchStub = () => {
    fetches += 1;
    return typeof response === 'function' ? response() : Promise.resolve(response);
  };
  const factory = new Function('fetch', 'ROUTE', 'blurControl', 'reportClient', SYNCBLUR_BLOCK + '\nreturn syncBlurFromState;');
  const control = blurControl === null ? null : { apply: (value) => { applied.push(value); } };
  const syncBlurFromState = factory(fetchStub, '/wallpaper', control, () => { reports += 1; });
  return { syncBlurFromState, applied, reports: () => reports, fetches: () => fetches };
}

test('syncBlurFromState：没有滑块就直接返回，不发请求', async () => {
  const h = makeSyncBlur(null, { ok: true, json: () => Promise.resolve({ blur: 12 }) });
  h.syncBlurFromState();
  await flush();
  assert.equal(h.fetches(), 0);
});

test('syncBlurFromState：拿到 blur 后同步给滑块并回报一次', async () => {
  const h = makeSyncBlur({}, { ok: true, json: () => Promise.resolve({ blur: 12 }) });
  h.syncBlurFromState();
  await flush();
  assert.deepEqual(h.applied, [12]);
  assert.equal(h.reports(), 1);
});

test('syncBlurFromState：非法 blur 不写滑块', async () => {
  const h = makeSyncBlur({}, { ok: true, json: () => Promise.resolve({ blur: 'abc' }) });
  h.syncBlurFromState();
  await flush();
  assert.deepEqual(h.applied, []);
});

test('syncBlurFromState：请求失败被吞掉，不产生未处理的 rejection', async () => {
  const h = makeSyncBlur({}, () => Promise.reject(new Error('offline')));
  h.syncBlurFromState();
  await flush();
  assert.deepEqual(h.applied, []);
});

/* ---------- auditSelectors（1.1.5） ---------- */

const COMPOSER_ANCHOR = 'textarea, [contenteditable]';
const COMPOSER_SELECTOR = '[class*="_composer"]';

function makeAudit(counts) {
  const warnings = [];
  const notes = [];
  const document = {
    querySelectorAll: (selector) => ({ length: Object.prototype.hasOwnProperty.call(counts, selector) ? counts[selector] : 0 }),
  };
  const factory = new Function('document', 'console', 'noteError', AUDIT_BLOCK + '\nreturn { audit: auditSelectors, health: function () { return selectorHealth; } };');
  const api = factory(document, { warn: (message) => { warnings.push(message); } }, (kind, message) => { notes.push({ kind, message }); });
  return { api, counts, warnings, notes };
}

test('auditSelectors：锚点在场但选择器落空，连续两轮才告警一次', () => {
  const h = makeAudit({ [COMPOSER_ANCHOR]: 1 });
  assert.equal(h.api.audit(), 0, '第一轮落空可能只是渲染中途');
  assert.deepEqual(h.api.health().missing, []);
  assert.equal(h.warnings.length, 0);

  assert.equal(h.api.audit(), 1, '第二轮仍然落空就必须确认失效');
  assert.deepEqual(h.api.health().missing, ['composer']);
  assert.equal(h.warnings.length, 1);
  assert.equal(h.notes.length, 1);
  assert.equal(h.notes[0].kind, 'selector-missing');

  assert.equal(h.api.audit(), 1, '持续失效不重复刷告警');
  assert.equal(h.warnings.length, 1);
});

test('auditSelectors：选择器恢复后再失效，会重新告警', () => {
  const h = makeAudit({ [COMPOSER_ANCHOR]: 1 });
  h.api.audit();
  h.api.audit();
  assert.equal(h.warnings.length, 1);

  h.counts[COMPOSER_SELECTOR] = 2;
  assert.equal(h.api.audit(), 0, '选择器回来就算恢复');
  assert.deepEqual(h.api.health().missing, []);

  h.counts[COMPOSER_SELECTOR] = 0;
  h.api.audit();
  assert.equal(h.api.audit(), 1);
  assert.equal(h.warnings.length, 2, '恢复后再次失效应该重新告警');
});

test('auditSelectors：锚点不在场（界面本来就没这一块）不算失效', () => {
  const h = makeAudit({});
  h.api.audit();
  h.api.audit();
  assert.deepEqual(h.api.health().missing, []);
  assert.equal(h.warnings.length, 0);
  const detail = h.api.health().detail;
  assert.equal(detail.length, 8, '每个选择器都要留下体检明细');
  assert.equal(detail.every((item) => item.matched === 0), true);
  assert.equal(detail.find((item) => item.id === 'composer').anchored, false);
});

test('auditSelectors：命中时记录匹配数与命中的那条选择器', () => {
  const h = makeAudit({ '[class*="_bubble"]': 3, 'pre': 1, 'code': 4, '[class*="_avatar"]': 2 });
  h.api.audit();
  const detail = h.api.health().detail;
  const bubble = detail.find((item) => item.id === 'bubble');
  assert.equal(bubble.matched, 3);
  assert.equal(bubble.selector, '[class*="_bubble"]');
  assert.equal(detail.find((item) => item.id === 'code').matched, 5, 'pre 与 code 要合并计数');
  assert.equal(h.api.health().checks, 1);
  assert.deepEqual(h.api.health().missing, []);
});

/* ---------- modeAfterPick（1.1.6） ---------- */

const modeAfterPick = new Function(MODEPICK_BLOCK + '\nreturn modeAfterPick;')();

test('modeAfterPick：轮换开着时手选任何壁纸都保持轮换', () => {
  assert.equal(modeAfterPick('rotate', 'image'), 'rotate', '点静态图不能退出轮换');
  assert.equal(modeAfterPick('rotate', 'video'), 'rotate', '点动态壁纸不能退出轮换');
});

test('modeAfterPick：其他模式按各自的目标模式走', () => {
  assert.equal(modeAfterPick('image', 'image'), 'image');
  assert.equal(modeAfterPick('image', 'video'), 'video');
  assert.equal(modeAfterPick('video', 'image'), 'image');
});

test('modeAfterPick：模式缺失或异常时退回目标模式，不会写出 undefined', () => {
  assert.equal(modeAfterPick(undefined, 'video'), 'video');
  assert.equal(modeAfterPick(null, 'image'), 'image');
  assert.equal(modeAfterPick('ROTATE', 'video'), 'video');
});
