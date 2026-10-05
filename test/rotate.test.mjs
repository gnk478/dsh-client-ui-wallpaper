import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

/**
 * 轮换加载路径测试（1.1.3 回归）。
 * 背景：1.1.1/1.1.2 的 rotate 分支丢了 `var seconds` / `var index` 声明，load() 一进分支就抛
 * ReferenceError，又被静默的 `.catch(function () {})` 吞掉 —— 壁纸整块不再绘制且没有任何提示。
 * 这里抽出真实的 load() 源码，用替身的 fetch / 定时器 / 节点工厂把整条路径跑通：
 * 只要 load() 里再出现未声明变量或提早年抛错，这个测试就会红。
 */
const SOURCE = readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8');
const START = '\n\t\t\tfunction load() {';
const END = '\n\t\t\tload();';
const startAt = SOURCE.indexOf(START);
const endAt = SOURCE.indexOf(END, startAt);
if (startAt < 0 || endAt < 0) throw new Error('找不到 load() 代码块');
const BLOCK = SOURCE.slice(startAt + 1, endAt);

const PARAMS = [
  'ROUTE', 'fetch', 'document', 'applyVars', 'syncBlurFromState', 'syncSidebarFromState',
  'paint', 'videoNode', 'imageNode', 'nextIndex', 'setTimeout', 'clearTimeout', 'setInterval',
  'clearInterval', 'PREWARM_MAX_BYTES', 'prewarmStats', 'scheduleProbe', 'auditSelectors',
];

const PRELUDE = [
  'var disposed = false;',
  'var autoInk = true;',
  'var appliedSignature;',
  'var paintNext = null;',
  'var pendingPaint = false;',
  'var timer;',
  'var prewarmTimer;',
  'var loadFailure = null;',
  'var sizeCache = {};',
].join('\n');

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

function makeHarness(listResult) {
  const painted = [];
  const intervals = [];
  const timeouts = [];
  const timeoutFns = [];
  const responses = Array.isArray(listResult) ? listResult.slice() : [listResult];
  let listCalls = 0;

  let audits = 0;
  const fetchStub = (url, init) => {
    const method = init && init.method ? init.method : 'GET';
    if (method === 'HEAD') return Promise.resolve({ headers: { get: () => '1024' } });
    listCalls += 1;
    const next = responses.length > 1 ? responses.shift() : responses[0];
    return typeof next === 'function' ? next() : Promise.resolve(next);
  };

  const factory = new Function(
    ...PARAMS,
    [
      PRELUDE,
      BLOCK,
      'return { load: load, peek: function () { return { loadFailure: loadFailure, appliedSignature: appliedSignature, timer: timer, prewarm: prewarmStats }; } };',
    ].join('\n'),
  );

  const api = factory(
    '/wallpaper',
    fetchStub,
    { hidden: false },
    () => {},
    () => {},
    () => {},
    (node) => { painted.push(node); },
    (name) => ({ tagName: 'VIDEO', name }),
    (name) => ({ tagName: 'IMG', name }),
    (i, total) => (i + 1) % total,
    (fn, delay) => { timeouts.push(delay); timeoutFns.push(fn); return timeouts.length; },
    () => {},
    (fn, delay) => { intervals.push(delay); return intervals.length; },
    () => {},
    50 * 1024 * 1024,
    { warmed: 0, skipped: 0, dropped: 0, last: null },
    () => {},
    () => { audits += 1; return 0; },
  );

  const runTimeout = async (i) => { timeoutFns[i](); await flush(); };

  return { api, painted, intervals, timeouts, calls: () => listCalls, runTimeout, audits: () => audits };
}

const okList = (config, overrides = {}) => ({
  ok: true,
  json: () => Promise.resolve({
    config,
    images: overrides.images || [],
    videos: overrides.videos || ['a.mp4', 'b.mp4', 'c.mp4'],
    sequence: overrides.sequence || [
      { kind: 'video', name: 'a.mp4' },
      { kind: 'video', name: 'b.mp4' },
      { kind: 'video', name: 'c.mp4' },
    ],
    liveMap: {},
    sizes: overrides.sizes || {},
  }),
});

test('轮换加载：画出当前项一次、定时器用 rotateSeconds、无失败记录', async () => {
  const h = makeHarness(okList({ mode: 'rotate', rotateSeconds: 45, shuffle: false, video: 'b.mp4', autoInk: true }));
  await h.api.load();
  await flush();
  assert.equal(h.painted.length, 1, 'rotate 分支只画一次（落空会重复画 video 分支）');
  assert.equal(h.painted[0].name, 'b.mp4', '首帧应停在 config.video 命中的那一项');
  assert.deepEqual(h.intervals, [45000], '轮换间隔必须是 rotateSeconds 秒');
  assert.equal(h.timeouts[0], 37000, '预热在 rotateSeconds - 8 秒后触发');
  assert.equal(h.api.peek().loadFailure, null);
  assert.equal(h.audits(), 1, 'load() 每轮都要做一次选择器体检');
});

test('轮换加载：rotateSeconds 非法或缺省时回落到 600 秒', async () => {
  const bad = makeHarness(okList({ mode: 'rotate', rotateSeconds: 3, shuffle: false, autoInk: true }));
  await bad.api.load();
  await flush();
  assert.deepEqual(bad.intervals, [600000]);

  const missing = makeHarness(okList({ mode: 'rotate', shuffle: false, autoInk: true }));
  await missing.api.load();
  await flush();
  assert.deepEqual(missing.intervals, [600000]);
});

test('轮换加载：load() 抛错不再被静默吞掉，记录到 loadFailure', async () => {
  const h = makeHarness(() => Promise.reject(new Error('boom')));
  await h.api.load();
  await flush();
  const failure = h.api.peek().loadFailure;
  assert.ok(failure, '失败必须留痕，否则壁纸空白一整天都没人知道');
  assert.equal(failure.name, 'Error');
  assert.equal(failure.message, 'boom');
  assert.equal(h.painted.length, 0);
});

test('轮换加载：下一次成功会清掉 loadFailure', async () => {
  let first = true;
  const h = makeHarness(() => {
    if (first) { first = false; return Promise.reject(new Error('boom')); }
    return Promise.resolve(okList({ mode: 'rotate', rotateSeconds: 60, shuffle: false, autoInk: true }));
  });
  await h.api.load();
  await flush();
  assert.ok(h.api.peek().loadFailure);
  await h.api.load();
  await flush();
  assert.equal(h.api.peek().loadFailure, null);
  assert.equal(h.painted.length, 1);
});

test('轮换预热：素材大小取自 list.json，超过阈值只计数不建节点', async () => {
  const big = 60 * 1024 * 1024;
  const h = makeHarness(okList(
    { mode: 'rotate', rotateSeconds: 45, shuffle: false, video: 'a.mp4', autoInk: true },
    { sizes: { 'a.mp4': 1024, 'b.mp4': big, 'c.mp4': 2048 } },
  ));
  await h.api.load();
  await flush();
  await h.runTimeout(0);
  const stats = h.api.peek().prewarm;
  assert.equal(stats.skipped, 1, '超过 PREWARM_MAX_BYTES 的素材必须只计数、不建节点');
  assert.equal(stats.warmed, 0);
  assert.equal(stats.last.name, 'b.mp4');
  assert.equal(stats.last.bytes, big, '大小应直接来自 list.json，不再依赖 HEAD 响应头');
});

test('轮换预热：小素材照常预热', async () => {
  const h = makeHarness(okList(
    { mode: 'rotate', rotateSeconds: 45, shuffle: false, video: 'a.mp4', autoInk: true },
    { sizes: { 'a.mp4': 1024, 'b.mp4': 2048, 'c.mp4': 4096 } },
  ));
  await h.api.load();
  await flush();
  await h.runTimeout(0);
  const stats = h.api.peek().prewarm;
  assert.equal(stats.warmed, 1);
  assert.equal(stats.skipped, 0);
  assert.equal(stats.last.bytes, 2048);
});

test('轮换预热：list.json 未带大小时回退 HEAD 探测', async () => {
  const h = makeHarness(okList({ mode: 'rotate', rotateSeconds: 45, shuffle: false, video: 'a.mp4', autoInk: true }));
  await h.api.load();
  await flush();
  await h.runTimeout(0);
  const stats = h.api.peek().prewarm;
  assert.equal(stats.last.bytes, 1024, 'HEAD 兜底仍要工作（老宿主 + 新客户端）');
  assert.equal(stats.warmed, 1);
});
